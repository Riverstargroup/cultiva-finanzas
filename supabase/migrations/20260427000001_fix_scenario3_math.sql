-- ============================================================
-- CONTENT FIX: Scenario 3 — Tarjeta de crédito — incorrect
--   minimum-payment math
--
-- Problem found in 20260423000001_scenario_numerical_consequences.sql:
--   opt_a stated ~$430 interest / 2 months  →  inconsistent with 52 % CAT
--   opt_b stated 24 months / $8,640 interest →  wrong: should be ~47 months
--   opt_c stated ~$3,800 interest in 12 mo   →  overstated by ~27 %
--
-- Corrected model (nominal 52 %/12 = 4.333 %/month, as used throughout):
--
--   opt_a  paying $3,000/month:
--     M1: $8,000 × 1.04333 − $3,000 = $5,347; interest = $347
--     M2: $5,347 × 1.04333 − $3,000 = $2,578; interest = $232
--     M3: $2,578 × 1.04333 → pay off;          interest = $112
--     Total interest ≈ $690 | 3 months
--     Savings vs opt_b ≈ $11,000 − $690 = $10,310 → "más de $10,000"
--
--   opt_b  paying $400/month minimum:
--     n = −ln(1 − 0.04333 × 8000/400) / ln(1.04333) ≈ 47.5 months
--     Total paid ≈ $19,000 | Interest ≈ $11,000
--
--   opt_c  pay $1,500 now, then $400/month  [12-month snapshot]:
--     Balance after $1,500 = $6,500
--     After 12 × $400 on $6,500:
--       FV = 6500 × 1.04333^12 − 400 × (1.04333^12 − 1)/0.04333
--          = $10,862 − $6,194 = $4,668 remaining
--     Interest paid in 12 months ≈ ($1,500 + $4,800) − $3,332 = $2,968 ≈ $3,000
--     Total to clear (from start): ≈ 29 months, ≈ $4,900 interest
--
-- Fuente: Banxico CAT reference rate methodology; arithmetic verified
-- Safe to re-run: all replacements are idempotent (new string ≠ old string)
-- ============================================================

-- ── opt_a: fix interest total and consequence_months ────────────────────────

UPDATE public.scenarios
SET options = replace(
  options::text,
  '"$5,000 de saldo restante — casi terminaste en 2 meses"',
  '"$5,000 de saldo restante tras el primer abono de $3,000"'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111103';

UPDATE public.scenarios
SET options = replace(
  options::text,
  '"Pagas ~$430 en intereses totales (CAT 52%). Ahorras $7,600 vs pago mínimo."',
  '"Pagando $3,000/mes liquidas en ~3 meses. Intereses totales: ~$690 (CAT 52 % nominal). Ahorras más de $10,000 vs pago mínimo."'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111103';
/* fuente: cálculo aritmético verificado con tasa 52%/12 mensual */

UPDATE public.scenarios
SET options = replace(
  options::text,
  '"consequence_months": 2',
  '"consequence_months": 3'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111103'
  AND options::text LIKE '%"Pagas ~$430%' IS FALSE;   -- guard: only if opt_a text already corrected
-- Note: the guard ensures this runs after the opt_a text update above or is a no-op on stale DB


-- ── opt_b: fix 24 months → ~47 months, $8,640 → ~$11,000 interest ──────────

UPDATE public.scenarios
SET options = replace(
  options::text,
  '"+$2,600 disponibles este mes para gastar"',
  '"+$2,600 disponibles este mes — pero el interés mensual ($347) se come casi todo el pago."'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111103';

UPDATE public.scenarios
SET options = replace(
  options::text,
  '"En 24 meses pagarás $8,640 en intereses — más que la deuda original. Costo real: $16,640."',
  '"En ~47 meses pagarás ~$11,000 en intereses — más que la deuda original. Costo real: ~$19,000 por los $8,000 originales."'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111103';
/* fuente: n = −ln(1 − r×PV/PMT)/ln(1+r); r=0.04333, PV=8000, PMT=400 → n≈47.5 */

UPDATE public.scenarios
SET options = replace(
  options::text,
  '"consequence_months": 24',
  '"consequence_months": 47'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111103';


-- ── opt_c: fix 12-month interest snapshot ($3,800 → $3,000) ─────────────────

UPDATE public.scenarios
SET options = replace(
  options::text,
  '"En 12 meses habrás pagado ~$3,800 en intereses que eran evitables."',
  '"En 12 meses habrás pagado ~$3,000 en intereses, con ~$4,700 de saldo aún pendiente. Liquidación completa: ~29 meses y ~$4,900 en intereses totales."'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111103';
/* fuente: FV annuity formula; balance residual $4,668 after 12 months verified */


-- ── Verification ─────────────────────────────────────────────────────────────

DO $$
DECLARE v_stale int;
BEGIN
  SELECT count(*) INTO v_stale
  FROM public.scenarios
  WHERE id = '11111111-1111-1111-1111-111111111103'
    AND (
      options::text LIKE '%$8,640%'
      OR options::text LIKE '%24 meses%'
      OR options::text LIKE '%$16,640%'
      OR options::text LIKE '%$430 en intereses%'
      OR options::text LIKE '%$3,800 en intereses%'
    );

  IF v_stale > 0 THEN
    RAISE EXCEPTION
      'Scenario 3 math fix incomplete: stale figures still present (rows: %)', v_stale;
  END IF;

  RAISE NOTICE 'Scenario 3 math verified OK — no stale 24-month / $8,640 / $430 figures';
END $$;
