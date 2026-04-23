-- ============================================================
-- Mi Jardín — Backyard economy, shop, special powers
-- Extends 20260422000000_garden_gamification.sql
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. PLANT_SHOP_ITEMS — catalog of purchasable plants & decor
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plant_shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  price int NOT NULL CHECK (price >= 0),
  species text NOT NULL,
  emoji text NOT NULL,
  special_power text CHECK (special_power IN ('fire','gold','ice') OR special_power IS NULL),
  power_description text,
  is_cosmetic boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.plant_shop_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read shop items"
  ON public.plant_shop_items FOR SELECT
  TO authenticated
  USING (is_available = true);

-- ────────────────────────────────────────────────────────────
-- 2. USER_PLANT_INVENTORY — purchased items (placed or not)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_plant_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_item_id uuid NOT NULL REFERENCES public.plant_shop_items(id),
  purchased_at timestamptz DEFAULT now(),
  is_placed boolean NOT NULL DEFAULT false,
  pos_x numeric(5,4),
  pos_y numeric(5,4),
  placed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_inventory_user ON public.user_plant_inventory(user_id);

ALTER TABLE public.user_plant_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own inventory"
  ON public.user_plant_inventory FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own inventory"
  ON public.user_plant_inventory FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- INSERT is done only via RPC buy_shop_item (SECURITY DEFINER) — no client INSERT policy

-- ────────────────────────────────────────────────────────────
-- 3. USER_GARDEN_ECONOMY — per-user rent + power timers
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_garden_economy (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  rent_due_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  rent_amount int NOT NULL DEFAULT 10,
  fire_plant_active_until timestamptz,
  gold_plant_active_until timestamptz,
  ice_plant_active_until timestamptz,
  last_passive_coins_at timestamptz,
  last_rent_collected_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_garden_economy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own economy"
  ON public.user_garden_economy FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_garden_economy_updated_at
  BEFORE UPDATE ON public.user_garden_economy
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ────────────────────────────────────────────────────────────
-- 4. Extend user_garden_plots with power slots
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.user_garden_plots
  ADD COLUMN IF NOT EXISTS special_power text CHECK (special_power IN ('fire','gold','ice') OR special_power IS NULL),
  ADD COLUMN IF NOT EXISTS power_active_until timestamptz;

-- ────────────────────────────────────────────────────────────
-- RPC: ensure_garden_economy — idempotent bootstrap
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.ensure_garden_economy(p_user_id uuid)
RETURNS public.user_garden_economy
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_row public.user_garden_economy%ROWTYPE;
BEGIN
  INSERT INTO public.user_garden_economy (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
  SELECT * INTO v_row FROM public.user_garden_economy WHERE user_id = p_user_id;
  RETURN v_row;
END;
$$;

-- ────────────────────────────────────────────────────────────
-- RPC: buy_shop_item — atomic: debit coins + insert inventory
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.buy_shop_item(
  p_user_id uuid,
  p_shop_item_id uuid
)
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_item public.plant_shop_items%ROWTYPE;
  v_balance int;
  v_inventory_id uuid;
BEGIN
  -- Caller must be the same user
  IF auth.uid() != p_user_id THEN
    RETURN json_build_object('error', 'unauthorized');
  END IF;

  SELECT * INTO v_item FROM public.plant_shop_items
    WHERE id = p_shop_item_id AND is_available = true;
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'item_not_found');
  END IF;

  SELECT COALESCE(SUM(delta), 0) INTO v_balance
    FROM public.coin_transactions WHERE user_id = p_user_id;

  IF v_balance < v_item.price THEN
    RETURN json_build_object('error', 'insufficient_coins', 'balance', v_balance);
  END IF;

  -- Debit via ledger
  INSERT INTO public.coin_transactions (user_id, delta, reason, ref_kind, ref_id)
    VALUES (p_user_id, -v_item.price, 'shop_purchase', 'shop_item', p_shop_item_id);

  -- Grant inventory item
  INSERT INTO public.user_plant_inventory (user_id, shop_item_id)
    VALUES (p_user_id, p_shop_item_id)
    RETURNING id INTO v_inventory_id;

  RETURN json_build_object(
    'inventory_id', v_inventory_id,
    'new_balance', v_balance - v_item.price
  );
END;
$$;

-- ────────────────────────────────────────────────────────────
-- RPC: place_inventory_item — mark placed + set coordinates
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.place_inventory_item(
  p_user_id uuid,
  p_inventory_id uuid,
  p_pos_x numeric,
  p_pos_y numeric
)
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF auth.uid() != p_user_id THEN
    RETURN json_build_object('error', 'unauthorized');
  END IF;

  UPDATE public.user_plant_inventory
    SET is_placed = true,
        pos_x = p_pos_x,
        pos_y = p_pos_y,
        placed_at = now()
    WHERE id = p_inventory_id
      AND user_id = p_user_id
      AND is_placed = false;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'not_found_or_already_placed');
  END IF;

  RETURN json_build_object('ok', true);
END;
$$;

-- ────────────────────────────────────────────────────────────
-- RPC: activate_special_power — sets active-until; fire/ice consumed on use
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.activate_special_power(
  p_user_id uuid,
  p_inventory_id uuid
)
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_power text;
  v_expiry timestamptz := now() + interval '24 hours';
