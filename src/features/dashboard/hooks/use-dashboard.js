import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../../auth/store/auth-store'
import { getHabitsForToday, toggleCompletion, saveNote, getCompletionHistory } from '../services/dashboard-service'

import { localDateISO } from '../../../shared/utils/date-utils'

/** Retorna a data de hoje em YYYY-MM-DD — chamada no momento do uso, nunca na carga do módulo */
function getToday() { return localDateISO() }

/**
 * Gerencia o estado do dashboard: hábitos do dia, stats, histórico e toggle/notas.
 * @returns {{ habits, stats, history, loading, error, toggle, saveHabitNote }}
 */
export function useDashboard() {
  const { user } = useAuthStore()
  const [habits,  setHabits]  = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const [data, hist] = await Promise.all([
        getHabitsForToday(user.id),
        getCompletionHistory(user.id, 14),
      ])
      setHabits(data)
      setHistory(hist)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { load() }, [load])

  const toggle = async (habitId, currentCompleted) => {
    const next = !currentCompleted
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, log: { ...(h.log ?? {}), completed: next } } : h
      )
    )
    try {
      await toggleCompletion(habitId, user.id, getToday(), next)
    } catch (err) {
      setError(err.message)
      load()
    }
  }

  const saveHabitNote = async (habitId, notes) => {
    await saveNote(habitId, user.id, getToday(), notes)
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, log: { ...(h.log ?? {}), notes } } : h
      )
    )
  }

  const completed = habits.filter((h) => h.log?.completed).length
  const stats = {
    total:      habits.length,
    completed,
    percentage: habits.length ? Math.round((completed / habits.length) * 100) : 0,
  }

  return { habits, stats, history, loading, error, toggle, saveHabitNote }
}
