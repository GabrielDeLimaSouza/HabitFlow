import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signUp } from '../services/auth-service'
import styles from './register-form.module.css'

function RegisterForm() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [sent,     setSent]     = useState(false)

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
      await signUp({ email, password })
      setSent(true)
    } catch (err) {
      setError(err.message ?? 'Erro ao criar conta. Tente novamente.')
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
            Enviamos um link de confirmação para <strong>{email}</strong>.
            Acesse seu e-mail e clique no link para ativar sua conta.
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
        <p className={styles.subtitle}>Crie sua conta</p>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input id="email" type="email" className={styles.input} value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com" required autoComplete="email" />
        </div>
        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>Senha</label>
          <input id="password" type="password" className={styles.input} value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="mínimo 8 caracteres" required autoComplete="new-password" />
        </div>
        <div className={styles.field}>
          <label htmlFor="confirm" className={styles.label}>Confirmar senha</label>
          <input id="confirm" type="password" className={styles.input} value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="repita a senha" required autoComplete="new-password" />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
        <p className={styles.footer}>
          Já tem uma conta?{' '}
          <Link to="/login" className={styles.link}>Entrar</Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterForm
