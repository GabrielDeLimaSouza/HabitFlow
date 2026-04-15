import styles from './weekly-trend-chart.module.css'

const W      = 300
const PAD_T  = 12
const PAD_B  = 26
const PLOT_H = 64
const BOTTOM = PAD_T + PLOT_H

/**
 * Gráfico de linha SVG — taxa de conclusão por semana (últimas 12 semanas).
 * @param {{ data: { label: string, rate: number|null }[] }} props
 */
function WeeklyTrendChart({ data }) {
  const valid = data.filter(d => d.rate !== null)
  if (valid.length < 2) return <p className={styles.empty}>Dados insuficientes.</p>

  const n   = data.length
  const xOf = (i) => (i / (n - 1)) * W
  const yOf = (r) => PAD_T + PLOT_H * (1 - r / 100)

  const points = data
    .map((d, i) => d.rate !== null ? `${xOf(i).toFixed(1)},${yOf(d.rate).toFixed(1)}` : null)
    .filter(Boolean)
    .join(' ')

  const labelIdxs = new Set([0, Math.floor((n - 1) / 2), n - 1])

  return (
    <svg
      viewBox={`0 0 ${W} ${PAD_T + PLOT_H + PAD_B}`}
      className={styles.svg}
      aria-label="Tendência semanal de conclusão"
    >
      {[0, 50, 100].map(pct => (
        <line
          key={pct}
          x1={0} y1={yOf(pct)} x2={W} y2={yOf(pct)}
          stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4"
        />
      ))}

      <polyline points={points} className={styles.line} />

      {data.map((d, i) => {
        if (d.rate === null) return null
        const x = xOf(i)
        const y = yOf(d.rate)
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="3" className={styles.dot} />
            {labelIdxs.has(i) && (
              <text x={x} y={BOTTOM + 16} className={styles.label}
                    style={{ textAnchor: i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle' }}>
                {d.label}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export default WeeklyTrendChart
