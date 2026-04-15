# HabitFlow — CLAUDE.md

## Stack
React 19 + JavaScript + Vite | Supabase (auth/db/RLS) | Zustand | CSS Modules | Lucide React | Vercel

## Estrutura
/src/features/<modulo>/{components,hooks,services,index.js}
/src/shared/{components,hooks,utils,styles}
/src/lib/supabase.js          ← client Supabase (sessionStorage)
/supabase/functions/habit-ai-agent/index.ts        ← Edge Function (TypeScript — exceção)
/supabase/functions/habit-weekly-insight/index.ts  ← Edge Function (TypeScript — exceção)

## Regras inegociáveis
- Funções: máximo 30 linhas | Arquivos: máximo 200 linhas
- Default export: só componentes React | Named exports: todo o resto
- Barrel file index.js em cada módulo
- Erros tratados explicitamente — sem catch vazio
- Lógica de negócio nos services, nunca nos componentes
- JSDoc em todas as funções públicas dos services

## Design System
Tokens em /src/shared/styles/tokens.css (inclui tokens v4: shadows, radius-xs/xl, layout vars, animation vars, semantic vars)
Fonte: Inter | Accent: #6366f1 | BG: #0a0a0f | Surface: #111118
Animações: --ease cubic-bezier(0.16,1,0.3,1) | --dur-xs 80ms … --dur-xl 500ms
Layout: --sidebar-w 240px | --bottom-bar-h 64px | --drawer-w 400px
Bordas (border), nunca box-shadow para separação | Sem gradientes decorativos
Ícones de categoria: nomes em minúsculo ('dumbbell', 'book', 'brain', 'heart', etc.)
  → ver /src/features/categories/icons.js para lista completa

## Estado atual — 2026-04-13
Módulos implementados:
  ✅ auth/       login, sessão (sessionStorage), store (user/session/profile),
                 ProtectedRoute, use-auth
                 auth-service: ensureProfile() — cria perfil no 1º login (FK categories)
                 supabase.js: storage: sessionStorage (sessão limpa ao fechar browser)
  ✅ dashboard/  DashboardPage — ordem: InsightCard → DayProgress → CategoryDonut →
                 HabitListToday → DailyLineChart → SleepCard
                 HabitListToday (filtro por categoria, chips dinâmicos)
                 HabitItem (checkbox 32px + checkBounce + confetti CSS + streak + ícone)
                 CategoryDonut (SVG, fix null context)
                 DailyLineChart (H=150, tooltip DD/MM, hover line, cursor crosshair)
                 NoteModal, use-dashboard (getToday() live, streak 30d, category join)
  ✅ habits/     HabitsPage (onboarding: reutiliza categorias existentes, erro visível),
                 HabitCard (border-left --habit-color, hover lift, agentBtn),
                 HabitForm, HabitFormModal, OnboardingModal (prop error),
                 ArchivedSection, CategoryFilter, use-habits
                 DEFAULT_CATEGORIES icons: 'dumbbell' / 'book' / 'brain'
  ✅ goals/      GoalBadge, GoalForm, GoalFormModal, use-goals, goal-service
  ✅ categories/ CategoriesPage, CategoryItem (getIcon — nomes minúsculos),
                 CategoryForm, CategoryFormModal, icons.js
  ✅ stats/      StatsPage (7 blocos), ContributionCalendar (SVG responsivo, labels de mês,
                 max-height 175px, tooltip DD/MM), OverviewCards (count-up),
                 WeekdayChart (SVG barras animadas, growUp, destaque melhor dia),
                 WeeklyTrendChart (SVG linha animada drawLine, 12 semanas),
                 HabitStatsList (ranking visual: ouro/prata/bronze, ordenado por rate30d),
                 CategorySelector, use-stats (weekdayStats + weeklyTrend expostos)
                 SleepBarChart: legenda texto claro ("8h ou mais" / "Abaixo da meta"),
                 valores acima das barras, preserveAspectRatio corrigido
                 stats-utils: getExpectedDays(), buildWeekdayStats(), buildWeeklyTrend()
                 stats-service: inclui frequency_type + frequency_days no select
  ✅ settings/   SettingsPage (5 seções: Perfil / Aparência / IA / Dados / Conta),
                 ProfileForm, SettingsPrimitives (SettingsSection, SettingsToggle, SettingsAction),
                 use-profile, profile-service (exportUserData — JSON de 5 tabelas)
  ✅ sleep/      SleepCard, SleepModal, SleepBarChart (SVG), use-sleep, sleep-service
                 Tabela: sleep_logs (user_id, sleep_date, bedtime, waketime, duration_min, quality, notes)
  ✅ insights/   InsightCard (4 estados: insuficiente → barra progresso, aguardando segunda →
                 countdown, gerando → skeleton, pronto → texto + data),
                 use-insight (auto-geração na segunda, daysWithData, daysUntilMonday),
                 insight-service (getDaysWithData)
                 Edge Function: habit-weekly-insight (300 tokens, cache semana, ai_usage)
                 Tabela: ai_insights (user_id, week_start, content, generated_at)
  ✅ ai-agent/   AgentDrawer (drawer + FAB + usageBar hora/mês/msgs), MessageBubble
                 (salvar nota com [IA HH:MM]), use-ai-agent (fetchUsage, saveNote),
                 ai-store (activeHabit, activeScreen, hourlyCount, monthlyCount),
                 ai-service (stream), Edge Function: habit-ai-agent
                 (MAX 5/hora, 100/mês, histórico 6 msgs, 400 tokens)
  ✅ shared/     Sidebar.jsx + sidebar.module.css (≥1024px, nav + logout)
                 BottomBar.jsx + bottom-bar.module.css (<1024px, MoreMenu animado)
                 app-layout.module.css | PageTransition.jsx | ThemeToggle.jsx
                 animations.css (fadeSlideUp, checkBounce, drawLine, pulse, skeleton)
                 use-animation.js (useStaggerDelay, useStaggerChildren, useFadeIn, useCountUp)
                 use-theme.js (Zustand + localStorage)
                 tokens.css — bloco v4 appended (não substituir o arquivo)
  ✅ App.jsx     Layout: Sidebar + main + BottomBar + AgentDrawer (global)
                 Rotas: / /habits /categories /stats /settings
  ✅ Banco       profiles (+ ai_enabled bool DEFAULT true,
                           monthly_message_limit int DEFAULT 100),
                 categories, habits, habit_goals, habit_logs, default_habits,
                 sleep_logs, ai_insights, ai_rate_limits, ai_usage
                 RLS obrigatório: INSERT + UPDATE em profiles (FK de categories)
  ✅ Tema        Light/Dark toggle — data-theme no <html>, tokens separados por tema

