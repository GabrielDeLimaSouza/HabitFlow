import { supabase } from '../../../lib/supabase'

/**
 * Altera a senha do usuário autenticado.
 * Dispara notificação automática "Senha alterada" via Supabase.
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}

/**
 * Inicia alteração de e-mail do usuário autenticado.
 * Envia e-mail de confirmação para o novo endereço.
 * Dispara notificação automática "Endereço de e-mail alterado" via Supabase.
 * @param {string} newEmail
 * @returns {Promise<void>}
 */
export async function updateEmail(newEmail) {
  const { error } = await supabase.auth.updateUser({
    email: newEmail,
    options: { emailRedirectTo: `${window.location.origin}/login` },
  })
  if (error) throw error
}
