import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { getIcon } from '../icons'
import styles from './category-item.module.css'

/**
 * @param {{ category: object, onEdit: Function, onRemove: Function, onMoveUp: Function, onMoveDown: Function, isFirst: boolean, isLast: boolean }} props
 */
function CategoryItem({ category, onEdit, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  const Icon = getIcon(category.icon)

  return (
    <div className={styles.item}>
      <div className={styles.iconWrapper} style={{ background: `${category.color}22`, color: category.color }}>
        {Icon ? <Icon size={18} /> : <span className={styles.dot} style={{ background: category.color }} />}
      </div>

      <span className={styles.name}>{category.name}</span>

      <div className={styles.actions}>
        <button className={styles.action} onClick={() => onMoveUp(category.id)} disabled={isFirst} aria-label="Mover para cima">
          <ChevronUp size={15} />
        </button>
        <button className={styles.action} onClick={() => onMoveDown(category.id)} disabled={isLast} aria-label="Mover para baixo">
          <ChevronDown size={15} />
        </button>
        <button className={styles.action} onClick={() => onEdit(category)} aria-label={`Editar ${category.name}`}>
          <Pencil size={15} />
        </button>
        <button className={styles.action} onClick={() => onRemove(category.id)} aria-label={`Remover ${category.name}`}>
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}

export default CategoryItem
