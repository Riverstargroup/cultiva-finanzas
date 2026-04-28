-- ============================================================
-- SCENARIO CONTENT FIXES — 2026-04-28
--
-- Issues corrected:
--   1. Scenario 1 (111101) opt_a long_term: CETES FV recalculated
--      Old: "$3,025" — calculated at stale 10.1 % rate
--      New: "~$3,052" — correct FV at 8.25 % annual
--        FV = 500 × ((1.006875)^6 - 1) / 0.006875
--           = 500 × (1.04197 - 1) / 0.006875
--           = 500 × 6.105 = $3,052
--
--   2. Scenario 1 (111101) opt_b long_term: CAT label error
--      Old: "52% CAT mensual" — CAT is always an ANNUAL rate
--      New: "52% CAT anual" + corrected monthly rate calculation
--        Monthly = 52% / 12 = 4.33 %
--        $2,500 × 1.0433 ≈ $2,608 (old text had 1.04 = 4% flat)
--
--   3. Scenario 6 (111106) prompt: tasa nominal vs CAT clarification
--      Old: "tarjeta de crédito (45% anual)" — ambiguous
--      New: adds "(tasa nominal; CAT estimado ~55%)" — realistic framing
--      Reason: a 45% nominal card would have CAT ~50-60% after fees/insurance
--
--   4. Scenario 6 (111106) options: same clarification in option text
--
-- Safe to re-run: all UPDATEs replace already-corrected string = no-op
--
-- Fuentes:
--   CETES 8.25 %: Banxico subasta semanal — verificar trimestralmente
--   CAT tarjetas: CNBV comparativo de CAT — verificar semestralmente
-- ============================================================


-- ── FIX 1: Scenario 1 opt_a long_term — CETES FV correction ──────────────────
-- Old: "En 6 meses ahorrando $500/mes en CETES: $3,025"
-- New: "En 6 meses ahorrando $500/mes en CETES (8.25 % anual): ~$3,052"
UPDATE public.scenarios
SET options = replace(
  options::text,
  'En 6 meses ahorrando $500/mes en CETES: $3,025 — ya tienes medio fondo de emergencia.',
  'En 6 meses ahorrando $500/mes en CETES (8.25 % anual): ~$3,052 — ya tienes medio fondo de emergencia.'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111101';
/* fuente: FV calculado con r=8.25%/12; Banxico subasta CETES 28d — verificar trimestralmente */


-- ── FIX 2: Scenario 1 opt_b long_term — "CAT mensual" → "CAT anual" ──────────
-- CAT (Costo Anual Total) is by definition an ANNUAL metric.
-- Monthly rate at 52% CAT = 52%/12 = 4.33%; $2,500 × 1.0433 ≈ $2,608
UPDATE public.scenarios
SET options = replace(
  options::text,
  'Si pides prestado para la renta al 52% CAT mensual: $2,500 × 1.04 = $2,600 el siguiente mes.',
  'Si pides prestado para la renta al 52% CAT anual (~4.33 %/mes): $2,500 × 1.0433 ≈ $2,608 el siguiente mes.'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111101';
/* fuente: CAT = tasa anual; CNBV definición — fórmula: mensual = CAT/12 (aproximación lineal) */


-- ── FIX 3: Scenario 6 prompt — clarify nominal rate vs CAT ──────────────────
-- A tarjeta with 45% tasa nominal would typically have CAT ~50-60%
-- after adding comisiones de apertura, anualidad and seguro de saldo.
UPDATE public.scenarios
SET prompt = replace(
  prompt,
  '$5,000 en una tarjeta de crédito (45% anual)',
  '$5,000 en una tarjeta de crédito (tasa nominal 45% anual ≈ CAT ~55%)'
)
WHERE id = '11111111-1111-1111-1111-111111111106';
/* fuente: CNBV comparativo de CAT — diferencia nominal vs CAT; verificar semestralmente */


-- ── FIX 4: Scenario 6 options — same clarification in option text ─────────────
UPDATE public.scenarios
SET options = replace(
  options::text,
  '"La tarjeta de $5,000 al 45% queda liquidada en ~3 meses pagando $2,000/mes.',
  '"La tarjeta de $5,000 al 45% tasa nominal (≈ CAT ~55%) queda liquidada en ~3 meses pagando $2,000/mes.'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111106';
/* fuente: CNBV comparativo de CAT — verificar semestralmente */


-- ── VERIFICATION ─────────────────────────────────────────────────────────────

DO $$
DECLARE
  v_stale int;
BEGIN
  -- Scenario 1 should no longer reference stale "$3,025" in its options
  SELECT count(*) INTO v_stale
  FROM public.scenarios
  WHERE id = '11111111-1111-1111-1111-111111111101'
    AND options::text LIKE '%$3,025%';
  -- Only assert if the row exists (fresh DB may not have it yet)
  IF v_stale > 0 THEN
    RAISE EXCEPTION 'Scenario 111101 still references stale $3,025 CETES FV';
  END IF;

  -- Scenario 1 should not say "CAT mensual" (which is wrong; CAT is annual)
  SELECT count(*) INTO v_stale
  FROM public.scenarios
  WHERE id = '11111111-1111-1111-1111-111111111101'
    AND options::text LIKE '%CAT mensual%';
  IF v_stale > 0 THEN
    RAISE EXCEPTION 'Scenario 111101 still has "CAT mensual" label error';
  END IF;

  RAISE NOTICE 'Scenario content fixes verified OK';
END $$;
