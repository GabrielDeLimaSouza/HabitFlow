import { Flame, TrendingUp, CheckCircle } from 'lucide-react'
import { useCountUp } from '../../../shared/hooks/use-animation'
import styles from './overview-cards.module.css'

/**
 * Card individual com count-up animado no número principal.
 * @param {{ icon, label, value: number, suffix: string, accent: boolean }} props
 */
function AnimatedCard({ icon, label, value, suffix, accent }) {
  const animated = useCountUp(value, 600)

  return (
    <div className={`${styles.card} ${accent ? styles.accent : ''}`}>
      <div className={styles.icon}>{icon}</div>
      <span className={styles.value}>
        {animated}{suffix}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}

/**
 * @param {{ overview: { streak: number, weekPercentage: number, totalLogs: number } }} props
 */
function OverviewCards({ overview }) {
  const streakSuffix = ` dia${overview.streak !== 1 ? 's' : ''}`

  return (
    <div className={styles.grid}>
      <AnimatedCard
        icon={<Flame size={20} />}
        label="Streak atual"
        value={overview.streak}
        suffix={streakSuffix}
        accent={overview.streak > 0}
      />
      <AnimatedCard
        icon={<TrendingUp size={20} />}
        label="Esta semana"
        value={overview.weekPercentage}
        suffix="%"
        accent={overview.weekPercentage >= 80}
      />
      <AnimatedCard
        icon={<CheckCircle size={20} />}
        label="Total concluídos"
        value={overview.totalLogs}
        suffix=""
        accent={false}
      />
    </div>
  )
}

export default OverviewCards
