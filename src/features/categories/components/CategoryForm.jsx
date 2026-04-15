import { useState } from 'react'
import { CATEGORY_ICONS } from '../icons'
import styles from './category-form.module.css'

const PRESET_COLORS = [
  '#6366f1', '#3b82f6', '#22c55e', '#f59e0b',
  '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6',
]

const DEFAULT_FORM = { name: '', color: '#6366f1', icon: 'star' }

/**
 * @param {{ category?: object, onSubmit: Function, onCancel: Function, loading: boolean }} props
 */
function CategoryForm({ category, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(category
    ? { name: category.name, color: category.color ?? '#6366f1', icon: category.icon ?? 'star' }
    : DEFAULT_FORM
  )

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, name: form.name.trim() })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Nome</label>
        <input
          className={styles.input}
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Ex: Saúde, Estudo, Lazer..."
          required
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Cor</label>
        <div className={styles.colors}>
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`${styles.colorBtn} ${form.color === c ? styles.colorActive : ''}`}
              style={{ background: c }}
              onClick={() => set('color', c)}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Ícone</label>
        <div className={styles.icons}>
          {CATEGORY_ICONS.map(({ name, Icon }) => (
            <button
              key={name}
              type="button"
              className={`${styles.iconBtn} ${form.icon === name ? styles.iconActive : ''}`}
              style={form.icon === name ? { color: form.color, background: `${form.color}22` } : {}}
              onClick={() => set('icon', name)}
              aria-label={name}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancel} onClick={onCancel}>Cancelar</button>
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Salvando...' : category ? 'Salvar' : 'Criar'}
        </button>
      </div>
    </form>
  )
}

export default CategoryForm
