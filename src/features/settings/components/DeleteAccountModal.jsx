import { useState, useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { useDeleteAccount } from '../hooks/use-delete-account'
import styles from './delete-account-modal.module.css'

const CONFIRM_WORD = 'EXCLUIR'

/**
 * Modal de confirmação para exclusão permanente da conta.
 * Exige digitar EXCLUIR antes de habilitar a ação destrutiva.
 * @param {{ onClose: Function, onDeleted: Function }} props
 */
function DeleteAccountModal({ onClose, onDeleted }) {
  const [text, setText] = useState('')
  const { remove, loading, error } = useDeleteAccount()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const confirmed = text.trim().toUpperCase() === CONFIRM_WORD

  const handleDelete = async () => {
    if (!confirmed || loading) return
    const ok = await remove()
    if (ok) onDeleted()
  }

  return (
    <div className={styles.overlay} onClick={loading ? undefined : onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <AlertTriangle size={18} className={styles.warnIcon} />
            Excluir minha conta
          </h2>
          <button className={styles.close} onClick={onClose} aria-label="Fechar" disabled={loading}>
            <X size={16} />
          </button>
        </div>

        <p className={styles.text}>
          Esta ação é <strong>permanente</strong>. Todos os seus dados — hábitos,
          registros, sono e histórico de IA — serão apagados e <strong>não poderão
          ser recuperados</strong>.
        </p>

        <label className={styles.label} htmlFor="confirm-delete">
          Digite <strong>{CONFIRM_WORD}</strong> para confirmar
        </label>
        <input
          id="confirm-delete"
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={CONFIRM_WORD}
          autoFocus
          disabled={loading}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button
            type="button"
            className={styles.delete}
            onClick={handleDelete}
            disabled={!confirmed || loading}
          >
            {loading ? 'Excluindo…' : 'Excluir permanentemente'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccountModal
