import { supabase } from '../../../lib/supabase'

/**
 * Exporta todos os dados do usuário como objeto JSON.
 * @param {string} userId
 * @returns {Promise<object>}
 */
export async function exportUserData(userId) {
  const [habitsRes, logsRes, categoriesRes, sleepRes, insightsRes] = await Promise.all([
    supabase.from('habits').select('*').eq('user_id', userId),
    supabase.from('habit_logs').select('*').eq('user_id', userId),
    supabase.from('categories').select('*').eq('user_id', userId),
    supabase.from('sleep_logs').select('*').eq('user_id', userId),
    supabase.from('ai_insights').select('*').eq('user_id', userId),
  ])
  return {
    exported_at: new Date().toISOString(),
    habits:      habitsRes.data      ?? [],
    habit_logs:  logsRes.data        ?? [],
    categories:  categoriesRes.data  ?? [],
    sleep_logs:  sleepRes.data       ?? [],
    ai_insights: insightsRes.data    ?? [],
  }
}

/**
 * @param {string} userId
 * @returns {Promise<object | null>}
 */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

/**
 * @param {string} userId
 * @param {{ name?: string, timezone?: string }} data
 * @returns {Promise<object>}
 */
export async function upsertProfile(userId, data) {
  const { data: row, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...data }, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return row
}
