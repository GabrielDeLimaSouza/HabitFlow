import { create } from 'zustand'

const STORAGE_KEY = 'habitflow-theme'
const DEFAULT_THEME = 'dark'

/** Aplica tema no elemento raiz imediatamente ao carregar o módulo. */
const initial = localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME
document.documentElement.setAttribute('data-theme', initial)

const useThemeStore = create((set, get) => ({
  theme: initial,

  /** Alterna entre dark e light, persiste no localStorage. */
  toggle() {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem(STORAGE_KEY, next)
    set({ theme: next })
  },
}))

/**
 * Hook para leitura e alternância do tema da aplicação.
 *
 * @returns {{ theme: 'dark' | 'light', toggle: function }}
 */
export function useTheme() {
  return useThemeStore()
}
