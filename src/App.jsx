import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { LoginForm, ProtectedRoute } from './features/auth'
import { DashboardPage } from './features/dashboard'
import { HabitsPage } from './features/habits'
import { CategoriesPage } from './features/categories'
import { StatsPage } from './features/stats'
import { SettingsPage } from './features/settings'
import { AgentDrawer } from './features/ai-agent'
import Sidebar from './shared/components/Sidebar'
import BottomBar from './shared/components/BottomBar'
import PageTransition from './shared/components/PageTransition'
import ErrorBoundary from './shared/components/ErrorBoundary'
import SessionWarningBanner from './shared/components/SessionWarningBanner'
import { useSessionTimeout } from './features/auth/hooks/use-session-timeout'
import styles from './shared/components/app-layout.module.css'

function AppLayout() {
  const { showWarning, resetTimer } = useSessionTimeout()

  return (
    <ProtectedRoute>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <BottomBar />
        <AgentDrawer />
        {showWarning && <SessionWarningBanner onDismiss={resetTimer} />}
      </div>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
