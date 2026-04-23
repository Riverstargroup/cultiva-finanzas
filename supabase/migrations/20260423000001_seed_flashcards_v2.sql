
-- ============================================================
-- FLASHCARDS SEED v2 — 24 tarjetas auditadas
-- Dominios: Presupuesto, Ahorro, Crédito, Deuda, Inversión, Seguros
-- Fuentes: Banxico, INEGI INPC, CNBV, cetesdirecto.com,
--          burodecredito.com.mx, Ley de Ingresos de la Federación
--
-- Tasas de referencia (verificar trimestralmente):
--   CETES 28 días: ~8.25% anual  — fuente: Banxico subasta semanal
--   INPC (inflación): ~3.9% anual — fuente: INEGI (dato mensual)
--   CAT tarjetas grandes: 50–90%  — fuente: CNBV / Banxico CAT promedio
--
-- Safe to re-run: ON CONFLICT (id) DO UPDATE
-- ============================================================

INSERT INTO public.flashcards (id, skill_id, front, back, difficulty, is_published)
VALUES

-- ── PRESUPUESTO (4 tarjetas) ─────────────────────────────────────────────

(
  'fc000000-0000-0000-0000-000000000001',
  'budget_3_buckets',
  '¿Cómo divide tu ingreso mensual la regla 50/30/20?',
  '50 % necesidades (renta, comida, transporte) · 30 % deseos (ropa, salidas, streaming) · 20 % ahorro o pago de deudas. Con $10,000/mes: $5,000 · $3,000 · $2,000. Acción inmediata: abre 3 cuentas o sobres digitales en tu banco y etiquétalos hoy.',
  1,
  true
),

(
  'fc000000-0000-0000-0000-000000000002',
  'budget_3_buckets',
  'Ganas $12,000/mes. Según 50/30/20, ¿cuánto máximo puedes gastar en salidas y entretenimiento?',
  '$3,600 (30 % de $12,000). El 50 % ($6,000) cubre necesidades primero, y el 20 % ($2,400) va a ahorro o deudas — intocable. Si tus gustos superan $3,600, recorta deseos antes de reducir el ahorro.',
  2,
  true
),

(
  'fc000000-0000-0000-0000-000000000003',
  'spending_leaks',
  '¿Qué es un "gasto hormiga" y por qué es peligroso?',
  'Compra pequeña y frecuente que parece inofensiva: café de cadena ($80), snack ($35), suscripción olvidada ($120). Individualmente nada; sumados pueden llegar a $2,000–$3,000/mes. Acción: revisa tus suscripciones activas en la app de tu banco esta semana.',
  1,
  true
),

(
  'fc000000-0000-0000-0000-000000000004',
  'spending_leaks',
  '¿Cuál es la forma más efectiva de detectar fugas de dinero en tu presupuesto?',
  'Registrar CADA gasto durante 14 días, incluso los de $10. Apps (Fintonic, Mobills) o una libreta sirven igual. Lo que no mides no puedes reducir. Los peores "ladrones invisibles": cargos recurrentes no reconocidos y compras impulsivas sin categoría.',
  2,
  true
),

-- ── AHORRO (4 tarjetas) ──────────────────────────────────────────────────

(
  'fc000000-0000-0000-0000-000000000005',
  'emergency_fund',
  '¿Cuánto debe tener tu fondo de emergencia?',
  'Entre 3 y 6 meses de tus gastos básicos mensuales. Si gastas $8,000/mes en lo esencial, tu meta es $24,000–$48,000. Primer objetivo accionable: $5,000. Guárdalo en cuenta separada o CETES a 28 días — nunca mezclado con tus gastos del día a día.',
  1,
  true
),

(
  'fc000000-0000-0000-0000-000000000006',
  'emergency_fund',
  '¿Dónde es mejor guardar tu fondo de emergencia?',
  'En CETES a 28 días (cetesdirecto.com, mínimo $100) o cuenta de ahorro líquida — nunca en inversiones a plazo largo. Debe ser accesible en menos de 72 horas, pero en cuenta separada para no tentarte. Prioridad: liquidez. Segundo: rendimiento.',
  /* fuente: cetesdirecto.com; tasa CETES ~8.25 % anual — verificar trimestralmente */
  2,
  true
),

(
  'fc000000-0000-0000-0000-000000000007',
  'auto_saving',
  '¿Qué significa "págate primero" en finanzas personales?',
  'Transferir tu porcentaje de ahorro el mismo día que recibes tu quincena — ANTES de cualquier otro gasto. Configúralo como transferencia automática programada en tu app bancaria bajo "Transferencias Programadas". Tu yo del futuro lo hará por ti, sin depender de voluntad.',
  1,
  true
),

(
  'fc000000-0000-0000-0000-000000000008',
  'auto_saving',
  '¿Por qué el dinero parado en una cuenta sin rendimiento pierde poder de compra?',
  'Con inflación de ~3.9 % anual (INEGI INPC, verificar mensualmente), $10,000 hoy equivalen a ~$9,610 de poder de compra en un año sin invertir. CETES a 28 días rinden ~8.25 % anual (Banxico); superan la inflación y protegen tu dinero real.',
  /* fuente: INEGI INPC; Banxico subasta CETES — verificar trimestralmente */
  2,
  true
),

