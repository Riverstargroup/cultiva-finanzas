-- ============================================================
-- DLV-70: Seed 20 flashcards con contenido financiero real
-- 5 por dominio: control | credito | proteccion | crecimiento
-- Preguntas formuladas para complementar los escenarios existentes
-- Números verificados México 2025
-- ============================================================

-- DOMINIO: control (5 flashcards)
-- skill_id: control_basics, budget_3_buckets, emergency_fund

INSERT INTO public.flashcards (skill_id, front, back, difficulty, is_published) VALUES

-- control_1: Fondo de emergencia — complementa escenario "Tu fondo de emergencia"
(
  'emergency_fund',
  '¿Cuánto deberías tener en tu fondo de emergencia y dónde guardarlo?',
  'Entre 3 y 6 meses de gastos básicos (para un egresado en CDMX: ~$24,000–$48,000). Guárdalo en una cuenta líquida separada de tus gastos diarios — no en inversiones, porque debes poder accederlo en 24 horas. CETES a 28 días o una cuenta de ahorro de alto rendimiento son buenas opciones.',
  1,
  true
),

-- control_2: Regla 50/30/20 — complementa escenario "El presupuesto 50/30/20"
(
  'budget_3_buckets',
  '¿Cómo aplicas la regla 50/30/20 con un sueldo de $14,000/mes?',
  '$7,000 (50%) → necesidades: renta, comida, transporte, servicios básicos. $4,200 (30%) → gustos: salidas, suscripciones, ropa. $2,800 (20%) → ahorro o deudas. Si tienes deuda con intereses altos (tarjeta al 52% CAT), ese 20% va primero a pagarla — es la "inversión" más rentable.',
  1,
  true
),

-- control_3: Ahorro automático — concepto de pagar primero a uno mismo
(
  'auto_saving',
  '¿Qué significa "págate primero a ti mismo" y cómo automatizarlo?',
  'Separar el ahorro el mismo día que recibes tu sueldo, antes de gastar nada. Configurar una transferencia automática a una cuenta de ahorro o CETES en la fecha de pago elimina la fricción y la tentación. Con $500/mes durante 12 meses a 10.1% en CETES = $6,284 — sin esfuerzo consciente.',
  2,
  true
),

-- control_4: Fugas de dinero — gastos invisibles
(
  'spending_leaks',
  'Nombre 3 tipos de "fugas de dinero" frecuentes en jóvenes mexicanos y cuánto pueden sumar al mes.',
  '1. Suscripciones olvidadas: Netflix, Spotify, apps = $200–$800/mes. 2. Comida por delivery vs cocinar: diferencia de $100–$200 por orden × 8 órdenes = $800–$1,600/mes extra. 3. Gastos de conveniencia: tienditas, uber vs transporte público = $300–$600/mes. Total posible: $1,300–$3,000/mes — suficiente para empezar un fondo de emergencia.',
  2,
  true
),

-- control_5: Control del mes — presupuesto básico
(
  'control_basics',
  '¿Cuál es la diferencia entre ingreso, gasto y flujo de caja? ¿Por qué importa?',
  'Ingreso: lo que entra (sueldo, freelance, etc.). Gasto: lo que sale (renta, comida, etc.). Flujo de caja = ingreso − gasto. Si es positivo, puedes ahorrar. Si es negativo, estás endeudándote sin saberlo. Muchas personas "sienten" que les alcanza pero tienen flujo negativo porque no lo miden — la app o la hoja más sencilla ya los pone en control.',
  1,
  true
),


-- DOMINIO: credito (5 flashcards)
-- skill_ids: min_payment_trap, credit_basics, rate_compare

-- credito_1: Trampa del pago mínimo — complementa escenario "Tarjeta de crédito"
(
  'min_payment_trap',
  'Tienes $8,000 en tarjeta al 52% CAT y pagas solo el mínimo de $400/mes. ¿Cuánto pagas en total?',
  'Con pago mínimo de $400 sobre $8,000 al 52% CAT: tardarías ~24 meses y pagarías ~$8,640 solo en intereses — más del doble de la deuda original. Costo total real: ~$16,640. Si en cambio pagás $2,000/mes desde el inicio, liquidas en 5 meses y pagas solo ~$850 en intereses. Diferencia: $7,790 ahorrados.',
  1,
  true
),

