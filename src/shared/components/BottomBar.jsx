import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Flame, BarChart2,
  MoreHorizontal, Tag, Settings, LogOut,
} from 'lucide-react'
import { secureLogout } from '../../features/auth/services/auth-service'
import styles from './bottom-bar.module.css'

function MoreMenu({ onClose }) {
  const navigate = useNavigate()

  const go = (path) => { navigate(path); onClose() }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.moreMenu}>
        <button className={styles.moreItem} onClick={() => go('/categories')}>
          <Tag size={18} /><span>Categorias</span>
        </button>
        <button className={styles.moreItem} onClick={() => go('/settings')}>
          <Settings size={18} /><span>Configurações</span>
        </button>
        <button
          className={`${styles.moreItem} ${styles.danger}`}
          onClick={secureLogout}
        >
          <LogOut size={18} /><span>Sair</span>
        </button>
      </div>
    </>
  )
}

function BottomBar() {
  const [moreOpen, setMoreOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `${styles.item} ${isActive ? styles.active : ''}`

  return (
    <div className={styles.bar}>
      <NavLink to="/" end className={linkClass}>
        <LayoutDashboard size={22} /><span>Início</span>
      </NavLink>
      <NavLink to="/habits" className={linkClass}>
        <Flame size={22} /><span>Hábitos</span>
      </NavLink>
      <NavLink to="/stats" className={linkClass}>
        <BarChart2 size={22} /><span>Stats</span>
      </NavLink>
      <button
        className={`${styles.item} ${moreOpen ? styles.active : ''}`}
        onClick={() => setMoreOpen(true)}
      >
        <MoreHorizontal size={22} /><span>Mais</span>
      </button>

      {moreOpen && <MoreMenu onClose={() => setMoreOpen(false)} />}
    </div>
  )
}

export default BottomBar