-- ── CRÉDITO (5 tarjetas) ─────────────────────────────────────────────────

(
  'fc000000-0000-0000-0000-000000000009',
  'credit_basics',
  '¿Qué es el CAT (Costo Anual Total) y por qué importa más que la tasa nominal?',
  'El costo real y completo del crédito: tasa de interés + comisiones + seguros obligatorios. Las tarjetas de crédito en México tienen CAT típico de 50–90 % en bancos grandes (fuente: CNBV / Banxico CAT promedio). Siempre pide el CAT antes de firmar — la "tasa mensual" oculta el costo real.',
  /* fuente: CNBV comparativo de CAT — verificar semestralmente */
  1,
  true
),

(
  'fc000000-0000-0000-0000-000000000010',
  'credit_score',
  '¿Qué factores determinan tu puntaje en el Buró de Crédito?',
  '~35 % historial de pagos puntuales · ~30 % porcentaje de crédito utilizado · ~15 % antigüedad del historial · ~20 % tipos de crédito y solicitudes nuevas. El mayor impacto: nunca caer en mora. Consulta tu historial gratis en burodecredito.com.mx (1 vez/año por ley).',
  1,
  true
),

(
  'fc000000-0000-0000-0000-000000000011',
  'credit_score',
  '¿Cómo consultar tu historial crediticio GRATIS en México sin afectar tu score?',
  'En burodecredito.com.mx o circulodecredito.com.mx tienes derecho a 1 reporte gratuito al año (LPDUSF, Art. 40). Consultarlo tú mismo (consulta suave) NO afecta tu score. Revísalo para detectar errores, cuentas abiertas sin tu conocimiento o deudas inexactas.',
  /* fuente: Ley para la Transparencia y Ordenamiento de los Servicios Financieros, Art. 40 */
  2,
  true
),

(
  'fc000000-0000-0000-0000-000000000012',
  'rate_compare',
  'Una tarjeta te cobra 3.5 % mensual. ¿Cuánto es eso en términos anuales?',
  'Aprox. 42 % anual nominal (3.5 % × 12 = 42 %). Pero el CAT puede ser 55–70 % al sumar comisiones y seguros. Regla: siempre pide el CAT — es la única cifra que incluye todo el costo real del crédito y permite comparar productos distintos.',
  2,
  true
),

(
  'fc000000-0000-0000-0000-000000000013',
  'min_payment_trap',
  'Con $10,000 de deuda en tarjeta al 60 % CAT, ¿qué pasa si solo pagas el mínimo (~$300/mes)?',
  'Interés mensual: ~$500 ($10,000 × 60 %/12). Con pago mínimo de $300, la deuda CRECE $200/mes en lugar de bajar. Nunca se liquida pagando solo el mínimo. Necesitas pagar más de $500/mes para empezar a reducir el capital. El mínimo es una salida de emergencia, no un plan.',
  /* fuente: simulador de pago mínimo Banxico — verificar CAT promedio semestralmente */
  3,
  true
),

-- ── DEUDA (4 tarjetas) ───────────────────────────────────────────────────

(
  'fc000000-0000-0000-0000-000000000014',
  'snowball_avalanche',
  '¿Qué es el método AVALANCHA para pagar deudas?',
  'Paga el mínimo en TODAS tus deudas y destina el dinero extra a la que tiene la TASA DE INTERÉS MÁS ALTA. Cuando la liquidas, ese pago extra cae sobre la siguiente más cara. Resultado: ahorras más dinero en intereses totales que cualquier otro método.',
  1,
  true
),

(
  'fc000000-0000-0000-0000-000000000015',
  'snowball_avalanche',
  '¿Qué es el método BOLA DE NIEVE para pagar deudas?',
  'Paga el mínimo en TODAS tus deudas y destina el dinero extra a la que tiene el SALDO MÁS PEQUEÑO. Al liquidarla, ese pago extra se acumula sobre la siguiente. Genera victorias rápidas y motivación; puede costar más intereses totales que el método avalancha, pero es más fácil sostener.',
  1,
  true
),

(
  'fc000000-0000-0000-0000-000000000016',
  'snowball_avalanche',
  'Deuda A: $5,000 al 60 % CAT. Deuda B: $20,000 al 20 % anual. ¿Cuál atacar primero con dinero extra?',
  'Deuda A — método avalancha. Interés mensual A: $250 ($5,000 × 60 %/12). Interés mensual B: $333 ($20,000 × 20 %/12). Por cada $1,000 extra enviado a la Deuda A te ahorras $50/mes en intereses; enviado a la Deuda B solo ahorras $17/mes. El porcentaje manda, no el saldo.',
  3,
  true
),

