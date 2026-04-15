import styles from './sleep-bar-chart.module.css'

const W = 420; const H = 120
const PAD_L = 28; const PAD_R = 8; const PAD_T = 18; const PAD_B = 26
const CHART_W = W - PAD_L - PAD_R
const CHART_H = H - PAD_T - PAD_B
const REF_MIN  = 480   // 8 horas em minutos
const DAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function buildBars(history) {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    const date = d.toLocaleDateString('sv')
    const log  = history.find((h) => h.sleep_date === date)
    return { date, mins: log?.duration_min ?? 0, dow: d.getDay() }
  })
}

function formatHours(mins) {
  if (!mins) return ''
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h${m}` : `${h}h`
}

/**
 * Gráfico de barras SVG — horas de sono dos últimos 7 dias.
 * Linha pontilhada de referência em 8h. Valores exibidos acima de cada barra.
 * @param {{ history: object[] }} props
 */
function SleepBarChart({ history }) {
  const bars   = buildBars(history)
  const maxMin = Math.max(...bars.map((b) => b.mins), REF_MIN, 1)
  const barW   = CHART_W / 7
  const refY   = PAD_T + CHART_H - (REF_MIN / maxMin) * CHART_H

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        preserveAspectRatio="xMidYMid meet"
        style={{ height: H }}
      >
        {/* Linha de referência 8h */}
        <line
          x1={PAD_L} x2={W - PAD_R} y1={refY} y2={refY}
          stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="4 3"
        />
        <text x={PAD_L - 4} y={refY + 4} textAnchor="end" className={styles.refLabel}>8h</text>

        {/* Barras */}
        {bars.map((bar, i) => {
          const x      = PAD_L + i * barW + barW * 0.15
          const bw     = barW * 0.7
          const barH   = bar.mins ? (bar.mins / maxMin) * CHART_H : 0
          const y      = PAD_T + CHART_H - barH
          const isGood = bar.mins >= REF_MIN
          const label  = formatHours(bar.mins)

          return (
            <g key={bar.date}>
              {barH > 0 ? (
                <>
                  <rect
                    x={x} y={y} width={bw} height={barH} rx="3"
                    fill={isGood ? 'var(--accent)' : 'var(--text-muted)'}
                    opacity="0.75" className={styles.bar}
                    style={{ animationDelay: `${i * 60}ms` }}
                  />
                  {barH > 14 && (
                    <text x={x + bw / 2} y={y - 3} textAnchor="middle" className={styles.barLabel}>
                      {label}
                    </text>
                  )}
                </>
              ) : (
                <rect x={x} y={PAD_T + CHART_H - 2} width={bw} height={2} rx="1" fill="var(--border)" />
              )}
              <text x={x + bw / 2} y={H - 8} textAnchor="middle" className={styles.axisLabel}>
                {DAYS_SHORT[bar.dow]}
              </text>
            </g>
          )
        })}
      </svg>

      <p className={styles.legend}>
        <span className={styles.legendDot} style={{ background: 'var(--accent)' }} />
        8h ou mais
        <span className={styles.legendDot} style={{ background: 'var(--text-muted)', marginLeft: 12 }} />
        Abaixo da meta
      </p>
    </div>
  )
}

export default SleepBarChart
