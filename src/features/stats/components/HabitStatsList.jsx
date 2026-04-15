import styles from './habit-stats-list.module.css'

const RANK_COLORS = ['#f59e0b', '#9ca3af', '#c97c2d']

/**
 * Lista de hábitos ordenada por taxa de 30 dias, com ranking visual.
 * @param {{ habitStats: { habit, currentStreak, bestStreak, rate30d }[] }} props
 */
function HabitStatsList({ habitStats }) {
  if (habitStats.length === 0) {
    return <p className={styles.empty}>Nenhum hábito encontrado.</p>
  }

  const sorted = [...habitStats].sort((a, b) => b.rate30d - a.rate30d)

  return (
    <ul className={styles.list}>
      {sorted.map(({ habit, currentStreak, bestStreak, rate30d }, i) => {
        const rankColor = i < 3 ? RANK_COLORS[i] : 'var(--text-disabled)'
        const barColor  = i < 3 ? RANK_COLORS[i] : (habit.color ?? 'var(--accent)')
        return (
          <li key={habit.id} className={styles.item}>
            <span className={styles.rank} style={{ color: rankColor }}>
              {i + 1}º
            </span>
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
                <span
                  className={styles.metricValue}
                  style={{ color: i === 0 ? RANK_COLORS[0] : undefined }}
                >
                  {rate30d}%
                </span>
                <span className={styles.metricLabel}>30 dias</span>
              </div>
            </div>
            <div className={styles.bar}>
              <div
                className={styles.barFill}
                style={{ width: `${rate30d}%`, background: barColor }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default HabitStatsList
