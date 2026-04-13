
-- =============================================
-- FASE 1: Motor de Aprendizaje Semilla
-- 6 tablas + RLS + triggers + seed data
-- =============================================

-- 1) COURSES
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  level text DEFAULT 'basico',
  estimated_minutes int DEFAULT 0,
  is_published boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read published courses"
  ON public.courses FOR SELECT
  TO authenticated
  USING (is_published = true);

-- 2) SCENARIOS (Seeds)
CREATE TABLE public.scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  order_index int DEFAULT 0,
  title text NOT NULL,
  prompt text NOT NULL,
  coaching text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]',
  recall jsonb NOT NULL DEFAULT '[]',
  mission text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_scenarios_course ON public.scenarios(course_id, order_index);

ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read scenarios"
  ON public.scenarios FOR SELECT
  TO authenticated
  USING (true);

-- 3) USER_COURSE_PROGRESS
CREATE TABLE public.user_course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed_scenarios uuid[] DEFAULT '{}'::uuid[],
  mastery_score numeric DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON public.user_course_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_course_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_course_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_course_progress_updated_at
  BEFORE UPDATE ON public.user_course_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 4) USER_SCENARIO_STATE (SM-2 spaced repetition)
CREATE TABLE public.user_scenario_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  scenario_id uuid NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  repetitions int DEFAULT 0,
  interval_days int DEFAULT 1,
  ease_factor numeric DEFAULT 2.5,
  next_due_at timestamptz DEFAULT now(),
  last_quality int DEFAULT 0,
  last_score numeric DEFAULT 0,
  last_attempt_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, scenario_id)
);

ALTER TABLE public.user_scenario_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own scenario state"
  ON public.user_scenario_state FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scenario state"
  ON public.user_scenario_state FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scenario state"
  ON public.user_scenario_state FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_scenario_state_updated_at
  BEFORE UPDATE ON public.user_scenario_state
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 5) USER_ACHIEVEMENTS
CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  badge_id text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own achievements"
  ON public.user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 6) USER_ACTIVITY_DAYS (streak tracking)
CREATE TABLE public.user_activity_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  day date NOT NULL,
  minutes int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, day)
);

ALTER TABLE public.user_activity_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own activity"
  ON public.user_activity_days FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity"
  ON public.user_activity_days FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity"
  ON public.user_activity_days FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- SEED DATA: Curso "Raíces" + 7 Scenarios
-- =============================================

-- Insert the course
INSERT INTO public.courses (id, slug, title, description, level, estimated_minutes, is_published, sort_order)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'raices-control-sin-dolor',
  'Raíces: Control de dinero sin dolor',
  'Domina lo básico para que tu dinero deje de escaparse: decisiones, hábitos y sistemas simples.',
  'basico',
  40,
  true,
  1
);

-- Scenario 1: Tu primera quincena
INSERT INTO public.scenarios (id, course_id, order_index, title, prompt, coaching, options, recall, mission, tags)
VALUES (
  '11111111-1111-1111-1111-111111111101',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  1,
  'Tu primera quincena',
  'Acabas de recibir tu primer pago quincenal: $6,000 en tu cuenta. Tienes renta por pagar ($2,500), necesitas comida para dos semanas, y tus amigos te invitan a una fiesta este fin de semana. ¿Qué haces primero?',
  'Lo primero siempre es cubrir lo que te mantiene con techo y comida. La diversión es importante, pero planificar antes de gastar es lo que separa a quien "le alcanza" de quien siempre anda corto.',
  '[{"id":"opt_a","text":"Pago la renta y separo para comida. Lo que sobre lo distribuyo entre ahorro y diversión.","feedback":"Excelente. Cubrir necesidades básicas primero te da estabilidad y claridad para decidir el resto.","is_best":true},{"id":"opt_b","text":"Voy a la fiesta y ya después veo cómo le hago con la renta.","feedback":"Es tentador, pero gastar primero en diversión y luego estresarte con la renta no es un plan sostenible.","is_best":false},{"id":"opt_c","text":"Pago la renta pero uso lo demás en ropa que necesito desde hace meses.","feedback":"Bien que priorizas la renta, pero si no separas para comida primero, terminarás pidiendo prestado a mitad de quincena.","is_best":false}]',
  '[{"id":"q1","question":"¿Cuál es el primer gasto que debes cubrir al recibir tu sueldo?","choices":[{"id":"a","text":"Diversión y ropa"},{"id":"b","text":"Necesidades básicas (renta, comida)"},{"id":"c","text":"Ahorro e inversión"}],"correct_choice_id":"b","explanation":"Las necesidades básicas son prioridad. Sin techo ni comida, nada más funciona."},{"id":"q2","question":"¿Qué pasa si gastas primero en diversión?","choices":[{"id":"a","text":"No pasa nada, siempre se puede pedir prestado"},{"id":"b","text":"Te arriesgas a no cubrir gastos esenciales y generar deuda"},{"id":"c","text":"Es la mejor forma de motivarte"}],"correct_choice_id":"b","explanation":"Gastar primero en diversión casi siempre lleva a deuda o estrés financiero a mitad de quincena."}]',
  'Abre tu app de banco o una hoja de papel. Anota cuánto recibes y cuánto gastas en lo básico este mes. Solo eso, sin juzgarte.',
  '{presupuesto}'
);

