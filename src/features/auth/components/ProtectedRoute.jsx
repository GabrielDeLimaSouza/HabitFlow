import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'
import { useAuthStore } from '../store/auth-store'
import { supabase } from '../../../lib/supabase'

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  const { clear } = useAuthStore()

  // Verificação secundária direta no Supabase ao montar — fonte de verdade.
  // O store local serve como cache para UX (evitar flicker); o Supabase decide.
  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session: serverSession } }) => {
        if (!serverSession) clear()
      })
      .catch(() => clear())
  }, [])

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div className="skeleton" style={{ width: 200, height: 12, borderRadius: 6 }} />
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute
