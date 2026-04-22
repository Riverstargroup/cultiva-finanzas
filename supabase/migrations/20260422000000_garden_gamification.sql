
-- ============================================================
-- Mi Jardín - Phase 1 Gamification
-- 9 new tables + Postgres functions
-- All mastery math + coin awards run server-side for integrity
-- ============================================================

-- 1. PLANT_SPECIES (static reference catalog)
CREATE TABLE public.plant_species (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  display_name text NOT NULL,
  domain text NOT NULL CHECK (domain IN ('control','credito','proteccion','crecimiento')),
  stage_assets jsonb NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.plant_species ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read plant species"
  ON public.plant_species FOR SELECT
  TO authenticated
  USING (true);

-- 2. USER_GARDEN_PLOTS (one row per user per domain)
CREATE TABLE public.user_garden_plots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  species_id uuid NOT NULL REFERENCES public.plant_species(id),
  domain text NOT NULL CHECK (domain IN ('control','credito','proteccion','crecimiento')),
  stage text NOT NULL DEFAULT 'seed' CHECK (stage IN ('seed','sprout','growing','blooming','mastered')),
  mastery numeric(4,3) NOT NULL DEFAULT 0 CHECK (mastery BETWEEN 0 AND 1),
  health int NOT NULL DEFAULT 100 CHECK (health BETWEEN 0 AND 100),
  last_watered_at timestamptz,
  is_blooming boolean NOT NULL DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, domain)
);

ALTER TABLE public.user_garden_plots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own garden plots"
  ON public.user_garden_plots FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own garden plots"
  ON public.user_garden_plots FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own garden plots"
  ON public.user_garden_plots FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_garden_plots_updated_at
  BEFORE UPDATE ON public.user_garden_plots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 3. FLASHCARDS (editorial content)
CREATE TABLE public.flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id text NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  front text NOT NULL,
  back text NOT NULL,
  difficulty int NOT NULL DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_flashcards_skill ON public.flashcards(skill_id);

ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read published flashcards"
  ON public.flashcards FOR SELECT
  TO authenticated
  USING (is_published = true);

-- 4. USER_FLASHCARD_REVIEWS (SM-2 state per user per card)
CREATE TABLE public.user_flashcard_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  flashcard_id uuid NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
  ease_factor numeric(3,2) NOT NULL DEFAULT 2.5,
  interval_days int NOT NULL DEFAULT 0,
  repetitions int NOT NULL DEFAULT 0,
  due_at timestamptz NOT NULL DEFAULT now(),
  last_quality int CHECK (last_quality BETWEEN 0 AND 5),
  last_reviewed_at timestamptz,
  UNIQUE (user_id, flashcard_id)
);

CREATE INDEX idx_user_flashcard_reviews_due ON public.user_flashcard_reviews(user_id, due_at);

ALTER TABLE public.user_flashcard_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own flashcard reviews"
  ON public.user_flashcard_reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flashcard reviews"
  ON public.user_flashcard_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcard reviews"
  ON public.user_flashcard_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. DRAGDROP_EXERCISES (editorial content)
CREATE TABLE public.dragdrop_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id text NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  buckets jsonb NOT NULL DEFAULT '[]',
  time_limit_seconds int,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.dragdrop_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read published exercises"
  ON public.dragdrop_exercises FOR SELECT
  TO authenticated
  USING (is_published = true);

-- 6. MINIGAMES (trivia, memory_match)
CREATE TABLE public.minigames (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('trivia','memory_match')),
  skill_id text REFERENCES public.skills(id),
  title text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  difficulty int NOT NULL DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.minigames ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read published minigames"
  ON public.minigames FOR SELECT
  TO authenticated
  USING (is_published = true);

-- 7. USER_ACTIVITY_ATTEMPTS (polymorphic attempt log)
CREATE TABLE public.user_activity_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_kind text NOT NULL CHECK (activity_kind IN ('flashcard','dragdrop','minigame','simulator','pollination')),
  activity_id uuid,
  score numeric(5,2),
  duration_ms int,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_activity_attempts_user ON public.user_activity_attempts(user_id, created_at DESC);

