import styles from './category-filter.module.css'

/**
 * Chips horizontais para filtrar hábitos por categoria.
 * Permite seleção múltipla; [] significa "Todos".
 * @param {{ categories: object[], selected: string[], onChange: Function }} props
 */
function CategoryFilter({ categories, selected, onChange }) {
  if (categories.length === 0) return null

  const toggle = (id) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    )
  }

  return (
    <div className={styles.chips}>
      <button
        className={`${styles.chip} ${selected.length === 0 ? styles.chipActive : ''}`}
        onClick={() => onChange([])}
      >
        Todos
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`${styles.chip} ${selected.includes(cat.id) ? styles.chipActive : ''}`}
          onClick={() => toggle(cat.id)}
        >
          <span className={styles.dot} style={{ background: cat.color }} />
          {cat.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
