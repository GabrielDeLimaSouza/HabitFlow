import { supabase } from '../../../lib/supabase'
import { useAuthStore } from '../store/auth-store'
import { useAiStore } from '../../ai-agent/store/ai-store'

/**
 * Autentica o usuário com email e senha.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: object, session: object }>}
 */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

/**
 * Encerra a sessão do usuário autenticado.
 * @returns {Promise<void>}
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Logout seguro: limpa todos os stores locais antes de encerrar a sessão
 * no Supabase. Garante estado limpo independente do resultado da chamada remota.
 * Usa window.location.href para descartar completamente o estado React.
 * @returns {Promise<void>}
 */
export async function secureLogout() {
  useAuthStore.getState().clear()
  useAiStore.getState().resetForUser(null)
  await supabase.auth.signOut().catch(() => {})
  window.location.href = '/login'
}

/**
 * Retorna a sessão ativa, ou null se não houver.
 * @returns {Promise<{ session: object | null }>}
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data
}

/**
 * Retorna o perfil público do usuário da tabela profiles.
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
 * Garante que o perfil do usuário existe — cria com defaults se ainda não existir.
 * Necessário porque categories.user_id tem FK para profiles.id.
 * Não faz SELECT: se a linha já existe (ignoreDuplicates), retorna vazio sem erro.
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function ensureProfile(userId) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId }, { onConflict: 'id', ignoreDuplicates: true })
  if (error) throw error
}

/**
 * Registra novo usuário com email e senha.
 * Envia e-mail de confirmação via Resend (SMTP configurado no Supabase).
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: object | null }>}
 */
export async function signUp({ email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
    },
  })
  if (error) throw error
  return data
}

/**
 * Envia e-mail de reset de senha para o endereço informado.
 * O link redireciona para /reset-password após confirmação.
 * @param {string} email
 * @returns {Promise<void>}
 */
export async function requestPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}

/**
 * Define uma nova senha para o usuário autenticado via link de reset.
 * Deve ser chamado apenas na rota /reset-password após o Supabase
 * ter processado o token da URL e estabelecido a sessão.
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export async function confirmPasswordReset(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}

/**
 * Registra um listener para mudanças no estado de autenticação.
 * @param {(event: string, session: object | null) => void} callback
 * @returns {() => void} unsubscribe
 */
export function onAuthChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return () => subscription.unsubscribe()
}
