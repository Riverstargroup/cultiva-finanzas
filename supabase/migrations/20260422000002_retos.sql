create table if not exists challenge_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  domain text not null check (domain in ('control','credito','proteccion','crecimiento')),
  difficulty int not null default 1 check (difficulty between 1 and 3),
  duration_days int not null default 7,
  coins_reward int not null default 100,
  mastery_delta float not null default 0.05,
  verification_hint text,
  created_at timestamptz default now()
);

create table if not exists user_weekly_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid not null references challenge_templates(id),
  week_start date not null,
  status text not null default 'active' check (status in ('active','completed','failed','skipped')),
  started_at timestamptz default now(),
  completed_at timestamptz,
  unique(user_id, template_id, week_start)
);

alter table user_weekly_challenges enable row level security;
create policy "users own weekly challenges" on user_weekly_challenges for all using (auth.uid() = user_id);
alter table challenge_templates enable row level security;
create policy "anyone can read templates" on challenge_templates for select using (true);

-- Seed 5 challenge templates
insert into challenge_templates (title, description, domain, difficulty, duration_days, coins_reward, mastery_delta, verification_hint) values
('Semana sin gastos hormiga', 'Elimina todos tus gastos hormiga durante 7 días: nada de cafés de cadena, snacks espontáneos ni compras impulsivas menores a $100.', 'control', 1, 7, 100, 0.05, 'Anota en papel o app cada vez que resististe la tentación'),
('Arma tu fondo de emergencia', 'Abre una cuenta CETES Directo y deposita aunque sea $500 esta semana. El primer depósito es el más difícil.', 'proteccion', 2, 7, 150, 0.08, 'Toma screenshot de tu primer depósito en cetesdirecto.com'),
('Revisa tu historial en Buró', 'Consulta tu reporte de crédito gratis en burodecredito.com.mx y anota tus áreas de mejora.', 'credito', 1, 3, 80, 0.04, 'Todos tienen derecho a 1 consulta gratis al año'),
('Automatiza tu ahorro', 'Configura una transferencia automática el día de quincena hacia tu cuenta de ahorro, aunque sea $200.', 'crecimiento', 2, 5, 120, 0.06, 'Configúralo en tu app bancaria en Transferencias Programadas'),
('Crea tu presupuesto semanal', 'Escribe cuánto vas a gastar esta semana en cada categoría ANTES de gastar. Respétalo.', 'control', 1, 7, 100, 0.05, 'Usa papel, notas del celular, o una app como Fintonic');
