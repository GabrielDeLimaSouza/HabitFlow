import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { confirmPasswordReset } from '../services/auth-service'
import styles from './login-form.module.css'

function ResetPasswordForm() {
  const navigate = useNavigate()
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)
  const [ready,     setReady]     = useState(false)

  // Supabase processa o token da URL e emite PASSWORD_RECOVERY
  // antes de permitir updateUser(). Aguardamos esse evento.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const validate = () => {
    if (password.length < 8) return 'A senha deve ter no mínimo 8 caracteres.'
    if (password !== confirm)  return 'As senhas não coincidem.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setLoading(true)
    try {
      await confirmPasswordReset(password)
      navigate('/login?type=password_reset')
    } catch (err) {
      setError(err.message ?? 'Erro ao redefinir senha. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!ready) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.form}>
          <p className={styles.subtitle}>Validando link de recuperação…</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>HabitFlow</h1>
        <p className={styles.subtitle}>Criar nova senha</p>
        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>Nova senha</label>
          <input id="password" type="password" className={styles.input} value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="mínimo 8 caracteres" required autoComplete="new-password" />
        </div>
        <div className={styles.field}>
          <label htmlFor="confirm" className={styles.label}>Confirmar nova senha</label>
          <input id="confirm" type="password" className={styles.input} value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="repita a senha" required autoComplete="new-password" />
        </div>
        {password !== confirm && confirm.length > 0 && (
          <p className={styles.error}>As senhas não coincidem.</p>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar nova senha'}
        </button>
      </form>
    </div>
  )
}

export default ResetPasswordForm
