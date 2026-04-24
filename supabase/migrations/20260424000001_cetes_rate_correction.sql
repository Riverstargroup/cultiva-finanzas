-- ============================================================
-- CONTENT CORRECTION: CETES rate 10.1 % → 8.25 %, inflación 4.5 % → 3.9 %
-- Cumulative 2020–2025 inflation: ~40 % → ~32 % (INEGI INPC acumulado real)
--
-- Reason: Banxico rate-cut cycle reduced CETES 28d target from peak ~11.25 %
-- (Aug 2023) to ~8.25 % (Q1 2026). INEGI INPC annual reading stabilised at ~3.9 %.
--
-- Recalculations applied:
--   Scenario 2  — $2,400/mes × 12 meses @ 8.25%/12 = ~$29,900 (prev. $30,120)
--   Scenario 4  — $800/mes × 5 meses @ 8.25%/12   = ~$4,050  (prev. $4,000 — fine)
--   Scenario 5  — $7,000 × 8.25% = $7,578 (prev. $7,707); -$273 real loss @ 3.9%
--   Scenario 7  — $3,000 × 8.25%/12 = $21/mes (prev. $25); 12m = $3,248; 5a = ~$4,459
--   Flashcards  — three cards with stale 10.1 % / 4.5 % / ~40 % acumulado
--
-- Safe to re-run: all UPDATEs are idempotent (replace already-corrected string = no-op)
--
-- Fuentes:
--   CETES 28d:    Banxico subasta semanal — banxico.org.mx (verificar trimestralmente)
--   INPC anual:   INEGI — inegi.org.mx (verificar mensualmente)
--   INPC acum.:   INEGI INPC 2020-2024 publicados — verificar vs datos oficiales
-- ============================================================


-- ── SCENARIO 2 (111102): Presupuesto 50/30/20, ingreso $12,000/mes ─────────

