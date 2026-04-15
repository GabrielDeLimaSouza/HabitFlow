import styles from './goal-badge.module.css'

const FREQ_SHORT = { daily: 'dia', weekly: 'semana', monthly: 'mês' }

/**
 * @param {{ goal: object }} props
 */
function GoalBadge({ goal }) {
  return (
    <span className={styles.badge}>
      {goal.target_value} {goal.target_unit}
      <span className={styles.sep}>·</span>
      {FREQ_SHORT[goal.target_frequency] ?? goal.target_frequency}
    </span>
  )
}

export default GoalBadge
