# HabitFlow

Plataforma web de rastreamento de hábitos com visualização de progresso, metas personalizáveis e assistente de IA integrado. Interface dark mode minimalista, construída para pessoas com rotina intensa que querem conciliar saúde, aprendizado e bem-estar.

---

## Tecnologias

- **Frontend:** React 19 + Vite + JavaScript
- **Backend:** Supabase (Auth, PostgreSQL, Edge Functions, RLS)
- **Estado global:** Zustand
- **Estilização:** CSS Modules + design tokens próprios
- **IA:** Claude Haiku via Supabase Edge Functions (TypeScript)
- **Deploy:** Vercel (frontend) + Supabase (backend)

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js 18 ou superior
- npm 9 ou superior
- Git
- Supabase CLI (para Edge Functions)
- Conta no Supabase (gratuita)
- Conta na Vercel (opcional, apenas para deploy)

---

## Configuração do ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/habitflow.git
cd habitflow
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

#### 3.1 Crie um projeto no Supabase

1. Acesse [supabase.com](http://supabase.com) e crie uma conta
2. Clique em **New Project**
3. Preencha:
    - **Name:** `habitflow`
    - **Database Password:** gere uma senha forte e guarde em local seguro
    - **Region:** South America (São Paulo)
4. Aguarde o provisionamento (~2 minutos)

#### 3.2 Execute o SQL de setup

1. No painel do Supabase, acesse **SQL Editor → New Query**
2. Cole e execute o conteúdo do arquivo `docs/supabase-setup.sql` (ou acesse a subpágina *Setup Supabase* no Notion do projeto)
3. O script cria todas as tabelas, políticas RLS, índices e dados iniciais

#### 3.3 Crie um usuário de teste

1. No painel do Supabase, acesse **Authentication → Users**
2. Clique em **Add User → Create new user**
3. Preencha email e senha (ex: `teste@habitflow.com` / `Teste@123`)
4. Confirme que um registro aparece na tabela `profiles` automaticamente

### 4. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais do Supabase:

```bash
cp .env.example .env
```

Abra o `.env` e preencha:

```bash
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Encontre esses valores em **Project Settings → API** no painel do Supabase.

> ⚠️ Nunca commite o arquivo `.env`. Ele já está no `.gitignore`.
> 

### 5. Configure as Edge Functions (IA)

Este passo é necessário apenas se quiser usar o assistente de IA.

#### 5.1 Instale a Supabase CLI

```bash
npm install -g supabase
supabase login
```

#### 5.2 Configure os secrets no Supabase

No painel do Supabase, acesse **Edge Functions → Manage Secrets** e adicione:

```
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

A `SUPABASE_SERVICE_ROLE_KEY` está em **Project Settings → API → service_role**.

#### 5.3 Faça o deploy das Edge Functions

```bash
supabase functions deploy habit-ai-agent --no-verify-jwt
supabase functions deploy habit-weekly-insight --no-verify-jwt
```

---

## Rodando localmente

```bash
npm run dev
```

Acesse http://localhost:5173 e faça login com o usuário criado no passo 3.3.

---

## Estrutura do projeto

```
/src
  /features            ← módulos de domínio isolados
    /auth              ← login, sessão, proteção de rotas
    /dashboard         ← tela principal, progresso do dia, gráficos
    /habits            ← CRUD de hábitos, registro diário
    /goals             ← metas por hábito
    /categories        ← categorias personalizadas
    /stats             ← estatísticas, heatmap, tendências
    /settings          ← perfil, preferências, exportação de dados
    /sleep             ← registro e visualização de sono
    /insights          ← insights semanais gerados por IA
    /ai-agent          ← assistente de IA (drawer + Edge Function)
  /shared              ← componentes, hooks, utils e estilos reutilizáveis
    /components        ← UI genérica (Sidebar, BottomBar, ErrorBoundary...)
    /hooks             ← hooks reutilizáveis
    /utils             ← utilitários (date-utils, etc.)
    /styles            ← tokens CSS, tema global
  /lib
    supabase.js        ← client Supabase configurado
/supabase
  /functions
    /habit-ai-agent         ← Edge Function do chat de IA
    /habit-weekly-insight   ← Edge Function de insights semanais
/public
```

O projeto usa **arquitetura feature-based**: cada módulo é autossuficiente e agrupa seus próprios componentes, hooks, services e estilos.

---

## Padrões de código

Antes de contribuir, leia e siga as convenções obrigatórias do projeto:

- **Funções:** máximo 30 linhas. Se passar, extraia funções menores.
- **Arquivos:** máximo 200 linhas. Se passar, divida em módulos.
- **Lógica de negócio:** sempre nos `services/`, nunca nos componentes.
- **Exports:** `default export` apenas para componentes React. Todo o resto usa named exports.
- **Erros:** sempre tratados explicitamente — sem `catch` vazio.
- **Documentação:** JSDoc em todas as funções públicas dos services.
- **Nomenclatura:**
    - Arquivos: `kebab-case` → `habit-service.js`
    - Componentes: `PascalCase` → `HabitCard.jsx`
    - Funções/variáveis: `camelCase` → `getHabitById()`
    - Constantes: `UPPER_SNAKE_CASE` → `MAX_STREAK_DAYS`
    - CSS Modules: `kebab-case` → `habit-card.module.css`

---

## Design System

O projeto tem um design system próprio dark mode minimalista (referência: Linear, Vercel).

Tokens de cor, tipografia, espaçamento e animações estão em:

```
src/shared/styles/tokens.css
```

Regras visuais obrigatórias:

- Sem gradientes decorativos
- Separação visual via `border`, nunca `box-shadow`
- Hover states sutis: opacidade +5%, sem mudança de cor
- Animações: máximo 200–300ms, `ease-out` — sem bounce
- Fonte: **Inter** (Google Fonts)
- Accent: `#6366f1` (indigo)

---

## Fluxo de desenvolvimento

Siga este fluxo para qualquer nova feature ou correção:

1. **Planejamento** — entenda o requisito, proponha a interface/contrato antes de codificar
2. **Implementação** — siga as convenções, não quebre módulos existentes
3. **Testes** — verifique os edge cases manualmente (testes unitários são prioridade futura)
4. **Documentação** — JSDoc nas funções públicas, atualize o [CLAUDE.md](http://CLAUDE.md) se necessário
5. **Revisão** — cheque aderência às convenções antes de abrir PR

---

## Banco de dados

Todas as tabelas usam **Row Level Security (RLS)** — cada usuário acessa apenas seus próprios dados.

| Tabela | Descrição |
| --- | --- |
| `profiles` | Dados públicos do usuário (nome, timezone, preferências) |
| `categories` | Categorias personalizadas de hábitos |
| `habits` | Hábitos do usuário (padrão ou customizados) |
| `habit_goals` | Metas por hábito (valor, unidade, frequência) |
| `habit_logs` | Registro diário de execução dos hábitos |
| `default_habits` | Hábitos padrão do app (leitura pública) |
| `sleep_logs` | Registros de sono |
| `ai_insights` | Insights semanais gerados pela IA |
| `ai_rate_limits` | Controle de uso do chat de IA (5 msg/hora) |
| `ai_usage` | Controle de uso mensal da IA por usuário |

---

## Agente de IA

O assistente de IA usa **Claude Haiku** via Supabase Edge Functions. A chave da API nunca fica exposta no browser — toda a comunicação passa pelo servidor.

Limites configurados:

- 5 mensagens por hora por usuário
- 100 mensagens por mês por usuário
- 1 insight semanal por usuário (gerado automaticamente às segundas-feiras)

---

## Variáveis de ambiente

| Variável | Onde encontrar | Obrigatória |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API | ✅ Sim |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | ✅ Sim |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](http://console.anthropic.com) | Apenas para IA |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | Apenas para IA |

> As duas últimas variáveis são configuradas apenas no painel do Supabase (Edge Functions → Secrets), nunca no `.env` local.
> 

---

## Scripts disponíveis

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção
npm run preview    # preview do build local
npm run lint       # verificação de código
```

---

## Deploy

### Frontend (Vercel)

1. Conecte o repositório na [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente no painel da Vercel:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
3. Deploy automático a cada push na branch principal

### Backend (Supabase)

O banco e as Edge Functions já estão no Supabase. Para atualizar uma Edge Function após mudanças:

```bash
supabase functions deploy habit-ai-agent --no-verify-jwt
supabase functions deploy habit-weekly-insight --no-verify-jwt
```

---

## Documentação completa

A documentação detalhada do projeto — arquitetura, decisões técnicas, design system, banco de dados e roadmap — está no Notion:

[HabitFlow](https://www.notion.so/HabitFlow-3284660fcd7980ce82b3d8faff7d6dee?pvs=21)

O arquivo `CLAUDE.md` na raiz do repositório contém o estado atual do desenvolvimento e os próximos passos definidos.
