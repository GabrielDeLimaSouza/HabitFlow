import { supabase } from '../../../lib/supabase'

/**
 * Chama a Edge Function habit-ai-agent via fetch direto (suporta streaming).
 * @param {{
 *   habitContext: object | null,
 *   messages: { role: string, content: string }[],
 *   userMessage: string,
 *   onChunk: (text: string) => void
 * }} params
 * @returns {Promise<void>}
 */
export async function callAgent({ habitContext, messages, userMessage, onChunk }) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Usuário não autenticado.')

  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/habit-ai-agent`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ habitContext, messages, userMessage }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    if (response.status === 429) throw new Error('RATE_LIMIT')
    throw new Error(body.error ?? 'Erro na Edge Function.')
  }

  const reader  = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    onChunk(decoder.decode(value, { stream: true }))
  }
}
