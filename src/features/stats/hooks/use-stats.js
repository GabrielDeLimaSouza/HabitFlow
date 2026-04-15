import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '../../auth/store/auth-store'
import { getLogsRange, getActiveHabits } from '../services/stats-service'
import { buildCalendar, buildOverview, buildHabitStats, buildWeekdayStats, buildWeeklyTrend } from '../utils/stats-utils'
import { localDateISO } from '../../../shared/utils/date-utils'

const DAYS_HISTORY = 365

/**
 * Carrega dados brutos e deriva estatísticas filtradas por categoria.
 * @returns {{ calendar, overview, habitStats, categories, categoryFilter,
 *             setCategoryFilter, loading, error }}
 */
export function useStats() {
  const { user } = useAuthStore()

  const [habits,  setHabits]  = useState([])
  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [categoryFilter, setCategoryFilter] = useState(null)

  useEffect(() => {
    if (!user) return
    const today     = localDateISO()
    const startDate = new Date(Date.now() - DAYS_HISTORY * 86400000).toLocaleDateString('sv')

    Promise.all([getLogsRange(user.id, startDate, today), getActiveHabits(user.id)])
      .then(([l, h]) => { setLogs(l); setHabits(h) })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  const categories = useMemo(() => {
    const seen = new Set()
    return habits.reduce((acc, h) => {
      if (h.category_id && h.categories && !seen.has(h.category_id)) {
        seen.add(h.category_id)
        acc.push({ id: h.category_id, name: h.categories.name, color: h.categories.color })
      }
      return acc
    }, [])
  }, [habits])

  const filteredHabits = useMemo(
    () => categoryFilter ? habits.filter((h) => h.category_id === categoryFilter) : habits,
    [habits, categoryFilter]
  )

  const filteredLogs = useMemo(() => {
    if (!categoryFilter) return logs
    const ids = new Set(filteredHabits.map((h) => h.id))
    return logs.filter((l) => ids.has(l.habit_id))
  }, [logs, filteredHabits, categoryFilter])

  const calendar     = useMemo(() => buildCalendar(filteredLogs),                   [filteredLogs])
  const overview     = useMemo(() => buildOverview(filteredLogs, filteredHabits),   [filteredLogs, filteredHabits])
  const habitStats   = useMemo(() => buildHabitStats(filteredHabits, filteredLogs), [filteredHabits, filteredLogs])
  const weekdayStats = useMemo(() => buildWeekdayStats(filteredLogs),              [filteredLogs])
  const weeklyTrend  = useMemo(() => buildWeeklyTrend(filteredLogs),               [filteredLogs])

  return { calendar, overview, habitStats, weekdayStats, weeklyTrend,
           categories, categoryFilter, setCategoryFilter, loading, error }
}
