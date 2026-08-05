-- MUNGUBA FINANCE — Migração: Modo Família
-- Execute este script no SQL Editor do Supabase (adiciona funcionalidade sem afetar o que já existe)

-- ── Tabela de famílias ──
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text unique not null,
  created_by uuid references auth.users on delete cascade not null,
  created_at timestamptz default now()
);

-- ── Tabela de membros da família ──
create table if not exists public.family_members (
  id bigserial primary key,
  family_id uuid references public.families on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  member_name text,
  joined_at timestamptz default now(),
  unique(family_id, user_id)
);

-- ── Meta/sonho compartilhado da família ──
create table if not exists public.family_goals (
  id bigserial primary key,
  family_id uuid references public.families on delete cascade not null,
  name text not null,
  icon text default '🏡',
  target numeric(14,2) not null,
  current numeric(14,2) default 0,
  created_by uuid references auth.users on delete cascade not null,
  created_at timestamptz default now()
);

alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.family_goals enable row level security;

-- Função auxiliar: verifica se o usuário pertence a uma família
create or replace function public.user_family_ids(uid uuid)
returns setof uuid as $$
  select family_id from public.family_members where user_id = uid;
$$ language sql security definer stable;

-- ── Políticas: families ──
drop policy if exists families_select on public.families;
create policy families_select on public.families for select
  using (id in (select public.user_family_ids(auth.uid())));

drop policy if exists families_insert on public.families;
create policy families_insert on public.families for insert
  with check (created_by = auth.uid());

-- ── Políticas: family_members ──
drop policy if exists family_members_select on public.family_members;
create policy family_members_select on public.family_members for select
  using (family_id in (select public.user_family_ids(auth.uid())));

drop policy if exists family_members_insert on public.family_members;
create policy family_members_insert on public.family_members for insert
  with check (user_id = auth.uid());

drop policy if exists family_members_delete on public.family_members;
create policy family_members_delete on public.family_members for delete
  using (user_id = auth.uid());

-- ── Políticas: family_goals ──
drop policy if exists family_goals_select on public.family_goals;
create policy family_goals_select on public.family_goals for select
  using (family_id in (select public.user_family_ids(auth.uid())));

drop policy if exists family_goals_insert on public.family_goals;
create policy family_goals_insert on public.family_goals for insert
  with check (family_id in (select public.user_family_ids(auth.uid())));

drop policy if exists family_goals_update on public.family_goals;
create policy family_goals_update on public.family_goals for update
  using (family_id in (select public.user_family_ids(auth.uid())));

-- ── Permite que membros da mesma família vejam transações e investimentos uns dos outros ──
-- (visão compartilhada — a essência do Modo Família)
drop policy if exists family_view_transactions on public.transactions;
create policy family_view_transactions on public.transactions for select
  using (
    user_id = auth.uid()
    or user_id in (
      select fm2.user_id from public.family_members fm1
      join public.family_members fm2 on fm1.family_id = fm2.family_id
      where fm1.user_id = auth.uid()
    )
  );

drop policy if exists family_view_investments on public.investments;
create policy family_view_investments on public.investments for select
  using (
    user_id = auth.uid()
    or user_id in (
      select fm2.user_id from public.family_members fm1
      join public.family_members fm2 on fm1.family_id = fm2.family_id
      where fm1.user_id = auth.uid()
    )
  );

-- ── Função para gerar código de convite único de 6 caracteres ──
create or replace function public.generate_invite_code()
returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i integer;
begin
  for i in 1..6 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return result;
end;
$$ language plpgsql;
