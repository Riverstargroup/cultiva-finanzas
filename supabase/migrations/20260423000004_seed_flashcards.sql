-- Seed 25 flashcards across skill domains with real Mexican financial data

INSERT INTO flashcards (id, skill_id, front, back, difficulty, is_published) VALUES

-- CONTROL (presupuesto, ahorro, emergencia)
(gen_random_uuid(), 'control_basics',    '¿Qué es la regla 50/30/20?',                    '50% para necesidades (renta, comida, transporte), 30% para deseos, 20% para ahorro o pago de deudas. Con $12,000/mes: $6,000 necesidades, $3,600 gustos, $2,400 ahorro.', 1, true),
(gen_random_uuid(), 'budget_3_buckets',  '¿Qué son las "3 cubetas" del presupuesto?',     'Necesidades (fijas), Deseos (variables), Ahorro/Deuda. El truco: automatiza el depósito a ahorro el mismo día que recibes tu sueldo.', 1, true),
(gen_random_uuid(), 'spending_leaks',    '¿Qué es un gasto hormiga?',                     'Pequeños gastos recurrentes que parecen insignificantes pero suman mucho. Ej: café diario $40 × 22 días = $880/mes = $10,560/año.', 1, true),
(gen_random_uuid(), 'emergency_fund',    '¿Cuánto debe tener tu fondo de emergencia?',    '3 a 6 meses de gastos básicos. Si gastas $8,000/mes en lo esencial, tu meta es $24,000–$48,000. Mantenlo en cuenta separada con rendimiento (CETES/fondos líquidos).', 2, true),
(gen_random_uuid(), 'emergency_fund',    '¿Dónde guardar el fondo de emergencia?',        'En instrumento líquido y seguro: cuenta de ahorro con rendimiento, CETES a 28 días, o fondos de deuda a corto plazo. NO en inversiones volátiles ni con penalización por retiro anticipado.', 2, true),
(gen_random_uuid(), 'auto_saving',       '¿Por qué se recomienda el ahorro automático?', 'Elimina la decisión de ahorrar. El dinero que no ves no lo gastas. Configura transferencia automática el día de quincena a cuenta de ahorro separada. Empieza con 5%, aumenta cada 3 meses.', 1, true),
(gen_random_uuid(), 'control_basics',    '¿Qué es el flujo de efectivo personal?',        'Ingresos menos gastos del mes. Positivo = generas ahorro. Negativo = te endeudas. Regístralo 30 días para saber tu punto de partida real.', 2, true),

-- CRÉDITO
(gen_random_uuid(), 'credit_basics',     '¿Qué es el CAT (Costo Anual Total)?',           'Indicador que incluye tasa de interés + comisiones + seguros. Es el costo real de un crédito. Tarjetas en México: CAT promedio 52–54%. Crédito hipotecario: 10–14%.', 2, true),
(gen_random_uuid(), 'credit_basics',     '¿Cuál es la diferencia entre tasa nominal y CAT?', 'Tasa nominal: solo el interés. CAT: interés + todas las comisiones. Una tarjeta con tasa 30% anual puede tener CAT 52% al sumar anualidad, seguros y comisiones por retraso.', 2, true),
(gen_random_uuid(), 'credit_score',      '¿Qué factores afectan tu Buró de Crédito?',    '1. Puntualidad en pagos (factor más importante). 2. Nivel de uso del crédito (ideal <30% del límite). 3. Antigüedad del historial. 4. Número de créditos activos. 5. Solicitudes recientes.', 2, true),
(gen_random_uuid(), 'min_payment_trap',  '¿Qué pasa si solo pagas el mínimo de tu tarjeta?', 'Con $10,000 de deuda al CAT 52%, pagando solo el mínimo (~4%) tardas 4–5 años en liquidar y pagas ~$12,000 adicionales en intereses — pagando 2.2x el precio original.', 3, true),
(gen_random_uuid(), 'min_payment_trap',  '¿Cuánto te cuesta usar el crédito revolving?',  'Ejemplo real: compras $3,000, pagas mínimo 8 meses → gastas $4,200 total. La deuda "viva" al CAT 52% crece $130 cada mes que no pagas el total.', 3, true),
(gen_random_uuid(), 'rate_compare',      '¿Cómo convertir tasa mensual a anual?',         'Tasa anual ≈ tasa mensual × 12 (aproximación simple). Exacto: (1 + tasa_mensual)^12 - 1. Ejemplo: 3.5% mensual = 42% anual simple = 51% anual compuesto.', 3, true),
(gen_random_uuid(), 'snowball_avalanche', '¿Cómo funciona el método avalancha para deudas?', 'Paga el mínimo en todas las deudas, y el dinero extra a la de MAYOR tasa. Cuando la liquidas, ese dinero va a la siguiente. Es el método que ahorra más dinero en intereses totales.', 2, true),
(gen_random_uuid(), 'snowball_avalanche', '¿Qué es el método bola de nieve?',              'Paga el mínimo en todas y el extra a la MENOR deuda primero. Liquidas más rápido, ganas motivación psicológica. Puede costar más en intereses que avalancha, pero mejora la adherencia.', 2, true),
(gen_random_uuid(), 'debt_plan_30d',     '¿Cuál es el primer paso para salir de deudas?', 'Listar TODAS las deudas: saldo, tasa, pago mínimo. Calcula el total y el costo mensual real. Sin ese mapa completo, es imposible hacer un plan efectivo.', 1, true),

