import { supabase } from '../../../lib/supabase'

/**
 * Lista todos os hábitos ativos do usuário.
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
export async function list(userId) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

/**
 * Cria um novo hábito para o usuário.
 * @param {string} userId
 * @param {{ name, color, frequency_type, frequency_days }} data
 * @returns {Promise<object>}
 */
export async function create(userId, data) {
  const { data: habit, error } = await supabase
    .from('habits')
    .insert({ user_id: userId, ...data })
    .select()
    .single()
  if (error) throw error
  return habit
}

/**
 * Atualiza campos de um hábito existente.
 * @param {string} habitId
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function update(habitId, data) {
  const { data: habit, error } = await supabase
    .from('habits')
    .update(data)
    .eq('id', habitId)
    .select()
    .single()
  if (error) throw error
  return habit
}

/**
 * Arquiva um hábito (soft delete via active = false).
 * @param {string} habitId
 * @returns {Promise<void>}
 */
export async function remove(habitId) {
  const { error } = await supabase
    .from('habits')
    .update({ active: false })
    .eq('id', habitId)
  if (error) throw error
}

/**
 * Retorna os hábitos padrão do app para onboarding.
 * @returns {Promise<object[]>}
 */
export async function getDefaults() {
  const { data, error } = await supabase.from('default_habits').select('*')
  if (error) throw error
  return data
}

/**
 * Lista hábitos arquivados (active = false) do usuário.
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
export async function listArchived(userId) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('active', false)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

/**
 * Restaura um hábito arquivado (active = true).
 * @param {string} habitId
 * @returns {Promise<void>}
 */
export async function restore(habitId) {
  const { error } = await supabase
    .from('habits')
    .update({ active: true })
    .eq('id', habitId)
  if (error) throw error
}

/**
 * Exclui um hábito permanentemente.
 * @param {string} habitId
 * @returns {Promise<void>}
 */
export async function permanentDelete(habitId) {
  const { error } = await supabase.from('habits').delete().eq('id', habitId)
  if (error) throw error
}
