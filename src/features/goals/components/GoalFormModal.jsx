import { useEffect } from 'react'
import { X } from 'lucide-react'
import GoalForm from './GoalForm'
import styles from './goal-form-modal.module.css'

/**
 * @param {{ habit: object, goal?: object, onSubmit: Function, onRemove?: Function, onClose: Function, loading: boolean }} props
 */
function GoalFormModal({ habit, goal, onSubmit, onRemove, onClose, loading }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{goal ? 'Editar meta' : 'Definir meta'}</h2>
            <p className={styles.habitName}>{habit.name}</p>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <GoalForm
          goal={goal}
          onSubmit={onSubmit}
          onCancel={onClose}
          onRemove={onRemove}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default GoalFormModal
