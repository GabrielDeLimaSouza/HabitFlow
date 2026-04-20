import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../services/auth-service'
import styles from './login-form.module.css'

function ForgotPasswordForm() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [sent,    setSent]    = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (err) {
      setError(err.message ?? 'Erro ao enviar e-mail. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.form}>
          <h1 className={styles.title}>Verifique seu e-mail</h1>
          <p className={styles.subtitle}>
            Enviamos um link de redefinição para <strong>{email}</strong>.
            Acesse seu e-mail e clique no link para criar uma nova senha.
          </p>
          <Link to="/login" className={styles.link}>Voltar para o login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>HabitFlow</h1>
        <p className={styles.subtitle}>Recuperar acesso</p>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>Email da sua conta</label>
          <input id="email" type="email" className={styles.input} value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com" required autoComplete="email" />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar link de recuperação'}
        </button>
        <p className={styles.footer}>
          Lembrou a senha?{' '}
          <Link to="/login" className={styles.link}>Entrar</Link>
        </p>
      </form>
    </div>
  )
}

export default ForgotPasswordForm
