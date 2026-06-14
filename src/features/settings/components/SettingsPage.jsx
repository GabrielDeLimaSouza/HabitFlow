import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/auth-store'
import { useAuth } from '../../auth'
import { useTheme } from '../../../shared/hooks/use-theme'
import { useProfile } from '../hooks/use-profile'
import { exportUserData } from '../services/profile-service'
import ProfileForm from './ProfileForm'
import SecuritySection from './SecuritySection'
import DeleteAccountModal from './DeleteAccountModal'
import { SettingsSection, SettingsToggle, SettingsAction } from './SettingsPrimitives'
import styles from './settings-page.module.css'

function SettingsPage() {
  const { user }          = useAuthStore()
  const { signOut }       = useAuth()
  const { theme, toggle } = useTheme()
  const { profile, save } = useProfile()
  const navigate          = useNavigate()
  const [exporting, setExporting] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleExport = async () => {
    if (!user) return
    setExporting(true)
    try {
      const data = await exportUserData(user.id)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `habitflow-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Configurações</h1>

        <ProfileForm />

        <SettingsSection title="APARÊNCIA">
          <SettingsToggle
            label="Tema escuro"
            hint="Alterna entre fundo escuro e claro"
            checked={theme === 'dark'}
            onChange={toggle}
          />
        </SettingsSection>

        <SettingsSection title="ASSISTENTE IA">
          <SettingsToggle
            label="Ativar assistente"
            hint="Permite usar o chat de IA e gerar insights semanais"
            checked={profile?.ai_enabled ?? true}
            onChange={(v) => save({ ai_enabled: v })}
          />
        </SettingsSection>

        <SecuritySection />

        <SettingsSection title="DADOS">
          <SettingsAction
            label="Exportar meus dados"
            hint="Baixa hábitos, registros e insights em JSON"
            buttonLabel={exporting ? 'Exportando…' : 'Exportar JSON'}
            onClick={handleExport}
            disabled={exporting}
          />
        </SettingsSection>

        <SettingsSection title="CONTA">
          <SettingsAction
            label={user?.email ?? ''}
            hint="E-mail vinculado à conta"
            buttonLabel="Sair da conta"
            onClick={handleSignOut}
            danger
          />
        </SettingsSection>

        <SettingsSection title="ZONA DE PERIGO">
          <SettingsAction
            label="Excluir minha conta"
            hint="Remove permanentemente sua conta e todos os dados associados"
            buttonLabel="Excluir conta"
            onClick={() => setShowDelete(true)}
            danger
          />
        </SettingsSection>
      </div>

      {showDelete && (
        <DeleteAccountModal
          onClose={() => setShowDelete(false)}
          onDeleted={() => navigate('/login')}
        />
      )}
    </div>
  )
}

export default SettingsPage
