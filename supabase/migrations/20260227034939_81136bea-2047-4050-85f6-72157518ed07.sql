
-- Add unique constraint on courses.slug if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'courses_slug_key'
  ) THEN
    ALTER TABLE public.courses ADD CONSTRAINT courses_slug_key UNIQUE (slug);
  END IF;
END $$;

-- ============================================
-- TABLE: skills
-- ============================================
CREATE TABLE IF NOT EXISTS public.skills (
  id text PRIMARY KEY,
  domain text NOT NULL,
  title text NOT NULL,
  description text,
  icon text,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read skills"
  ON public.skills FOR SELECT
  USING (true);

-- ============================================
-- TABLE: user_skills
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  skill_id text NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  mastery numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'locked',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own skills"
  ON public.user_skills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON public.user_skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON public.user_skills FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- TABLE: user_missions
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  scenario_id uuid NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  done_at timestamptz,
  UNIQUE(user_id, scenario_id)
);

ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own missions"
  ON public.user_missions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own missions"
  ON public.user_missions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own missions"
  ON public.user_missions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- SEED: 15 skills
-- ============================================
INSERT INTO public.skills (id, domain, title, description, icon, sort_order) VALUES
  ('control_basics',      'control',     'Control del mes',          'Domina tu flujo mensual',           'gauge',        1),
  ('budget_3_buckets',    'control',     'Presupuesto en 3 cubetas', 'Distribuye en esenciales, metas y gustos', 'columns3', 2),
  ('spending_leaks',      'control',     'Fugas de dinero',          'Detecta y elimina gastos invisibles','search',       3),
  ('emergency_fund',      'control',     'Fondo de emergencia',      'Construye tu colchón financiero',   'shield',       4),
  ('auto_saving',         'control',     'Ahorro automático',        'Automatiza para no depender de voluntad','zap',       5),
  ('credit_basics',       'credito',     'Crédito sin miedo',        'Entiende el crédito como herramienta','credit-card', 6),
  ('credit_score',        'credito',     'Historial y score',        'Construye reputación financiera',   'bar-chart',    7),
  ('min_payment_trap',    'credito',     'Trampa del pago mínimo',   'Evita el ciclo del pago mínimo',    'alert-triangle',8),
  ('rate_compare',        'credito',     'Comparar tasas',           'Convierte y compara costos reales', 'percent',      9),
  ('snowball_avalanche',  'credito',     'Estrategia de deudas',     'Elige snowball o avalanche',        'trending-down',10),
  ('debt_plan_30d',       'credito',     'Plan 30 días',             'Sistema mínimo viable para salir de deuda','calendar',11),
  ('fraud_basics',        'proteccion',  'Señales de fraude',        'Identifica banderas rojas',         'eye',          12),
  ('identity_protection', 'proteccion',  'Protege tu identidad',     'Cuida tus datos y accesos',         'lock',         13),
  ('inflation_basics',    'crecimiento', 'Inflación y dinero quieto','Entiende por qué el dinero pierde valor','trending-up',14),
  ('investing_basics',    'crecimiento', 'Inversión básica',         'Primeros pasos para invertir',      'sprout',       15)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SEED: Curso 2 + 9 scenarios
