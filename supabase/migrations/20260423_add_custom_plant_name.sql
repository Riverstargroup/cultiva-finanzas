-- Sprint 1 "Plants Alive": let users give their plants a personal name.
-- Length-capped (≤ 20 chars) to match UI constraints in NameYourPlant.
ALTER TABLE user_garden_plots
  ADD COLUMN IF NOT EXISTS custom_name TEXT CHECK (char_length(custom_name) <= 20);
