import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas.')
}

/**
 * Client Supabase configurado com sessionStorage.
 *
 * POR QUE sessionStorage:
 * - localStorage persiste após fechar o browser → inseguro em computadores compartilhados
 * - sessionStorage é limpo automaticamente ao fechar a aba/browser
 * - O usuário precisa fazer login novamente a cada nova sessão do browser
 * - Funciona normalmente em recarregamentos de página (F5)
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage:            window.sessionStorage, // ← sessão limpa ao fechar browser
    persistSession:     true,                  // persiste na aba atual
    autoRefreshToken:   true,                  // renova token automaticamente
    detectSessionInUrl: true,                  // necessário para magic links
  },
})