-- opt_a long_term: annuity FV = 2400 × ((1+0.0825/12)^12 - 1)/(0.0825/12) ≈ 29,900
UPDATE public.scenarios
SET options = replace(
  options::text,
  'Ahorrando $2,400/mes en CETES (10.1%): en 12 meses tienes $30,120 — fondo de emergencia + inicio de inversión.',
  'Ahorrando $2,400/mes en CETES (8.25 % anual): en 12 meses tienes ~$29,900 — fondo de emergencia + inicio de inversión.'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111102';
/* fuente: Banxico subasta CETES 28d — verificar trimestralmente */

-- opt_c long_term: update cross-reference amount
UPDATE public.scenarios
SET options = replace(
  options::text,
  '0 ahorro acumulado vs $30,120 con la regla 50/30/20.',
  '$0 acumulado vs ~$29,900 con la regla 50/30/20.'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111102';


-- ── SCENARIO 4 (111104): Fondo de emergencia ────────────────────────────────

-- opt_a long_term: annuity FV = 800 × ((1+0.0825/12)^5 - 1)/(0.0825/12) ≈ 4,050
UPDATE public.scenarios
SET options = replace(
  options::text,
  'Con $800/mes ahorrados en CETES (10.1%), en 5 meses tienes $4,000 para el siguiente imprevisto.',
  'Con $800/mes ahorrados en CETES (8.25 % anual), en 5 meses tienes ~$4,050 para el siguiente imprevisto.'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111104';
/* fuente: Banxico subasta CETES 28d — verificar trimestralmente */


-- ── SCENARIO 5 (111105): Ahorro vs Inversión ────────────────────────────────

-- opt_a short_term: rate label update
UPDATE public.scenarios
SET options = replace(
  options::text,
  '$7,000 en CETES 28 días (10.1% anual).',
  '$7,000 en CETES 28 días (8.25 % anual).'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111105';

-- opt_a long_term: FV = 7000 × 1.0825 = 7,577.50 ≈ 7,578; real loss 7000 × 3.9% = 273
UPDATE public.scenarios
SET options = replace(
  options::text,
  'En 12 meses los $7,000 en CETES crecen a $7,707. Ganancia real: +$707 vs -$315 si los dejas en banco.',
  'En 12 meses los $7,000 en CETES crecen a ~$7,578 (+$578). En banco (0.5 % anual), la inflación del 3.9 % erosiona ~$273 de poder de compra real.'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111105';
/* fuente: Banxico CETES 28d 8.25%; INEGI INPC 3.9% — verificar trimestralmente */

-- opt_c long_term: inflation real-purchasing-power loss 4.5% → 3.9%; 14,325 → 14,415
UPDATE public.scenarios
SET options = replace(
  options::text,
  'En 12 meses con inflación 4.5%, tu poder de compra cae: tus $15,000 valen $14,325 en términos reales.',
  'En 12 meses con inflación ~3.9 % (INEGI INPC), tu poder de compra cae: tus $15,000 valen ~$14,415 en términos reales.'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111105';
/* fuente: INEGI INPC anual — verificar mensualmente en inegi.org.mx */


-- ── SCENARIO 7 (111107): Primera inversión ──────────────────────────────────

-- opt_a short_term: monthly yield = 3000 × 0.0825/12 = 20.63 ≈ 21
UPDATE public.scenarios
SET options = replace(
  options::text,
  '$3,000 en CETES 28 días al 10.1% anual = $25 en el primer mes.',
  '$3,000 en CETES 28 días al 8.25 % anual = ~$21 en el primer mes.'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111107';
/* fuente: Banxico subasta CETES 28d — verificar trimestralmente */

-- opt_a long_term:
--   12 meses: 3000 × 1.0825 = 3,247.50 → $3,248  (+$248)
--   5 años:   3000 × (1.0825)^5 = 3000 × 1.4864 = $4,459  (+$1,459)
--   Ganancia real (sobre inflación 3.9%):
--     real rate = (1.0825/1.039)^5 - 1 ≈ 22.8%; $3,000 × 22.8% ≈ $683
UPDATE public.scenarios
SET options = replace(
  options::text,
  'En 12 meses: $3,303 (+$303). En 5 años con reinversión: $4,888 (+$1,888 real sobre inflación 4.5%).',
  'En 12 meses: $3,248 (+$248). En 5 años con reinversión: ~$4,459 (+$1,459; ganancia real sobre inflación 3.9 %: ~$683).'
)::jsonb
WHERE id = '11111111-1111-1111-1111-111111111107';
/* fuente: Banxico CETES 28d 8.25%; INEGI INPC 3.9% — verificar trimestralmente */


-- ── FLASHCARDS: tarjetas con tasas desactualizadas (del seed 000004) ─────────

-- Card: "¿Qué son los CETES y cómo invertir en ellos?"
-- Old back: "~10.1% anual, lo que supera la inflación actual (~4.5%)"
-- New back: "~8.25 % anual (Banxico), supera inflación ~3.9 % (INEGI INPC)"
UPDATE public.flashcards
SET back = 'Certificados de la Tesorería — deuda del gobierno mexicano. Desde $100 MXN. Tasa actual: ~8.25 % anual (Banxico subasta semanal), superando la inflación actual (~3.9 % INPC, INEGI). Disponibles en cetesdirecto.com.mx sin comisiones.'
WHERE front = '¿Qué son los CETES y cómo invertir en ellos?'
  AND back LIKE '%10.1%';
/* fuente: Banxico subasta CETES 28d; INEGI INPC — verificar trimestralmente */

-- Card: "¿Qué es la inflación y cómo afecta tu dinero?"
-- Old back: "Con inflación del 4.5% anual, $1,000 de hoy valen solo $956"
-- Correction: 3.9% anual → $1,000 / 1.039 ≈ $962 real purchasing power
UPDATE public.flashcards
SET back = 'La inflación es el aumento general de precios. Con inflación de ~3.9 % anual (INEGI INPC), $1,000 de hoy valen solo ~$962 en poder adquisitivo el próximo año. Si tu dinero no crece más que la inflación, pierdes poder de compra.'
WHERE front = '¿Qué es la inflación y cómo afecta tu dinero?'
  AND back LIKE '%4.5%';
/* fuente: INEGI INPC anual — verificar mensualmente */

-- Card: "¿Cómo afectó la inflación a los precios en México 2020–2025?"
-- Old back: "La inflación acumulada fue ~40%. Una despensa de $500 en 2020 cuesta ~$700 en 2025."
-- Correction: INEGI INPC acumulado 2020-2024 ≈ 31-32%; $500 × 1.32 ≈ $660
-- (INPC 2020: 3.15%, 2021: 7.36%, 2022: 7.82%, 2023: 4.66%, 2024: ~4.7% → acum. ~31.7%)
UPDATE public.flashcards
SET back = 'La inflación acumulada 2020–2025 fue ~32 % (INEGI INPC). Una despensa de $500 en 2020 cuesta ~$660 en 2025. El salario mínimo subió de $123 a $278/día (+126 %), superando con creces a la inflación — pero solo si lo tienes.'
WHERE front = '¿Cómo afectó la inflación a los precios en México 2020–2025?'
  AND back LIKE '%acumulada fue ~40%';
/* fuente: INEGI INPC acumulado publicado; CONASAMI decretos 2020-2025 */


-- ── VERIFICATION ─────────────────────────────────────────────────────────────

DO $$
DECLARE
  v_stale_scenarios int;
  v_stale_flashcard int;
BEGIN
  -- Scenarios should no longer reference the old 10.1% rate
  SELECT count(*) INTO v_stale_scenarios
  FROM public.scenarios
  WHERE id IN (
    '11111111-1111-1111-1111-111111111102',
    '11111111-1111-1111-1111-111111111104',
    '11111111-1111-1111-1111-111111111105',
    '11111111-1111-1111-1111-111111111107'
  )
  AND options::text LIKE '%10.1%%';

  -- Flashcard CETES card should reference 8.25% not 10.1%
  SELECT count(*) INTO v_stale_flashcard
  FROM public.flashcards
  WHERE front = '¿Qué son los CETES y cómo invertir en ellos?'
    AND back LIKE '%10.1%';

  -- Only assert if rows actually exist (fresh DB may have no scenarios yet)
  IF v_stale_scenarios > 0 THEN
    RAISE EXCEPTION 'Correction failed: % scenario(s) still reference 10.1%% CETES rate',
      v_stale_scenarios;
  END IF;

  IF v_stale_flashcard > 0 THEN
    RAISE EXCEPTION 'Correction failed: CETES flashcard still references 10.1%% rate';
  END IF;

  RAISE NOTICE 'Rate correction verified OK — no stale 10.1%% references in corrected rows';
END $$;