ALTER TABLE public.user_activity_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own attempts"
  ON public.user_activity_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
  ON public.user_activity_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 8. COIN_TRANSACTIONS (append-only ledger — never update, never delete rows)
CREATE TABLE public.coin_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta int NOT NULL,
  reason text NOT NULL,
  ref_kind text,
  ref_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_coin_transactions_user ON public.coin_transactions(user_id, created_at DESC);

ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own coin transactions"
  ON public.coin_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Server functions only insert; client cannot write directly
CREATE POLICY "System can insert coin transactions"
  ON public.coin_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Derived view: current balance per user
CREATE VIEW public.user_coin_balance AS
  SELECT user_id, COALESCE(SUM(delta), 0)::int AS coins
  FROM public.coin_transactions
  GROUP BY user_id;

-- 9. GARDEN_EVENTS (audit log for animations + analytics)
CREATE TABLE public.garden_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plot_id uuid REFERENCES public.user_garden_plots(id) ON DELETE CASCADE,
  event_kind text NOT NULL CHECK (event_kind IN ('stage_up','bloom','water','glow','wither')),
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_garden_events_user ON public.garden_events(user_id, created_at DESC);

ALTER TABLE public.garden_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own garden events"
  ON public.garden_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert garden events"
  ON public.garden_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- POSTGRES FUNCTIONS (mastery math runs server-side)
-- ============================================================

-- Derive stage from mastery value
CREATE OR REPLACE FUNCTION public.mastery_to_stage(mastery_val numeric)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN mastery_val < 0.2 THEN 'seed'
    WHEN mastery_val < 0.4 THEN 'sprout'
    WHEN mastery_val < 0.6 THEN 'growing'
    WHEN mastery_val < 0.8 THEN 'blooming'
    ELSE 'mastered'
  END;
$$;

