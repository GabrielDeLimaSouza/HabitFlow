import styles from './onboarding-modal.module.css'

const SUGGESTIONS = [
  { name: 'Exercício',  category: 'Saúde',       color: '#22c55e' },
  { name: 'Leitura',    category: 'Aprendizado',  color: '#6366f1' },
  { name: 'Meditação',  category: 'Bem-estar',    color: '#f59e0b' },
]

/**
 * Modal de onboarding exibido quando o usuário não tem hábitos.
 * @param {{ onAdd: Function, onSkip: Function, loading: boolean, error?: string }} props
 */
function OnboardingModal({ onAdd, onSkip, loading, error }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div>
          <h2 className={styles.title}>Bem-vindo ao HabitFlow!</h2>
          <p className={styles.subtitle}>
            Comece com hábitos e categorias pré-configurados ou crie os seus.
          </p>
        </div>

        <ul className={styles.list}>
          {SUGGESTIONS.map((s) => (
            <li key={s.name} className={styles.item}>
              <span className={styles.dot} style={{ background: s.color }} />
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{s.name}</span>
                <span className={styles.itemCategory}>{s.category}</span>
              </div>
            </li>
          ))}
        </ul>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button className={styles.addBtn} onClick={onAdd} disabled={loading}>
            {loading ? 'Criando...' : 'Adicionar estes hábitos'}
          </button>
          <button className={styles.skipBtn} onClick={onSkip} disabled={loading}>
            Começar do zero
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingModal
