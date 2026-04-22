CREATE TABLE IF NOT EXISTS public.user_pollination_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  cards_reviewed integer NOT NULL DEFAULT 0,
  domains_touched text[] NOT NULL DEFAULT '{}',
  coins_earned integer NOT NULL DEFAULT 0
);

ALTER TABLE public.user_pollination_sessions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_pollination_sessions' AND policyname = 'users own pollination sessions'
  ) THEN
    CREATE POLICY "users own pollination sessions"
      ON public.user_pollination_sessions FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;
