-- Colunas de consentimento (registro do aceite da Política de Privacidade)
alter table public.profiles
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists terms_version text;

-- Atualiza o trigger para persistir o consentimento vindo do signup (raw_user_meta_data)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.profiles (id, name, terms_accepted_at, terms_version)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    (new.raw_user_meta_data->>'terms_accepted_at')::timestamptz,
    new.raw_user_meta_data->>'terms_version'
  );
  return new;
end;
$function$;
