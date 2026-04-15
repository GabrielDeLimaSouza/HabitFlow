import styles from './habit-stats-list.module.css'

/**
 * @param {{ habitStats: { habit, currentStreak, bestStreak, rate30d }[] }} props
 */
function HabitStatsList({ habitStats }) {
  if (habitStats.length === 0) {
    return <p className={styles.empty}>Nenhum hábito encontrado.</p>
  }

  return (
    <ul className={styles.list}>
      {habitStats.map(({ habit, currentStreak, bestStreak, rate30d }) => (
        <li key={habit.id} className={styles.item}>
          <div className={styles.dot} style={{ background: habit.color ?? 'var(--accent)' }} />

          <span className={styles.name}>{habit.name}</span>

          <div className={styles.metrics}>
            <div className={styles.metric}>
              <span className={styles.metricValue}>{currentStreak}d</span>
              <span className={styles.metricLabel}>streak</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricValue}>{bestStreak}d</span>
              <span className={styles.metricLabel}>recorde</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricValue}>{rate30d}%</span>
              <span className={styles.metricLabel}>30 dias</span>
            </div>
          </div>

          <div className={styles.bar}>
            <div className={styles.barFill} style={{ width: `${rate30d}%`, background: habit.color ?? 'var(--accent)' }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default HabitStatsList
