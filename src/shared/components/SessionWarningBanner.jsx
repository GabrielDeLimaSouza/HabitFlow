import styles from './session-warning-banner.module.css'

/**
 * Banner fixo exibido quando a sessão está prestes a expirar por inatividade.
 * Clicar em "Continuar sessão" reseta o timer e dispensa o aviso.
 * @param {{ onDismiss: () => void }} props
 */
function SessionWarningBanner({ onDismiss }) {
  return (
    <div className={styles.banner} role="alert" aria-live="assertive">
      <p className={styles.message}>
        Sua sessão expira em 5 minutos por inatividade.
      </p>
      <button className={styles.btn} onClick={onDismiss}>
        Continuar sessão
      </button>
    </div>
  )
}

export default SessionWarningBanner
