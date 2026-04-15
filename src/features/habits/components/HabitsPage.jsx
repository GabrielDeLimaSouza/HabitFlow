import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useAiStore } from '../../ai-agent/store/ai-store'
import { useHabits } from '../hooks/use-habits'
import { useGoals, GoalFormModal } from '../../goals'
import { useCategories } from '../../categories'
import HabitCard from './HabitCard'
import HabitFormModal from './HabitFormModal'
import OnboardingModal from './OnboardingModal'
import ArchivedSection from './ArchivedSection'
import CategoryFilter from './CategoryFilter'
import styles from './habits-page.module.css'

const DEFAULT_CATEGORIES = [
  { name: 'Saúde',       color: '#22c55e', icon: 'dumbbell', position: 0 },
  { name: 'Aprendizado', color: '#6366f1', icon: 'book',     position: 1 },
  { name: 'Bem-estar',   color: '#f59e0b', icon: 'brain',    position: 2 },
]

const DEFAULT_HABITS = [
  { name: 'Exercício', color: '#22c55e', catIndex: 0 },
  { name: 'Leitura',   color: '#6366f1', catIndex: 1 },
  { name: 'Meditação', color: '#f59e0b', catIndex: 2 },
]

function HabitsPage() {
  useEffect(() => {
    useAiStore.getState().setActiveScreen('habits')
    useAiStore.getState().clearActiveHabit()
  }, [])

  const { habits, archived, loading, error, create, update, remove,
          restore, permanentDelete } = useHabits()
  const habitIds = habits.map((h) => h.id)
  const { goals, save: saveGoal, remove: removeGoal } = useGoals(habitIds)
  const { categories, create: createCategory } = useCategories()

  const [modal,          setModal]          = useState(null)
  const [goalModal,      setGoalModal]      = useState(null)
  const [saving,         setSaving]         = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [catFilter,      setCatFilter]      = useState([])
  const [onboardError,   setOnboardError]   = useState(null)

  const filteredHabits = catFilter.length === 0
    ? habits
    : habits.filter((h) => catFilter.includes(h.category_id))

  const handleHabitSubmit = async (data) => {
    const { goal: goalData, ...habitData } = data
    setSaving(true)
    try {
      if (modal === 'create') {
        const habit = await create(habitData)
        if (goalData) await saveGoal(habit.id, goalData, undefined)
      } else {
        await update(modal.id, habitData)
        const existingGoal = goals.get(modal.id)
        if (goalData) {
          await saveGoal(modal.id, goalData, existingGoal?.id)
        } else if (existingGoal) {
          await removeGoal(existingGoal.id, modal.id)
        }
      }
      setModal(null)
    } finally {
      setSaving(false)
    }
  }

  const handleGoalSubmit = async (data) => {
    setSaving(true)
    try {
      const existing = goals.get(goalModal.id)
      await saveGoal(goalModal.id, data, existing?.id)
      setGoalModal(null)
    } finally {
      setSaving(false)
    }
  }

  const handleGoalRemove = async () => {
    setSaving(true)
    try {
      const existing = goals.get(goalModal.id)
      if (existing) await removeGoal(existing.id, goalModal.id)
      setGoalModal(null)
    } finally {
      setSaving(false)
    }
  }

  const handleOnboarding = async () => {
    setSaving(true)
    setOnboardError(null)
    try {
      // Reutiliza categorias existentes; cria só as que ainda não existem
      const cats = await Promise.all(
        DEFAULT_CATEGORIES.map((dc) => {
          const existing = categories.find((c) => c.name === dc.name)
          return existing ? existing : createCategory(dc)
        })
      )
      await Promise.all(
        DEFAULT_HABITS.map((h) =>
          create({ name: h.name, color: h.color, category_id: cats[h.catIndex].id,
                   frequency_type: 'daily', frequency_days: [1,2,3,4,5,6,7] })
        )
      )
      setShowOnboarding(false)
    } catch (err) {
      setOnboardError(err?.message ?? String(err))
    } finally {
      setSaving(false)
    }
  }

  const showEmpty = !loading && habits.length === 0 && showOnboarding

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Hábitos</h1>
          <button className={styles.newBtn} onClick={() => setModal('create')}>
            <Plus size={16} />
            Novo hábito
          </button>
        </header>

        {error && <p className={styles.error}>{error}</p>}

        <CategoryFilter categories={categories} selected={catFilter} onChange={setCatFilter} />

        {loading ? (
          <div className={styles.skeletons}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`skeleton ${styles.skeletonItem}`} />
            ))}
          </div>
        ) : (
          <ul className={styles.list}>
            {filteredHabits.map((habit) => (
              <li key={habit.id}>
                <HabitCard habit={habit} goal={goals.get(habit.id)}
                  onEdit={setModal} onRemove={remove} onGoalClick={setGoalModal} />
              </li>
            ))}
          </ul>
        )}

        <ArchivedSection archived={archived} onRestore={restore} onDelete={permanentDelete} />
      </div>

      {showEmpty && (
        <OnboardingModal onAdd={handleOnboarding} onSkip={() => setShowOnboarding(false)}
          loading={saving} error={onboardError} />
      )}

      {modal !== null && (
        <HabitFormModal habit={modal === 'create' ? undefined : modal}
          categories={categories} onSubmit={handleHabitSubmit}
          onClose={() => setModal(null)} loading={saving} />
      )}

      {goalModal !== null && (
        <GoalFormModal habit={goalModal} goal={goals.get(goalModal.id)}
          onSubmit={handleGoalSubmit} onRemove={handleGoalRemove}
          onClose={() => setGoalModal(null)} loading={saving} />
      )}
    </div>
  )
}

export default HabitsPage
