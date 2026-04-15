import { useState } from 'react'
import { Moon, Plus } from 'lucide-react'
import SleepModal from './SleepModal'
import styles from './sleep-card.module.css'

function formatHours(mins) {
  if (!mins) return ''
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h ${m}min` : `${h}h`
}

function Stars({ quality }) {
  if (!quality) return null
  return (
    <span className={styles.stars}>
      {'★'.repeat(quality)}{'☆'.repeat(5 - quality)}
    </span>
  )
}

/**
 * Card de sono de ontem para o Dashboard.
 * @param {{ log: object|null, onSave: Function, loading: boolean }} props
 */
function SleepCard({ log, onSave, loading }) {
  const [open, setOpen] = useState(false)

  if (loading) return null

  return (
    <>
      <button className={styles.card} onClick={() => setOpen(true)}>
        <div className={styles.icon}>
          <Moon size={18} />
        </div>

        <div className={styles.info}>
          {log ? (
            <>
              <span className={styles.label}>Sono de ontem</span>
              <div className={styles.data}>
                <span className={styles.hours}>{formatHours(log.duration_min)}</span>
                <Stars quality={log.quality} />
              </div>
            </>
          ) : (
            <>
              <span className={styles.label}>Sono de ontem</span>
              <span className={styles.cta}>Registrar sono</span>
            </>
          )}
        </div>

        <div className={styles.action}>
          <Plus size={14} />
        </div>
      </button>

      {open && (
        <SleepModal log={log} onSave={onSave} onClose={() => setOpen(false)} />
      )}
    </>
  )
}

export default SleepCard
