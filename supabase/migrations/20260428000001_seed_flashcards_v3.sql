-- ============================================================
-- FLASHCARDS SEED v3 — 8 nuevas tarjetas auditadas
-- Dominios nuevos cubiertos: Retiro/AFORE, Seguros de vida,
--   Impuestos (ISR/SAT), Crédito hipotecario (Infonavit)
--
-- Fuentes:
--   AFORE patron 2026: Reforma 2020 a Ley del Seguro Social art. 168
--     — contribución patronal escalada ~8.635% SBC en 2026
--     — empleado: 1.125% SBC (fijo) — cuota social: variable
--   RESICO: Ley de ISR art. 113-E (vigente 2021+); ingreso max $3.5M/año
--     — tasa 1 % (hasta $25k/mes) a 2.5 % (hasta $291k/mes)
--   Infonavit patron: 5% SBC — Ley Federal del Trabajo art. 136
--   GMM primas: referencia editorial mercado mexicano 2025-2026
--   Rendimiento AFORE: CONSAR rendimiento neto histórico promedio ~7-9% nominal
--   ISR empleados: SAT tabla de retención (tarifa mensual DOF)
--
-- Figures to verify:
--   AFORE contribution % → quarterly (CONSAR website)
--   RESICO thresholds  → annually (SAT, enero)
--   Infonavit credit amount → annually (infonavit.org.mx)
--   GMM premiums → annually
--   ISR effective rates → annually (SAT tabla retención)
--
-- Safe to re-run: ON CONFLICT (id) DO UPDATE
-- ============================================================

-- ── 0. Add new skills needed for the new cards ───────────────────────────────
-- Skills are required FK for flashcards.skill_id
-- domain values must match CHECK constraint: control | credito | proteccion | crecimiento

INSERT INTO public.skills (id, domain, title, description, icon, sort_order) VALUES
  ('retirement_basics', 'crecimiento', 'Retiro y AFORE',
   'Entiende el SAR, AFORE y el poder del tiempo para tu jubilación',
   'clock', 16),
  ('insurance_life',    'proteccion',  'Seguros esenciales',
   'IMSS, GMM y seguro de vida — cuándo y por qué importan',
   'heart-pulse', 17),
  ('tax_basics',        'control',     'Obligaciones SAT',
   'ISR, RESICO y declaración anual para empleados y freelance',
   'file-text', 18),
  ('housing_credit',    'crecimiento', 'Crédito hipotecario',
   'Infonavit, subcuenta de vivienda y cómo funciona el crédito de casa',
   'home', 19)
ON CONFLICT (id) DO NOTHING;


-- ── 1. Insert 8 new flashcards ────────────────────────────────────────────────
-- domain column is NOT NULL (added in migration 20260423000004); must be explicit.

INSERT INTO public.flashcards
  (id, skill_id, domain, front, back, difficulty, is_published)
VALUES

-- ── RETIRO / AFORE (2 tarjetas) ──────────────────────────────────────────────

(
  'fc000000-0000-0000-0000-000000000025',
  'retirement_basics',
  'crecimiento',
  '¿Qué es el AFORE y qué pasa si nunca cotizas formalmente?',
  'Tu AFORE (Administradora de Fondos para el Retiro) acumula aportaciones para tu jubilación en el sector formal. En 2026, el patrón aporta ~8.6 % de tu salario base a la cuenta de retiro (cifra en aumento gradual hasta ~13.9 % en 2030, reforma 2020 LSS), tú aportas 1.125 % y el gobierno añade una cuota social. Sin cotización formal, esos recursos nunca se acumulan. Acción: revisa tu saldo en imss.gob.mx — es gratis y tarda 5 minutos.',
  /* fuente: Reforma Ley del Seguro Social 2020 art. 168; CONSAR — verificar trimestralmente */
  2,
  true
),

