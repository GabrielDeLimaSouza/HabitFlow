import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import styles from './habit-form.module.css'

const PRESET_COLORS = [
  '#6366f1', '#3b82f6', '#22c55e', '#f59e0b',
  '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6',
]

const DAYS = [
  { value: 1, short: 'Seg' }, { value: 2, short: 'Ter' },
  { value: 3, short: '4ª'  }, { value: 4, short: '5ª'  },
  { value: 5, short: 'Sex' }, { value: 6, short: 'Sáb' },
  { value: 7, short: 'Dom' },
]

const GOAL_UNITS = ['minutos', 'horas', 'vezes', 'litros', 'páginas', 'km']

const DEFAULT_GOAL = { target_value: '', target_unit: 'minutos', target_frequency: 'daily' }

const DEFAULT_FORM = {
  name: '', color: '#6366f1', frequency_days: [1, 2, 3, 4, 5, 6, 7], category_id: null,
}

/**
 * @param {{ habit?: object, categories?: object[], onSubmit: Function, onCancel: Function, loading: boolean }} props
 */
function HabitForm({ habit, categories = [], onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(habit ? {
    name: habit.name, color: habit.color ?? '#6366f1',
    frequency_days: habit.frequency_days ?? [1, 2, 3, 4, 5, 6, 7],
    category_id: habit.category_id ?? null,
  } : DEFAULT_FORM)

  const [goalOn,  setGoalOn]  = useState(!!habit?.goal)
  const [goal,    setGoalData] = useState(habit?.goal ?? DEFAULT_GOAL)

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleCategoryChange = (catId) => {
    set('category_id', catId || null)
    if (catId) {
      const cat = categories.find((c) => c.id === catId)
      if (cat?.color) set('color', cat.color)
    }
  }

  const toggleDay = (day) => {
    const days = form.frequency_days.includes(day)
      ? form.frequency_days.filter((d) => d !== day)
      : [...form.frequency_days, day].sort((a, b) => a - b)
    if (days.length > 0) set('frequency_days', days)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const frequency_type = form.frequency_days.length === 7 ? 'daily' : 'custom'
    const goalData = goalOn && goal.target_value
      ? { target_value: Number(goal.target_value), target_unit: goal.target_unit, target_frequency: goal.target_frequency }
      : null
    onSubmit({ ...form, name: form.name.trim(), frequency_type, goal: goalData })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Nome</label>
        <input className={styles.input} value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Ex: Leitura, Exercício..." required autoFocus />
      </div>

      {categories.length > 0 && (
        <div className={styles.field}>
          <label className={styles.label}>Categoria</label>
          <select className={styles.select} value={form.category_id ?? ''}
            onChange={(e) => handleCategoryChange(e.target.value)}>
            <option value="">Sem categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>Cor</label>
        <div className={styles.colors}>
          {PRESET_COLORS.map((c) => (
            <button key={c} type="button" aria-label={c}
              className={`${styles.colorBtn} ${form.color === c ? styles.colorActive : ''}`}
              style={{ background: c }} onClick={() => set('color', c)} />
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.daysHeader}>
          <label className={styles.label}>Dias</label>
          <div className={styles.dayShortcuts}>
            <button type="button" className={styles.shortcut}
              onClick={() => set('frequency_days', [1,2,3,4,5,6,7])}>Todos</button>
            <button type="button" className={styles.shortcut}
              onClick={() => set('frequency_days', [1,2,3,4,5])}>Dias úteis</button>
          </div>
        </div>
        <div className={styles.days}>
          {DAYS.map((d) => (
            <button key={d.value} type="button"
              className={`${styles.dayPill} ${form.frequency_days.includes(d.value) ? styles.dayActive : ''}`}
              onClick={() => toggleDay(d.value)}>
              {d.short}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.goalToggle}>
        <button type="button" className={styles.goalToggleBtn}
          onClick={() => setGoalOn(!goalOn)}>
          {goalOn ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {goalOn ? 'Remover meta' : 'Adicionar meta'}
        </button>
        {goalOn && (
          <div className={styles.goalFields}>
            <input type="number" min="0.1" step="any" placeholder="30"
              className={styles.goalValue} value={goal.target_value}
              onChange={(e) => setGoalData((g) => ({ ...g, target_value: e.target.value }))} />
            <select className={styles.select} value={goal.target_unit}
              onChange={(e) => setGoalData((g) => ({ ...g, target_unit: e.target.value }))}>
              {GOAL_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <span className={styles.goalPer}>por</span>
            <select className={styles.select} value={goal.target_frequency}
              onChange={(e) => setGoalData((g) => ({ ...g, target_frequency: e.target.value }))}>
              <option value="daily">dia</option>
              <option value="weekly">semana</option>
              <option value="monthly">mês</option>
            </select>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancel} onClick={onCancel}>Cancelar</button>
        <button type="submit" className={styles.submit} disabled={loading || !form.name}>
          {loading ? 'Salvando...' : habit ? 'Salvar' : 'Criar'}
        </button>
      </div>
    </form>
  )
}

export default HabitForm
