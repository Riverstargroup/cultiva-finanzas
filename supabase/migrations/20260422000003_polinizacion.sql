create table if not exists user_pollination_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_date date not null default current_date,
  domain_learned text not null check (domain_learned in ('control','credito','proteccion','crecimiento')),
  insight text not null,
  coins_earned int not null default 20,
  created_at timestamptz default now(),
  unique(user_id, session_date)
);

alter table user_pollination_sessions enable row level security;
create policy "users own pollination sessions" on user_pollination_sessions for all using (auth.uid() = user_id);
