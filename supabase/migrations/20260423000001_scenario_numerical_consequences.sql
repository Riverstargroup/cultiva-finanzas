-- ============================================================
-- DLV-68: Add numerical consequences to scenario options
-- Numbers based on Mexico 2025: CETES 10.1%, CAT 52-54%,
-- inflación 4.5%, salario entry-level CDMX $12k-$18k/mes
-- ============================================================

-- Scenario 3: Tarjeta de crédito: amiga o enemiga
-- Deuda: $8,000 | CAT 52% anual
-- Pago mínimo ($400) sobre $8,000: ~18-20 meses a $400 = ~$8,000 en intereses
-- Pagar $3,000: liquida en ~2 meses, pagas ~$400 en intereses

UPDATE public.scenarios
SET options = '[
  {
    "id": "opt_a",
    "text": "Pago los $3,000 completos para reducir la deuda lo más rápido posible.",
    "feedback": "Excelente decisión. Entre más rápido bajes el capital, menos intereses pagas en total.",
    "is_best": true,
    "short_term_result": "$5,000 de saldo restante — casi terminaste en 2 meses",
    "long_term_result": "Pagas ~$430 en intereses totales (CAT 52%). Ahorras $7,600 vs pago mínimo.",
    "consequence_months": 2
  },
  {
    "id": "opt_b",
    "text": "Pago solo el mínimo ($400) y uso el resto para comprar algo que quiero.",
    "feedback": "El pago mínimo puede tardar años en liquidar la deuda y terminas pagando el doble o triple del precio original.",
    "is_best": false,
    "short_term_result": "+$2,600 disponibles este mes para gastar",
    "long_term_result": "En 24 meses pagarás $8,640 en intereses — más que la deuda original. Costo real: $16,640.",
    "consequence_months": 24
  },
  {
    "id": "opt_c",
    "text": "Pago $1,500 y guardo $1,500 por si acaso.",
    "feedback": "No está mal tener reserva, pero si la tarjeta cobra 52% CAT, es mejor priorizar el pago de la deuda.",
    "is_best": false,
    "short_term_result": "$6,500 de saldo — y $1,500 en reserva al 0.5% en banco",
    "long_term_result": "En 12 meses habrás pagado ~$3,800 en intereses que eran evitables.",
    "consequence_months": 12
  }
]'::jsonb
WHERE id = '11111111-1111-1111-1111-111111111103';

-- Scenario 4: Tu fondo de emergencia
-- Emergencia $4,000-$8,000 | Sin fondo → tarjeta al 52% CAT

UPDATE public.scenarios
SET options = '[
  {
    "id": "opt_a",
    "text": "Pido prestado a un familiar y empiezo a juntar un fondo de emergencia para que no me vuelva a pasar.",
    "feedback": "Buena decisión a corto plazo, y excelente que aprendas la lección. El fondo de emergencia es tu red de seguridad.",
    "is_best": true,
    "short_term_result": "Resuelves la emergencia sin intereses. Ahorro real: $0 en deuda generada.",
    "long_term_result": "Con $800/mes ahorrados en CETES (10.1%), en 5 meses tienes $4,000 para el siguiente imprevisto.",
    "consequence_months": 5
  },
  {
    "id": "opt_b",
    "text": "Lo pago con tarjeta de crédito a meses sin intereses.",
    "feedback": "Si realmente son 0% intereses y puedes pagar las mensualidades, puede funcionar. Pero la mayoría de las promociones tienen letra chiquita.",
    "is_best": false,
    "short_term_result": "Pagas $4,000 en 6 cuotas de $667/mes — si no hay comisiones ni penalizaciones.",
    "long_term_result": "Si fallas un pago: intereses retroactivos al 52% CAT sobre los $4,000 desde el día uno.",
    "consequence_months": 6
  },
  {
    "id": "opt_c",
    "text": "Vivo sin refrigerador un tiempo hasta juntar el dinero.",
    "feedback": "A veces toca sacrificar comodidad, pero vivir sin refrigerador afecta tu alimentación y terminas gastando más en comida fuera.",
    "is_best": false,
    "short_term_result": "Ahorro inmediato: $0, pero gastos en comida fuera +$150/semana = +$600/mes.",
    "long_term_result": "En 2 meses de comida fuera habrás gastado $1,200 extra — 30% del costo de reparación.",
    "consequence_months": 2
  }
]'::jsonb
WHERE id = '11111111-1111-1111-1111-111111111104';

-- Scenario 5: Ahorro vs inversión
-- $15,000 ahorrados | CETES 10.1% | Inflación 4.5%

