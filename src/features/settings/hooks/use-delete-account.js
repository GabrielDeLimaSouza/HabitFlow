import { useState } from 'react'
import { deleteAccount } from '../services/account-service'

/**
 * Estado e ação de exclusão de conta.
 * @returns {{ remove: () => Promise<boolean>, loading: boolean, error: string | null }}
 */
export function useDeleteAccount() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const remove = async () => {
    setLoading(true)
    setError(null)
    try {
      await deleteAccount()
      return true
    } catch (err) {
      setError(err.message ?? 'Não foi possível excluir a conta. Tente novamente.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading, error }
}