-- Scenario 2: El presupuesto 50/30/20
INSERT INTO public.scenarios (id, course_id, order_index, title, prompt, coaching, options, recall, mission, tags)
VALUES (
  '11111111-1111-1111-1111-111111111102',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  2,
  'El presupuesto 50/30/20',
  'Tu amiga te dice que nunca le alcanza el sueldo ($12,000/mes). Te pide consejo. Tú conoces la regla 50/30/20. ¿Cómo se la explicas?',
  'El 50/30/20 es una guía, no una ley. Lo importante es que tus necesidades queden cubiertas, tengas algo para disfrutar, y siempre reserves algo para tu yo del futuro.',
  '[{"id":"opt_a","text":"50% para necesidades (renta, comida, transporte), 30% para gustos, 20% para ahorro o deudas.","feedback":"Perfecto. Es simple, adaptable, y le da estructura sin ser rígido.","is_best":true},{"id":"opt_b","text":"Gasta lo menos posible y ahorra todo lo que puedas.","feedback":"Suena disciplinado, pero es insostenible. Si no disfrutas nada, eventualmente explotarás y gastarás de más.","is_best":false},{"id":"opt_c","text":"No te preocupes por porcentajes, solo no gastes más de lo que ganas.","feedback":"Es un buen principio, pero sin estructura, es fácil perder el control sin darte cuenta.","is_best":false}]',
  '[{"id":"q1","question":"En la regla 50/30/20, ¿a qué se destina el 20%?","choices":[{"id":"a","text":"Gustos y entretenimiento"},{"id":"b","text":"Ahorro o pago de deudas"},{"id":"c","text":"Renta y servicios"}],"correct_choice_id":"b","explanation":"El 20% es para construir tu futuro financiero: ahorro, inversión o eliminar deudas."},{"id":"q2","question":"¿Por qué no es buena idea ahorrar el 100% y no gastar en gustos?","choices":[{"id":"a","text":"Porque es ilegal"},{"id":"b","text":"Porque es insostenible y puede llevar a gastos impulsivos"},{"id":"c","text":"Porque los bancos no lo permiten"}],"correct_choice_id":"b","explanation":"La privación extrema no es sostenible. Un presupuesto debe incluir algo de disfrute para ser mantenible."},{"id":"q3","question":"Si ganas $10,000, ¿cuánto debería ir a necesidades según 50/30/20?","choices":[{"id":"a","text":"$3,000"},{"id":"b","text":"$5,000"},{"id":"c","text":"$7,000"}],"correct_choice_id":"b","explanation":"El 50% de $10,000 = $5,000 para necesidades básicas como renta, comida y transporte."}]',
  'Toma tus ingresos del último mes y divídelos en 50/30/20. ¿Se parece a lo que realmente gastaste? Solo observa, sin cambiar nada aún.',
  '{presupuesto}'
);