UPDATE public.scenarios
SET options = '[
  {
    "id": "opt_a",
    "text": "Investigo opciones de bajo riesgo (CETES, fondos de inversión) y destino una parte, manteniendo mi fondo de emergencia intacto.",
    "feedback": "Perfecto. Separas tu red de seguridad y pones a trabajar el excedente en algo que entiendas.",
    "is_best": true,
    "short_term_result": "$8,000 fondo de emergencia intocable + $7,000 en CETES 28 días (10.1% anual).",
    "long_term_result": "En 12 meses los $7,000 en CETES crecen a $7,707. Ganancia real: +$707 vs -$315 si los dejas en banco.",
    "consequence_months": 12
  },
  {
    "id": "opt_b",
    "text": "Meto todo en la inversión que me recomiende mi compañero.",
    "feedback": "Nunca inviertas en algo que no entiendes, ni metas dinero que puedas necesitar. Eso no es invertir, es apostar.",
    "is_best": false,
    "short_term_result": "$0 de fondo de emergencia — cualquier imprevisto te manda a deuda.",
    "long_term_result": "Si el negocio falla: pierdes los $15,000 y necesitas tarjeta de crédito para emergencias al 52% CAT.",
    "consequence_months": 6
  },
  {
    "id": "opt_c",
    "text": "Mejor sigo ahorrando. Invertir es para ricos.",
    "feedback": "Hoy invertir es accesible desde $100 en muchos países. No necesitas ser rico, solo informarte.",
    "is_best": false,
    "short_term_result": "$15,000 en cuenta bancaria al 0.5-1.5% anual.",
    "long_term_result": "En 12 meses con inflación 4.5%, tu poder de compra cae: tus $15,000 valen $14,325 en términos reales.",
    "consequence_months": 12
  }
]'::jsonb
WHERE id = '11111111-1111-1111-1111-111111111105';

-- Scenario 6: Deudas inteligentes
-- $5,000 al 45% anual + $20,000 al 18% anual | $2,000/mes extra

UPDATE public.scenarios
SET options = '[
  {
    "id": "opt_a",
    "text": "Los $2,000 van directo a la tarjeta de crédito (45% anual) mientras pago el mínimo del préstamo.",
    "feedback": "Correcto. El método avalancha: atacar primero la deuda con mayor tasa de interés te ahorra más dinero en total.",
    "is_best": true,
    "short_term_result": "La tarjeta de $5,000 al 45% queda liquidada en ~3 meses pagando $2,000/mes.",
    "long_term_result": "Ahorras ~$2,400 en intereses vs distribuir el pago. En 18 meses ambas deudas liquidadas.",
    "consequence_months": 18
  },
  {
    "id": "opt_b",
    "text": "Divido $1,000 para cada deuda.",
    "feedback": "Parece justo, pero matemáticamente pagas más intereses en total. La tarjeta al 45% te está costando mucho más.",
    "is_best": false,
    "short_term_result": "$1,000 a tarjeta + $1,000 a préstamo — avance lento en ambas.",
    "long_term_result": "Pagas ~$800 extra en intereses vs método avalancha. 22 meses para liquidar todo.",
    "consequence_months": 22
  },
  {
    "id": "opt_c",
    "text": "Pago el préstamo primero porque es la deuda más grande.",
    "feedback": "El tamaño de la deuda importa menos que la tasa de interés. $5,000 al 45% te cuesta proporcionalmente mucho más que $20,000 al 18%.",
    "is_best": false,
    "short_term_result": "$2,000 al préstamo personal — pero la tarjeta sigue acumulando 45% anual.",
    "long_term_result": "La tarjeta genera ~$1,850 en intereses mientras te enfocas en el préstamo. Costo extra vs avalancha: ~$1,400.",
    "consequence_months": 24
  }
]'::jsonb
WHERE id = '11111111-1111-1111-1111-111111111106';

-- Scenario 7: Tu primera inversión
-- $3,000 extras | CETES 10.1% | vs crypto riesgo / prestamo a amigo

UPDATE public.scenarios
SET options = '[
  {
    "id": "opt_a",
    "text": "Compro CETES a 28 días para probar cómo funciona. Es seguro y puedo reinvertir.",
    "feedback": "Perfecto primer paso. CETES son prácticamente sin riesgo, te enseñan cómo funciona la inversión, y puedes empezar desde $100.",
    "is_best": true,
    "short_term_result": "$3,000 en CETES 28 días al 10.1% anual = $25 en el primer mes.",
    "long_term_result": "En 12 meses: $3,303 (+$303). En 5 años con reinversión: $4,888 (+$1,888 real sobre inflación 4.5%).",
    "consequence_months": 12
  },
  {
    "id": "opt_b",
    "text": "Compro Bitcoin porque un youtuber dice que va a subir.",
    "feedback": "Las criptomonedas son de alto riesgo. No es lugar para tu primera inversión ni para dinero que no puedas perder.",
    "is_best": false,
    "short_term_result": "Potencial +50% o -60% en semanas. Sin garantía ni regulación.",
    "long_term_result": "Escenario histórico promedio crypto: -40% a -80% en correcciones. Puedes perder $1,200-$2,400 de tus $3,000.",
    "consequence_months": 12
  },
  {
    "id": "opt_c",
    "text": "Le doy mi dinero a un amigo que tiene un negocio ''seguro''.",
    "feedback": "Los negocios de amigos son la forma más común de perder dinero y amistades. Invierte en instrumentos regulados.",
    "is_best": false,
    "short_term_result": "Dinero inmovilizado sin documentación legal ni garantía.",
    "long_term_result": "80% de los negocios pequeños cierran en 2 años. Escenario probable: $0 recuperados y una amistad dañada.",
    "consequence_months": 24
  }
]'::jsonb
WHERE id = '11111111-1111-1111-1111-111111111107';

