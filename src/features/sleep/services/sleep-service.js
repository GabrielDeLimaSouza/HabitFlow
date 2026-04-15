import { supabase } from '../../../lib/supabase'
import { localDateISO } from '../../../shared/utils/date-utils'

/**
 * Retorna o registro de sono de um dia específico.
 * @param {string} userId
 * @param {string} date - YYYY-MM-DD
 * @returns {Promise<object|null>}
 */
export async function getForDate(userId, date) {
  const { data, error } = await supabase
    .from('sleep_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('sleep_date', date)
    .maybeSingle()
  if (error) throw error
  return data
}

/**
 * Cria ou atualiza o registro de sono de um dia.
 * @param {string} userId
 * @param {{ sleep_date, bedtime, wake_time, duration_min, quality, notes }} data
 * @returns {Promise<object>}
 */
export async function save(userId, data) {
  const { data: log, error } = await supabase
    .from('sleep_logs')
    .upsert({ user_id: userId, ...data }, { onConflict: 'user_id,sleep_date' })
    .select()
    .single()
  if (error) throw error
  return log
}

/**
 * Retorna os registros de sono dos últimos N dias.
 * @param {string} userId
 * @param {number} [days=7]
 * @returns {Promise<object[]>}
 */
export async function getHistory(userId, days = 7) {
  const from = new Date()
  from.setDate(from.getDate() - days + 1)

  const { data, error } = await supabase
    .from('sleep_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('sleep_date', from.toLocaleDateString('sv'))
    .order('sleep_date', { ascending: true })
  if (error) throw error
  return data ?? []
}
