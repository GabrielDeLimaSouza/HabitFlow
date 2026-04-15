import { useState } from 'react'
import styles from './goal-form.module.css'

const UNITS = ['minutos', 'horas', 'vezes', 'litros', 'ml', 'páginas', 'km', 'kg', 'outro']
const FREQ_LABELS = { daily: 'dia', weekly: 'semana', monthly: 'mês' }

const DEFAULT_FORM = {
  target_value: '',
  target_unit: 'minutos',
  custom_unit: '',
  target_frequency: 'daily',
}

function buildPreview(form) {
  const unit = form.target_unit === 'outro' ? form.custom_unit : form.target_unit
  if (!form.target_value || !unit) return null
  return `${form.target_value} ${unit} por ${FREQ_LABELS[form.target_frequency]}`
}

/**
 * @param {{ goal?: object, onSubmit: Function, onCancel: Function, onRemove?: Function, loading: boolean }} props
 */
function GoalForm({ goal, onSubmit, onCancel, onRemove, loading }) {
  const isCustomUnit = goal && !UNITS.slice(0, -1).includes(goal.target_unit)

  const [form, setForm] = useState(goal ? {
    target_value:     goal.target_value,
    target_unit:      isCustomUnit ? 'outro' : goal.target_unit,
    custom_unit:      isCustomUnit ? goal.target_unit : '',
    target_frequency: goal.target_frequency,
  } : DEFAULT_FORM)

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const unit = form.target_unit === 'outro' ? form.custom_unit.trim() : form.target_unit
    onSubmit({ target_value: Number(form.target_value), target_unit: unit, target_frequency: form.target_frequency })
  }

  const preview = buildPreview(form)

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.sentence}>Quero alcançar</p>

      <div className={styles.row}>
        <input
          type="number"
          min="0.1"
          step="any"
          className={styles.valueInput}
          value={form.target_value}
          onChange={(e) => set('target_value', e.target.value)}
          placeholder="30"
          required
          autoFocus
        />

        <select
          className={styles.select}
          value={form.target_unit}
          onChange={(e) => set('target_unit', e.target.value)}
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u === 'outro' ? 'outro...' : u}
            </option>
          ))}
        </select>

        <span className={styles.connector}>por</span>

        <select
          className={styles.select}
          value={form.target_frequency}
          onChange={(e) => set('target_frequency', e.target.value)}
        >
          <option value="daily">dia</option>
          <option value="weekly">semana</option>
          <option value="monthly">mês</option>
        </select>
      </div>

      {form.target_unit === 'outro' && (
        <input
          className={styles.customUnit}
          value={form.custom_unit}
          onChange={(e) => set('custom_unit', e.target.value)}
          placeholder="Ex: copos, sessões, capítulos..."
          required
        />
      )}

      {preview && (
        <p className={styles.preview}>{preview}</p>
      )}

      <div className={styles.actions}>
        {goal && onRemove && (
          <button type="button" className={styles.remove} onClick={onRemove} disabled={loading}>
            Remover meta
          </button>
        )}
        <div className={styles.right}>
          <button type="button" className={styles.cancel} onClick={onCancel}>Cancelar</button>
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Salvando...' : goal ? 'Salvar' : 'Definir meta'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default GoalForm
