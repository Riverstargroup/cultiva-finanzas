-- user_predictions: stores pre-scenario predictions and compares with outcome
CREATE TABLE IF NOT EXISTS user_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  scenario_id text NOT NULL,
  predicted_value numeric(5,2) NOT NULL CHECK (predicted_value >= 0 AND predicted_value <= 100),
  actual_value numeric(5,2),
  was_correct boolean,
  coins_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users own predictions"
  ON user_predictions FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_predictions_user_scenario
  ON user_predictions(user_id, scenario_id);
