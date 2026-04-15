import { useState, useEffect, useRef } from 'react'
import { secureLogout } from '../services/auth-service'

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']
const WARN_BEFORE_MS  = 5 * 60 * 1000  // aviso 5 min antes do logout

/**
 * Monitora inatividade do usuário e executa logout seguro após timeoutMs.
 * Exibe aviso warningMs antes do logout para que o usuário possa reagir.
 * @param {number} timeoutMs - Inatividade em ms para logout (padrão: 30 min)
 * @returns {{ showWarning: boolean, resetTimer: () => void }}
 */
export function useSessionTimeout(timeoutMs = 30 * 60 * 1000) {
  const [showWarning, setShowWarning] = useState(false)
  const timerRef = useRef(null)
  const warnRef  = useRef(null)
  const resetRef = useRef(null)  // referência estável ao reset para exposição externa

  useEffect(() => {
    const reset = () => {
      clearTimeout(timerRef.current)
      clearTimeout(warnRef.current)
      setShowWarning(false)
      warnRef.current  = setTimeout(() => setShowWarning(true), timeoutMs - WARN_BEFORE_MS)
      timerRef.current = setTimeout(secureLogout, timeoutMs)
    }

    resetRef.current = reset
    ACTIVITY_EVENTS.forEach((e) => document.addEventListener(e, reset, { passive: true }))
    reset()

    return () => {
      ACTIVITY_EVENTS.forEach((e) => document.removeEventListener(e, reset))
      clearTimeout(timerRef.current)
      clearTimeout(warnRef.current)
    }
  }, [timeoutMs])

  return { showWarning, resetTimer: () => resetRef.current?.() }
}
