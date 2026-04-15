import Anthropic from 'npm:@anthropic-ai/sdk'
import { createClient } from 'npm:@supabase/supabase-js'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_MESSAGES_PER_HOUR = 5  // reduzido de 20

interface HabitContext {
  name?:     string
  category?: string | null
  goal?:     { value: number; unit: string; frequency: string } | null
  streak?:   number
  screen?:   string
}

const SCREEN_LABELS: Record<string, string> = {
  dashboard:  'painel principal',
  habits:     'lista de hábitos',
  stats:      'estatísticas',
  goals:      'metas',
  categories: 'categorias',
}

// Regra de escopo — sempre incluída
const SCOPE_RULE =
  'Responda APENAS sobre hábitos, categorias e sono registrados no HabitFlow. ' +
  'Qualquer pergunta fora desse escopo: "Só posso ajudar com seus hábitos, categorias e sono no HabitFlow."'

/** Prompt compacto — máximo ~150 palavras */
function buildSystemPrompt(ctx: HabitContext | null): string {
  const base = 'Você é um coach de hábitos do HabitFlow. Responda em pt-BR, máximo 2 parágrafos curtos e diretos.'

  if (!ctx?.name && ctx?.screen) {
    const label = SCREEN_LABELS[ctx.screen] ?? 'app'
    return `${base} Contexto: usuário está na tela de ${label}.\n${SCOPE_RULE}`
  }

  if (!ctx?.name) return `${base}\n${SCOPE_RULE}`

  const parts = [`${base} Foco no hábito "${ctx.name}".`]
  if (ctx.category) parts.push(`Categoria: ${ctx.category}.`)
  if (ctx.goal)     parts.push(`Meta: ${ctx.goal.value} ${ctx.goal.unit}/${ctx.goal.frequency}.`)
  if (ctx.streak)   parts.push(`Streak: ${ctx.streak} dia${ctx.streak !== 1 ? 's' : ''}.`)
  parts.push(SCOPE_RULE)

  return parts.join(' ')
}

async function checkHourlyLimit(supabase: ReturnType<typeof createClient>, userId: string) {
  const windowStart = new Date()
  windowStart.setMinutes(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('ai_rate_limits')
    .select('message_count')
    .eq('user_id', userId)
    .eq('window_start', windowStart.toISOString())
    .maybeSingle()

  if (error) return true // falha silenciosa

  if (!data) {
    await supabase.from('ai_rate_limits').insert({
      user_id:       userId,
      window_start:  windowStart.toISOString(),
      message_count: 1,
    })
    return true
  }

  if (data.message_count >= MAX_MESSAGES_PER_HOUR) return false

  await supabase
    .from('ai_rate_limits')
    .update({ message_count: data.message_count + 1 })
    .eq('user_id', userId)
    .eq('window_start', windowStart.toISOString())

  return true
}

async function incrementMonthlyUsage(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  currentCount: number,
  outputTokens: number,
) {
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  await supabase.from('ai_usage').upsert({
    user_id:       userId,
    month_start:   monthStart.toISOString().split('T')[0],
    chat_messages: currentCount + 1,
    tokens_used:   outputTokens,
    updated_at:    new Date().toISOString(),
  }, { onConflict: 'user_id,month_start' })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  try {
    // 1. Autenticação
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.replace('Bearer ', '')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    )

    // 2. Verificar se IA está habilitada + limite mensal
    const { data: profile } = await supabase
      .from('profiles')
      .select('ai_enabled, monthly_message_limit')
      .eq('id', user.id)
      .single()

    if (profile && profile.ai_enabled === false) {
      return new Response(JSON.stringify({ error: 'AI_DISABLED' }), {
        status: 403, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const { data: usage } = await supabase
      .from('ai_usage')
      .select('chat_messages, tokens_used')
      .eq('user_id', user.id)
      .eq('month_start', monthStart.toISOString().split('T')[0])
      .maybeSingle()

    const monthlyLimit = profile?.monthly_message_limit ?? 100
    if (usage && usage.chat_messages >= monthlyLimit) {
      return new Response(JSON.stringify({ error: 'MONTHLY_LIMIT' }), {
        status: 429, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    // 3. Rate limit por hora
    const hourlyOk = await checkHourlyLimit(supabase, user.id)
    if (!hourlyOk) {
      return new Response(JSON.stringify({ error: 'RATE_LIMIT' }), {
        status: 429, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    // 4. Body + validação
    const body = await req.json()

    const userMessage: string = typeof body.userMessage === 'string'
      ? body.userMessage.trim().slice(0, 500)
      : ''

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'userMessage inválido.' }), {
        status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    // Histórico reduzido: máx 6 mensagens (era 18)
    const rawMessages: unknown[] = Array.isArray(body.messages) ? body.messages : []
    const sanitizedMessages = rawMessages
      .filter((m): m is { role: string; content: string } =>
        m !== null &&
        typeof m === 'object' &&
        typeof (m as Record<string, unknown>).role === 'string' &&
        typeof (m as Record<string, unknown>).content === 'string'
      )
      .slice(-6)
      .map(({ role, content }) => ({ role, content: content.slice(0, 1000) }))

    const rawCtx = body.habitContext
    let habitContext: HabitContext | null = null
    if (rawCtx && typeof rawCtx === 'object') {
      if (typeof rawCtx.name === 'string') {
        habitContext = {
          name:     String(rawCtx.name).slice(0, 80),
          category: rawCtx.category ? String(rawCtx.category).slice(0, 80) : null,
          goal:     rawCtx.goal ?? null,
          streak:   Number(rawCtx.streak) || 0,
        }
      } else if (typeof rawCtx.screen === 'string') {
        habitContext = { screen: rawCtx.screen.slice(0, 50) }
      }
    }

    // 5. Chamada Anthropic — max_tokens reduzido para 400
    const anthropic    = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })
    const systemPrompt = buildSystemPrompt(habitContext)

    const allMessages = [
      ...sanitizedMessages,
      { role: 'user', content: userMessage },
    ]

    const response = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system:     systemPrompt,
      messages:   allMessages,
      stream:     true,
    })

    // 6. Stream + atualizar contador ao final
    const currentMessages = usage?.chat_messages ?? 0
    const previousTokens  = usage?.tokens_used ?? 0

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        let outputTokens = 0

        for await (const event of response) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
          // Captura tokens reais do evento final da Anthropic
          if (event.type === 'message_delta' && event.usage) {
            outputTokens = event.usage.output_tokens ?? 0
          }
        }

        controller.close()

        // Atualizar contador depois do stream (sem bloquear resposta)
        await incrementMonthlyUsage(
          supabase, user.id,
          currentMessages,
          previousTokens + outputTokens,
        ).catch(() => { /* falha silenciosa */ })
      },
    })

    return new Response(readable, {
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' },
    })

  } catch (err) {
    console.error('Edge Function error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error', detail: String(err) }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }
})
