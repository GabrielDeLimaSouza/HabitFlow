import { useState, useEffect } from 'react'

/**
 * Retorna style com animationDelay para efeito stagger em listas.
 * Uso simples: <div className="animate-in" style={useStaggerDelay(i)} />
 *
 * @param {number} index - índice do item na lista
 * @param {number} [baseDelay=40] - delay base em ms
 * @returns {Object} style object com animationDelay
 */
export function useStaggerDelay(index, baseDelay = 40) {
  return { animationDelay: `${Math.min(index * baseDelay, 300)}ms` }
}

/**
 * Retorna uma função que, dado o índice do item, devolve
 * className + style para animar itens em sequência (stagger).
 *
 * @param {number} [delay=40] - ms entre cada item
 * @returns {function(number): { className: string, style: object }}
 */
export function useStaggerChildren(delay = 40) {
  return (index) => ({
    className: 'stagger-item',
    style: { '--stagger-delay': `${index * delay}ms` },
  })
}

/**
 * Retorna props para aplicar animação de fade-in ao montar.
 *
 * @param {number} [duration=200] - duração em ms
 * @returns {{ className: string, style: object }}
 */
export function useFadeIn(duration = 200) {
  return {
    className: 'fade-in',
    style: { '--fade-duration': `${duration}ms` },
  }
}

/**
 * Anima um número de 0 até `target` em `duration` ms.
 *
 * @param {number} target   - valor final
 * @param {number} [duration=600] - duração em ms
 * @returns {number} - valor atual animado
 */
export function useCountUp(target, duration = 600) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!target) return
    let current = 0
    const increment = target / (duration / 16)

    const timer = setInterval(() => {
      current = Math.min(current + increment, target)
      setValue(Math.floor(current))
      if (current >= target) clearInterval(timer)
    }, 16)

    return () => clearInterval(timer)
  }, [target, duration])

  return value
}
