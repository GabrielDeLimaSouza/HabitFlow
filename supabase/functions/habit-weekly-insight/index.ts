import Anthropic from 'npm:@anthropic-ai/sdk'
import { createClient } from 'npm:@supabase/supabase-js'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Prompt compacto — máximo ~100 palavras
const SYSTEM_PROMPT =
  'Você é um coach de hábitos. Analise os dados e escreva 3 parágrafos curtos em pt-BR: ' +
  '1) ponto forte da semana com dado específico, ' +
  '2) principal desafio identificado, ' +
  '3) uma ação prática para a próxima semana. ' +
  'Máximo 120 palavras no total. Seja direto e use os dados fornecidos.'

function getWeekStart(): string {
  const now  = new Date()
  const diff = now.getDay() === 0 ? 6 : now.getDay() - 1
  const mon  = new Date(now)
  mon.setDate(now.getDate() - diff)
  return mon.toISOString().split('T')[0]
}

function buildContext(habits: any[], logs: any[], sleep: any[]): string {
  const lines = habits.map((h) => {
    const completed = logs.filter((l) => l.habit_id === h.id && l.completed).length
    const total     = logs.filter((l) => l.habit_id === h.id).length
    const rate      = total > 0 ? Math.round((completed / total) * 100) : 0
    return `${h.name}: ${completed}/${total} dias (${rate}%)`
  })

  if (sleep.length > 0) {
    const avg = sleep.reduce((s: number, l: any) => s + l.duration_min, 0) / sleep.length
    lines.push(`Sono médio: ${(avg / 60).toFixed(1)}h`)
  }

  return lines.join('\n')
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const token        = authHeader.replace('Bearer ', '')
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

    const weekStart = getWeekStart()
    const today     = new Date().toISOString().split('T')[0]
    const sevenAgo  = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

    // Retorna insight existente — nunca regenera
    const { data: existing } = await supabase
      .from('ai_insights').select('*')
      .eq('user_id', user.id).eq('week_start', weekStart).maybeSingle()

    if (existing) {
      return new Response(JSON.stringify(existing), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    // Verificar mínimo de 7 dias com dados
    const { data: recentLogs } = await supabase
      .from('habit_logs').select('logged_date')
      .eq('user_id', user.id).gte('logged_date', sevenAgo)

    const distinctDays = new Set((recentLogs ?? []).map((l: any) => l.logged_date)).size
    if (distinctDays < 7) {
      return new Response(JSON.stringify({ error: 'INSUFFICIENT_DATA', daysWithData: distinctDays }), {
        status: 422, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    // Buscar dados da semana
    const [habitsRes, logsRes, sleepRes] = await Promise.all([
      supabase.from('habits').select('id, name').eq('user_id', user.id).eq('active', true),
      supabase.from('habit_logs').select('habit_id, completed')
        .eq('user_id', user.id).gte('logged_date', weekStart).lte('logged_date', today),
      supabase.from('sleep_logs').select('duration_min, quality')
        .eq('user_id', user.id).gte('sleep_date', weekStart).lte('sleep_date', today),
    ])

    if (habitsRes.error) throw habitsRes.error

    const context   = buildContext(habitsRes.data ?? [], logsRes.data ?? [], sleepRes.data ?? [])
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })

    const message = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: context }],
    })

    const content = (message.content[0] as { text: string }).text

    const { data: saved, error: saveError } = await supabase
      .from('ai_insights')
      .insert({ user_id: user.id, week_start: weekStart, content })
      .select().single()

    if (saveError) throw saveError

    // Atualizar contador de insights no ai_usage
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const monthKey = monthStart.toISOString().split('T')[0]

    const { data: usage } = await supabase
      .from('ai_usage').select('insight_count')
      .eq('user_id', user.id).eq('month_start', monthKey).maybeSingle()

    await supabase.from('ai_usage').upsert({
      user_id:       user.id,
      month_start:   monthKey,
      insight_count: (usage?.insight_count ?? 0) + 1,
      updated_at:    new Date().toISOString(),
    }, { onConflict: 'user_id,month_start' })

    return new Response(JSON.stringify(saved), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('habit-weekly-insight error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error', detail: String(err) }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }
})
