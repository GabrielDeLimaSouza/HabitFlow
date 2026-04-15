import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import styles from './archived-section.module.css'

/**
 * Seção colapsável de hábitos arquivados com ações de restaurar e excluir permanentemente.
 * @param {{ archived: object[], onRestore: Function, onDelete: Function }} props
 */
function ArchivedSection({ archived, onRestore, onDelete }) {
  const [open,      setOpen]      = useState(false)
  const [confirming, setConfirming] = useState(null) // habitId em confirmação

  if (archived.length === 0) return null

  return (
    <section className={styles.section}>
      <button className={styles.toggle} onClick={() => setOpen(!open)}>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        Arquivados ({archived.length})
      </button>

      {open && (
        <ul className={styles.list}>
          {archived.map((habit) => (
            <li key={habit.id} className={styles.card}>
              <span className={styles.accent} style={{ background: habit.color ?? 'var(--accent)' }} />
              <span className={styles.name}>{habit.name}</span>
              <span className={styles.badge}>Arquivado</span>

              {confirming === habit.id ? (
                <div className={styles.confirm}>
                  <span>Excluir permanentemente?</span>
                  <button className={`${styles.btn} ${styles.confirmYes}`}
                    onClick={() => { onDelete(habit.id); setConfirming(null) }}>
                    Sim
                  </button>
                  <button className={`${styles.btn} ${styles.confirmNo}`}
                    onClick={() => setConfirming(null)}>
                    Não
                  </button>
                </div>
              ) : (
                <div className={styles.actions}>
                  <button className={`${styles.btn} ${styles.restore}`}
                    onClick={() => onRestore(habit.id)}>
                    Restaurar
                  </button>
                  <button className={`${styles.btn} ${styles.delete}`}
                    onClick={() => setConfirming(habit.id)}>
                    Excluir
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ArchivedSection