(
  'fc000000-0000-0000-0000-000000000026',
  'retirement_basics',
  'crecimiento',
  '¿Por qué $500/mes al AFORE a los 20 años puede valer más de $1.9 millones a los 65?',
  '$500/mes aportados voluntariamente al AFORE durante 45 años (20→65) a un rendimiento del 7 % anual crecen a ~$1.9 millones; al 8 % anual, a ~$2.6 millones — interés compuesto puro. El mismo monto iniciado a los 40 años (25 años) produce solo ~$450,000 al 8 %. El tiempo es el activo más valioso. Las aportaciones voluntarias a tu AFORE son deducibles de ISR (si declaras) y líquidas en ~2 meses.',
  /* fuente: FV = PMT × ((1+r)^n-1)/r; rendimiento histórico neto AFOREs grandes CONSAR ~7-9 % nominal */
  2,
  true
),

-- ── SEGUROS ESENCIALES (2 tarjetas) ──────────────────────────────────────────

(
  'fc000000-0000-0000-0000-000000000027',
  'insurance_life',
  'proteccion',
  '¿Cuánto puede costar una cirugía grave en hospital privado en México?',
  'Una cirugía cardiovascular: $400,000–$800,000 MXN. UCI por 10 días: $200,000–$500,000. Sin seguro, un solo evento de salud puede consumir décadas de ahorro. El Seguro de Gastos Médicos Mayores (GMM) cubre hospitalizaciones, especialistas, medicamentos de alto costo y urgencias. Prima anual estimada para un joven de 22 años: $6,000–$18,000/año según deducible y suma asegurada. El IMSS solo aplica si cotizas activamente y en hospital IMSS con disponibilidad.',
  /* fuente: referencia editorial mercado GMM México 2025-2026 — verificar anualmente */
  1,
  true
),

(
  'fc000000-0000-0000-0000-000000000028',
  'insurance_life',
  'proteccion',
  '¿Cuándo necesita un universitario un seguro de vida?',
  'Si tienes dependientes económicos (papás, hermanos menores, hijos) o deudas co-firmadas que otro tendría que cubrir si tú mueres. Sin dependientes ni deudas cofinanciadas: NO es urgente ahora. Pero conviene saber que la prima sube con la edad y las preexistencias. A los 22 años, coberturas básicas de $1–3 millones MXN pueden costar $300–$800/mes en seguros temporales a 20 años. El IMSS incluye seguro de vida básico solo mientras cotizas activamente.',
  /* fuente: referencia editorial mercado seguros de vida México 2025-2026 — verificar anualmente */
  2,
  true
),

-- ── IMPUESTOS / SAT (2 tarjetas) ─────────────────────────────────────────────

(
  'fc000000-0000-0000-0000-000000000029',
  'tax_basics',
  'control',
  '¿Qué es el ISR y cómo lo paga un empleado formal en México?',
  'ISR = Impuesto Sobre la Renta. Es progresivo: a mayor ingreso, mayor tasa. Si eres empleado, tu empresa lo retiene automáticamente en cada quincena — aparece en tu recibo como "ISR retenido". Con $10,000/mes la tasa efectiva aproximada es 8–12 %; con $20,000/mes, aprox. 15–20 %. Si solo tienes un empleo formal, no necesitas declarar. Si tienes más de una fuente de ingreso, debes presentar declaración anual antes del 30 de abril.',
  /* fuente: SAT tabla de retención mensual vigente — verificar anualmente (enero) en sat.gob.mx */
  1,
  true
),

(
  'fc000000-0000-0000-0000-000000000030',
  'tax_basics',
  'control',
  'Cobras por servicios independientes. ¿Qué es RESICO y cuánto pagas de ISR?',
  'RESICO (Régimen Simplificado de Confianza) aplica a personas físicas con ingresos anuales hasta $3.5 millones. Tasa ISR mensual: 1 % si ganas hasta $25,000/mes · 1.1 % hasta $50,000 · 1.5 % hasta $83,333 · 2 % hasta $208,333 · 2.5 % hasta $291,666. Sin contabilidad compleja. Para inscribirte: sat.gob.mx (gratis). Obligación: emitir CFDI (factura) por cada cobro. Acción: si cobras servicios y no tienes RFC, regístrate esta semana antes de acumular multas.',
  /* fuente: Ley de ISR art. 113-E; DOF 12-nov-2021 — verificar anualmente en sat.gob.mx */
  2,
  true
),

