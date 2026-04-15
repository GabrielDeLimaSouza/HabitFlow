import { supabase } from '../../../lib/supabase'
import { localDateISO } from '../../../shared/utils/date-utils'

/** Converte getDay() JS (0=Dom) para o padrão do schema (1=Seg, 7=Dom) */
function getTodayDow() {
  const day = new Date().getDay()
  return day === 0 ? 7 : day
}

/** Retorna true se o hábito está agendado para o dia da semana informado */
function isScheduledToday(habit, todayDow) {
  if (habit.frequency_type === 'daily') return true
  return habit.frequency_days?.includes(todayDow) ?? false
}

/** Calcula streak consecutivo (dias seguidos completado) a partir de um Set de datas */
function computeStreak(dateSet) {
  let streak = 0
  const d = new Date()
  for (let i = 0; i < 30; i++) {
    if (!dateSet.has(d.toLocaleDateString('sv'))) break
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

/**
 * Retorna os hábitos ativos do usuário para hoje, com log, categoria e streak.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getHabitsForToday(userId) {
  const today     = localDateISO()
  const todayDow  = getTodayDow()
  const thirtyAgo = new Date(Date.now() - 30 * 86400000).toLocaleDateString('sv')

  const [habitsRes, logsRes, histRes] = await Promise.all([
    supabase.from('habits').select('*, categories(name, color)').eq('user_id', userId).eq('active', true),
    supabase.from('habit_logs').select('*').eq('user_id', userId).eq('logged_date', today),
    supabase.from('habit_logs').select('habit_id, logged_date, completed')
      .eq('user_id', userId).gte('logged_date', thirtyAgo).eq('completed', true),
  ])

  if (habitsRes.error) throw habitsRes.error
  if (logsRes.error)   throw logsRes.error

  const logMap = Object.fromEntries((logsRes.data ?? []).map((l) => [l.habit_id, l]))

  const streakMap = {}
  ;(histRes.data ?? []).forEach((l) => {
    if (!streakMap[l.habit_id]) streakMap[l.habit_id] = new Set()
    streakMap[l.habit_id].add(l.logged_date)
  })

  return (habitsRes.data ?? [])
    .filter((h) => isScheduledToday(h, todayDow))
    .map((h) => ({
      ...h,
      log:            logMap[h.id] ?? null,
      category_name:  h.categories?.name  ?? null,
      category_color: h.categories?.color ?? null,
      streak:         computeStreak(streakMap[h.id] ?? new Set()),
    }))
}

/**
 * Cria ou atualiza o registro de conclusão de um hábito no dia informado.
 * @param {string} habitId
 * @param {string} userId
 * @param {string} date  - formato YYYY-MM-DD
 * @param {boolean} completed
 */
export async function toggleCompletion(habitId, userId, date, completed) {
  const { error } = await supabase
    .from('habit_logs')
    .upsert(
      { habit_id: habitId, user_id: userId, logged_date: date, completed },
      { onConflict: 'habit_id,logged_date' }
    )
  if (error) throw error
}

/**
 * Salva ou atualiza a anotação de um hábito no dia informado.
 * @param {string} habitId
 * @param {string} userId
 * @param {string} date
 * @param {string} notes
 */
export async function saveNote(habitId, userId, date, notes) {
  const { error } = await supabase
    .from('habit_logs')
    .upsert(
      { habit_id: habitId, user_id: userId, logged_date: date, notes },
      { onConflict: 'habit_id,logged_date' }
    )
  if (error) throw error
}

/**
 * Retorna o número de hábitos completados por dia nos últimos N dias.
 * @param {string} userId
 * @param {number} [days=14]
 */
export async function getCompletionHistory(userId, days = 14) {
  const today = new Date()
  const from  = new Date(today)
  from.setDate(from.getDate() - days + 1)

  const { data, error } = await supabase
    .from('habit_logs')
    .select('logged_date')
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('logged_date', from.toLocaleDateString('sv'))
    .lte('logged_date', today.toLocaleDateString('sv'))

  if (error) throw error

  const counts = {}
  data.forEach(({ logged_date }) => {
    counts[logged_date] = (counts[logged_date] ?? 0) + 1
  })

  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (days - 1 - i))
    const date = d.toLocaleDateString('sv')
    return { date, count: counts[date] ?? 0 }
  })
}
