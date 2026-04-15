import { useEffect } from 'react'
import { useStats } from '../hooks/use-stats'
import { SleepBarChart, useSleep } from '../../sleep'
import { useAiStore } from '../../ai-agent/store/ai-store'
import CategorySelector from './CategorySelector'
import ContributionCalendar from './ContributionCalendar'
import OverviewCards from './OverviewCards'
import HabitStatsList from './HabitStatsList'
import styles from './stats-page.module.css'

function StatsPage() {
  useEffect(() => {
    useAiStore.getState().setActiveScreen('stats')
    useAiStore.getState().clearActiveHabit()
  }, [])

  const { calendar, overview, habitStats, categories,
          categoryFilter, setCategoryFilter, loading, error } = useStats()
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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Estatísticas</h1>
          <CategorySelector
            categories={categories}
            selected={categoryFilter}
            onChange={setCategoryFilter}
          />
        </header>

        {error && <p className={styles.error}>{error}</p>}

        {overview && <OverviewCards overview={overview} />}

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>
            {categoryFilter
              ? `Últimos 3 meses — ${categories.find((c) => c.id === categoryFilter)?.name}`
              : 'Últimos 3 meses'}
          </h2>
          <ContributionCalendar calendar={calendar} />
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Sono — últimos 7 dias</h2>
          <SleepBarChart history={sleepHistory} />
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Por hábito</h2>
          <HabitStatsList habitStats={habitStats} />
        </section>
      </div>
    </div>
  )
}

export default StatsPage
