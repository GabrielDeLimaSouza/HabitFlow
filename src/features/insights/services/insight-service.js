import { supabase } from '../../../lib/supabase'
import { localDateISO } from '../../../shared/utils/date-utils'

/**
 * Retorna a quantidade de dias distintos com logs nos últimos 7 dias.
 * @param {string} userId
 * @returns {Promise<number>}
 */
export async function getDaysWithData(userId) {
  const from = new Date(Date.now() - 7 * 86400000).toLocaleDateString('sv')
  const { data, error } = await supabase
    .from('habit_logs').select('logged_date')
    .eq('user_id', userId).gte('logged_date', from)
  if (error) throw error
  return new Set((data ?? []).map((l) => l.logged_date)).size
}

function getWeekStart() {
  const now  = new Date()
  const diff = now.getDay() === 0 ? 6 : now.getDay() - 1
  const mon  = new Date(now)
  mon.setDate(now.getDate() - diff)
  return mon.toLocaleDateString('sv')
}

/**
 * Retorna o insight da semana atual, se já gerado.
 * @param {string} userId
 * @returns {Promise<object|null>}
 */
export async function getThisWeek(userId) {
  const { data, error } = await supabase
    .from('ai_insights')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start', getWeekStart())
    .maybeSingle()
  if (error) throw error
  return data
}

/**
 * Chama a Edge Function para gerar (ou recuperar) o insight semanal.
 * @returns {Promise<object>} - { id, content, week_start, created_at }
 */
export async function generate() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Usuário não autenticado.')

  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/habit-weekly-insight`

  const res = await fetch(url, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? 'Falha ao gerar insight.')
  }

  return res.json()
}