-- credito_2: CAT — qué es y para qué sirve
(
  'credit_basics',
  '¿Qué es el CAT y por qué es más útil que la tasa de interés para comparar créditos?',
  'CAT = Costo Anual Total. Incluye tasa de interés + comisiones + seguros obligatorios + otros cargos. La tasa nominal puede decir "24% anual" pero el CAT real puede ser 52% o más. En México, el CAT promedio de tarjetas de crédito es 52–54% (Banco de México, 2025). Siempre compara CAT, no solo la tasa anunciada.',
  1,
  true
),

-- credito_3: Tasas mensual vs anual
(
  'rate_compare',
  '¿Cómo conviertes "2% mensual" a tasa anual para comparar créditos?',
  'Aproximación simple: 2% × 12 = 24% anual. Fórmula exacta: (1 + 0.02)^12 − 1 = 26.8% anual efectivo. La diferencia importa para períodos largos. Regla práctica: si un crédito te dice "X% mensual", multiplica por 12 para comparar con tasas anuales. Un crédito al "4% mensual" = ~48% anual — evítalo.',
  2,
  true
),

-- credito_4: Historial crediticio — cómo construirlo
(
  'credit_score',
  '¿Cómo construye historial crediticio una persona que nunca ha tenido crédito en México?',
  '3 pasos accesibles: 1. Tarjeta de crédito garantizada (depósito como garantía, límite bajo $3,000–$5,000). 2. Usarla para 1–2 compras mensuales que puedas pagar COMPLETO al corte. 3. Nunca rebasar el 30% del límite (utilización baja = mejor score). En 6–12 meses de pagos puntuales ya tienes historial en Buró de Crédito. Lo más importante: puntualidad, no cantidad de tarjetas.',
  2,
  true
),

-- credito_5: Método avalancha vs snowball
(
  'snowball_avalanche',
  'Tienes 3 deudas: $3,000 al 45%, $8,000 al 22%, $15,000 al 12%. Con $2,000/mes extra, ¿cuál estrategia te ahorra más dinero: avalancha o snowball?',
  'Avalancha (mayor tasa primero): paga primero la de $3,000 al 45%, luego la de $8,000 al 22%, luego la de $15,000 al 12%. Ahorro en intereses: ~$4,200 vs snowball. Snowball (menor saldo primero) costaría ~$4,200 más en intereses pero puede darte motivación más rápida (cierras la primera deuda en 2 meses). Avalancha es matemáticamente mejor; snowball es psicológicamente mejor. Elige según tu personalidad.',
  3,
  true
),


-- DOMINIO: proteccion (5 flashcards)
-- skill_ids: fraud_basics, identity_protection

-- proteccion_1: Señales de fraude
(
  'fraud_basics',
  '¿Cuáles son las 3 señales más claras de fraude financiero en México?',
  '1. Urgencia artificial: "Actúa en las próximas 2 horas o pierdes tu dinero." 2. Rendimientos imposibles: "Gana 10% mensual garantizado" (= 120% anual, imposible de forma legítima). 3. Pago por adelantado: te piden dinero antes de darte algo. Ninguna institución legítima (banco, CNBV, SAT) te pide datos o dinero por mensaje de texto o llamada no solicitada.',
  1,
  true
),

-- proteccion_2: Clonación de tarjetas
(
  'fraud_basics',
  '¿Cómo funciona el skimming (clonación de tarjetas) y cómo protegerte?',
  'Skimming: dispositivo en cajero/terminal que copia los datos de tu tarjeta. Señales: cajero con piezas sueltas, teclado que "baila", lector que sobresale. Protección: cubre el teclado al ingresar NIP, usa cajeros dentro de bancos o en lugares visibles, revisa tu estado de cuenta semanalmente, activa notificaciones de cada movimiento en tu app. En México, reporta clonación al 800 de tu banco — tienen hasta 5 días hábiles para reintegrar el monto.',
  2,
  true
),

-- proteccion_3: Protección de identidad — datos personales
(
  'identity_protection',
  '¿Qué datos personales NUNCA debes compartir por ningún canal digital o telefónico?',
  'Nunca compartas: NIP, CVV/CVC de tarjeta, contraseña de banca en línea, token/código de un solo uso (OTP), CURP + datos bancarios juntos (combinación suficiente para fraude). Los bancos legítimos NUNCA te piden estos datos por teléfono, mensaje o correo. Si alguien los solicita, es fraude — cuelga y llama tú directamente al número en tu tarjeta.',
  1,
  true
),

-- proteccion_4: CONDUSEF — derechos del usuario financiero
(
  'identity_protection',
  '¿Qué es la CONDUSEF y cuándo acudir a ella?',
  'CONDUSEF = Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros. Acude cuando: un banco te cobra comisiones no autorizadas, te niegan información sobre tu contrato, sufres fraude y el banco no responde, o quieres verificar si una empresa financiera está regulada. Tel: 55 5340-0999. También puedes consultar el Buró de Entidades Financieras (buro.gob.mx) para ver quejas de tu banco.',
  2,
  true
),