-- PROTECCIÓN
(gen_random_uuid(), 'fraud_basics',      '¿Qué es el phishing financiero?',               'Engaño donde suplantan a banco/SAT/IMSS para robar datos. Señales: urgencia extrema, links sospechosos, solicitan contraseña completa. Los bancos NUNCA piden tu NIP por teléfono.', 1, true),
(gen_random_uuid(), 'fraud_basics',      '¿Cómo verificar si un sitio de inversión es legítimo?', 'Consulta CONDUSEF y CNBV. Entidades reguladas aparecen en sus registros públicos. Si promete rendimientos >15% sin riesgo, es probable fraude. "Si suena demasiado bueno, es fraude."', 2, true),
(gen_random_uuid(), 'identity_protection', '¿Cómo proteger tu RFC y CURP?',               'No compartas en sitios no oficiales. Revisa tu expediente en SAT cada 6 meses. Si sospechas uso indebido, presenta declaratoria ante SAT. Activa e.firma para trámites oficiales.', 2, true),

-- CRECIMIENTO (inversión, inflación)
(gen_random_uuid(), 'inflation_basics',  '¿Qué es la inflación y cómo te afecta?',        'Es el aumento de precios. Inflación MX 2024: ~4.5% anual. Si tienes $10,000 en efectivo sin rendimiento, en 1 año equivalen a $9,569 en poder de compra. Tu dinero pierde valor quieto.', 2, true),
(gen_random_uuid(), 'inflation_basics',  '¿Qué son los CETES y cómo funcionan?',          'Certificados de Tesorería del gobierno mexicano. Tasa actual: ~10.1% anual. Disponibles desde $100 MXN en cetesdirecto.com.mx. Sin riesgo de emisor (es el gobierno federal).', 1, true),
(gen_random_uuid(), 'investing_basics',  '¿Qué es el interés compuesto?',                 'Interés sobre interés. $10,000 al 10% anual: año 1 = $11,000, año 2 = $12,100, año 5 = $16,105, año 10 = $25,937. Einstein lo llamó "el octavo milagro del mundo".', 1, true),
(gen_random_uuid(), 'investing_basics',  '¿Cuál es la diferencia entre ahorro e inversión?', 'Ahorro: capital seguro, bajo rendimiento (1–3%), alta liquidez. Inversión: mayor rendimiento potencial, asumes algún riesgo, plazo mínimo recomendado. No uses para el fondo de emergencia.', 2, true),
(gen_random_uuid(), 'investing_basics',  '¿Qué es la diversificación?',                   'Distribuir el dinero en distintos instrumentos/activos para no depender de uno solo. "No pongas todos los huevos en la misma canasta." Reduce riesgo sin eliminar rendimiento.', 2, true),
(gen_random_uuid(), 'inflation_basics',  '¿Qué es el rendimiento real de una inversión?', 'Rendimiento nominal menos inflación. CETES 10.1% - inflación 4.5% = rendimiento real ~5.4%. Si tu inversión rinde menos que la inflación, estás perdiendo poder adquisitivo.', 3, true);
