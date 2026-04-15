import { useState } from 'react'
import styles from './daily-line-chart.module.css'

const W      = 520
const H      = 150
const PAD_L  = 32
const PAD_R  = 12
const PAD_T  = 16
const PAD_B  = 28
const CHART_W = W - PAD_L - PAD_R
const CHART_H = H - PAD_T - PAD_B

function toX(i, total) { return PAD_L + (i / (total - 1)) * CHART_W }
function toY(v, max)   { return PAD_T + CHART_H - (max > 0 ? (v / max) * CHART_H : 0) }

function buildPath(pts) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
}

/**
 * Gráfico de linha SVG — hábitos completados por dia (últimos 14 dias).
 * Hover mostra linha vertical + tooltip com data e contagem.
 * @param {{ history: Array<{ date: string, count: number }> }} props
 */
function DailyLineChart({ history }) {
  const [hovered, setHovered] = useState(null)

  if (!history.length) return null

  const max  = Math.max(...history.map((d) => d.count), 1)
  const pts  = history.map((d, i) => ({ x: toX(i, history.length), y: toY(d.count, max), ...d }))
  const line = buildPath(pts)
  const area = `${line} L ${pts.at(-1).x},${PAD_T + CHART_H} L ${pts[0].x},${PAD_T + CHART_H} Z`

  const labelEvery = Math.ceil(history.length / 6)
  const hovPt      = hovered !== null ? pts[hovered] : null
  const slotW      = CHART_W / Math.max(history.length - 1, 1)

  // Tooltip: clamp para não sair do SVG
  const tipW = 80
  function tipX(px) { return Math.min(Math.max(px - tipW / 2, PAD_L), W - PAD_R - tipW) }

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid horizontal */}
        {[0, 0.5, 1].map((frac) => (
          <line key={frac}
            x1={PAD_L} x2={W - PAD_R}
            y1={PAD_T + CHART_H * (1 - frac)}
            y2={PAD_T + CHART_H * (1 - frac)}
            stroke="var(--border)" strokeWidth="1" />
        ))}

        {/* Linha vertical de hover */}
        {hovPt && (
          <line
            x1={hovPt.x} x2={hovPt.x}
            y1={PAD_T} y2={PAD_T + CHART_H}
            stroke="var(--border-active)" strokeWidth="1" strokeDasharray="3 3" />
        )}

        {/* Área preenchida */}
        <path d={area} fill="url(#areaGrad)" className={styles.area} />

        {/* Linha principal */}
        <path d={line} fill="none"
          stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
          className={styles.line} />

        {/* Pontos — visíveis, maiores */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={hovered === i ? 6 : 4}
            fill="var(--accent)" stroke="var(--bg-surface)" strokeWidth="2"
            className={styles.dot}
            style={{ transition: 'r 100ms' }} />
        ))}

        {/* Zonas de hover — cobrindo toda a área do ponto */}
        {pts.map((p, i) => (
          <rect key={i}
            x={p.x - slotW / 2} y={PAD_T}
            width={slotW} height={CHART_H}
            fill="transparent"
            className={styles.hoverZone}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)} />
        ))}

        {/* Tooltip */}
        {hovPt && (
          <g>
            <rect
              x={tipX(hovPt.x)} y={PAD_T + 2}
              width={tipW} height={34}
              rx="5"
              fill="var(--bg-elevated)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text x={tipX(hovPt.x) + tipW / 2} y={PAD_T + 16}
              textAnchor="middle" className={styles.tooltipDate}>
              {hovPt.date.slice(5).split('-').reverse().join('/')}
            </text>
            <text x={tipX(hovPt.x) + tipW / 2} y={PAD_T + 30}
              textAnchor="middle" className={styles.tooltipCount}>
              {hovPt.count} hábito{hovPt.count !== 1 ? 's' : ''}
            </text>
          </g>
        )}

        {/* Eixo X */}
        {pts.map((p, i) => i % labelEvery === 0 && (
          <text key={i} x={p.x} y={H - 6}
            textAnchor="middle" className={styles.axisLabel}>
            {p.date.slice(5).split('-').reverse().join('/')}
          </text>
        ))}
      </svg>
    </div>
  )
}

export default DailyLineChart