## Bugs — Sprint 1 (2026-04-13) — TODOS CORRIGIDOS ✅

### ✅ CRÍTICOS — corrigidos
  - Sidebar.jsx:18 — `profile?.full_name` → `profile?.name`
  - HabitForm.jsx + HabitCard.jsx + HabitsPage.jsx — meta pré-carregada ao editar,
    `goalOn` inicia com `!!habit?.goal`, goal salvo/removido no path de edição

### ✅ ALTOS — corrigidos
  - ai-store.js + HabitCard.jsx — `habitChanged` por `id`; `open()` passa `id` no contexto
  - Timezone sistêmico — `shared/utils/date-utils.js` criado com `localDateISO()` /
    `yesterdayISO()` usando `toLocaleDateString('sv')`. Corrigido em 8 arquivos:
    dashboard-service, use-dashboard, stats-utils, use-stats, use-sleep,
    sleep-service, SleepBarChart, insight-service

### ✅ MÉDIOS — corrigidos
  - HabitForm.jsx — labels 'Seg/Ter/4ª/5ª/Sex/Sáb/Dom' (sem ambiguidade)
  - use-habits.js — `remove()` com try/catch e `setError()`
  - use-sleep.js — `useMemo(getYesterday, [])` → `yesterdayISO()` direto (sem stale)

## Bugs — Sprint 2 (2026-04-13) — TODOS CORRIGIDOS ✅

### ✅ Arquitetural — corrigidos
  - App.jsx + ErrorBoundary.jsx (novo) — ErrorBoundary envolve BrowserRouter
  - use-ai-agent.js — histórico sempre inicia com role 'user' antes de enviar à API

### ✅ Bugs — corrigidos
  - use-sleep.js — `yesterdayISO()` inline → `useState(yesterdayISO)` (inicializador)
  - use-ai-agent.js — filtro de erro removido; só remove a última msg se for placeholder vazio
  - use-insight.js — `generate` virou `useCallback(fn, [])`; adicionada às deps do useEffect
  - HabitForm.jsx, CategoryForm.jsx, GoalForm.jsx — `.trim()` nos campos de texto livres

## Sprint 4 (2026-04-15) — TODOS CORRIGIDOS ✅

