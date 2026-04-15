import { useState, useMemo } from 'react'
import HabitItem from './HabitItem'
import styles from './habit-list-today.module.css'

/**
 * Lista de hábitos do dia com filtro por categoria.
 * @param {{ habits: object[], onToggle: Function, onNoteClick: Function, loading: boolean }} props
 */
function HabitListToday({ habits, onToggle, onNoteClick, loading }) {
  const [activeCategory, setActiveCategory] = useState(null)

  const categories = useMemo(() => {
    const seen = new Set()
    return habits.reduce((acc, h) => {
      if (h.category_id && !seen.has(h.category_id)) {
        seen.add(h.category_id)
        acc.push({ id: h.category_id, name: h.category_name, color: h.category_color })
      }
      return acc
    }, [])
  }, [habits])

  const filtered = activeCategory
    ? habits.filter((h) => h.category_id === activeCategory)
    : habits

  if (loading) {
    return (
      <ul className={styles.list}>
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className={`skeleton ${styles.skeleton}`} />
        ))}
      </ul>
    )
  }

  if (habits.length === 0) {
    return <p className={styles.empty}>Nenhum hábito para hoje. Crie seu primeiro hábito.</p>
  }

  return (
    <>
      {categories.length > 1 && (
        <div className={styles.filters}>
          <button
            className={`${styles.chip} ${!activeCategory ? styles.chipActive : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.chip} ${activeCategory === cat.id ? styles.chipActive : ''}`}
              style={{ '--cat-color': cat.color ?? 'var(--accent)' }}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
      <ul className={styles.list}>
        {filtered.map((habit) => (
          <HabitItem key={habit.id} habit={habit} onToggle={onToggle} onNoteClick={onNoteClick} />
        ))}
      </ul>
    </>
  )
}

export default HabitListToday
