import { Pencil, Archive, Target, Sparkles } from 'lucide-react'
import { GoalBadge } from '../../goals'
import { useAiAgent } from '../../ai-agent'
import { useAiStore } from '../../ai-agent/store/ai-store'
import styles from './habit-card.module.css'

const FREQ_LABELS = { daily: 'Diário', weekly: 'Semanal', custom: 'Personalizado' }
const DAYS_SHORT  = ['', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

function getFrequencyDescription(habit) {
  if (habit.frequency_type === 'daily') return 'Todos os dias'
  const days = (habit.frequency_days ?? []).map((d) => DAYS_SHORT[d]).join(', ')
  return days || FREQ_LABELS[habit.frequency_type]
}

/**
 * @param {{ habit: object, goal?: object, onEdit: Function, onRemove: Function, onGoalClick: Function }} props
 */
function HabitCard({ habit, goal, onEdit, onRemove, onGoalClick }) {
  const { open } = useAiAgent()

  const handleOpenAgent = () => {
    useAiStore.getState().setActiveHabit({ id: habit.id, name: habit.name, color: habit.color })
    open({
      id:       habit.id,
      name:     habit.name,
      category: habit.category_name ?? null,
      goal:     goal ? { value: goal.target_value, unit: goal.target_unit, frequency: goal.target_frequency } : null,
      streak:   habit.streak ?? 0,
    })
  }

  return (
    <div
      className={`${styles.card} ${styles.cardWrapper}`}
      style={{ '--habit-color': habit.color ?? 'var(--accent)' }}
    >
      <div className={styles.accent} style={{ background: habit.color ?? 'var(--accent)' }} />

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{habit.name}</span>
          {goal && <GoalBadge goal={goal} />}
        </div>
        <span className={styles.freq}>{getFrequencyDescription(habit)}</span>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.action} ${styles.agentBtn}`}
          onClick={handleOpenAgent}
          aria-label={`Assistente para ${habit.name}`}
          title="Abrir assistente"
        >
          <Sparkles size={16} />
        </button>
        <button
          className={styles.action}
          onClick={() => onGoalClick(habit)}
          aria-label={`Meta de ${habit.name}`}
          title="Definir meta"
        >
          <Target size={16} />
        </button>
        <button
          className={styles.action}
          onClick={() => onEdit({ ...habit, goal })}
          aria-label={`Editar ${habit.name}`}
        >
          <Pencil size={16} />
        </button>
        <button
          className={styles.action}
          onClick={() => onRemove(habit.id)}
          aria-label={`Arquivar ${habit.name}`}
        >
          <Archive size={16} />
        </button>
      </div>
    </div>
  )
}

export default HabitCard
