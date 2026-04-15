import { create } from 'zustand'

const MAX_MESSAGES = 20

export const useAiStore = create((set) => ({
  isOpen:        false,
  habitContext:  null,
  messages:      [],
  loading:       false,
  error:         null,
  currentUserId: null,

  // v4 — contexto automático por tela
  activeScreen: 'dashboard',
  activeHabit:  null,

  // v5 — contadores de uso visíveis
  hourlyCount:  0,
  monthlyCount: 0,

  /**
   * Abre o drawer com o contexto do hábito.
   * Limpa o histórico automaticamente quando o hábito muda.
   * @param {object | null} habitContext
   */
  open: (habitContext = null) => set((state) => {
    const habitChanged = habitContext?.id !== state.habitContext?.id
    return {
      isOpen:       true,
      habitContext,
      messages:     habitChanged ? [] : state.messages,
      error:        habitChanged ? null : state.error,
    }
  }),

  close: () => set({ isOpen: false }),

  /**
   * Adiciona uma mensagem ao histórico.
   * Quando messages.length >= 20, remove os 2 primeiros (1 turno completo)
   * antes de adicionar — preservando sempre os turnos mais recentes.
   * @param {{ role: 'user' | 'assistant', content: string }} message
   */
  addMessage: (message) => set((state) => {
    const trimmed = state.messages.length >= MAX_MESSAGES
      ? state.messages.slice(2)
      : state.messages
    return { messages: [...trimmed, message] }
  }),

  clearMessages: () => set({ messages: [], error: null }),

  // v4 — ações de contexto automático
  setActiveScreen:  (screen) => set({ activeScreen: screen }),
  setActiveHabit:   (habit)  => set({ activeHabit: habit }),
  clearActiveHabit: ()       => set({ activeHabit: null }),

  // v5 — contadores
  setHourlyCount:  (n) => set({ hourlyCount: n }),
  setMonthlyCount: (n) => set({ monthlyCount: n }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  /**
   * Reseta o histórico quando o usuário muda (login/logout).
   * Não faz nada se o userId for o mesmo.
   * @param {string | null} userId
   */
  resetForUser: (userId) => set((state) => {
    if (state.currentUserId === userId) return {}
    return { currentUserId: userId, messages: [], error: null, habitContext: null, activeHabit: null, isOpen: false }
  }),
}))
