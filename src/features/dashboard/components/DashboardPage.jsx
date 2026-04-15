import { useState, useEffect } from 'react'
import { useAuthStore } from '../../auth/store/auth-store'
import { useAiStore } from '../../ai-agent/store/ai-store'
import { useCategories } from '../../categories'
import { SleepCard, useSleep } from '../../sleep'
import { InsightCard, useInsight } from '../../insights'
import { useDashboard } from '../hooks/use-dashboard'
import DayProgress from './DayProgress'
import HabitListToday from './HabitListToday'
import CategoryDonut from './CategoryDonut'
import DailyLineChart from './DailyLineChart'
import NoteModal from './NoteModal'
import styles from './dashboard-page.module.css'

const DAYS_PT   = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const MONTHS_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function formatDate() {
  const now = new Date()
  return `${DAYS_PT[now.getDay()]}, ${now.getDate()} de ${MONTHS_PT[now.getMonth()]}`
}

function DashboardPage() {
  useEffect(() => {
    useAiStore.getState().setActiveScreen('dashboard')
    useAiStore.getState().clearActiveHabit()
  }, [])

  const { user, profile }                                  = useAuthStore()
  const { habits, stats, history, loading, error, toggle, saveHabitNote } = useDashboard()
  const { categories }                                     = useCategories()
  const { log: sleepLog, save: saveSleep, loading: sleepLoading } = useSleep()
  const { insight, loading: insightLoading, generating, error: insightError, daysWithData, isMonday, daysUntilMonday, generate } = useInsight()
  const [noteHabit, setNoteHabit]                          = useState(null)

  const username = profile?.name || user?.email?.split('@')[0] || 'você'
  const hasCompletions = habits.some((h) => h.log?.completed)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.greeting}>{getGreeting()}, {username}</h1>
            <p className={styles.date}>{formatDate()}</p>
          </div>
        </header>

        {error && <p className={styles.error}>{error}</p>}

        <InsightCard insight={insight} loading={insightLoading}
          generating={generating} error={insightError}
          daysWithData={daysWithData} isMonday={isMonday}
          daysUntilMonday={daysUntilMonday} onGenerate={generate} />

        <section className={styles.card}>
          <DayProgress completed={stats.completed} total={stats.total} percentage={stats.percentage} />
        </section>

        {hasCompletions && categories.length > 0 && (
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Completados por categoria</h2>
            <CategoryDonut habits={habits} categories={categories} />
          </section>
        )}

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Hábitos de hoje</h2>
          <HabitListToday habits={habits} onToggle={toggle}
            onNoteClick={setNoteHabit} loading={loading} />
        </section>

        {history.length > 0 && (
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Últimos 14 dias</h2>
            <DailyLineChart history={history} />
          </section>
        )}

        <SleepCard log={sleepLog} onSave={saveSleep} loading={sleepLoading} />
      </div>

      {noteHabit && (
        <NoteModal
          habit={noteHabit}
          onSave={saveHabitNote}
          onClose={() => setNoteHabit(null)}
        />
      )}
    </div>
  )
}

export default DashboardPage
