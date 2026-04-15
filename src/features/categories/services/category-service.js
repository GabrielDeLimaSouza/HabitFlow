import { supabase } from '../../../lib/supabase'

/**
 * Lista as categorias do usuário ordenadas por posição.
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
export async function list(userId) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

/**
 * Cria uma nova categoria.
 * @param {string} userId
 * @param {{ name, color, icon }} data
 * @returns {Promise<object>}
 */
export async function create(userId, data) {
  const { data: category, error } = await supabase
    .from('categories')
    .insert({ user_id: userId, ...data })
    .select()
    .single()
  if (error) throw error
  return category
}

/**
 * Atualiza campos de uma categoria.
 * @param {string} categoryId
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function update(categoryId, data) {
  const { data: category, error } = await supabase
    .from('categories')
    .update(data)
    .eq('id', categoryId)
    .select()
    .single()
  if (error) throw error
  return category
}

/**
 * Remove uma categoria permanentemente.
 * @param {string} categoryId
 * @returns {Promise<void>}
 */
export async function remove(categoryId) {
  const { error } = await supabase.from('categories').delete().eq('id', categoryId)
  if (error) throw error
}

/**
 * Atualiza a posição de múltiplas categorias.
 * @param {{ id: string, position: number }[]} updates
 * @returns {Promise<void>}
 */
export async function reorder(updates) {
  await Promise.all(
    updates.map(({ id, position }) =>
      supabase.from('categories').update({ position }).eq('id', id)
    )
  )
}
