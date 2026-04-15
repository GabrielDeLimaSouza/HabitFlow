import styles from './category-selector.module.css'

/**
 * Seletor de categoria para filtrar as estatísticas.
 * @param {{ categories: object[], selected: string|null, onChange: Function }} props
 */
function CategorySelector({ categories, selected, onChange }) {
  if (categories.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Filtrar por</span>
      <select
        className={styles.select}
        value={selected ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">Todas as categorias</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CategorySelector