-- Scenario 1: Tu primera quincena — add numerical results
UPDATE public.scenarios
SET options = '[
  {
    "id": "opt_a",
    "text": "Pago la renta y separo para comida. Lo que sobre lo distribuyo entre ahorro y diversión.",
    "feedback": "Excelente. Cubrir necesidades básicas primero te da estabilidad y claridad para decidir el resto.",
    "is_best": true,
    "short_term_result": "$2,500 renta + ~$1,500 comida = $4,000 esenciales cubiertos. Sobrante: $2,000.",
    "long_term_result": "En 6 meses ahorrando $500/mes en CETES: $3,025 — ya tienes medio fondo de emergencia.",
    "consequence_months": 6
  },
  {
    "id": "opt_b",
    "text": "Voy a la fiesta y ya después veo cómo le hago con la renta.",
    "feedback": "Es tentador, pero gastar primero en diversión y luego estresarte con la renta no es un plan sostenible.",
    "is_best": false,
    "short_term_result": "Fiesta: $600-$1,000 gastados. Renta pendiente: $2,500 de emergencia.",
    "long_term_result": "Si pides prestado para la renta al 52% CAT mensual: $2,500 × 1.04 = $2,600 el siguiente mes.",
    "consequence_months": 1
  },
  {
    "id": "opt_c",
    "text": "Pago la renta pero uso lo demás en ropa que necesito desde hace meses.",
    "feedback": "Bien que priorizas la renta, pero si no separas para comida primero, terminarás pidiendo prestado a mitad de quincena.",
    "is_best": false,
    "short_term_result": "Ropa: $1,500-$2,000. Queda ~$1,500 para comida de 2 semanas — muy justo.",
    "long_term_result": "Sin ahorro este mes, cualquier imprevisto te obliga a pedir prestado. Ciclo que puede repetirse.",
    "consequence_months": 1
  }
]'::jsonb
WHERE id = '11111111-1111-1111-1111-111111111101';

-- Scenario 2: El presupuesto 50/30/20 — add numerical results
-- Income: $12,000/mes
UPDATE public.scenarios
SET options = '[
  {
    "id": "opt_a",
    "text": "50% para necesidades (renta, comida, transporte), 30% para gustos, 20% para ahorro o deudas.",
    "feedback": "Perfecto. Es simple, adaptable, y le da estructura sin ser rígido.",
    "is_best": true,
    "short_term_result": "$6,000 necesidades + $3,600 gustos + $2,400 ahorro — todo planificado desde el día 1.",
    "long_term_result": "Ahorrando $2,400/mes en CETES (10.1%): en 12 meses tienes $30,120 — fondo de emergencia + inicio de inversión.",
    "consequence_months": 12
  },
  {
    "id": "opt_b",
    "text": "Gasta lo menos posible y ahorra todo lo que puedas.",
    "feedback": "Suena disciplinado, pero es insostenible. Si no disfrutas nada, eventualmente explotarás y gastarás de más.",
    "is_best": false,
    "short_term_result": "Ahorras $4,000-$5,000 este mes, pero cero diversión ni alivio al estrés.",
    "long_term_result": "Estadísticamente, después de 3 meses de privación extrema, el gasto de rebote promedio cancela 2 meses de ahorro.",
    "consequence_months": 3
  },
  {
    "id": "opt_c",
    "text": "No te preocupes por porcentajes, solo no gastes más de lo que ganas.",
    "feedback": "Es un buen principio, pero sin estructura, es fácil perder el control sin darte cuenta.",
    "is_best": false,
    "short_term_result": "Sin categorías, el 30% para gustos se convierte en 50-60% sin notarlo.",
    "long_term_result": "Sin ahorro sistemático: en 12 meses, 0 ahorro acumulado vs $30,120 con la regla 50/30/20.",
    "consequence_months": 12
  }
]'::jsonb
WHERE id = '11111111-1111-1111-1111-111111111102';
