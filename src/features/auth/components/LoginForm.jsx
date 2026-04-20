import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '../utils/login-rate-limit'
import styles from './login-form.module.css'

function formatRemaining(ms) {
  const m = Math.ceil(ms / 60000)
  return m > 1 ? `${m} minutos` : `${Math.ceil(ms / 1000)} segundos`
}

function LoginForm() {
  const { signIn }  = useAuth()
  const navigate    = useNavigate()
  const [searchParams] = useSearchParams()
  const [confirmed, setConfirmed] = useState(null)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [blocked,  setBlocked]  = useState(false)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'signup')         setConfirmed('signup')
    if (type === 'password_reset') setConfirmed('password_reset')
  }, [searchParams])

  // Atualiza estado de bloqueio a cada segundo enquanto bloqueado
  useEffect(() => {
    const tick = () => {
      const { blocked: b, remainingMs } = checkRateLimit()
      setBlocked(b)
      setRemaining(remainingMs)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { blocked: isBlocked } = checkRateLimit()
    if (isBlocked) return

    setError(null)
    setLoading(true)
    try {
      await signIn({ email, password })
      clearAttempts()
      navigate('/')
    } catch (err) {
      // Registra tentativa apenas em erro de credenciais (400), não de rede
      if (err.status === 400 || err.message?.toLowerCase().includes('invalid')) {
        recordFailedAttempt()
      }
      const { blocked: nowBlocked, remainingAttempts } = checkRateLimit()
      if (nowBlocked) {
        setError('Muitas tentativas. Conta temporariamente bloqueada.')
      } else {
        setError(`${err.message} (${remainingAttempts} tentativa${remainingAttempts !== 1 ? 's' : ''} restante${remainingAttempts !== 1 ? 's' : ''})`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>HabitFlow</h1>
        <p className={styles.subtitle}>Bem-vindo de volta</p>

        {confirmed === 'signup' && (
          <p className={styles.success}>E-mail confirmado! Faça login para começar.</p>
        )}
        {confirmed === 'password_reset' && (
          <p className={styles.success}>Senha redefinida com sucesso! Faça login.</p>
        )}

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
            placeholder="••••••••" required autoComplete="current-password" />
        </div>

        <div className={styles.forgotRow}>
          <Link to="/forgot-password" className={styles.link}>Esqueci minha senha</Link>
        </div>

        {blocked && (
          <p className={styles.error}>
            Muitas tentativas. Tente novamente em {formatRemaining(remaining)}.
          </p>
        )}
        {!blocked && error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button} disabled={loading || blocked}>
          {loading ? 'Entrando...' : blocked ? 'Bloqueado' : 'Entrar'}
        </button>
        <p className={styles.footer}>
          Não tem uma conta?{' '}
          <Link to="/register" className={styles.link}>Criar conta</Link>
        </p>
      </form>
    </div>
  )
}

export default LoginForm
