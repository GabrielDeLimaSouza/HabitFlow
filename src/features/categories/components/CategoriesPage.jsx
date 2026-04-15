import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCategories } from '../hooks/use-categories'
import CategoryItem from './CategoryItem'
import CategoryFormModal from './CategoryFormModal'
import styles from './categories-page.module.css'

function CategoriesPage() {
  const { categories, loading, error, create, update, remove, moveUp, moveDown } = useCategories()
  const [modal, setModal] = useState(null) // null | 'create' | category
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (data) => {
    setSaving(true)
    try {
      if (modal === 'create') await create(data)
      else await update(modal.id, data)
      setModal(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Categorias</h1>
            <p className={styles.subtitle}>Organize seus hábitos em grupos</p>
          </div>
          <button className={styles.newBtn} onClick={() => setModal('create')}>
            <Plus size={16} />
            Nova categoria
          </button>
        </header>

        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <div className={styles.skeletons}>
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : categories.length === 0 ? (
          <p className={styles.empty}>Nenhuma categoria criada ainda.</p>
        ) : (
          <ul className={styles.list}>
            {categories.map((cat, i) => (
              <li key={cat.id}>
                <CategoryItem
                  category={cat}
                  onEdit={setModal}
                  onRemove={remove}
                  onMoveUp={moveUp}
                  onMoveDown={moveDown}
                  isFirst={i === 0}
                  isLast={i === categories.length - 1}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {modal !== null && (
        <CategoryFormModal
          category={modal === 'create' ? undefined : modal}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
          loading={saving}
        />
      )}
    </div>
  )
}

export default CategoriesPage
