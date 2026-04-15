import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import styles from './sleep-modal.module.css'

const MAX_NOTES = 200

function calcDuration(bedtime, wakeTime) {
  if (!bedtime || !wakeTime) return null
  const [bh, bm] = bedtime.split(':').map(Number)
  const [wh, wm] = wakeTime.split(':').map(Number)
  let mins = wh * 60 + wm - (bh * 60 + bm)
  if (mins <= 0) mins += 24 * 60
  return mins
}

function formatDuration(mins) {
  if (!mins) return ''
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h ${m}min` : `${h}h`
}

/**
 * Modal para registrar o sono de ontem.
 * @param {{ log: object|null, onSave: Function, onClose: Function }} props
 */
function SleepModal({ log, onSave, onClose }) {
  const [bedtime,  setBedtime]  = useState(log?.bedtime  ?? '22:00')
  const [wakeTime, setWakeTime] = useState(log?.wake_time ?? '07:00')
  const [quality,  setQuality]  = useState(log?.quality  ?? 0)
  const [notes,    setNotes]    = useState(log?.notes    ?? '')

  const duration = calcDuration(bedtime, wakeTime)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!duration) return
    onSave({ bedtime, wake_time: wakeTime, duration_min: duration, quality: quality || null, notes: notes || null })
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Sono de ontem</h2>
          <button className={styles.close} onClick={onClose} aria-label="Fechar"><X size={16} /></button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.times}>
            <div className={styles.field}>
              <label className={styles.label}>Dormi às</label>
              <input type="time" className={styles.timeInput}
                value={bedtime} onChange={(e) => setBedtime(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Acordei às</label>
              <input type="time" className={styles.timeInput}
                value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} required />
            </div>
          </div>

          {duration && (
            <p className={styles.duration}>{formatDuration(duration)} de sono</p>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Qualidade</label>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button"
                  className={`${styles.star} ${n <= quality ? styles.starOn : ''}`}
                  onClick={() => setQuality(n === quality ? 0 : n)}>
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Notas (opcional)</label>
            <textarea className={styles.textarea} value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, MAX_NOTES))}
              placeholder="Como você se sentiu ao acordar?" rows={3} />
            <span className={styles.counter}>{notes.length}/{MAX_NOTES}</span>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.save} disabled={!duration}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SleepModal
