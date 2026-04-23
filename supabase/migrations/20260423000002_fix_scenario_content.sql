
-- ============================================================
-- SCENARIO CONTENT FIX — correcciones de precisión financiera
-- Problema: escenario "Tarjeta de crédito" citaba tasas de interés
-- de 30–40 % anual que están por debajo del CAT real de tarjetas
-- mexicanas. El mandato exige CAT ≥ 40 % para ser realista
-- con el mercado mexicano (fuente: CNBV / Banxico CAT promedio).
--
-- Cambios:
--   1. coaching: "30-40 % anual" → "40–70 % anual (CAT)"
--   2. recall q1: "30-60 % anual" → "50–90 % anual (CAT) en México"
--
-- Escenario afectado: 11111111-1111-1111-1111-111111111103
-- (Tarjeta de crédito: amiga o enemiga — Curso 1)
-- ============================================================

UPDATE public.scenarios
SET coaching = replace(
  coaching,
  'si la tarjeta cobra 30-40% anual de intereses',
  'si la tarjeta cobra 40–70 % anual (CAT) de intereses'
  /* fuente: CNBV comparativo de CAT — verificar semestralmente */
)
WHERE id = '11111111-1111-1111-1111-111111111103';

-- Fix recall question 1: realistic CAT range for Mexican credit cards
-- Old: "30-60% anual" / New: "50–90% CAT en México para bancos grandes"
UPDATE public.scenarios
SET recall = replace(
  recall::text,
  'Los intereses de tarjeta de crédito en Latinoamérica pueden ser del 30-60% anual.',
  'El CAT (Costo Anual Total) de tarjetas de crédito en México está típicamente entre 50–90 % en bancos grandes (fuente: CNBV). Incluye intereses + comisiones + seguros.'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111103';

-- Also fix scenario 3 option_c feedback: "30-40% anual" → "40-60%+ anual (CAT)"
UPDATE public.scenarios
SET options = replace(
  options::text,
  'si la tarjeta cobra 30-40% anual de intereses',
  'si la tarjeta cobra 40–60 %+ anual (CAT) de intereses'
  /* fuente: CNBV CAT promedio — verificar semestralmente */
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111103';

-- ============================================================
-- Verify: confirm the row was updated and has no "30-40%"
-- ============================================================
DO $$
DECLARE v_bad int;
BEGIN
  SELECT count(*) INTO v_bad
  FROM public.scenarios
  WHERE id = '11111111-1111-1111-1111-111111111103'
    AND (coaching LIKE '%30-40%' OR recall::text LIKE '%30-60%' OR options::text LIKE '%30-40%');
  ASSERT v_bad = 0,
    'Scenario 111103 still contains outdated interest rate figures';
END $$;