(
  'fc000000-0000-0000-0000-000000000017',
  'debt_plan_30d',
  '¿Cuáles son los 4 pasos mínimos para un plan de pago de deudas que puedes ejecutar este mes?',
  '1) Lista todas tus deudas: saldo, tasa y pago mínimo. 2) Elige estrategia: avalancha (menor costo) o bola de nieve (más motivación). 3) Automatiza los pagos mínimos para nunca caer en mora. 4) Destina un extra fijo (aunque sea $200) a la deuda prioritaria. Empieza hoy, no el mes que viene.',
  2,
  true
),

-- ── INVERSIÓN (4 tarjetas) ───────────────────────────────────────────────

(
  'fc000000-0000-0000-0000-000000000018',
  'inflation_basics',
  '¿Qué es la inflación y cómo daña el dinero ahorrado sin invertir?',
  'Aumento sostenido de precios medido por el INPC (INEGI). Con ~3.9 % anual de inflación, $100,000 parados valen ~$96,100 de poder de compra en un año. Tu dinero debe crecer al menos igual que la inflación para no perder valor real.',
  /* fuente: INEGI INPC — verificar mensualmente en inegi.org.mx */
  1,
  true
),

(
  'fc000000-0000-0000-0000-000000000019',
  'investing_basics',
  '¿Qué son los CETES y por qué son la primera inversión para un principiante?',
  'Certificados de la Tesorería de la Federación — deuda que le prestas al gobierno mexicano, respaldada por Hacienda. Prácticamente sin riesgo de impago. Tasa ~8.25 % anual a 28 días (verificar en Banxico semanalmente). Mínimo de inversión: $100. Plataforma: cetesdirecto.com.',
  /* fuente: Banxico subasta semanal CETES 28d — verificar trimestralmente */
  1,
  true
),

(
  'fc000000-0000-0000-0000-000000000020',
  'investing_basics',
  '¿Cuánto rinden $5,000 en CETES a 28 días después de un año completo?',
  'Rendimiento bruto: $5,000 × 8.25 % = $412. CETES retiene ISR automáticamente (~0.97 % anual del capital según Ley de Ingresos vigente = ~$49). Rendimiento neto estimado: ~$363/año. Total aprox.: $5,363 — muy superior a cuentas bancarias típicas (0.5–1 % anual).',
  /* fuente: cetesdirecto.com; Ley de Ingresos de la Federación (ISR retención) — verificar anualmente */
  2,
  true
),

(
  'fc000000-0000-0000-0000-000000000021',
  'investing_basics',
  '¿Cuál es la regla de oro ANTES de hacer tu primera inversión?',
  '1) Fondo de emergencia completo (mínimo 3 meses de gastos). 2) Sin deudas de alto costo activas (tarjetas con CAT >40 % — págalas primero, ninguna inversión segura rinde más que lo que te cobran). 3) No invertir dinero que necesites en los próximos 6 meses. 4) Entiende el instrumento antes de meterle dinero.',
  3,
  true
),

-- ── SEGUROS / PROTECCIÓN (3 tarjetas) ───────────────────────────────────

(
  'fc000000-0000-0000-0000-000000000022',
  'fraud_basics',
  '¿Qué cubre el seguro de Gastos Médicos Mayores (GMM) que el IMSS no garantiza?',
  'Hospitalización en clínicas privadas, médicos especialistas de tu elección, medicamentos de alto costo, traslados en ambulancia. El IMSS solo aplica si cotizas activamente y en hospitales IMSS con disponibilidad. El GMM protege de gastos catastróficos: un evento grave puede superar $500,000 sin seguro.',
  1,
  true
),

(
  'fc000000-0000-0000-0000-000000000023',
  'fraud_basics',
  '¿Cuáles son las 3 señales de alerta clásicas de fraude financiero?',
  '1) Rendimientos altos "garantizados" sin riesgo (ninguna inversión legítima garantiza más de 20 % sin riesgo real). 2) Urgencia artificial: "solo hoy", "últimos lugares", "oferta exclusiva". 3) Piden NIP, token, contraseña o número completo de tarjeta por teléfono, SMS o WhatsApp. Tu banco real NUNCA solicita esos datos.',
  2,
  true
),

(
  'fc000000-0000-0000-0000-000000000024',
  'identity_protection',
  '¿Qué datos bancarios NUNCA debes revelar, ni aunque quien llama diga ser tu banco?',
  'NIP de tarjeta · token digital · contraseña de banca en línea · número completo de tarjeta (16 dígitos) · CVV/CVC (3 dígitos al reverso). Regla absoluta: tu banco real NUNCA los pide por teléfono, SMS ni WhatsApp. Si alguien los solicita, cuelga y llama al número del reverso de tu tarjeta.',
  1,
  true
)

ON CONFLICT (id) DO UPDATE SET
  skill_id     = EXCLUDED.skill_id,
  front        = EXCLUDED.front,
  back         = EXCLUDED.back,
  difficulty   = EXCLUDED.difficulty,
  is_published = EXCLUDED.is_published;

-- Verify count
DO $$
DECLARE v_count int;
BEGIN
  SELECT count(*) INTO v_count FROM public.flashcards
  WHERE id LIKE 'fc000000-0000-0000-0000-%';
  ASSERT v_count = 24, 'Expected 24 flashcards, got ' || v_count;
END $$;
