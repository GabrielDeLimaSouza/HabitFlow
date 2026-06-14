-- Coluna de declaração de idade (registro da confirmação 16+)
alter table public.profiles
  add column if not exists age_confirmed_at timestamptz;

-- Atualiza o trigger preservando termos e acrescentando a idade
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
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
