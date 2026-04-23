-- Add domain column to flashcards so hooks can filter without a join
ALTER TABLE public.flashcards
  ADD COLUMN IF NOT EXISTS domain text
    CHECK (domain IN ('control','credito','proteccion','crecimiento'));

-- Populate domain from skills for existing rows
UPDATE public.flashcards fc
SET domain = s.domain
FROM public.skills s
WHERE fc.skill_id = s.id AND fc.domain IS NULL;

-- Make domain NOT NULL now that existing rows are filled
ALTER TABLE public.flashcards
  ALTER COLUMN domain SET NOT NULL;

-- Update existing index / add domain index
CREATE INDEX IF NOT EXISTS idx_flashcards_domain ON public.flashcards(domain);

-- ============================================================
-- SEED: 24 flashcards (6 per domain)
-- ============================================================

INSERT INTO public.flashcards (skill_id, domain, front, back, difficulty) VALUES

-- CONTROL (6 cards)
(
  'control_basics', 'control',
  '¿Qué es el flujo de caja personal?',
  'La diferencia entre ingresos y gastos en un período. Positivo = ahorro. Negativo = deuda. Conocerlo es el primer paso de control.',
  1
),
(
  'budget_3_buckets', 'control',
  '¿Qué propone la regla 50/30/20?',
  '50% a necesidades (renta, comida, transporte), 30% a deseos (ocio, ropa, salidas), 20% a ahorro y deuda. Ejemplo con $12,000/mes: $6,000 / $3,600 / $2,400.',
  2
),
(
  'spending_leaks', 'control',
  '¿Qué es un gasto hormiga?',
  'Pequeños gastos recurrentes que parecen insignificantes pero suman mucho. Ejemplo: café diario $50 × 22 días = $1,100/mes = $13,200/año.',
  1
),
(
  'emergency_fund', 'control',
  '¿Cuánto debe tener tu fondo de emergencia?',
  'Entre 3 y 6 meses de gastos básicos. Si tus gastos son $8,000/mes, tu meta es $24,000–$48,000. Guárdalo en cuenta de ahorro o CETES a la vista.',
  2
),
(
  'auto_saving', 'control',
  '¿Por qué el ahorro automático funciona mejor?',
  'Elimina la dependencia de fuerza de voluntad. Si el dinero se transfiere al ahorro antes de que lo veas, no puedes gastarlo. Paga primero al futuro tú.',
  2
),
(
  'control_basics', 'control',
  '¿Cuál es la diferencia entre necesidad y deseo?',
  'Necesidad: esencial para vivir (comida, techo, transporte al trabajo). Deseo: mejora tu vida pero no es indispensable (streaming, ropa de moda, restaurantes). Confundirlos es el error #1 de presupuesto.',
  1
),

-- CRÉDITO (6 cards)
(
  'credit_basics', 'credito',
  '¿Qué es el CAT (Costo Anual Total)?',
  'Incluye tasa de interés + comisiones + seguros. Promedio tarjetas de crédito en México: 52–54% CAT. Úsalo para comparar: una tarjeta al 25% CAT es mejor que otra al 60% aunque la segunda tenga más beneficios.',
  2
),
(
  'min_payment_trap', 'credito',
  '¿Qué pasa si solo pagas el mínimo en tu tarjeta?',
  'Con un saldo de $10,000 a 52% CAT pagando solo el mínimo, puedes tardar más de 5 años y pagar hasta $15,000 extra en intereses — 2.5 veces el valor original.',
  1
),
(
  'credit_score', 'credito',
  '¿Cómo se calcula el score de Buró de Crédito?',
  'Pago puntual (35% del peso), uso del crédito disponible (30%), antigüedad del historial (15%), diversidad de créditos (10%), consultas recientes (10%). Nunca rebasar el 30% de tu línea de crédito.',
  3
),
(
  'rate_compare', 'credito',
  '¿Qué es la tasa de interés mensual vs anual?',
  'Una tasa mensual del 4% parece pequeña pero equivale al 48% anual. Siempre pide la tasa anual o el CAT para comparar productos financieros realmente.',
  2
),
(
  'snowball_avalanche', 'credito',
  '¿Cuál es la diferencia entre método bola de nieve y avalancha?',
  'Bola de nieve: paga primero la deuda más pequeña (motivación psicológica). Avalancha: paga primero la de mayor tasa de interés (ahorra más dinero). La avalancha es matemáticamente superior; la bola de nieve es mejor si necesitas victorias rápidas.',
  3
),
(
  'debt_plan_30d', 'credito',
  '¿Qué es la regla del 36% de deuda?',
  'Tu pago mensual total de deudas (tarjetas, créditos, préstamos) no debe superar el 36% de tu ingreso mensual. Con $12,000/mes: máximo $4,320 en pagos de deuda.',
  2
),

