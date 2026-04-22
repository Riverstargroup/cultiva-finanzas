-- Challenge templates (editorial content)
CREATE TABLE IF NOT EXISTS public.challenge_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  target_mastery_delta numeric NOT NULL DEFAULT 0.10,
  target_domain text CHECK (target_domain IN ('control','credito','proteccion','crecimiento')),
  reward_coins integer NOT NULL DEFAULT 100,
  difficulty int NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  emoji text NOT NULL DEFAULT '🌾',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.challenge_templates ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'challenge_templates' AND policyname = 'Authenticated users can read templates'
  ) THEN
    CREATE POLICY "Authenticated users can read templates"
      ON public.challenge_templates FOR SELECT
      TO authenticated USING (true);
  END IF;
END $$;

-- User weekly challenges
CREATE TABLE IF NOT EXISTS public.user_weekly_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  template_id uuid REFERENCES public.challenge_templates(id) ON DELETE CASCADE NOT NULL,
  week_start date NOT NULL DEFAULT date_trunc('week', CURRENT_DATE)::date,
  progress numeric NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  harvested boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, template_id, week_start)
);

ALTER TABLE public.user_weekly_challenges ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_weekly_challenges' AND policyname = 'users own weekly challenges'
  ) THEN
    CREATE POLICY "users own weekly challenges"
      ON public.user_weekly_challenges FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Seed 5 challenge templates
INSERT INTO public.challenge_templates (title, description, target_mastery_delta, target_domain, reward_coins, difficulty, emoji)
VALUES
  ('Presupuesto de la semana',
   'Completa 2 escenarios de control financiero',
   0.10, 'control', 100, 1, '📊'),
  ('Domador de deudas',
   'Mejora tu dominio en crédito completando escenarios',
   0.12, 'credito', 120, 2, '💳'),
  ('Escudo financiero',
   'Aprende a proteger tu patrimonio',
   0.10, 'proteccion', 100, 1, '🛡️'),
  ('Semilla de ahorro',
   'Aumenta tu maestría en crecimiento patrimonial',
   0.15, 'crecimiento', 150, 3, '🌱'),
  ('Polinizador maestro',
   'Completa una sesión de polinización cruzada',
   0.08, NULL, 80, 1, '🐝')
ON CONFLICT DO NOTHING;

-- Function to assign weekly challenges
CREATE OR REPLACE FUNCTION public.assign_weekly_challenges(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_weekly_challenges (user_id, template_id, week_start)
  SELECT
    p_user_id,
    ct.id,
    date_trunc('week', CURRENT_DATE)::date
  FROM public.challenge_templates ct
  WHERE ct.is_active = true
  ON CONFLICT (user_id, template_id, week_start) DO NOTHING;
END;
$$;
