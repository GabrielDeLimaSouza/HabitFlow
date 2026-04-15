import { supabase } from '../../../lib/supabase'

/**
 * Retorna todos os logs do usuário dentro do intervalo de datas.
 * @param {string} userId
 * @param {string} startDate  - formato YYYY-MM-DD
 * @param {string} endDate    - formato YYYY-MM-DD
 * @returns {Promise<object[]>}
 */
export async function getLogsRange(userId, startDate, endDate) {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('habit_id, logged_date, completed')
    .eq('user_id', userId)
    .gte('logged_date', startDate)
    .lte('logged_date', endDate)
    .order('logged_date')
  if (error) throw error
  return data
}

/**
 * Retorna os hábitos ativos do usuário com dados de categoria.
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
export async function getActiveHabits(userId) {
  const { data, error } = await supabase
    .from('habits')
    .select('id, name, color, category_id, frequency_type, frequency_days, categories(id, name, color)')
    .eq('user_id', userId)
    .eq('active', true)
    .order('created_at')
  if (error) throw error
  return data
}
