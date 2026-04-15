import { useEffect } from 'react'
import { useAuthStore } from '../store/auth-store'
import { signIn, getSession, onAuthChange, getProfile, ensureProfile, secureLogout } from '../services/auth-service'
import { useAiStore } from '../../ai-agent/store/ai-store'

/**
 * Hook principal de autenticação.
 * Inicializa a sessão e escuta mudanças de estado do Supabase Auth.
 *
 * @returns {{ user, session, loading, signIn, signOut }}
 */
export function useAuth() {
  const { user, session, loading, setUser, setSession, setProfile, setLoading, clear } = useAuthStore()

  const hydrateSession = async (session) => {
    setSession(session)
    setUser(session?.user ?? null)
    if (session?.user) {
      try {
        // ensureProfile garante que o perfil existe antes de qualquer operação
        // que dependa de categories.user_id → profiles.id (FK)
        await ensureProfile(session.user.id)
        const profile = await getProfile(session.user.id)
        setProfile(profile)
      } catch {
        setProfile(null)
      }
    } else {
      setProfile(null)
    }
    useAiStore.getState().resetForUser(session?.user?.id ?? null)
    setLoading(false)
  }

  useEffect(() => {
    getSession()
      .then(({ session }) => hydrateSession(session))
      .catch(() => clear())

    const unsubscribe = onAuthChange((_event, session) => {
      hydrateSession(session)
    })

    return unsubscribe
  }, [])

  const handleSignIn = (credentials) => signIn(credentials)

  return { user, session, loading, signIn: handleSignIn, signOut: secureLogout }
}
