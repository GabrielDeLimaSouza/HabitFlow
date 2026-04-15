import { useAiStore } from '../store/ai-store'
import { callAgent } from '../services/ai-service'
import { supabase } from '../../../lib/supabase'
import { localDateISO } from '../../../shared/utils/date-utils'

/**
 * Busca o contador mensal do usuário no banco.
 * O limite horário é calculado e aplicado exclusivamente no Edge Function
 * (que retorna 429 quando excedido) — o client não calcula window_start.
 * @param {string} userId
 */
async function fetchUsage(userId) {
  const monthWindow = new Date()
  monthWindow.setDate(1)
  monthWindow.setHours(0, 0, 0, 0)

  const { data: monthData } = await supabase.from('ai_usage').select('chat_messages')
    .eq('user_id', userId).eq('month_start', monthWindow.toISOString().split('T')[0]).maybeSingle()

  useAiStore.getState().setMonthlyCount(monthData?.chat_messages ?? 0)
}

/**
 * Salva o conteúdo de uma mensagem do assistente nas anotações do hábito ativo.
 * @param {string} content
 */
async function saveNote(content) {
  const { activeHabit, currentUserId } = useAiStore.getState()
  if (!activeHabit?.id || !currentUserId) return

  const today = localDateISO()
  const time  = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const prefix = `[IA ${time}]\n`

  const { data: existing } = await supabase
    .from('habit_logs').select('id, notes')
    .eq('habit_id', activeHabit.id).eq('logged_date', today).maybeSingle()

  const newNote = existing?.notes
    ? `${existing.notes}\n\n${prefix}${content}`
    : `${prefix}${content}`

  if (existing) {
    await supabase.from('habit_logs')
      .update({ notes: newNote.slice(0, 2000) }).eq('id', existing.id)
  } else {
    await supabase.from('habit_logs').insert({
      habit_id: activeHabit.id, user_id: currentUserId,
      logged_date: today, notes: newNote.slice(0, 2000),
    })
  }
}

/**
 * @returns {{ isOpen, messages, loading, error, hourlyCount, monthlyCount,
 *             open, close, sendMessage, fetchUsage, saveNote }}
 */
export function useAiAgent() {
  const {
    isOpen, habitContext, messages, loading, error,
    hourlyCount, monthlyCount,
    open, close, addMessage, setLoading, setError,
  } = useAiStore()

  const sendMessage = async (text) => {
    addMessage({ role: 'user', content: text })
    setLoading(true)
    setError(null)
    addMessage({ role: 'assistant', content: '' })

    let assistantText = ''

    try {
      const { activeHabit, activeScreen, habitContext: storedCtx } = useAiStore.getState()
      const resolvedContext = activeHabit ?? storedCtx ?? { screen: activeScreen }

      // Histórico: exclui o placeholder do assistente (último item) e garante
      // que sempre começa com role 'user' para não quebrar a alternância na API.
      let history = useAiStore.getState().messages.slice(0, -1)
      if (history[0]?.role === 'assistant') history = history.slice(1)

      await callAgent({
        habitContext: resolvedContext,
        messages:    history,
        userMessage: text,
        onChunk: (chunk) => {
          assistantText += chunk
          useAiStore.setState((state) => {
            const updated = [...state.messages]
            updated[updated.length - 1] = { role: 'assistant', content: assistantText }
            return { messages: updated }
          })
        },
      })

      // Incrementar contador horário local (servidor aplica o limite real via 429)
      useAiStore.getState().setHourlyCount(useAiStore.getState().hourlyCount + 1)
      // Atualizar contador mensal via banco
      const { currentUserId } = useAiStore.getState()
      if (currentUserId) fetchUsage(currentUserId).catch(() => {})
    } catch (err) {
      const ERROR_MESSAGES = {
        RATE_LIMIT:    'Limite de 5 mensagens por hora atingido. Volte em breve.',
        MONTHLY_LIMIT: 'Você atingiu o limite de mensagens deste mês.',
        AI_DISABLED:   'O assistente de IA está desabilitado nas configurações.',
      }
      setError(ERROR_MESSAGES[err.message] ?? 'Não foi possível responder agora. Tente novamente.')
      useAiStore.setState((s) => {
        const msgs = s.messages
        const last = msgs[msgs.length - 1]
        if (last?.role === 'assistant' && last?.content === '') {
          return { messages: msgs.slice(0, -1) }
        }
        return {}
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    isOpen, messages, loading, error, hourlyCount, monthlyCount,
    open, close, sendMessage,
    fetchUsage: (userId) => fetchUsage(userId),
    saveNote,
  }
}
