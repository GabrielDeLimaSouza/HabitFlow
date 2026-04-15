import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../../auth/store/auth-store'
import * as insightService from '../services/insight-service'

function getDaysUntilMonday() {
  const day = new Date().getDay() // 0=Dom … 6=Sáb
  if (day === 1) return 0
  return day === 0 ? 1 : 8 - day
}

/**
 * Gerencia o insight semanal com auto-geração na segunda-feira.
 * @returns {{ insight, loading, generating, error, daysWithData, isMonday, daysUntilMonday, generate }}
 */
export function useInsight() {
  const { user }      = useAuthStore()
  const [insight,     setInsight]     = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [generating,  setGenerating]  = useState(false)
  const [error,       setError]       = useState(null)
  const [daysWithData, setDaysWithData] = useState(0)

  const isMonday       = new Date().getDay() === 1
  const daysUntilMon   = getDaysUntilMonday()

  const generate = useCallback(async () => {
    setGenerating(true)
    setError(null)
    try {
      const data = await insightService.generate()
      setInsight(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }, [])

  useEffect(() => {
    if (!user) return

    Promise.all([
      insightService.getThisWeek(user.id),
      insightService.getDaysWithData(user.id),
    ])
      .then(([ins, days]) => {
        setInsight(ins)
        setDaysWithData(days)

        // Auto-geração na segunda-feira se tem dados e insight ainda não existe
        if (new Date().getDay() === 1 && !ins && days >= 7) {
          generate()
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user, generate])

  return { insight, loading, generating, error, daysWithData, isMonday, daysUntilMonday: daysUntilMon, generate }
}