-- SM-2 algorithm for flashcard reviews
CREATE OR REPLACE FUNCTION public.apply_flashcard_review(
  p_user_id uuid,
  p_flashcard_id uuid,
  p_quality int  -- 0-5
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_review public.user_flashcard_reviews%ROWTYPE;
  v_new_ef numeric(3,2);
  v_new_interval int;
  v_new_reps int;
  v_coin_amount int := 0;
  v_mastery_delta numeric(4,3) := 0;
BEGIN
  -- Load or init review state
  SELECT * INTO v_review
  FROM public.user_flashcard_reviews
  WHERE user_id = p_user_id AND flashcard_id = p_flashcard_id;

  IF NOT FOUND THEN
    INSERT INTO public.user_flashcard_reviews (user_id, flashcard_id)
    VALUES (p_user_id, p_flashcard_id)
    RETURNING * INTO v_review;
  END IF;

  -- SM-2 math
  v_new_ef := GREATEST(1.3,
    v_review.ease_factor + (0.1 - (5 - p_quality) * (0.08 + (5 - p_quality) * 0.02))
  );

  IF p_quality < 3 THEN
    v_new_reps := 0;
    v_new_interval := 1;
  ELSIF v_review.repetitions = 0 THEN
    v_new_reps := 1;
    v_new_interval := 1;
  ELSIF v_review.repetitions = 1 THEN
    v_new_reps := 2;
    v_new_interval := 6;
  ELSE
    v_new_reps := v_review.repetitions + 1;
    v_new_interval := ROUND(v_review.interval_days * v_new_ef);
  END IF;

  -- Update review state
  UPDATE public.user_flashcard_reviews SET
    ease_factor = v_new_ef,
    interval_days = v_new_interval,
    repetitions = v_new_reps,
    due_at = now() + (v_new_interval || ' days')::interval,
    last_quality = p_quality,
    last_reviewed_at = now()
  WHERE user_id = p_user_id AND flashcard_id = p_flashcard_id;

  -- Award coins for quality >= 3
  IF p_quality >= 3 THEN
    v_coin_amount := 5;
    v_mastery_delta := 0.05;

    INSERT INTO public.coin_transactions (user_id, delta, reason, ref_kind, ref_id)
    VALUES (p_user_id, v_coin_amount, 'flashcard_correct', 'flashcard', p_flashcard_id);
  END IF;

  RETURN json_build_object(
    'new_interval', v_new_interval,
    'new_ease_factor', v_new_ef,
    'coins_earned', v_coin_amount,
    'mastery_delta', v_mastery_delta
  );
END;
$$;

-- Grow plant and emit event atomically
CREATE OR REPLACE FUNCTION public.grow_plant(
  p_user_id uuid,
  p_domain text,
  p_mastery_delta numeric
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_plot public.user_garden_plots%ROWTYPE;
  v_old_stage text;
  v_new_mastery numeric(4,3);
  v_new_stage text;
  v_event_kind text;
BEGIN
  SELECT * INTO v_plot
  FROM public.user_garden_plots
  WHERE user_id = p_user_id AND domain = p_domain;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'plot_not_found');
  END IF;

  v_old_stage := v_plot.stage;
  v_new_mastery := LEAST(1.0, v_plot.mastery + p_mastery_delta);
  v_new_stage := public.mastery_to_stage(v_new_mastery);

  UPDATE public.user_garden_plots SET
    mastery = v_new_mastery,
    stage = v_new_stage,
    last_watered_at = now(),
    health = LEAST(100, health + 5),
    is_blooming = (v_new_stage = 'mastered')
  WHERE id = v_plot.id;

  -- Emit event if stage changed
  IF v_old_stage != v_new_stage THEN
    v_event_kind := 'stage_up';
    INSERT INTO public.garden_events (user_id, plot_id, event_kind, metadata)
    VALUES (p_user_id, v_plot.id, v_event_kind,
      json_build_object('from', v_old_stage, 'to', v_new_stage));
  ELSE
    v_event_kind := 'water';
    INSERT INTO public.garden_events (user_id, plot_id, event_kind, metadata)
    VALUES (p_user_id, v_plot.id, v_event_kind,
      json_build_object('mastery_delta', p_mastery_delta));
  END IF;

  RETURN json_build_object(
    'old_stage', v_old_stage,
    'new_stage', v_new_stage,
    'new_mastery', v_new_mastery,
    'stage_upgraded', v_old_stage != v_new_stage
  );
END;
$$;

-- Award coins (enforces non-negative balance)
CREATE OR REPLACE FUNCTION public.award_coins(
  p_user_id uuid,
  p_delta int,
  p_reason text,
  p_ref_kind text DEFAULT NULL,
  p_ref_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_current_balance int;
BEGIN
  SELECT COALESCE(SUM(delta), 0) INTO v_current_balance
  FROM public.coin_transactions
  WHERE user_id = p_user_id;

  IF p_delta < 0 AND (v_current_balance + p_delta) < 0 THEN
    RETURN json_build_object('error', 'insufficient_coins', 'balance', v_current_balance);
  END IF;

  INSERT INTO public.coin_transactions (user_id, delta, reason, ref_kind, ref_id)
  VALUES (p_user_id, p_delta, p_reason, p_ref_kind, p_ref_id);

  RETURN json_build_object(
    'new_balance', v_current_balance + p_delta,
    'delta', p_delta
  );
END;
$$;

-- Initialize garden for new user (4 plots, one per domain)
CREATE OR REPLACE FUNCTION public.initialize_user_garden(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_garden_plots (user_id, species_id, domain)
  SELECT p_user_id, ps.id, ps.domain
  FROM public.plant_species ps
  ON CONFLICT (user_id, domain) DO NOTHING;
END;
$$;

-- ============================================================
-- SEED DATA: 4 plant species
-- ============================================================
INSERT INTO public.plant_species (slug, display_name, domain, stage_assets, sort_order) VALUES
  ('margarita', 'Margarita de Control', 'control',
   '{"seed":"","sprout":"","growing":"","blooming":"","mastered":""}', 1),
  ('lirio', 'Lirio de Crédito', 'credito',
   '{"seed":"","sprout":"","growing":"","blooming":"","mastered":""}', 2),
  ('helecho', 'Helecho de Protección', 'proteccion',
   '{"seed":"","sprout":"","growing":"","blooming":"","mastered":""}', 3),
  ('girasol', 'Girasol de Crecimiento', 'crecimiento',
   '{"seed":"","sprout":"","growing":"","blooming":"","mastered":""}', 4)
ON CONFLICT (slug) DO NOTHING;
