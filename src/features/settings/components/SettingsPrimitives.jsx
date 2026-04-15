import styles from './settings-page.module.css'

/**
 * Seção de configurações com card e título.
 * @param {{ title: string, children: React.ReactNode }} props
 */
export function SettingsSection({ title, children }) {
  return (
    <section className={styles.section}>
      <span className={styles.sectionTitle}>{title}</span>
      {children}
    </section>
  )
}

/**
 * Toggle switch (pill) com label e hint opcionais.
 * @param {{ label: string, hint?: string, checked: boolean, onChange: Function, disabled?: boolean }} props
 */
export function SettingsToggle({ label, hint, checked, onChange, disabled }) {
  return (
    <label className={styles.toggleRow}>
      <div className={styles.toggleInfo}>
        <span className={styles.label}>{label}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        type="button"
        className={`${styles.toggleSwitch} ${checked ? styles.toggleSwitchOn : ''}`}
        onClick={() => onChange(!checked)}
        disabled={disabled}
      />
    </label>
  )
}

/**
 * Linha de ação com descrição e botão.
 * @param {{ label: string, hint?: string, buttonLabel: string, onClick: Function, danger?: boolean, disabled?: boolean }} props
 */
export function SettingsAction({ label, hint, buttonLabel, onClick, danger, disabled }) {
  return (
    <div className={styles.actionRow}>
      <div className={styles.toggleInfo}>
        <span className={styles.label}>{label}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
      <button
        type="button"
        className={danger ? styles.btnDanger : styles.btnSecondary}
        onClick={onClick}
        disabled={disabled}
      >
        {buttonLabel}
      </button>
    </div>
  )
}
