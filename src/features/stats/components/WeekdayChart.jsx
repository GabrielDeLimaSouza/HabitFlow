import styles from './weekday-chart.module.css'

const W      = 280
const BAR_TOP = 20
const BAR_H   = 72
const LABEL_Y = 108
const COL_W   = W / 7
const BAR_W   = 22

/**
 * Gráfico de barras SVG — taxa de conclusão por dia da semana.
 * @param {{ data: { label: string, rate: number|null }[] }} props
 */
function WeekdayChart({ data }) {
  const valid = data.filter(d => d.rate !== null)
  if (!valid.length) return <p className={styles.empty}>Dados insuficientes.</p>

  const maxIdx = data.reduce(
    (best, d, i) => d.rate !== null && (best === -1 || d.rate > data[best]?.rate) ? i : best,
    -1,
  )
  const base = BAR_TOP + BAR_H  // bottom y-coord das barras

  return (
    <svg
      viewBox={`0 0 ${W} 114`}
      className={styles.svg}
      aria-label="Taxa de conclusão por dia da semana"
    >
      {data.map((d, i) => {
        const cx   = i * COL_W + COL_W / 2
        const barH = d.rate !== null ? Math.max((d.rate / 100) * BAR_H, 3) : 0
        const barY = base - barH
        const isTop = i === maxIdx

        return (
          <g key={i}>
            <rect
              x={cx - BAR_W / 2} y={BAR_TOP}
              width={BAR_W} height={BAR_H}
              fill="var(--bg-elevated)" rx="4"
            />
            {d.rate !== null && (
              <rect
                x={cx - BAR_W / 2} y={barY}
                width={BAR_W} height={barH}
                fill={isTop ? 'var(--accent)' : 'rgba(99,102,241,0.42)'}
                rx="4"
                className={styles.bar}
                style={{ animationDelay: `${i * 45}ms` }}
              />
            )}
            <text
              x={cx} y={LABEL_Y}
              className={`${styles.label} ${isTop ? styles.labelTop : ''}`}
            >
              {d.label}
            </text>
            {d.rate !== null && (
              <text
                x={cx} y={barY - 5}
                className={`${styles.rateText} ${isTop ? styles.rateTop : ''}`}
              >
                {d.rate}%
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export default WeekdayChart
