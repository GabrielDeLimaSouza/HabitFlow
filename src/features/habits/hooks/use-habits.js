import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../../auth/store/auth-store'
import * as habitService from '../services/habit-service'

/**
 * Gerencia o estado e as ações de CRUD de hábitos (ativos e arquivados).
 * @returns {{ habits, archived, loading, error, create, update, remove,
 *             restore, permanentDelete, createFromDefaults }}
 */
export function useHabits() {
  const { user } = useAuthStore()
  const [habits,   setHabits]   = useState([])
  const [archived, setArchived] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const [active, arch] = await Promise.all([
        habitService.list(user.id),
        habitService.listArchived(user.id),
      ])
      setHabits(active)
      setArchived(arch)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { load() }, [load])

  const create = async (data) => {
    const habit = await habitService.create(user.id, data)
    setHabits((prev) => [...prev, habit])
    return habit
  }

  const update = async (habitId, data) => {
    const habit = await habitService.update(habitId, data)
    setHabits((prev) => prev.map((h) => (h.id === habitId ? habit : h)))
    return habit
  }

  const remove = async (habitId) => {
    try {
      await habitService.remove(habitId)
      const habit = habits.find((h) => h.id === habitId)
      setHabits((prev) => prev.filter((h) => h.id !== habitId))
      if (habit) setArchived((prev) => [...prev, { ...habit, active: false }])
    } catch (err) {
      setError(err.message)
    }
  }

  const restore = async (habitId) => {
    await habitService.restore(habitId)
    const habit = archived.find((h) => h.id === habitId)
    setArchived((prev) => prev.filter((h) => h.id !== habitId))
    if (habit) setHabits((prev) => [...prev, { ...habit, active: true }])
  }

  const permanentDelete = async (habitId) => {
    await habitService.permanentDelete(habitId)
    setArchived((prev) => prev.filter((h) => h.id !== habitId))
  }

  const createFromDefaults = async () => {
    const defaults = await habitService.getDefaults()
    const created = await Promise.all(
      defaults.map((d) =>
        habitService.create(user.id, {
          name: d.name, color: d.color ?? '#6366f1', icon: d.icon,
          description: d.description, frequency_type: 'daily',
          frequency_days: [1, 2, 3, 4, 5, 6, 7],
        })
      )
    )
    setHabits((prev) => [...prev, ...created])
  }

  return { habits, archived, loading, error, create, update, remove,
           restore, permanentDelete, createFromDefaults }
}
