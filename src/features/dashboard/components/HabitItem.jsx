import { Check, Sparkles, MessageSquare, Flame } from 'lucide-react'
import { useAiAgent } from '../../ai-agent'
import { useAiStore } from '../../ai-agent/store/ai-store'
import styles from './habit-item.module.css'

const PARTICLES = [1, 2, 3, 4, 5, 6]

/**
 * Item de hábito do dashboard com checkbox animado, ícone, streak e confetti.
 * @param {{ habit: object, onToggle: Function, onNoteClick: Function }} props
 */
function HabitItem({ habit, onToggle, onNoteClick }) {
  const completed = habit.log?.completed ?? false
  const hasNote   = !!habit.log?.notes
  const { open }  = useAiAgent()
  const color     = habit.color ?? 'var(--accent)'

  const handleOpenAgent = () => {
    useAiStore.getState().setActiveHabit({ id: habit.id, name: habit.name, color: habit.color })
    open({ name: habit.name, category: habit.category_name ?? null, goal: null, streak: habit.streak ?? 0 })
  }

  return (
    <li className={`${styles.item} ${completed ? styles.completed : ''}`}>
      <div className={styles.toggleWrap} style={{ '--habit-color': color }}>
        <button
          className={styles.toggle}
          onClick={() => onToggle(habit.id, completed)}
          aria-label={completed ? `Desmarcar ${habit.name}` : `Marcar ${habit.name} como feito`}
        >
          {completed && <Check size={14} strokeWidth={2.5} />}
        </button>
        {completed && PARTICLES.map((n) => (
          <span key={n} className={styles.particle} style={{ '--habit-color': color }} />
        ))}
      </div>

      {habit.icon
        ? <span className={styles.icon}>{habit.icon}</span>
        : <span className={styles.dot} style={{ background: color }} />
      }

      <div className={styles.info}>
        <span className={styles.name}>{habit.name}</span>
        {habit.streak >= 2 && (
          <span className={styles.streak}>
            <Flame size={10} className={styles.streakIcon} />
            {habit.streak} dias seguidos
          </span>
        )}
      </div>

      <button
        className={`${styles.iconBtn} ${hasNote ? styles.hasNote : ''}`}
        onClick={() => onNoteClick(habit)}
        aria-label={`Anotar sobre ${habit.name}`}
        title="Adicionar anotação"
      >
        <MessageSquare size={12} />
      </button>

      <button
        className={styles.iconBtn}
        onClick={handleOpenAgent}
        aria-label={`Assistente para ${habit.name}`}
        title="Abrir assistente"
      >
        <Sparkles size={12} />
      </button>
    </li>
  )
}

export default HabitItem
