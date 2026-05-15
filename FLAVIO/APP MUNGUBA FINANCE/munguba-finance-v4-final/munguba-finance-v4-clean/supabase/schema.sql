-- MUNGUBA FINANCE — Schema corrigido
-- desc renomeado para "descricao" para evitar conflito com palavra reservada do PostgreSQL

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  phone text,
  xp integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.transactions (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  descricao text not null,
  cat text not null,
  val numeric(12,2) not null,
  type text not null check (type in ('income','fixed','variable')),
  created_at timestamptz default now()
);

create table if not exists public.investments (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  tp text not null,
  nm text not null,
  val numeric(14,2) not null,
  rt numeric(6,2) default 0,
  date date,
  created_at timestamptz default now()
);

create table if not exists public.dreams (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  icon text default '✈️',
  target numeric(14,2) not null,
  current numeric(14,2) default 0,
  why text,
  banner text default 'bn-green',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.investments enable row level security;
alter table public.dreams enable row level security;

create policy if not exists users_own_profile
  on public.profiles for all using (auth.uid() = id);

create policy if not exists users_own_transactions
  on public.transactions for all using (auth.uid() = user_id);

create policy if not exists users_own_investments
  on public.investments for all using (auth.uid() = user_id);

create policy if not exists users_own_dreams
  on public.dreams for all using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
