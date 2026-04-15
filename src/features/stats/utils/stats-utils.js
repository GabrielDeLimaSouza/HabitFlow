import { localDateISO } from '../../../shared/utils/date-utils'

/** @param {string[]} dates - datas ISO únicas, qualquer ordem */
function calcCurrentStreak(dates) {
  if (dates.length === 0) return 0
  const sorted = [...new Set(dates)].sort().reverse()
  const today     = localDateISO()
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('sv')
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const diff = (new Date(sorted[i - 1]) - new Date(sorted[i])) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}

/** @param {string[]} dates */
function calcBestStreak(dates) {
  if (dates.length === 0) return 0
  const sorted = [...new Set(dates)].sort()
  let best = 1, current = 1
  for (let i = 1; i < sorted.length; i++) {
    const diff = (new Date(sorted[i]) - new Date(sorted[i - 1])) / 86400000
    if (diff === 1) { current++; if (current > best) best = current }
    else current = 1
  }
  return best
}

/**
 * Conta quantos dias o hábito estava agendado entre startDate e endDate (inclusive).
 * @param {{ frequency_type: string, frequency_days?: number[] }} habit
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate   - YYYY-MM-DD
 * @returns {number}
 */
function getExpectedDays(habit, startDate, endDate) {
  const start = new Date(startDate + 'T00:00:00')
  const end   = new Date(endDate   + 'T00:00:00')
  let count = 0
  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (habit.frequency_type === 'daily') {
      count++
    } else {
      const dow = d.getDay() === 0 ? 7 : d.getDay()
      if (habit.frequency_days?.includes(dow)) count++
    }
  }
  return count
}

/**
 * Monta o array de 84 dias para o calendário de contribuições.
 * @param {{ logged_date: string, completed: boolean }[]} logs
 * @returns {{ date: string, completed: number, total: number, intensity: 0|1|2|3 }[]}
 */
export function buildCalendar(logs) {
  const map = {}
  logs.forEach(({ logged_date, completed }) => {
    if (!map[logged_date]) map[logged_date] = { completed: 0, total: 0 }
    map[logged_date].total++
    if (completed) map[logged_date].completed++
  })

  return Array.from({ length: 84 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (83 - i))
    const date = d.toLocaleDateString('sv')
    const { completed = 0, total = 0 } = map[date] ?? {}
    const pct = total > 0 ? (completed / total) * 100 : 0
    const intensity = total === 0 ? 0 : pct <= 50 ? 1 : pct <= 80 ? 2 : 3
    return { date, completed, total, intensity }
  })
}

/**
 * Calcula streak atual, % semanal real e total de logs concluídos.
 * weekPercentage usa dias agendados como denominador quando habits é fornecido.
 * @param {{ logged_date: string, completed: boolean }[]} logs
 * @param {{ frequency_type: string, frequency_days?: number[] }[]} [habits]
 */
export function buildOverview(logs, habits = []) {
  const completedDates = logs.filter(l => l.completed).map(l => l.logged_date)
  const streak = calcCurrentStreak(completedDates)

  const today  = new Date()
  const dow    = today.getDay() === 0 ? 7 : today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dow - 1))
  const weekStart = monday.toLocaleDateString('sv')
  const todayStr  = localDateISO()

  const weekCompleted = logs.filter(l => l.logged_date >= weekStart && l.completed).length

  // Denominador real: soma de dias agendados por hábito desde segunda-feira
  const weekExpected = habits.length > 0
    ? habits.reduce((sum, h) => sum + getExpectedDays(h, weekStart, todayStr), 0)
    : logs.filter(l => l.logged_date >= weekStart).length // fallback

  const weekPercentage = weekExpected > 0
    ? Math.min(Math.round((weekCompleted / weekExpected) * 100), 100)
    : 0

  return { streak, weekPercentage, totalLogs: completedDates.length }
}

/**
 * Calcula streak e taxa de conclusão por hábito usando dias agendados como denominador.
 * @param {{ id: string, name: string, color: string,
 *           frequency_type: string, frequency_days?: number[] }[]} habits
 * @param {{ habit_id: string, logged_date: string, completed: boolean }[]} logs
 */
export function buildHabitStats(habits, logs) {
  const today    = localDateISO()
  const cutoff30 = new Date(Date.now() - 30 * 86400000).toLocaleDateString('sv')

  return habits.map((habit) => {
    const habitLogs      = logs.filter(l => l.habit_id === habit.id)
    const completedDates = habitLogs.filter(l => l.completed).map(l => l.logged_date)

    const completed30 = habitLogs.filter(l => l.logged_date >= cutoff30 && l.completed).length
    const expected30  = getExpectedDays(habit, cutoff30, today)
    const rate30d     = expected30 > 0 ? Math.min(Math.round((completed30 / expected30) * 100), 100) : 0

    return {
      habit,
      currentStreak: calcCurrentStreak(completedDates),
      bestStreak:    calcBestStreak(completedDates),
      rate30d,
    }
  })
}
