import { useState } from 'react'
import { useAuthStore } from '../../auth/store/auth-store'
import { upsertProfile } from '../services/profile-service'

/**
 * @returns {{ profile: object | null, saving: boolean, error: string | null, save: (data: object) => Promise<void> }}
 */
export function useProfile() {
  const { user, profile, setProfile } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState(null)

  /** @returns {Promise<boolean>} true se salvou com sucesso */
  const save = async (data) => {
    if (!user) return false
    setSaving(true)
    setError(null)
    try {
      const updated = await upsertProfile(user.id, data)
      setProfile(updated)
      return true
    } catch (err) {
      setError(err.message ?? 'Erro ao salvar perfil.')
      return false
    } finally {
      setSaving(false)
    }
  }

  return { profile, saving, error, save }
}
