import styles from './contribution-calendar.module.css'

const MONTHS_PT  = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']
const DAY_LABELS = ['Seg','','Qua','','Sex','','Dom']

const CELL = 13   // tamanho base da célula no viewBox (escala com SVG)
const GAP  = 3
const STEP = CELL + GAP
const PAD_L = 28  // espaço para labels de dia
const PAD_T = 16  // espaço para labels de mês

const FILL = [
  'var(--bg-elevated)',
  'rgba(99,102,241,0.28)',
  'rgba(99,102,241,0.58)',
  'var(--accent)',
]

/** Padding nulo no início para alinhar o primeiro dia ao dia de semana correto. */
function buildGrid(calendar) {
  if (!calendar.length) return []
  const dow = new Date(calendar[0].date).getDay()
  const pad = dow === 0 ? 6 : dow - 1   // Mon=0 offset
  return [...Array(pad).fill(null), ...calendar]
}

/** Calcula spans de mês: [{ label, col, colCount }] */
function buildMonthSpans(grid) {
  const cols = Math.ceil(grid.length / 7)
  const spans = []
  let lastMonth = -1

  for (let c = 0; c < cols; c++) {
    const day = grid.slice(c * 7, c * 7 + 7).find((d) => d !== null)
    if (!day) continue
    const m = new Date(day.date).getMonth()
    if (m !== lastMonth) {
      spans.push({ label: MONTHS_PT[m], col: c, colCount: 1 })
      lastMonth = m
    } else if (spans.length) {
      spans[spans.length - 1].colCount++
    }
  }
  return spans
}

/**
 * Calendário de contribuições — SVG responsivo que preenche o espaço disponível.
 * @param {{ calendar: { date: string, completed: number, total: number, intensity: 0|1|2|3 }[] }} props
 */
function ContributionCalendar({ calendar }) {
  if (!calendar.length) return null

  const grid       = buildGrid(calendar)
  const totalCols  = Math.ceil(grid.length / 7)
  const monthSpans = buildMonthSpans(grid)
  const vbW = PAD_L + totalCols * STEP
  const vbH = PAD_T + 7 * STEP

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        className={styles.svg}
        preserveAspectRatio="xMinYMid meet"
        role="img"
        aria-label="Calendário de contribuições dos últimos 3 meses"
      >
        {/* Labels de mês */}
        {monthSpans.map((m, i) => (
          <text key={i} x={PAD_L + m.col * STEP} y={PAD_T - 4} className={styles.monthTxt}>
            {m.label}
          </text>
        ))}

        {/* Labels de dia da semana */}
        {DAY_LABELS.map((lbl, i) => lbl && (
          <text
            key={i}
            x={PAD_L - 5}
            y={PAD_T + i * STEP + CELL * 0.78}
            textAnchor="end"
            className={styles.dayTxt}
          >
            {lbl}
          </text>
        ))}

        {/* Células */}
        {grid.map((day, i) => {
          const col = Math.floor(i / 7)
          const row = i % 7
          const x   = PAD_L + col * STEP
          const y   = PAD_T + row * STEP

          return (
            <rect
              key={day ? day.date : `pad-${i}`}
              x={x} y={y} width={CELL} height={CELL} rx="2"
              fill={FILL[day?.intensity ?? 0]}
              opacity={day ? 1 : 0.35}
              className={day ? styles.cell : undefined}
              style={day ? { animationDelay: `${col * 5}ms` } : undefined}
            >
              {day && (
                <title>
                  {day.date.split('-').reverse().join('/')}
                  {day.total > 0 ? ` — ${day.completed}/${day.total} hábitos` : ''}
                </title>
              )}
            </rect>
          )
        })}
      </svg>

      <div className={styles.legend}>
        <span className={styles.legendLbl}>Menos</span>
        {FILL.map((fill, i) => (
          <svg key={i} width={CELL} height={CELL} viewBox={`0 0 ${CELL} ${CELL}`} style={{ flexShrink: 0 }}>
            <rect x={0} y={0} width={CELL} height={CELL} rx="2" fill={fill} />
          </svg>
        ))}
        <span className={styles.legendLbl}>Mais</span>
      </div>
    </div>
  )
}

export default ContributionCalendar