-- ============================================
WITH course_upsert AS (
  INSERT INTO public.courses (slug, title, description, level, estimated_minutes, is_published, sort_order)
  VALUES (
    'credito-sin-miedo',
    'Crédito sin miedo',
    'Entiende el crédito, evita trampas y sal de deudas con un plan realista. Educación general, no asesoría.',
    'basico',
    55,
    true,
    20
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    level = EXCLUDED.level,
    estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = EXCLUDED.is_published,
    sort_order = EXCLUDED.sort_order
  RETURNING id
),
delete_old AS (
  DELETE FROM public.scenarios
  WHERE course_id = (SELECT id FROM course_upsert)
)
INSERT INTO public.scenarios
  (course_id, order_index, title, prompt, coaching, options, recall, mission, tags)
SELECT
  course_upsert.id,
  s.order_index,
  s.title,
  s.prompt,
  s.coaching,
  s.options::jsonb,
  s.recall::jsonb,
  s.mission,
  s.tags
FROM course_upsert
CROSS JOIN (VALUES
(1,
 'Crédito: herramienta o trampa',
 'Te ofrecen una tarjeta "sin anualidad" y un préstamo "rápido". Te dicen: "es bueno tener crédito". ¿Qué haces primero?',
 'El crédito no es "bueno" ni "malo": es una herramienta. La diferencia la hace el costo (tasa y comisiones) y tu hábito (pagar a tiempo). Antes de aceptar cualquier producto, entiende 3 cosas: cuánto cuesta, qué pasa si pagas tarde, y si puedes pagarlo completo sin sacrificar lo esencial.',
 '[{"id":"opt_a","text":"Acepto la tarjeta para \"construir historial\" y ya luego veo cómo la uso.","feedback":"Construir historial sirve, pero sin plan es fácil caer en pagos mínimos y comisiones. Primero define: usarla solo si puedes pagar el total cada mes y con límite bajo.","is_best":false},{"id":"opt_b","text":"Pregunto el costo total: tasa anual, comisiones, qué pasa si pago tarde y cuál sería el pago completo mensual típico.","feedback":"Correcto. Entender el costo y reglas evita que firmes a ciegas. Luego decides si te conviene y bajo qué condiciones.","is_best":true},{"id":"opt_c","text":"Rechazo todo crédito; mejor solo efectivo siempre.","feedback":"Evitar deudas puede ser sano, pero crédito bien usado puede ayudarte en emergencias y objetivos. Lo importante es control, no miedo.","is_best":false}]',
 '[{"id":"q1","question":"¿Qué define si el crédito te ayuda o te atrapa?","choices":[{"id":"a","text":"Solo la publicidad del banco"},{"id":"b","text":"Costo total + hábito de pago"},{"id":"c","text":"El color de la tarjeta"}],"correct_choice_id":"b","explanation":"El costo (tasa/comisiones) y tus pagos determinan el resultado."},{"id":"q2","question":"¿Cuál es una regla simple de uso saludable de tarjeta?","choices":[{"id":"a","text":"Pagar el mínimo para mejorar score"},{"id":"b","text":"Pagar el total cada mes si la usas"},{"id":"c","text":"Usarla para compras impulsivas"}],"correct_choice_id":"b","explanation":"Pagar el total evita intereses y mantiene control."}]',
 'Misión (2 min): Escribe tu regla personal de crédito en una frase (ej. "Si no puedo pagarlo completo este mes, no lo compro").',
 ARRAY['credito','fundamentos','habitos']
),
(2,
 'Historial y score: lo que sí controlas',
 'Pagas todo "cuando puedes", a veces te atrasas unos días. Piensas: "no pasa nada, luego me pongo al corriente". ¿Qué es lo más importante para tu historial?',
 'Tu historial se construye con consistencia, no con intensidad. La señal más fuerte suele ser pagar a tiempo. Incluso pequeños atrasos repetidos te cuestan más que tener un límite alto. Tu estrategia: automatiza el pago mínimo (para nunca caer en mora) y programa el pago total o extra cuando sea posible.',
 '[{"id":"opt_a","text":"Lo importante es gastar mucho con la tarjeta para que vean que la uso.","feedback":"Gastar mucho no es el objetivo. Usar y pagar a tiempo importa más que volumen.","is_best":false},{"id":"opt_b","text":"Lo más importante es pagar a tiempo, aunque sea el mínimo, para evitar mora (y luego pagar extra cuando pueda).","feedback":"Bien: evitar mora es prioridad. Ojo: el mínimo evita mora pero genera intereses; ideal es pagar total cuando puedas.","is_best":true},{"id":"opt_c","text":"Cerrar cuentas y abrir nuevas seguido para \"reiniciar\" el historial.","feedback":"Cambiar cuentas sin plan puede perjudicar. La estabilidad y el pago puntual suelen ayudar más.","is_best":false}]',
 '[{"id":"q1","question":"¿Qué hábito suele tener mayor impacto positivo en historial?","choices":[{"id":"a","text":"Pagar a tiempo"},{"id":"b","text":"Cambiar de banco cada mes"},{"id":"c","text":"Tener muchas tarjetas sin usar"}],"correct_choice_id":"a","explanation":"La puntualidad es una señal clave de confianza."},{"id":"q2","question":"Si hoy solo puedes hacer una automatización, ¿cuál eliges?","choices":[{"id":"a","text":"Pago mínimo automático para evitar mora"},{"id":"b","text":"Compra automática de cosas"},{"id":"c","text":"Retiro de efectivo automático"}],"correct_choice_id":"a","explanation":"Evitar mora te protege de daños grandes."}]',
 'Misión (1 min): Decide tu "día de finanzas" semanal (ej. domingo). Ese día revisas pagos y fechas.',
 ARRAY['score','historial','habitos','proteccion']
),
(3,
 'Pago mínimo: por qué te atrapa',
 'Tienes una tarjeta con saldo. El banco te muestra "pago mínimo" y "pago para no generar intereses". Estás tentado a pagar el mínimo "solo este mes". ¿Qué haces?',
 'El pago mínimo es una salida de emergencia, no un plan. Si pagas mínimo, la deuda tarda mucho más y pagas más intereses. Regla coach: si no puedes pagar total, paga mínimo + un extra fijo realista y detén nuevas compras hasta estabilizar.',
 '[{"id":"opt_a","text":"Pago el mínimo y sigo usando la tarjeta normal; ya luego ajusto.","feedback":"Riesgo alto: así la deuda crece y se vuelve costumbre. Si pagas mínimo, debes cortar nuevas compras o usar solo débito.","is_best":false},{"id":"opt_b","text":"Pago para no generar intereses (o lo máximo posible) y pongo un límite: no usar la tarjeta hasta bajar el saldo.","feedback":"Excelente: reduces costo total y recuperas control. Un límite de uso evita recaídas.","is_best":true},{"id":"opt_c","text":"Pago el mínimo pero hago una compra grande porque \"me lo merezco\".","feedback":"Esto convierte una salida de emergencia en un hoyo. No es castigo: es estrategia para salir más rápido.","is_best":false}]',
 '[{"id":"q1","question":"¿Para qué sirve realmente el pago mínimo?","choices":[{"id":"a","text":"Para salir de la deuda rápido"},{"id":"b","text":"Para evitar mora, pero no para eliminar la deuda"},{"id":"c","text":"Para pagar cero intereses"}],"correct_choice_id":"b","explanation":"Evita mora, pero mantiene la deuda y genera intereses."},{"id":"q2","question":"Si no puedes pagar el total, ¿qué plan es mejor?","choices":[{"id":"a","text":"Mínimo + extra fijo y frenar nuevas compras"},{"id":"b","text":"Solo mínimo por meses"},{"id":"c","text":"Ignorar el estado de cuenta"}],"correct_choice_id":"a","explanation":"Un extra fijo acelera salida y frenar compras evita recaídas."}]',
 'Misión (2 min): Define tu "extra fijo" mensual (aunque sea pequeño) para deuda: $___ en tu moneda local.',
 ARRAY['tarjeta','deuda','tasa','habitos']
),
(4,
 'Tasas: anual, mensual y "costo real"',
 'Te ofrecen dos créditos. Uno dice "2.5% mensual" y otro "30% anual". ¿Cómo comparas sin confundirte?',
 'Comparar tasas sin convertir es como comparar kilos con litros. Regla: convierte todo a una base común. Para aproximar: tasa mensual × 12 ≈ tasa anual (no exacto, pero útil). También importa el "costo total": comisiones, seguros, y penalizaciones.',
 '[{"id":"opt_a","text":"Elijo el que suena más pequeño (2.5% mensual) porque \"2.5\" es menor.","feedback":"Ojo: 2.5% mensual ≈ 30% anual. Sin convertir, es fácil equivocarse.","is_best":false},{"id":"opt_b","text":"Convierto ambos a anual aproximado y también pregunto comisiones para estimar costo total.","feedback":"Correcto: misma unidad + costo total. Así tomas decisión informada.","is_best":true},{"id":"opt_c","text":"Elijo el que me aprueban más rápido, sin ver tasas.","feedback":"La velocidad puede salir cara. Mejor 2 minutos extra para comparar que años pagando de más.","is_best":false}]',
 '[{"id":"q1","question":"2.5% mensual aproximado equivale a:","choices":[{"id":"a","text":"5% anual"},{"id":"b","text":"30% anual"},{"id":"c","text":"2.5% anual"}],"correct_choice_id":"b","explanation":"Aproximación: 2.5 × 12 = 30."},{"id":"q2","question":"Además de la tasa, ¿qué otro factor afecta costo total?","choices":[{"id":"a","text":"Comisiones y seguros"},{"id":"b","text":"El color del contrato"},{"id":"c","text":"La hora del día"}],"correct_choice_id":"a","explanation":"Comisiones/seguros/penalizaciones cambian el costo real."}]',
 'Misión (1 min): La próxima vez que veas una tasa, conviértela a "por mes" o "por año" en una nota rápida.',
 ARRAY['tasa','comparacion','credito','fundamentos']
),
(5,
 'Snowball vs Avalanche (decisión humana)',
 'Tienes varias deudas. Una estrategia paga primero la deuda más pequeña (snowball). Otra paga primero la más cara (avalanche). ¿Cuál eliges y por qué?',
 'Coach serio: avalanche suele ahorrar más intereses; snowball suele aumentar motivación porque ves "victorias" rápido. La mejor estrategia es la que sostienes. Si abandonas, no gana ninguna. Elegimos según tu personalidad y estrés, no por ego.',
 '[{"id":"opt_a","text":"Avalanche: pago primero la de mayor tasa para pagar menos intereses.","feedback":"Muy bien: financieramente eficiente. Requiere constancia si la victoria tarda.","is_best":true},{"id":"opt_b","text":"Snowball: pago primero la deuda más pequeña para ganar momentum.","feedback":"También válido: psicológicamente poderoso. Puede costar un poco más en intereses, pero mejora adherencia.","is_best":true},{"id":"opt_c","text":"Pago un poco a todas sin orden, \"para sentir que avanzo\".","feedback":"Eso suele alargar todo. Necesitas un objetivo claro y enfoque para cerrar deudas.","is_best":false}]',
 '[{"id":"q1","question":"¿Qué ventaja típica tiene avalanche?","choices":[{"id":"a","text":"Menos intereses totales"},{"id":"b","text":"Más compras impulsivas"},{"id":"c","text":"No requiere disciplina"}],"correct_choice_id":"a","explanation":"Pagar la tasa más alta primero reduce costo total."},{"id":"q2","question":"¿Qué ventaja típica tiene snowball?","choices":[{"id":"a","text":"Mayor motivación por victorias rápidas"},{"id":"b","text":"Siempre cuesta menos intereses"},{"id":"c","text":"No hace falta presupuesto"}],"correct_choice_id":"a","explanation":"Cerrar una deuda pronto motiva y sostiene el plan."}]',
 'Misión (2 min): Elige tu estrategia hoy (snowball o avalanche) y escribe 1 razón real (motivación o costo).',
 ARRAY['deuda','estrategia','habitos','coach']
),
(6,
 'Señales de sobreendeudamiento (sin drama)',
 'Cada mes pagas deudas y "no te queda nada". Te dices: "cuando gane más, arreglo todo". ¿Qué haces esta semana?',
 'Cuando todo se va a pagos, necesitas un plan de respiración: 1) detener nuevas deudas, 2) reducir gastos temporales, 3) renegociar si es necesario, 4) elegir estrategia y automatizar. No es moral: es matemática + hábito.',
 '[{"id":"opt_a","text":"Sigo igual y espero que el próximo mes sea mejor.","feedback":"Esperar rara vez cambia la ecuación. Pequeños ajustes constantes sí.","is_best":false},{"id":"opt_b","text":"Hago \"pausa\": recorto 2–3 gastos por 30 días y dejo de usar crédito mientras aplico estrategia.","feedback":"Excelente: pausa corta y clara. Evita que el problema crezca mientras recuperas control.","is_best":true},{"id":"opt_c","text":"Pido otro crédito para pagar el crédito anterior sin cambiar hábitos.","feedback":"Eso puede ser bola de nieve peligrosa. Solo tendría sentido si reduces tasa y cambias el plan, no solo mover deuda.","is_best":false}]',
 '[{"id":"q1","question":"¿Qué es lo primero si estás sobreendeudado?","choices":[{"id":"a","text":"Abrir otra tarjeta"},{"id":"b","text":"Detener nuevas deudas y hacer un plan"},{"id":"c","text":"Ignorar el estado de cuenta"}],"correct_choice_id":"b","explanation":"Detener el sangrado es prioridad."},{"id":"q2","question":"¿Por cuánto tiempo puedes hacer un recorte temporal \"sostenible\"?","choices":[{"id":"a","text":"30 días con metas claras"},{"id":"b","text":"10 años sin plan"},{"id":"c","text":"Nunca recortar"}],"correct_choice_id":"a","explanation":"30 días es un sprint realista para reordenar."}]',
 'Misión (2 min): Elige 2 recortes temporales por 30 días (suscripción, delivery, compras impulso). Escríbelos.',
 ARRAY['deuda','habitos','presupuesto','proteccion']
),
(7,
 'Negociar y reestructurar (sin caer en estafas)',
 'Una persona te ofrece "arreglar tu deuda" a cambio de un pago por adelantado y te pide datos personales. Suena tentador. ¿Qué haces?',
 'Regla de seguridad: nunca pagues "por adelantado" a desconocidos por promesas rápidas ni entregues datos sensibles. Si necesitas negociar, hazlo directamente con la entidad o con canales verificados. Y siempre entiende el nuevo costo total.',
 '[{"id":"opt_a","text":"Pago por adelantado para que lo resuelvan rápido; suena profesional.","feedback":"Riesgo alto. Las promesas rápidas + pago adelantado son bandera roja.","is_best":false},{"id":"opt_b","text":"Verifico canales oficiales y si busco ayuda, uso solo entidades verificadas; no comparto datos sensibles.","feedback":"Correcto. Proteges tu identidad y negocias con información.","is_best":true},{"id":"opt_c","text":"Ignoro todo y dejo de pagar para \"presionar\".","feedback":"Dejar de pagar suele empeorar costos y estrés. Si estás al límite, busca un plan formal, no silencio.","is_best":false}]',
 '[{"id":"q1","question":"¿Qué es una bandera roja de estafa financiera?","choices":[{"id":"a","text":"Promesas rápidas + pago por adelantado"},{"id":"b","text":"Contrato claro por escrito"},{"id":"c","text":"Canales oficiales"}],"correct_choice_id":"a","explanation":"Promesa rápida + anticipo es señal clásica de riesgo."},{"id":"q2","question":"¿Con quién es más seguro negociar deuda?","choices":[{"id":"a","text":"Con un desconocido por chat"},{"id":"b","text":"Con el acreedor por canal oficial/verificado"},{"id":"c","text":"Con alguien que no da documentos"}],"correct_choice_id":"b","explanation":"Canal oficial reduce fraude y te da trazabilidad."}]',
 'Misión (1 min): Haz una lista de 2 canales oficiales (web/app/teléfono verificado) de tus servicios financieros.',
 ARRAY['fraude','proteccion','deuda','seguridad']
),
(8,
 'Deuda "inteligente" vs deuda "tóxica"',
 'Te ofrecen comprar algo a meses. Te dices: "si es a cuotas, sí puedo". ¿Cómo decides si esa deuda vale la pena?',
 'Deuda inteligente compra algo que aumenta tu capacidad futura (herramienta de trabajo, educación con retorno claro) y tiene costo razonable. Deuda tóxica compra consumo que no puedes sostener. Regla: si la cuota te quita lo esencial (comida, renta, salud), no es opción.',
 '[{"id":"opt_a","text":"Acepto cualquier cuota si cabe en el mes, aunque me deje en cero.","feedback":"Quedar en cero te deja sin margen y te empuja a más deuda. Necesitas colchón.","is_best":false},{"id":"opt_b","text":"Solo tomo deuda si no compromete esenciales y si hay retorno claro (o valor real) y costo entendible.","feedback":"Correcto: criterio + costo total + impacto en esenciales.","is_best":true},{"id":"opt_c","text":"Tomo deuda para ''sentirme bien'' y ya luego veo.","feedback":"Eso suele ser caro emocional y financieramente. Mejor planear una recompensa que no te endeude.","is_best":false}]',
 '[{"id":"q1","question":"¿Qué caracteriza deuda \"tóxica\"?","choices":[{"id":"a","text":"Compra consumo que no puedes sostener"},{"id":"b","text":"Tiene contrato claro"},{"id":"c","text":"Se paga a tiempo"}],"correct_choice_id":"a","explanation":"Si no puedes sostenerlo, se vuelve una carga."},{"id":"q2","question":"¿Qué regla protege tu estabilidad?","choices":[{"id":"a","text":"Si me deja sin esenciales, no la tomo"},{"id":"b","text":"Si todos la toman, yo también"},{"id":"c","text":"Si es \"sin anualidad\", es gratis"}],"correct_choice_id":"a","explanation":"Proteger esenciales evita el efecto dominó."}]',
 'Misión (2 min): Escribe tus "esenciales" (3–5): vivienda, comida, transporte, salud, etc. Esa lista manda.',
 ARRAY['deuda','habitos','decisiones','presupuesto']
),
(9,
 'Plan 30 días (sistema, no fuerza de voluntad)',
 'Quieres salir del estrés financiero, pero te dura 3 días la motivación. ¿Qué sistema construyes para que funcione cuando no hay ganas?',
 'Coach serio: el objetivo es reducir fricción. Un sistema mínimo: 1) día fijo de finanzas (10 min/semana), 2) automatizar pagos mínimos, 3) automatizar ahorro pequeño, 4) plan de deuda (snowball/avalanche) con extra fijo, 5) revisar mensual y ajustar.',
 '[{"id":"opt_a","text":"Dependo de motivación: ''este mes sí me porto bien''.","feedback":"La motivación sube y baja. El sistema te sostiene cuando baja.","is_best":false},{"id":"opt_b","text":"Hago un sistema mínimo con automatizaciones y un día fijo semanal, aunque sea pequeño.","feedback":"Excelente: pequeño + constante gana. Eso es lo que escala en 3–6 meses.","is_best":true},{"id":"opt_c","text":"Hago un plan enorme perfecto que nunca ejecuto.","feedback":"Un plan perfecto no sirve si no vive. Mejor mínimo viable y ajustable.","is_best":false}]',
 '[{"id":"q1","question":"¿Qué hace sostenible un cambio financiero?","choices":[{"id":"a","text":"Fuerza de voluntad"},{"id":"b","text":"Sistema con automatizaciones"},{"id":"c","text":"Culpa"}],"correct_choice_id":"b","explanation":"Automatizar reduce fricción y fallas humanas."},{"id":"q2","question":"¿Cuál es un ''mínimo viable'' semanal?","choices":[{"id":"a","text":"10 min para revisar pagos y plan"},{"id":"b","text":"3 horas diarias"},{"id":"c","text":"Nunca revisar"}],"correct_choice_id":"a","explanation":"10 min/semana es realista y acumulativo."}]',
 'Misión (2 min): Agenda tu "día de finanzas" + define 1 automatización (pago mínimo o ahorro pequeño).',
 ARRAY['habitos','sistema','deuda','plan_30d']
)
) AS s(order_index, title, prompt, coaching, options, recall, mission, tags);
