import { useState } from 'react'
import { useSecurity } from '../hooks/use-security'
import { SettingsSection } from './SettingsPrimitives'
import styles from './settings-page.module.css'

function SecuritySection() {
  const { changePassword, changeEmail, loading, error, success } = useSecurity()

  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newEmail,        setNewEmail]        = useState('')
  const [activeForm,      setActiveForm]      = useState(null) // 'password' | 'email' | null

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (newPassword.length < 8) return
    if (newPassword !== confirmPassword) return
    await changePassword(newPassword)
    if (!error) { setNewPassword(''); setConfirmPassword(''); setActiveForm(null) }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!newEmail) return
    await changeEmail(newEmail)
    if (!error) { setNewEmail(''); setActiveForm(null) }
  }

  return (
    <SettingsSection title="SEGURANÇA">
      {activeForm === null && (
        <>
          <button className={styles.btnSecondary} onClick={() => setActiveForm('password')}>
            Alterar senha
          </button>
          <button className={styles.btnSecondary} onClick={() => setActiveForm('email')}
            style={{ marginTop: 'var(--space-2)' }}>
            Alterar e-mail
          </button>
        </>
      )}

      {activeForm === 'password' && (
        <form onSubmit={handlePasswordSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Nova senha</label>
            <input type="password" className={styles.input} value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="mínimo 8 caracteres" minLength={8} required />
          </div>
          <div className={styles.field} style={{ marginTop: 'var(--space-3)' }}>
            <label className={styles.label}>Confirmar nova senha</label>
            <input type="password" className={styles.input} value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="repita a senha" required />
          </div>
          {newPassword !== confirmPassword && confirmPassword.length > 0 && (
            <p className={styles.errorMsg}>As senhas não coincidem.</p>
          )}
          {error   && <p className={styles.errorMsg}>{error}</p>}
          {success && <p className={styles.successMsg}>Senha alterada. Você receberá um e-mail de confirmação.</p>}
          <div className={styles.actions}>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Salvando…' : 'Salvar senha'}
            </button>
            <button type="button" className={styles.btnSecondary}
              onClick={() => setActiveForm(null)} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {activeForm === 'email' && (
        <form onSubmit={handleEmailSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Novo e-mail</label>
            <input type="email" className={styles.input} value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="novo@email.com" required />
          </div>
          {error   && <p className={styles.errorMsg}>{error}</p>}
          {success && <p className={styles.successMsg}>Verifique seu novo e-mail para confirmar a alteração.</p>}
          <div className={styles.actions}>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Enviando…' : 'Enviar confirmação'}
            </button>
            <button type="button" className={styles.btnSecondary}
              onClick={() => setActiveForm(null)} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </SettingsSection>
  )
}

export default SecuritySection
