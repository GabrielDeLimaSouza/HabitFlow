import { useEffect } from 'react'
import { useStats } from '../hooks/use-stats'
import { SleepBarChart, useSleep } from '../../sleep'
import { useAiStore } from '../../ai-agent/store/ai-store'
import CategorySelector from './CategorySelector'
import ContributionCalendar from './ContributionCalendar'
import OverviewCards from './OverviewCards'
import HabitStatsList from './HabitStatsList'
import WeekdayChart from './WeekdayChart'
import WeeklyTrendChart from './WeeklyTrendChart'
import styles from './stats-page.module.css'

function StatsPage() {
  useEffect(() => {
    useAiStore.getState().setActiveScreen('stats')
    useAiStore.getState().clearActiveHabit()
  }, [])

  const {
    calendar, overview, habitStats, weekdayStats, weeklyTrend,
    categories, categoryFilter, setCategoryFilter, loading, error,
  } = useStats()
  const { history: sleepHistory } = useSleep()

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.skeletons}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`skeleton ${styles.skeleton}`} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const calLabel = categoryFilter
    ? `Últimos 3 meses — ${categories.find((c) => c.id === categoryFilter)?.name}`
    : 'Últimos 3 meses'

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Bloco 1 — Cabeçalho */}
        <header className={styles.header}>
          <h1 className={styles.title}>Estatísticas</h1>
          <CategorySelector
            categories={categories}
            selected={categoryFilter}
            onChange={setCategoryFilter}
          />
        </header>

        {error && <p className={styles.error}>{error}</p>}

        {/* Bloco 2 — Cards de visão geral */}
        {overview && <OverviewCards overview={overview} />}

        {/* Bloco 3 — Calendário de contribuições */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>{calLabel}</h2>
          <ContributionCalendar calendar={calendar} />
        </section>

        {/* Bloco 4 — Melhor dia da semana */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Melhor dia da semana</h2>
          <WeekdayChart data={weekdayStats} />
        </section>

        {/* Bloco 5 — Tendência semanal */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Tendência semanal</h2>
          <WeeklyTrendChart data={weeklyTrend} />
        </section>

        {/* Bloco 6 — Sono */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Sono — últimos 7 dias</h2>
          <SleepBarChart history={sleepHistory} />
        </section>

        {/* Bloco 7 — Ranking por hábito */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Ranking por hábito</h2>
          <HabitStatsList habitStats={habitStats} />
        </section>

      </div>
    </div>
  )
}

export default StatsPage
