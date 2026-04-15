import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/use-theme'
import styles from './theme-toggle.module.css'

/**
 * Botão que alterna entre tema escuro e claro.
 * Ícone gira 90° ao trocar de tema.
 */
function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      className={styles.btn}
      onClick={toggle}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
    >
      {isDark
        ? <Sun  key="sun"  size={16} className={styles.icon} />
        : <Moon key="moon" size={16} className={styles.icon} />
      }
    </button>
  )
}

export default ThemeToggle
