import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import styles from './note-modal.module.css'

const MAX = 300

/**
 * Modal de anotação para um hábito no dia atual.
 * @param {{ habit: object, onSave: Function, onClose: Function }} props
 */
function NoteModal({ habit, onSave, onClose }) {
  const [text, setText] = useState(habit.log?.notes ?? '')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(habit.id, text)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Nota — {habit.name}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Fechar">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX))}
            placeholder="Como foi hoje com este hábito?"
            autoFocus
          />
          <p className={styles.counter}>{text.length}/{MAX}</p>

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.save}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NoteModal
