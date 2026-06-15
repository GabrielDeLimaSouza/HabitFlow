-- =============================================================================
-- HabitFlow — Snapshot do schema do banco remoto (schema public)
-- Projeto Supabase: aselotqpdgbjvmagdnfy
-- Gerado em: 2026-06-14 (via consulta read-only ao catálogo do Postgres)
--
-- ATENÇÃO: este arquivo é um baseline de referência/documentação do estado
-- atual do banco remoto. NÃO é uma migration e não deve ser aplicado com
-- `db push`. Objetos de plataforma do Supabase (auth, storage, extensões,
-- event triggers internos de PostgREST/pg_cron/pg_graphql) foram omitidos.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- TABELAS
-- -----------------------------------------------------------------------------

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  name text NOT NULL,
  avatar_url text,
  timezone text DEFAULT 'America/Sao_Paulo'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  theme text DEFAULT 'dark'::text NOT NULL,
  ai_enabled boolean DEFAULT true NOT NULL,
  monthly_message_limit integer DEFAULT 100 NOT NULL,
  daily_goal integer DEFAULT 3 NOT NULL,
  rest_days integer[] DEFAULT '{}'::integer[] NOT NULL,
  preferred_reminder_time time without time zone,
  terms_accepted_at timestamp with time zone,
  terms_version text,
  age_confirmed_at timestamp with time zone
);