-- ── CRÉDITO HIPOTECARIO / INFONAVIT (1 tarjeta) ──────────────────────────────

(
  'fc000000-0000-0000-0000-000000000031',
  'housing_credit',
  'crecimiento',
  '¿Qué es el Infonavit y cómo funciona tu subcuenta de vivienda?',
  'Cuando trabajas en sector formal, tu patrón aporta el 5 % de tu salario mensualmente a tu subcuenta Infonavit (Ley Federal del Trabajo art. 136). Estos recursos se acumulan y generan puntos. Con ~1,080 puntos puedes solicitar un crédito para comprar casa. Con $15,000/mes de salario, el crédito Infonavit estimado puede ser $600,000–$1,200,000 MXN (varía por historial y plazo). Consulta tus puntos y saldo en app.infonavit.org.mx — gratuito.',
  /* fuente: Ley Federal del Trabajo art. 136 (5%); Infonavit criterios de precalificación — verificar anualmente */
  2,
  true
),

-- ── AHORRO CON OBJETIVO (1 tarjeta) ──────────────────────────────────────────

(
  'fc000000-0000-0000-0000-000000000032',
  'auto_saving',
  'control',
  '¿Qué diferencia un objetivo de ahorro que se cumple de uno que siempre se pospone?',
  'Un objetivo SMART: Específico ("$50,000 para laptop en 10 meses"), Medible ($5,000/mes), Alcanzable (según tu ingreso), Relevante (necesaria para tu trabajo), Tiempo definido (fecha exacta). "Ahorrar más" no funciona — no hay palanca. "$800 cada lunes a cuenta separada, etiquetada LaptopTEC, durante 10 semanas" sí. Pon una foto del objetivo en tu pantalla de inicio como recordatorio visual constante.',
  1,
  true
)

ON CONFLICT (id) DO UPDATE SET
  skill_id     = EXCLUDED.skill_id,
  domain       = EXCLUDED.domain,
  front        = EXCLUDED.front,
  back         = EXCLUDED.back,
  difficulty   = EXCLUDED.difficulty,
  is_published = EXCLUDED.is_published;


-- ── 2. Verification ───────────────────────────────────────────────────────────

DO $$
DECLARE
  v_count   int;
  v_missing int;
BEGIN
  -- Verify all 8 new cards exist
  SELECT count(*) INTO v_count
  FROM public.flashcards
  WHERE id IN (
    'fc000000-0000-0000-0000-000000000025',
    'fc000000-0000-0000-0000-000000000026',
    'fc000000-0000-0000-0000-000000000027',
    'fc000000-0000-0000-0000-000000000028',
    'fc000000-0000-0000-0000-000000000029',
    'fc000000-0000-0000-0000-000000000030',
    'fc000000-0000-0000-0000-000000000031',
    'fc000000-0000-0000-0000-000000000032'
  );
  ASSERT v_count = 8, 'Expected 8 new v3 flashcards, got ' || v_count;

  -- Total v2+v3 cards should be at least 32
  SELECT count(*) INTO v_count
  FROM public.flashcards
  WHERE id LIKE 'fc000000-0000-0000-0000-%'
    AND is_published = true;
  ASSERT v_count >= 32, 'Expected >= 32 published fc... flashcards, got ' || v_count;

  -- Verify domain is not null for new cards
  SELECT count(*) INTO v_missing
  FROM public.flashcards
  WHERE id LIKE 'fc000000-0000-0000-0000-0000000000%'
    AND domain IS NULL;
  ASSERT v_missing = 0, 'New flashcards with NULL domain: ' || v_missing;

  RAISE NOTICE 'v3 flashcard seed verified OK — % fc-series published cards', v_count;
END $$;
