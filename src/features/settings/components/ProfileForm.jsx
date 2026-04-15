import { useState, useEffect } from 'react'
import { useProfile } from '../hooks/use-profile'
import styles from './settings-page.module.css'

const TIMEZONES = [
  'America/Sao_Paulo',
  'America/Fortaleza',
  'America/Manaus',
  'America/Belem',
  'America/Recife',
  'America/Bahia',
  'America/Cuiaba',
  'America/Porto_Velho',
  'America/Boa_Vista',
  'America/Rio_Branco',
  'America/Noronha',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/Lisbon',
  'Europe/London',
  'UTC',
]

function ProfileForm() {
  const { profile, saving, error, save } = useProfile()
  const [name,     setName]     = useState('')
  const [timezone, setTimezone] = useState('America/Sao_Paulo')
  const [success,  setSuccess]  = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '')
      setTimezone(profile.timezone ?? 'America/Sao_Paulo')
    }
  }, [profile])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)
    await save({ name: name.trim(), timezone })
    setSuccess(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Perfil</span>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Nome</label>
          <input
            id="name"
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            maxLength={80}
            disabled={saving}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="timezone">Fuso horário</label>
          <select
            id="timezone"
            className={styles.select}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            disabled={saving}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        {error   && <p className={styles.errorMsg}>{error}</p>}
        {success && !error && <p className={styles.successMsg}>Perfil salvo.</p>}

        <div className={styles.actions}>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default ProfileForm
