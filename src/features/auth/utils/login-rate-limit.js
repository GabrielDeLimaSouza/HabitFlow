const KEY         = 'habitflow:login_attempts'
const MAX_ATTEMPTS = 5
const WINDOW_MS    = 15 * 60 * 1000  // 15 minutos

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? null
  } catch {
    return null
  }
}

/**
 * Verifica se o login está bloqueado por excesso de tentativas.
 * @returns {{ blocked: boolean, remainingMs: number, remainingAttempts: number }}
 */
export function checkRateLimit() {
  const stored = load()
  if (!stored) return { blocked: false, remainingMs: 0, remainingAttempts: MAX_ATTEMPTS }

  const elapsed = Date.now() - stored.windowStart
  if (elapsed > WINDOW_MS) return { blocked: false, remainingMs: 0, remainingAttempts: MAX_ATTEMPTS }

  const blocked = stored.count >= MAX_ATTEMPTS
  return {
    blocked,
    remainingMs:      blocked ? WINDOW_MS - elapsed : 0,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - stored.count),
  }
}

/**
 * Registra uma tentativa de login com credenciais incorretas.
 */
export function recordFailedAttempt() {
  const stored  = load()
  const now     = Date.now()
  const expired = !stored || now - stored.windowStart > WINDOW_MS

  localStorage.setItem(KEY, JSON.stringify({
    count:       expired ? 1 : stored.count + 1,
    windowStart: expired ? now : stored.windowStart,
  }))
}

/**
 * Limpa o contador de tentativas (chamar após login bem-sucedido).
 */
export function clearAttempts() {
  localStorage.removeItem(KEY)
}
