import { supabase } from '../../../lib/supabase'

/**
 * Retorna todas as metas dos hábitos informados.
 * @param {string[]} habitIds
 * @returns {Promise<object[]>}
 */
export async function listByHabitIds(habitIds) {
  if (habitIds.length === 0) return []
  const { data, error } = await supabase
    .from('habit_goals')
    .select('*')
    .in('habit_id', habitIds)
  if (error) throw error
  return data
}

/**
 * Cria ou atualiza a meta de um hábito.
 * @param {string} habitId
 * @param {{ target_value, target_unit, target_frequency }} data
 * @param {string|undefined} existingId - ID da meta existente (update) ou undefined (create)
 * @returns {Promise<object>}
 */
export async function save(habitId, data, existingId) {
  const payload = { habit_id: habitId, ...data }

  if (existingId) {
    const { data: goal, error } = await supabase
      .from('habit_goals')
      .update(payload)
      .eq('id', existingId)
      .select()
      .single()
    if (error) throw error
    return goal
  }

  const { data: goal, error } = await supabase
    .from('habit_goals')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return goal
}

/**
 * Remove a meta de um hábito.
 * @param {string} goalId
 * @returns {Promise<void>}
 */
export async function remove(goalId) {
  const { error } = await supabase.from('habit_goals').delete().eq('id', goalId)
  if (error) throw error
}
