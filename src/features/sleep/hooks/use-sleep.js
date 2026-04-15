import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../../auth/store/auth-store'
import * as sleepService from '../services/sleep-service'
import { yesterdayISO } from '../../../shared/utils/date-utils'

/**
 * Gerencia o registro de sono de ontem e o histórico dos últimos 7 dias.
 * @returns {{ log, history, loading, error, save }}
 */
export function useSleep() {
  const { user }       = useAuthStore()
  const [yesterday]    = useState(yesterdayISO)

  const [log,     setLog]     = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const [l, hist] = await Promise.all([
        sleepService.getForDate(user.id, yesterday),
        sleepService.getHistory(user.id, 7),
      ])
      setLog(l)
      setHistory(hist)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user, yesterday])

  useEffect(() => { load() }, [load])

  /**
   * Salva (upsert) o registro de sono de ontem com atualização otimista.
   * @param {{ bedtime, wake_time, duration_min, quality, notes }} data
   */
  const save = async (data) => {
    const payload = { sleep_date: yesterday, ...data }
    // Atualização otimista
    setLog((prev) => ({ ...(prev ?? {}), ...payload }))
    try {
      const saved = await sleepService.save(user.id, payload)
      setLog(saved)
      setHistory((prev) => {
        const rest = prev.filter((h) => h.sleep_date !== yesterday)
        return [...rest, saved].sort((a, b) => a.sleep_date.localeCompare(b.sleep_date))
      })
    } catch (err) {
      setError(err.message)
      load()
    }
  }

  return { log, history, loading, error, save, yesterday }
}