-- Scenario 3: Tarjeta de crédito: amiga o enemiga
INSERT INTO public.scenarios (id, course_id, order_index, title, prompt, coaching, options, recall, mission, tags)
VALUES (
  '11111111-1111-1111-1111-111111111103',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  3,
  'Tarjeta de crédito: amiga o enemiga',
  'Te llega tu estado de cuenta de la tarjeta de crédito: debes $8,000. El pago mínimo es $400. Tienes $3,000 disponibles este mes después de gastos básicos. ¿Qué haces?',
  'El pago mínimo es la trampa más cara del sistema financiero. Cada mes que solo pagas el mínimo, los intereses crecen como bola de nieve. Paga lo máximo que puedas, siempre.',
  '[{"id":"opt_a","text":"Pago los $3,000 completos para reducir la deuda lo más rápido posible.","feedback":"Excelente decisión. Entre más rápido bajes el capital, menos intereses pagas en total.","is_best":true},{"id":"opt_b","text":"Pago solo el mínimo ($400) y uso el resto para comprar algo que quiero.","feedback":"El pago mínimo puede tardar años en liquidar la deuda y terminas pagando el doble o triple del precio original.","is_best":false},{"id":"opt_c","text":"Pago $1,500 y guardo $1,500 por si acaso.","feedback":"No está mal tener reserva, pero si la tarjeta cobra 30-40% anual de intereses, es mejor priorizar el pago de la deuda.","is_best":false}]',
  '[{"id":"q1","question":"¿Por qué es peligroso pagar solo el mínimo de la tarjeta?","choices":[{"id":"a","text":"Porque el banco te cancela la tarjeta"},{"id":"b","text":"Porque los intereses hacen que la deuda crezca y tardes años en pagar"},{"id":"c","text":"Porque baja tu sueldo"}],"correct_choice_id":"b","explanation":"Los intereses de tarjeta de crédito en Latinoamérica pueden ser del 30-60% anual. El mínimo apenas cubre intereses."},{"id":"q2","question":"Si tienes dinero disponible y deuda con intereses altos, ¿qué conviene más?","choices":[{"id":"a","text":"Guardar el dinero bajo el colchón"},{"id":"b","text":"Pagar la mayor cantidad posible de la deuda"},{"id":"c","text":"Invertir en criptomonedas"}],"correct_choice_id":"b","explanation":"Ninguna inversión segura rinde más que lo que te cobra una tarjeta de crédito en intereses. Pagar deuda cara es la mejor inversión."}]',
  'Revisa tu último estado de cuenta de tarjeta (si tienes). Busca la tasa de interés anual. ¿Sabías que era tan alta?',
  '{deuda}'
);

-- Scenario 4: Tu fondo de emergencia
INSERT INTO public.scenarios (id, course_id, order_index, title, prompt, coaching, options, recall, mission, tags)
VALUES (
  '11111111-1111-1111-1111-111111111104',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  4,
  'Tu fondo de emergencia',
  'Se descompone tu refrigerador y necesitas $4,000 para repararlo o $8,000 para uno nuevo. No tienes ahorros. ¿Qué haces?',
  'Las emergencias no avisan. Sin un fondo de emergencia, cualquier imprevisto te manda directo a la deuda. Empieza con $1,000 y crece desde ahí.',
  '[{"id":"opt_a","text":"Pido prestado a un familiar y empiezo a juntar un fondo de emergencia para que no me vuelva a pasar.","feedback":"Buena decisión a corto plazo, y excelente que aprendas la lección. El fondo de emergencia es tu red de seguridad.","is_best":true},{"id":"opt_b","text":"Lo pago con tarjeta de crédito a meses sin intereses.","feedback":"Si realmente son 0% intereses y puedes pagar las mensualidades, puede funcionar. Pero la mayoría de las promociones tienen letra chiquita.","is_best":false},{"id":"opt_c","text":"Vivo sin refrigerador un tiempo hasta juntar el dinero.","feedback":"A veces toca sacrificar comodidad, pero vivir sin refrigerador afecta tu alimentación y terminas gastando más en comida fuera.","is_best":false}]',
  '[{"id":"q1","question":"¿Cuánto es un buen primer objetivo para un fondo de emergencia?","choices":[{"id":"a","text":"$100"},{"id":"b","text":"1-3 meses de gastos básicos"},{"id":"c","text":"Un año completo de sueldo"}],"correct_choice_id":"b","explanation":"Lo ideal es 3-6 meses de gastos, pero empezar con 1 mes ya te da mucha tranquilidad."},{"id":"q2","question":"¿Dónde es mejor guardar tu fondo de emergencia?","choices":[{"id":"a","text":"Debajo del colchón"},{"id":"b","text":"En una cuenta de ahorro separada, fácil de acceder"},{"id":"c","text":"Invertido en acciones"}],"correct_choice_id":"b","explanation":"Debe ser accesible rápidamente (no en inversiones) pero separado de tu cuenta de gastos diarios para no tentarte."},{"id":"q3","question":"¿Por qué es importante tener un fondo de emergencia?","choices":[{"id":"a","text":"Para comprar cosas en oferta"},{"id":"b","text":"Para evitar endeudarte cuando surjan imprevistos"},{"id":"c","text":"Para impresionar a tus amigos"}],"correct_choice_id":"b","explanation":"Sin fondo de emergencia, cualquier imprevisto te lleva a pedir prestado o usar tarjeta de crédito con intereses altos."}]',
  'Define una meta: ¿cuánto necesitas para 1 mes de gastos básicos? Anota ese número. Es tu primer objetivo de fondo de emergencia.',
  '{ahorro}'
);

