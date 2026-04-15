import { useAiAgent } from '../../ai-agent'
import { useAiStore } from '../../ai-agent/store/ai-store'
import styles from './category-donut.module.css'

const R    = 60
const C    = 2 * Math.PI * R   // ≈ 376.99
const CX   = 80
const CY   = 80
const GAP  = 3                  // separação entre segmentos em unidades de arco

/**
 * Monta os segmentos do donut a partir dos hábitos completados hoje.
 * @param {object[]} habits
 * @param {object[]} categories
 */
function buildSegments(habits, categories) {
  const completed = habits.filter((h) => h.log?.completed)
  const total = completed.length
  if (total === 0) return { segments: [], total }

  const counts = {}
  completed.forEach((h) => {
    const key = h.category_id ?? '__none__'
    counts[key] = (counts[key] ?? 0) + 1
  })

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]))
  let cumulative = 0

  const segments = Object.entries(counts).map(([catId, count]) => {
    const cat   = catMap[catId] ?? { id: catId, name: 'Sem categoria', color: 'var(--text-muted)' }
    const arc   = Math.max((count / total) * C - GAP, 0)
    const seg   = { cat, count, arc, offset: cumulative }
    cumulative += arc + GAP
    return seg
  })

  return { segments, total }
}

/**
 * Donut chart SVG mostrando hábitos completados hoje por categoria.
 * Clique na categoria abre o agente com contexto.
 * @param {{ habits: object[], categories: object[] }} props
 */
function CategoryDonut({ habits, categories }) {
  const { open } = useAiAgent()
  const { segments, total } = buildSegments(habits, categories)

  if (total === 0) return null

  return (
    <div className={styles.wrapper}>
      <svg viewBox="0 0 160 160" className={styles.svg} aria-hidden="true">
        <circle cx={CX} cy={CY} r={R} fill="none"
          stroke="var(--bg-elevated)" strokeWidth="18" />

        {segments.map((seg, i) => (
          <circle key={seg.cat.id} cx={CX} cy={CY} r={R}
            fill="none"
            stroke={seg.cat.color}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={`${seg.arc} ${C - seg.arc}`}
            strokeDashoffset={-(C / 4) - seg.offset}
            className={styles.segment}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}

        <text x={CX} y={CY - 6} textAnchor="middle" className={styles.centerNum}>
          {total}
        </text>
        <text x={CX} y={CY + 12} textAnchor="middle" className={styles.centerLabel}>
          hoje
        </text>
      </svg>

      <ul className={styles.legend}>
        {segments.map((seg) => (
          <li key={seg.cat.id} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: seg.cat.color }} />
            <span className={styles.catName}>{seg.cat.name}</span>
            <span className={styles.catCount}>
              {seg.count} ({Math.round((seg.count / total) * 100)}%)
            </span>
            {seg.cat.id !== '__none__' && (
              <button
                className={styles.askBtn}
                onClick={() => {
                  useAiStore.getState().setActiveHabit({ name: seg.cat.name, color: seg.cat.color })
                  open({ name: seg.cat.name, category: seg.cat.name, goal: null, streak: 0 })
                }}
              >
                Perguntar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CategoryDonut
