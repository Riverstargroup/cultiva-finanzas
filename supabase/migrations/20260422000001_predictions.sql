CREATE TABLE IF NOT EXISTS public.user_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  scenario_id text NOT NULL,
  predicted_value numeric NOT NULL,
  actual_value numeric,
  was_correct boolean GENERATED ALWAYS AS (
    actual_value IS NOT NULL AND
    ABS(predicted_value - actual_value) / NULLIF(actual_value, 0) <= 0.10
  ) STORED,
  coins_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_predictions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_predictions' AND policyname = 'users own predictions'
  ) THEN
    CREATE POLICY "users own predictions"
      ON public.user_predictions
      FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;