BEGIN
  IF auth.uid() != p_user_id THEN
    RETURN json_build_object('error', 'unauthorized');
  END IF;

  SELECT psi.special_power INTO v_power
    FROM public.user_plant_inventory upi
    JOIN public.plant_shop_items psi ON psi.id = upi.shop_item_id
    WHERE upi.id = p_inventory_id AND upi.user_id = p_user_id;

  IF v_power IS NULL THEN
    RETURN json_build_object('error', 'no_power_on_item');
  END IF;

  PERFORM public.ensure_garden_economy(p_user_id);

  IF v_power = 'fire' THEN
    UPDATE public.user_garden_economy
      SET fire_plant_active_until = v_expiry WHERE user_id = p_user_id;
  ELSIF v_power = 'gold' THEN
    UPDATE public.user_garden_economy
      SET gold_plant_active_until = v_expiry WHERE user_id = p_user_id;
  ELSIF v_power = 'ice' THEN
    UPDATE public.user_garden_economy
      SET ice_plant_active_until = v_expiry WHERE user_id = p_user_id;
  END IF;

  -- Fire and ice are single-use: consume the inventory item
  IF v_power IN ('fire', 'ice') THEN
    DELETE FROM public.user_plant_inventory WHERE id = p_inventory_id;
  END IF;

  RETURN json_build_object('power', v_power, 'active_until', v_expiry);
END;
$$;

-- ────────────────────────────────────────────────────────────
-- RPC: tick_garden_economy — deducts overdue rent, credits gold yield
-- Idempotent via timestamp cursors. Call once per garden view open.
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.tick_garden_economy(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_econ public.user_garden_economy%ROWTYPE;
  v_rent_delta int := 0;
  v_gold_delta int := 0;
  v_now timestamptz := now();
  v_ice_on boolean;
  v_gold_on boolean;
  v_balance int;
BEGIN
  IF auth.uid() != p_user_id THEN
    RETURN json_build_object('error', 'unauthorized');
  END IF;

  v_econ := public.ensure_garden_economy(p_user_id);

  v_ice_on  := v_econ.ice_plant_active_until  IS NOT NULL AND v_econ.ice_plant_active_until  > v_now;
  v_gold_on := v_econ.gold_plant_active_until IS NOT NULL AND v_econ.gold_plant_active_until > v_now;

  -- RENT: deduct for each overdue 24h cycle (skipped if ice active)
  IF NOT v_ice_on AND v_econ.rent_due_at <= v_now THEN
    SELECT COALESCE(SUM(delta), 0) INTO v_balance
      FROM public.coin_transactions WHERE user_id = p_user_id;

    -- Deduct what we can (floor at 0)
    v_rent_delta := -LEAST(v_econ.rent_amount, v_balance);

    IF v_rent_delta < 0 THEN
      INSERT INTO public.coin_transactions (user_id, delta, reason)
        VALUES (p_user_id, v_rent_delta, 'garden_rent');
    END IF;

    UPDATE public.user_garden_economy
      SET rent_due_at = v_now + interval '24 hours',
          last_rent_collected_at = v_now
      WHERE user_id = p_user_id;
  END IF;

  -- GOLD PLANT: +10 coins/day while active, not yet collected today
  IF v_gold_on AND (
    v_econ.last_passive_coins_at IS NULL OR
    v_econ.last_passive_coins_at < v_now - interval '24 hours'
  ) THEN
    v_gold_delta := 10;
    INSERT INTO public.coin_transactions (user_id, delta, reason)
      VALUES (p_user_id, v_gold_delta, 'gold_plant_passive');
    UPDATE public.user_garden_economy
      SET last_passive_coins_at = v_now
      WHERE user_id = p_user_id;
  END IF;

  RETURN json_build_object('rent_delta', v_rent_delta, 'gold_delta', v_gold_delta);
END;
$$;

-- ────────────────────────────────────────────────────────────
-- SEED DATA: shop items catalog
-- ────────────────────────────────────────────────────────────
INSERT INTO public.plant_shop_items
  (slug, name, description, price, species, emoji, special_power, power_description, is_cosmetic, sort_order)
VALUES
  ('plant_fire',    'Flor Escudo',    'Protege tu racha si te ausentas un día.',      500,  'fire_plant',  '🔥', 'fire', 'Activa: tu racha no se rompe por 1 día ausente.',  false, 10),
  ('plant_gold',    'Árbol Dorado',   'Genera 10 monedas al día mientras está activo.',1500,'gold_plant',  '🥇', 'gold', 'Activa: +10 monedas al día por 24h.',               false, 20),
  ('plant_ice',     'Flor de Hielo',  'Congela la renta del jardín por 1 día.',       800,  'ice_plant',   '🧊', 'ice',  'Activa: no pagas renta por 24h.',                   false, 30),
  ('decor_lantern', 'Farolillo',      'Decoración nocturna cálida.',                  120,  'lantern',     '🏮', NULL,   NULL,                                                 true,  100),
  ('decor_bench',   'Banca de madera','Un lugar para descansar en el jardín.',        200,  'bench',       '🪑', NULL,   NULL,                                                 true,  110),
  ('decor_fountain','Fuente',         'Calma y frescura para tu espacio verde.',      450,  'fountain',    '⛲', NULL,   NULL,                                                 true,  120)
ON CONFLICT (slug) DO NOTHING;
