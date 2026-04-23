-- Retos de Cosecha Expansion — 12 additional challenge templates
-- Covers ahorro, presupuesto, inversión, deuda across 4 skill domains
-- New challenges are appended; existing rows are skipped via ON CONFLICT DO NOTHING

INSERT INTO public.challenge_templates
  (title, description, target_domain, reward_coins, difficulty, target_mastery_delta, emoji, is_active)
VALUES

-- ─── AHORRO / PROTECCIÓN ──────────────────────────────────────────────────
(
  'Reto de los $50 diarios',
  'Aparta $50 pesos cada día durante 7 días seguidos. ¡Al final tendrás $350 de fondo!',
  'proteccion', 80, 1, 0.05, '🐷', true
),
(
  'Tanda digital',
  'Únete o crea una tanda con familiares o amigos esta semana. Anota los términos acordados.',
  'proteccion', 100, 1, 0.06, '🤝', true
),
(
  'Cuéntame tu colchón',
  'Calcula cuántos meses de gastos cubre tu fondo de emergencia actual. Anota el resultado.',
  'proteccion', 60, 1, 0.04, '🛋️', true
),

-- ─── PRESUPUESTO / CONTROL ────────────────────────────────────────────────
(
  'Diario de gastos express',
  'Registra cada gasto del día en una app o libreta durante 5 días seguidos.',
  'control', 90, 1, 0.05, '📓', true
),
(
  'Regla 50-30-20 en acción',
  'Arma tu presupuesto esta semana usando la regla: 50% necesidades, 30% deseos, 20% ahorro.',
  'control', 130, 2, 0.08, '🥧', true
),
(
  'Audit de suscripciones',
  'Lista todas tus suscripciones (streaming, apps, gym). Cancela al menos una que no uses.',
  'control', 110, 2, 0.07, '✂️', true
),
(
  'Semana sin delivery',
  'Evita pedir comida a domicilio o Rappi por 5 días. Cocina o come fuera caminando.',
  'control', 100, 1, 0.05, '🍳', true
),

-- ─── INVERSIÓN / CRECIMIENTO ──────────────────────────────────────────────
(
  'Explora CETES Directo',
  'Ingresa a cetesdirecto.com.mx y revisa las tasas actuales. Anota cuánto ganarías en 28 días.',
  'crecimiento', 90, 1, 0.05, '🏦', true
),
(
  'Simula tu primera inversión',
  'Usa una calculadora de interés compuesto y proyecta $500 a 1 año. Comparte el resultado.',
  'crecimiento', 110, 2, 0.07, '📈', true
),
(
  'Afore check-up',
  'Ingresa a Aforemóvil o PENSIONISSSTE y revisa tu saldo actual. Anota tu UMA y semanas cotizadas.',
  'crecimiento', 130, 2, 0.08, '🏛️', true
),

-- ─── DEUDA / CRÉDITO ──────────────────────────────────────────────────────
(
  'Conoce tu score',
  'Consulta tu reporte gratuito en burodecredito.com.mx o círculo de crédito. Anota tu puntaje.',
  'credito', 100, 1, 0.06, '📊', true
),
(
  'Método bola de nieve',
  'Lista todas tus deudas de menor a mayor. Paga más del mínimo a la más pequeña esta semana.',
  'credito', 150, 3, 0.10, '⛄', true
)

ON CONFLICT DO NOTHING;