-- Scenario 5: Ahorro vs inversión
INSERT INTO public.scenarios (id, course_id, order_index, title, prompt, coaching, options, recall, mission, tags)
VALUES (
  '11111111-1111-1111-1111-111111111105',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  5,
  'Ahorro vs inversión',
  'Llevas 6 meses ahorrando y tienes $15,000 en tu cuenta. Un compañero te dice que "el dinero guardado pierde valor por la inflación" y que deberías invertir. ¿Qué haces?',
  'Tu compañero tiene razón: el dinero quieto pierde valor. Pero invertir sin entender es apostar. Primero asegura tu fondo de emergencia, luego aprende sobre opciones seguras antes de meter dinero.',
  '[{"id":"opt_a","text":"Investigo opciones de bajo riesgo (CETES, fondos de inversión) y destino una parte, manteniendo mi fondo de emergencia intacto.","feedback":"Perfecto. Separas tu red de seguridad y pones a trabajar el excedente en algo que entiendas.","is_best":true},{"id":"opt_b","text":"Meto todo en la inversión que me recomiende mi compañero.","feedback":"Nunca inviertas en algo que no entiendes, ni metas dinero que puedes necesitar. Eso no es invertir, es apostar.","is_best":false},{"id":"opt_c","text":"Mejor sigo ahorrando. Invertir es para ricos.","feedback":"Hoy invertir es accesible desde $100 en muchos países. No necesitas ser rico, solo informarte.","is_best":false}]',
  '[{"id":"q1","question":"¿Qué pasa con el dinero ahorrado que no se invierte?","choices":[{"id":"a","text":"Crece solo"},{"id":"b","text":"Pierde poder de compra por la inflación"},{"id":"c","text":"Se mantiene igual siempre"}],"correct_choice_id":"b","explanation":"La inflación hace que $100 hoy compren menos que $100 hace un año. Por eso es importante que tu dinero al menos iguale la inflación."},{"id":"q2","question":"¿Cuál es una inversión de bajo riesgo accesible en Latinoamérica?","choices":[{"id":"a","text":"Criptomonedas"},{"id":"b","text":"CETES o bonos del gobierno"},{"id":"c","text":"Prestarle a un amigo"}],"correct_choice_id":"b","explanation":"Los CETES y bonos gubernamentales son de las inversiones más seguras. Las criptomonedas son de alto riesgo."}]',
  'Busca en Google cuánto rinden los CETES (o bonos del gobierno de tu país) hoy. Compara ese rendimiento con la inflación actual.',
  '{inversion,ahorro}'
);

-- Scenario 6: Deudas inteligentes
INSERT INTO public.scenarios (id, course_id, order_index, title, prompt, coaching, options, recall, mission, tags)
VALUES (
  '11111111-1111-1111-1111-111111111106',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  6,
  'Deudas inteligentes',
  'Tienes dos deudas: $5,000 en una tarjeta de crédito (45% anual) y $20,000 de un préstamo personal (18% anual). Te sobran $2,000 este mes. ¿Cómo los distribuyes?',
  'No todas las deudas son iguales. Ataca primero la que te cobra más intereses. Es matemática pura: cada peso que pagas a la deuda cara te ahorra más que pagarlo a la barata.',
  '[{"id":"opt_a","text":"Los $2,000 van directo a la tarjeta de crédito (45% anual) mientras pago el mínimo del préstamo.","feedback":"Correcto. El método avalancha: atacar primero la deuda con mayor tasa de interés te ahorra más dinero en total.","is_best":true},{"id":"opt_b","text":"Divido $1,000 para cada deuda.","feedback":"Parece justo, pero matemáticamente pagas más intereses en total. La tarjeta al 45% te está costando mucho más.","is_best":false},{"id":"opt_c","text":"Pago el préstamo primero porque es la deuda más grande.","feedback":"El tamaño de la deuda importa menos que la tasa de interés. $5,000 al 45% te cuesta proporcionalmente mucho más que $20,000 al 18%.","is_best":false}]',
  '[{"id":"q1","question":"¿Qué es el método avalancha para pagar deudas?","choices":[{"id":"a","text":"Pagar primero la deuda más pequeña"},{"id":"b","text":"Pagar primero la deuda con la tasa de interés más alta"},{"id":"c","text":"Pagar todas por igual"}],"correct_choice_id":"b","explanation":"El método avalancha prioriza la deuda con mayor tasa de interés. Te ahorra más dinero en intereses totales."},{"id":"q2","question":"Si una deuda cobra 45% anual y otra 18%, ¿cuál atacar primero?","choices":[{"id":"a","text":"La de 18% porque es más fácil"},{"id":"b","text":"La de 45% porque cada peso extra ahorrado en intereses vale más"},{"id":"c","text":"Da igual, son lo mismo"}],"correct_choice_id":"b","explanation":"Cada peso extra que pagas a la deuda del 45% te ahorra 2.5 veces más en intereses que si lo pagas a la del 18%."},{"id":"q3","question":"¿Cuándo tiene sentido tomar un préstamo?","choices":[{"id":"a","text":"Siempre que puedas pagarlo"},{"id":"b","text":"Cuando genera valor mayor que su costo (educación, negocio viable)"},{"id":"c","text":"Nunca, toda deuda es mala"}],"correct_choice_id":"b","explanation":"La deuda inteligente es la que te genera más valor del que te cuesta. Un préstamo para educación puede multiplicar tus ingresos."}]',
  'Haz una lista de todas tus deudas con su tasa de interés. Ordénalas de mayor a menor tasa. Esa es tu prioridad de pago.',
  '{deuda}'
);

