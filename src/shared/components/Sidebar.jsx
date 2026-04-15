import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Flame, BarChart2, Tag, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '../../features/auth/store/auth-store'
import { secureLogout } from '../../features/auth/services/auth-service'
import ThemeToggle from './ThemeToggle'
import logoUrl from '../../img/logo-habbit-flow.png'
import styles from './sidebar.module.css'

const NAV_LINKS = [
  { to: '/',           end: true,  Icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/habits',     end: false, Icon: Flame,           label: 'Hábitos' },
  { to: '/categories', end: false, Icon: Tag,             label: 'Categorias' },
  { to: '/stats',      end: false, Icon: BarChart2,       label: 'Estatísticas' },
  { to: '/settings',   end: false, Icon: Settings,        label: 'Configurações' },
]

function Sidebar() {
  const { profile, user } = useAuthStore()
  const displayName = profile?.name ?? user?.email ?? ''

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src={logoUrl} alt="HabitFlow" className={styles.logoImg} />
      </div>

      <nav className={styles.nav}>
        {NAV_LINKS.map(({ to, end, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <footer className={styles.footer}>
        <ThemeToggle />
        {displayName && (
          <span className={styles.userName} title={displayName}>
            {displayName}
          </span>
        )}
        <button
          className={styles.signOutBtn}
          onClick={secureLogout}
          aria-label="Sair"
        >
          <LogOut size={16} />
        </button>
      </footer>
    </aside>
  )
}

export default Sidebar
