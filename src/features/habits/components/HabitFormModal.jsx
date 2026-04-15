import { useEffect } from 'react'
import { X } from 'lucide-react'
import HabitForm from './HabitForm'
import styles from './habit-form-modal.module.css'

/**
 * @param {{ habit?: object, categories?: object[], onSubmit: Function, onClose: Function, loading: boolean }} props
 */
function HabitFormModal({ habit, categories, onSubmit, onClose, loading }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{habit ? 'Editar hábito' : 'Novo hábito'}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <HabitForm habit={habit} categories={categories} onSubmit={onSubmit} onCancel={onClose} loading={loading} />
      </div>
    </div>
  )
}

export default HabitFormModal