-- Scenario 7: Tu primera inversión
INSERT INTO public.scenarios (id, course_id, order_index, title, prompt, coaching, options, recall, mission, tags)
VALUES (
  '11111111-1111-1111-1111-111111111107',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  7,
  'Tu primera inversión',
  'Ya tienes tu fondo de emergencia listo y $3,000 extra que no necesitas en los próximos 6 meses. Quieres hacer tu primera inversión. ¿Qué eliges?',
  'La mejor primera inversión es la que entiendes y te deja dormir tranquilo. No busques hacerte rico rápido. Busca aprender cómo funciona el dinero trabajando para ti.',
  '[{"id":"opt_a","text":"Compro CETES a 28 días para probar cómo funciona. Es seguro y puedo reinvertir.","feedback":"Perfecto primer paso. CETES son prácticamente sin riesgo, te enseñan cómo funciona la inversión, y puedes empezar desde $100.","is_best":true},{"id":"opt_b","text":"Compro Bitcoin porque un youtuber dice que va a subir.","feedback":"Las criptomonedas son de alto riesgo. No es lugar para tu primera inversión ni para dinero que no puedas perder.","is_best":false},{"id":"opt_c","text":"Le doy mi dinero a un amigo que tiene un negocio ''seguro''.","feedback":"Los negocios de amigos son la forma más común de perder dinero y amistades. Invierte en instrumentos regulados.","is_best":false}]',
  '[{"id":"q1","question":"¿Qué son los CETES?","choices":[{"id":"a","text":"Acciones de empresas mexicanas"},{"id":"b","text":"Certificados de deuda del gobierno, de bajo riesgo"},{"id":"c","text":"Una criptomoneda"}],"correct_choice_id":"b","explanation":"CETES (Certificados de la Tesorería) son instrumentos de deuda del gobierno. Son de los más seguros que existen."},{"id":"q2","question":"¿Cuál es la regla de oro antes de invertir?","choices":[{"id":"a","text":"Pedir un préstamo para invertir más"},{"id":"b","text":"Tener un fondo de emergencia y no invertir dinero que necesites pronto"},{"id":"c","text":"Invertir todo tu sueldo"}],"correct_choice_id":"b","explanation":"Nunca inviertas dinero que puedas necesitar a corto plazo. Primero tu fondo de emergencia, luego invierte el excedente."},{"id":"q3","question":"¿Por qué NO es buena idea invertir basándote en tips de redes sociales?","choices":[{"id":"a","text":"Porque las redes sociales no existen"},{"id":"b","text":"Porque muchos ''expertos'' no están regulados y pueden tener conflictos de interés"},{"id":"c","text":"Porque las inversiones solo se hacen en bancos"}],"correct_choice_id":"b","explanation":"Muchos influencers financieros ganan dinero promocionando productos, no por darte buen consejo. Investiga siempre por tu cuenta."}]',
  'Entra a cetesdirecto.com (México) o busca el equivalente en tu país para bonos del gobierno. Solo explora, no necesitas comprar nada aún.',
  '{inversion}'
);