-- PROTECCIÓN (6 cards)
(
  'fraud_basics', 'proteccion',
  '¿Cuáles son las 3 banderas rojas de fraude financiero?',
  '1. Promesas de rendimientos garantizados muy altos (>20% mensual). 2. Presión para decidir "ahora o nunca". 3. Solicitan acceso a tus cuentas o contraseñas. Si ves una, detente.',
  1
),
(
  'identity_protection', 'proteccion',
  '¿Qué debes hacer si sospechas robo de identidad en México?',
  '1. Reporta en CONDUSEF (800-999-8080). 2. Revisa tu historial en Buró de Crédito (1 consulta gratis/año). 3. Bloquea tus tarjetas con tu banco. 4. Cambia contraseñas y activa 2FA.',
  2
),
(
  'fraud_basics', 'proteccion',
  '¿Qué es el phishing y cómo evitarlo?',
  'Engaño por correo/SMS simulando ser tu banco para robarte datos. Regla: tu banco NUNCA pide contraseñas por mensaje. Siempre entra directo a la app oficial, nunca por links en mensajes.',
  1
),
(
  'identity_protection', 'proteccion',
  '¿Por qué es importante diversificar dónde guardas tu dinero?',
  'Si tienes todo en una sola institución y quiebra, el IPAB protege hasta 400,000 UDIS (~$3 millones MXN) por persona. Por encima de eso, puedes perder el excedente.',
  3
),
(
  'fraud_basics', 'proteccion',
  '¿Cómo proteger tus contraseñas financieras?',
  'Usa contraseñas únicas para cada cuenta bancaria. Activa autenticación de dos factores (2FA). No guardes contraseñas en notas de tu teléfono. Un gestor de contraseñas como Bitwarden es más seguro.',
  2
),
(
  'identity_protection', 'proteccion',
  '¿Qué cubre el IMSS vs un seguro de gastos médicos mayores?',
  'IMSS cubre solo si cotizas activamente (trabajo formal). Gastos médicos mayores cubre hospitalizaciones, cirugías, emergencias sin importar el empleo. Una cirugía compleja puede costar $500,000+ MXN — sin seguro puede borrar tus ahorros.',
  3
),

-- CRECIMIENTO (6 cards)
(
  'inflation_basics', 'crecimiento',
  '¿Qué es la inflación y cómo afecta tu dinero?',
  'La inflación es el aumento general de precios. Con inflación del 4.5% anual, $1,000 de hoy valen solo $956 en poder adquisitivo el próximo año. Si tu dinero no crece más que la inflación, pierdes poder de compra.',
  1
),
(
  'investing_basics', 'crecimiento',
  '¿Qué son los CETES y cómo invertir en ellos?',
  'Certificados de la Tesorería — deuda del gobierno mexicano. Desde $100 MXN. Tasa actual: ~10.1% anual, lo que supera la inflación actual (~4.5%). Disponibles en cetesdirecto.com.mx sin comisiones.',
  2
),
(
  'inflation_basics', 'crecimiento',
  '¿Qué es el interés compuesto?',
  'Ganar interés sobre los intereses ya ganados. $10,000 al 8% anual: año 1 = $10,800, año 10 = $21,589, año 20 = $46,610. Einstein lo llamó "el octavo milagro del mundo".',
  1
),
(
  'investing_basics', 'crecimiento',
  '¿Cuál es la diferencia entre ahorro e inversión?',
  'Ahorro: dinero guardado con bajo riesgo y baja ganancia (cuentas bancarias, CETES a corto plazo). Inversión: dinero puesto a trabajar con más riesgo y mayor potencial de ganancia (acciones, fondos, bienes raíces).',
  1
),
(
  'inflation_basics', 'crecimiento',
  '¿Cómo afectó la inflación a los precios en México 2020–2025?',
  'La inflación acumulada fue ~40%. Una despensa de $500 en 2020 cuesta ~$700 en 2025. El salario mínimo subió de $123 a $278/día (+126%), superando la inflación — pero solo si lo tienes.',
  2
),
(
  'investing_basics', 'crecimiento',
  '¿Qué es la diversificación de inversiones?',
  'Distribuir tu dinero en distintos activos para no depender de uno solo. "No pongas todos los huevos en una canasta". Mezclar CETES + acciones + fondo de emergencia reduce el riesgo sin sacrificar rendimiento a largo plazo.',
  2
)

ON CONFLICT DO NOTHING;
