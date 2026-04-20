import { useState } from 'react'
import { updatePassword, updateEmail } from '../services/security-service'

/**
 * @returns {{ changePassword, changeEmail, loading, error, success }}
 */
export function useSecurity() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [success, setSuccess] = useState(null)

  const run = async (fn) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await fn()
      setSuccess(true)
    } catch (err) {
      setError(err.message ?? 'Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  const changePassword = (newPassword) => run(() => updatePassword(newPassword))
  const changeEmail    = (newEmail)    => run(() => updateEmail(newEmail))

  return { changePassword, changeEmail, loading, error, success }
}