CREATE TABLE public.categories (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#6366f1'::text NOT NULL,
  icon text,
  "position" integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.habits (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  category_id uuid,
  name text NOT NULL,
  description text,
  icon text,
  color text DEFAULT '#6366f1'::text NOT NULL,
  is_default boolean DEFAULT false NOT NULL,
  frequency_type text DEFAULT 'daily'::text NOT NULL,
  frequency_days integer[] DEFAULT '{1,2,3,4,5,6,7}'::integer[] NOT NULL,
  reminder_time time without time zone,
  active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.habit_goals (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  habit_id uuid NOT NULL,
  target_value numeric NOT NULL,
  target_unit text NOT NULL,
  target_frequency text DEFAULT 'daily'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.habit_logs (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  habit_id uuid NOT NULL,
  user_id uuid NOT NULL,
  logged_date date NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  value numeric,
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.default_habits (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL,
  description text,
  icon text,
  color text DEFAULT '#6366f1'::text NOT NULL,
  category_name text,
  default_goal_value numeric,
  default_goal_unit text,
  default_goal_frequency text DEFAULT 'daily'::text NOT NULL
);

CREATE TABLE public.sleep_logs (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  sleep_date date NOT NULL,
  bedtime time without time zone NOT NULL,
  wake_time time without time zone NOT NULL,
  duration_min integer NOT NULL,
  quality integer,
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.ai_insights (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  week_start date NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.ai_rate_limits (
  user_id uuid NOT NULL,
  window_start timestamp with time zone DEFAULT date_trunc('hour'::text, now()) NOT NULL,
  message_count integer DEFAULT 1 NOT NULL
);

CREATE TABLE public.ai_usage (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  month_start date DEFAULT (date_trunc('month'::text, now()))::date NOT NULL,
  chat_messages integer DEFAULT 0 NOT NULL,
  insight_count integer DEFAULT 0 NOT NULL,
  tokens_used integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- -----------------------------------------------------------------------------
-- CONSTRAINTS (PK / UNIQUE / FK / CHECK)
-- -----------------------------------------------------------------------------

-- profiles
ALTER TABLE ONLY public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.profiles ADD CONSTRAINT profiles_theme_check CHECK ((theme = ANY (ARRAY['dark'::text, 'light'::text])));

-- categories
ALTER TABLE ONLY public.categories ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.categories ADD CONSTRAINT categories_user_id_name_key UNIQUE (user_id, name);
ALTER TABLE ONLY public.categories ADD CONSTRAINT categories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- habits
ALTER TABLE ONLY public.habits ADD CONSTRAINT habits_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.habits ADD CONSTRAINT habits_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.habits ADD CONSTRAINT habits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.habits ADD CONSTRAINT habits_frequency_type_check CHECK ((frequency_type = ANY (ARRAY['daily'::text, 'weekly'::text, 'custom'::text])));

-- habit_goals
ALTER TABLE ONLY public.habit_goals ADD CONSTRAINT habit_goals_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.habit_goals ADD CONSTRAINT habit_goals_habit_id_key UNIQUE (habit_id);
ALTER TABLE ONLY public.habit_goals ADD CONSTRAINT habit_goals_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.habit_goals ADD CONSTRAINT habit_goals_target_frequency_check CHECK ((target_frequency = ANY (ARRAY['daily'::text, 'weekly'::text, 'monthly'::text])));
ALTER TABLE ONLY public.habit_goals ADD CONSTRAINT habit_goals_target_value_check CHECK ((target_value > (0)::numeric));

-- habit_logs
ALTER TABLE ONLY public.habit_logs ADD CONSTRAINT habit_logs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.habit_logs ADD CONSTRAINT habit_logs_habit_id_logged_date_key UNIQUE (habit_id, logged_date);
ALTER TABLE ONLY public.habit_logs ADD CONSTRAINT habit_logs_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.habit_logs ADD CONSTRAINT habit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.habit_logs ADD CONSTRAINT habit_logs_value_check CHECK ((value >= (0)::numeric));

-- default_habits
ALTER TABLE ONLY public.default_habits ADD CONSTRAINT default_habits_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.default_habits ADD CONSTRAINT default_habits_default_goal_frequency_check CHECK ((default_goal_frequency = ANY (ARRAY['daily'::text, 'weekly'::text, 'monthly'::text])));
ALTER TABLE ONLY public.default_habits ADD CONSTRAINT default_habits_default_goal_value_check CHECK ((default_goal_value > (0)::numeric));

-- sleep_logs
ALTER TABLE ONLY public.sleep_logs ADD CONSTRAINT sleep_logs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.sleep_logs ADD CONSTRAINT sleep_logs_user_id_sleep_date_key UNIQUE (user_id, sleep_date);
ALTER TABLE ONLY public.sleep_logs ADD CONSTRAINT sleep_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.sleep_logs ADD CONSTRAINT sleep_logs_duration_min_check CHECK ((duration_min > 0));
ALTER TABLE ONLY public.sleep_logs ADD CONSTRAINT sleep_logs_quality_check CHECK (((quality >= 1) AND (quality <= 5)));

-- ai_insights
ALTER TABLE ONLY public.ai_insights ADD CONSTRAINT ai_insights_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.ai_insights ADD CONSTRAINT ai_insights_user_id_week_start_key UNIQUE (user_id, week_start);
ALTER TABLE ONLY public.ai_insights ADD CONSTRAINT ai_insights_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- ai_rate_limits
ALTER TABLE ONLY public.ai_rate_limits ADD CONSTRAINT ai_rate_limits_pkey PRIMARY KEY (user_id, window_start);
ALTER TABLE ONLY public.ai_rate_limits ADD CONSTRAINT ai_rate_limits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- ai_usage
ALTER TABLE ONLY public.ai_usage ADD CONSTRAINT ai_usage_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.ai_usage ADD CONSTRAINT ai_usage_user_id_month_start_key UNIQUE (user_id, month_start);
ALTER TABLE ONLY public.ai_usage ADD CONSTRAINT ai_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- -----------------------------------------------------------------------------
-- ÍNDICES (não associados a constraints)
-- -----------------------------------------------------------------------------

CREATE INDEX idx_categories_position ON public.categories USING btree (user_id, "position");
CREATE INDEX idx_categories_user ON public.categories USING btree (user_id);
CREATE INDEX idx_habits_active ON public.habits USING btree (user_id, active);
CREATE INDEX idx_habits_user ON public.habits USING btree (user_id);
CREATE INDEX idx_habit_logs_habit_date ON public.habit_logs USING btree (habit_id, logged_date);
CREATE INDEX idx_habit_logs_user_date ON public.habit_logs USING btree (user_id, logged_date);
CREATE INDEX idx_sleep_logs_user_date ON public.sleep_logs USING btree (user_id, sleep_date);
CREATE INDEX idx_ai_insights_user_week ON public.ai_insights USING btree (user_id, week_start);
CREATE INDEX idx_ai_usage_user_month ON public.ai_usage USING btree (user_id, month_start);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY — habilitação
-- -----------------------------------------------------------------------------

ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_goals    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.default_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage       ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- POLÍTICAS RLS
-- -----------------------------------------------------------------------------

-- profiles
CREATE POLICY "profiles: usuário insere o próprio" ON public.profiles
  FOR INSERT TO public WITH CHECK ((auth.uid() = id));
CREATE POLICY "profiles: usuário lê o próprio" ON public.profiles
  FOR SELECT TO public USING ((auth.uid() = id));
CREATE POLICY "profiles: usuário atualiza o próprio" ON public.profiles
  FOR UPDATE TO public USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));

-- categories
CREATE POLICY "categories: usuário gerencia as próprias" ON public.categories
  FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

-- habits
CREATE POLICY "habits: usuário gerencia os próprios" ON public.habits
  FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

-- habit_goals (via dono do hábito)
CREATE POLICY "habit_goals: usuário gerencia as próprias" ON public.habit_goals
  FOR ALL TO public
  USING ((EXISTS ( SELECT 1 FROM habits WHERE ((habits.id = habit_goals.habit_id) AND (habits.user_id = auth.uid())))))
  WITH CHECK ((EXISTS ( SELECT 1 FROM habits WHERE ((habits.id = habit_goals.habit_id) AND (habits.user_id = auth.uid())))));

-- habit_logs
CREATE POLICY "habit_logs: usuário gerencia os próprios" ON public.habit_logs
  FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

-- default_habits (catálogo público, somente leitura)
CREATE POLICY "default_habits: leitura pública" ON public.default_habits
  FOR SELECT TO public USING (true);

-- sleep_logs
CREATE POLICY "sleep_logs: usuário gerencia os próprios" ON public.sleep_logs
  FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

-- ai_insights
CREATE POLICY "ai_insights: usuário acessa os próprios" ON public.ai_insights
  FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

-- ai_rate_limits
CREATE POLICY "ai_rate_limits: usuário acessa o próprio" ON public.ai_rate_limits
  FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

-- ai_usage
CREATE POLICY "ai_usage: usuário acessa o próprio" ON public.ai_usage
  FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

-- -----------------------------------------------------------------------------
-- FUNÇÕES
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, name, terms_accepted_at, terms_version, age_confirmed_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    (new.raw_user_meta_data->>'terms_accepted_at')::timestamptz,
    new.raw_user_meta_data->>'terms_version',
    (new.raw_user_meta_data->>'age_confirmed_at')::timestamptz
  );
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função utilitária de plataforma: habilita RLS automaticamente em novas tabelas
-- do schema public (disparada pelo event trigger `ensure_rls`).
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;

-- -----------------------------------------------------------------------------
-- TRIGGERS
-- -----------------------------------------------------------------------------

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Trigger em auth.users (cria o profile no signup, persistindo consentimento/idade)
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- -----------------------------------------------------------------------------
-- EVENT TRIGGERS (app)
-- Obs.: event triggers internos do Supabase (pgrst_ddl_watch, pgrst_drop_watch,
-- issue_graphql_placeholder, issue_pg_cron_access, issue_pg_graphql_access,
-- issue_pg_net_access) são gerenciados pela plataforma e foram omitidos.
-- -----------------------------------------------------------------------------

CREATE EVENT TRIGGER ensure_rls ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION rls_auto_enable();

-- =============================================================================
-- Fim do snapshot.
-- =============================================================================
