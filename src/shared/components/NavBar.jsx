import { NavLink } from 'react-router-dom'
import { User } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import styles from './nav-bar.module.css'

function NavBar() {
  return (
    <nav className={styles.nav}>
      <span className={styles.logo}>HabitFlow</span>

      <div className={styles.links}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/habits"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          Hábitos
        </NavLink>
        <NavLink
          to="/categories"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          Categorias
        </NavLink>
        <NavLink
          to="/stats"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          Estatísticas
        </NavLink>
      </div>

      <ThemeToggle />

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `${styles.signOut} ${isActive ? styles.active : ''}`
        }
        aria-label="Configurações"
      >
        <User size={16} />
      </NavLink>
    </nav>
  )
}

export default NavBar
