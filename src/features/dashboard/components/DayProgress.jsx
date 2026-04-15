import styles from './day-progress.module.css'

/**
 * @param {{ completed: number, total: number, percentage: number }} props
 */
function DayProgress({ completed, total, percentage }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.labels}>
        <span className={styles.fraction}>
          {completed} <span className={styles.divider}>/</span> {total} hábitos
        </span>
        <span className={styles.percent}>{percentage}%</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

export default DayProgress
