import { supabase } from '../../../lib/supabase'

/**
 * Exclui permanentemente a conta do usuário autenticado.
 * Chama a Edge Function delete-account (o invoke anexa o JWT da sessão);
 * o CASCADE no banco remove profiles e todas as tabelas filhas.
 * Encerra a sessão local após a exclusão bem-sucedida.
 * @returns {Promise<void>}
 */
export async function deleteAccount() {
  const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' })
  if (error) throw error
  await supabase.auth.signOut()
}