### ✅ BUG-05 — StatsPage reestruturada em 7 blocos
  - WeekdayChart.jsx — SVG barras animadas (growUp + transformOrigin na base),
    destaque accent no melhor dia, taxa % acima de cada barra
  - WeeklyTrendChart.jsx — SVG linha animada (stroke-dashoffset drawLine),
    12 semanas, pontos com fadeIn, labels nas extremidades + meio
  - HabitStatsList.jsx — ranking visual com ouro/prata/bronze (RANK_COLORS),
    ordenação descendente por rate30d, barColor vinculado ao rank
  - stats-utils.js — buildWeekdayStats() + buildWeeklyTrend() adicionados
  - use-stats.js — weekdayStats + weeklyTrend expostos pelo hook
  - StatsPage.jsx — estrutura de 7 blocos numerados nos comentários

## Segurança — status (v6 COMPLETO ✅)
  ✅ GRUPO 1: supabase.js com storage: sessionStorage
              → sessão limpa ao fechar browser; F5 mantém sessão
  ✅ GRUPO 3: secureLogout() em auth-service.js — limpa auth-store + ai-store,
              chama supabase.signOut(), navega via window.location.href
              Substituído em: Sidebar, BottomBar, use-auth (expostos como secureLogout)
  ✅ GRUPO 4: ProtectedRoute — verifica supabase.auth.getSession() no mount;
              store local = cache para UX; Supabase = fonte de verdade
              Loading skeleton exibido durante verificação
  ✅ GRUPO 2: use-session-timeout.js — logout automático aos 30min de inatividade
              Eventos: mousemove, mousedown, keydown, touchstart, scroll, click
              Integrado em AppLayout (App.jsx)
  ✅ GRUPO 5: SessionWarningBanner.jsx — banner fixo 5min antes do logout
              Botão "Continuar sessão" reseta o timer via resetTimer()
              CSS: session-warning-banner.module.css
  ✅ GRUPO 6: login-rate-limit.js — 5 tentativas / 15min via localStorage
              LoginForm.jsx — countdown reativo, botão bloqueado, erro com tentativas restantes
  ✅ ARQU-02: fetchUsage — cálculo client-side de window_start removido
              hourlyCount incrementado localmente por sessão; servidor aplica via 429

## Agente de IA — status
  ✅ Edge Function habit-ai-agent: auth dupla, rate limit (5/h + 100/mês), stream,
     histórico 6 msgs, 400 tokens, verifica ai_enabled + monthly_message_limit
  ✅ Edge Function habit-weekly-insight: Claude Haiku, cache por semana, 300 tokens,
     verifica 7 dias com dados, atualiza ai_usage.insight_count
  ✅ Frontend: drawer streaming + usageBar + salvar nota + MessageBubble
  ⚠️  ANTHROPIC_API_KEY → Supabase Dashboard > Edge Functions > Secrets
  ⚠️  SUPABASE_SERVICE_ROLE_KEY → Supabase Dashboard > Edge Functions > Secrets
  ⚠️  Deploy: supabase functions deploy habit-ai-agent --no-verify-jwt
  ⚠️  Deploy: supabase functions deploy habit-weekly-insight --no-verify-jwt

## Bugs corrigidos (histórico)
  - 403 profiles: políticas RLS INSERT + UPDATE faltando → rodar SQL no Supabase
  - 409 categories onboarding: INSERT duplicado → reutiliza existentes por nome
  - FK categories_user_id_fkey: perfil não existia no 1º login → ensureProfile()
  - Ícones de categoria sem exibição: nomes capitalizados ('Heart') vs minúsculos ('heart')
  - ContributionCalendar apertado: migrado para SVG responsivo com viewBox dinâmico
  - SleepBarChart símbolos: ≥ / < substituídos por texto ("8h ou mais" / "Abaixo da meta")

## Próximos passos (ordem de prioridade)
  1. ✅ Sprint 1 concluída — 7 bugs corrigidos em 11 arquivos
  2. ✅ Sprint 2 concluída — 6 itens de qualidade corrigidos em 8 arquivos
  3. ✅ Sprint 3 concluída — segurança de sessão v6 completa (6 grupos + ARQU-02)
  4. ✅ Sprint 4 concluída — StatsPage 7 blocos: WeekdayChart + WeeklyTrendChart + HabitStatsList ranking
  5. Deploy das Edge Functions + secrets no Supabase
  6. Testar fluxo completo: login → dashboard → hábitos → sono → agente → insights

## Última atualização: 2026-04-15
## Última tarefa: Sprint 4 — StatsPage reestruturada em 7 blocos (BUG-05)

## Contexto completo
Notion: https://www.notion.so/3284660fcd7980ce82b3d8faff7d6dee
Módulo em desenvolvimento: —
