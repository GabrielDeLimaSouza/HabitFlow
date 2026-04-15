import { useState, useEffect } from 'react'
import * as goalService from '../services/goal-service'

/**
 * Gerencia as metas de uma lista de hábitos.
 * @param {string[]} habitIds
 * @returns {{ goals: Map<string, object>, loading, error, save, remove }}
 */
export function useGoals(habitIds) {
  const [goals, setGoals]   = useState(new Map())
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const habitKey = habitIds.join(',')

  useEffect(() => {
    if (habitIds.length === 0) return
    setLoading(true)
    goalService.listByHabitIds(habitIds)
      .then((data) => setGoals(new Map(data.map((g) => [g.habit_id, g]))))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitKey])

  const save = async (habitId, data, existingId) => {
    const goal = await goalService.save(habitId, data, existingId)
    setGoals((prev) => new Map(prev).set(habitId, goal))
    return goal
  }

  const remove = async (goalId, habitId) => {
    await goalService.remove(goalId)
    setGoals((prev) => {
      const next = new Map(prev)
      next.delete(habitId)
      return next
    })
  }

  return { goals, loading, error, save, remove }
}