-- proteccion_5: Contraseñas y seguridad digital
(
  'identity_protection',
  '¿Cuáles son las mejores prácticas para proteger tu banca en línea?',
  '1. Contraseña única y larga (15+ caracteres) — no la uses en ningún otro sitio. 2. Activa autenticación de dos factores (2FA) por app, no por SMS cuando sea posible. 3. Nunca accedas a banca en WiFi público; usa datos móviles. 4. Verifica que la URL comience con https:// y el nombre exacto del banco. 5. Activa límites de transferencia bajos para el día a día. Un gestor de contraseñas (Bitwarden, es gratis) facilita tener contraseñas fuertes únicas.',
  2,
  true
),


-- DOMINIO: crecimiento (5 flashcards)
-- skill_ids: inflation_basics, investing_basics

-- crecimiento_1: Inflación e impacto real — complementa escenario "Ahorro vs inversión"
(
  'inflation_basics',
  '¿Cuánto vale realmente $100,000 guardados en efectivo después de 5 años con inflación del 4.5% anual?',
  'Con inflación 4.5% anual, el poder de compra de $100,000 cae a ~$79,900 en 5 años (pérdida de ~$20,100). Para mantener el valor, necesitas al menos igualar la inflación. CETES a 28 días al 10.1% anual: $100,000 crecen a $162,100 en 5 años — ganancia real de ~$42,200 sobre inflación. Quedarte en efectivo o cuenta de débito es perder dinero garantizado.',
  1,
  true
),

-- crecimiento_2: CETES — cómo funcionan
(
  'investing_basics',
  '¿Cómo funciona invertir en CETES y cuánto necesitas para empezar?',
  'CETES (Certificados de la Tesorería) son deuda del gobierno mexicano. Los compras hoy a precio descontado y recibes el valor nominal al vencimiento (28, 91, 182 o 364 días). Ejemplo: compras CETES a 28 días, $10,000 al 10.1% anual = $10,027.50 al vencimiento (~$27.50 de ganancia). Mínimo: $100. Plataforma: cetesdirecto.com (sin intermediarios, sin comisiones). Riesgo: prácticamente nulo (respaldo del gobierno).',
  1,
  true
),

-- crecimiento_3: Interés compuesto — el octavo milagro
(
  'investing_basics',
  '¿Por qué el interés compuesto se llama "la octava maravilla del mundo" y cuándo empieza a importar de verdad?',
  'El interés compuesto reinvierte las ganancias, generando rendimientos sobre rendimientos. Ejemplo: $10,000 al 10% anual: Año 1 → $11,000. Año 5 → $16,105. Año 10 → $25,937. Año 20 → $67,275. La magia ocurre después del año 7-10. Por eso el consejo más poderoso en finanzas personales es: empezar hoy, aunque sea poco. $500/mes desde los 22 años vale mucho más que $1,500/mes desde los 35.',
  2,
  true
),

-- crecimiento_4: Diversificación — por qué no poner todos los huevos en una canasta
(
  'investing_basics',
  '¿Qué es diversificar inversiones y cómo hacerlo con poco dinero en México?',
  'Diversificar = distribuir el dinero en activos distintos para que la caída de uno no te destruya. Ejemplo básico para principiante con $15,000: $8,000 fondo de emergencia (cuenta líquida), $5,000 CETES 28 días (seguro, líquido), $2,000 fondo indexado (GBM+, BIVA) que sigue al mercado. No metas todo en un solo activo, empresa o "oportunidad". La diversificación es el único "almuerzo gratis" en finanzas.',
  3,
  true
),

-- crecimiento_5: Inflación vs inversión — tasa real de rendimiento
(
  'inflation_basics',
  '¿Cuál es la diferencia entre rendimiento nominal y rendimiento real, y cómo calcular el rendimiento real de CETES?',
  'Rendimiento nominal: lo que te paga la inversión (ej. CETES 10.1%). Rendimiento real = rendimiento nominal − inflación. Fórmula Fisher exacta: (1.101 / 1.045) − 1 = 5.36%. Con CETES al 10.1% e inflación 4.5%, tu dinero crece 5.36% en términos reales. Si tu cuenta bancaria paga 1% y la inflación es 4.5%, tu rendimiento real es −3.5%: pierdes 3.5% de poder adquisitivo cada año.',
  3,
  true
)

ON CONFLICT DO NOTHING;
