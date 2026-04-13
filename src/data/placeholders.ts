// Placeholder data for Phase 1 — no DB calls

export interface ScenarioOption {
  id: "opt_a" | "opt_b" | "opt_c";
  text: string;
  feedback: string;
  is_best: boolean;
}

export interface PlaceholderScenario {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  options: ScenarioOption[];
}

export interface PlaceholderCourse {
  id: string;
  title: string;
  description: string;
  difficulty: "basico" | "intermedio" | "avanzado";
  duration_min: number;
  scenarios: PlaceholderScenario[];
}

export const PILOT_COURSE: PlaceholderCourse = {
  id: "course-pilot-001",
  title: "Fundamentos Financieros",
  description:
    "Aprende a tomar mejores decisiones con tu dinero a través de 5 escenarios reales de la vida cotidiana.",
  difficulty: "basico",
  duration_min: 30,
  scenarios: [
    {
      id: "scenario-001",
      title: "Aguinaldo",
      description: "Recibes tu aguinaldo, ¿qué haces?",
      sort_order: 1,
      options: [
        { id: "opt_a", text: "Gastar todo en algo que siempre quise", feedback: "Darse un gusto está bien, pero sin un plan podrías terminar el mes sin ahorros. Considera reservar al menos una parte.", is_best: false },
        { id: "opt_b", text: "Ahorrar el 50% e invertir el resto", feedback: "¡Excelente! Dividir tu aguinaldo entre ahorro e inversión te da seguridad y crecimiento a largo plazo.", is_best: true },
        { id: "opt_c", text: "Pagar deudas pendientes", feedback: "Buena opción si tienes deudas con intereses altos. Liberarte de deudas es una forma de inversión en tu tranquilidad.", is_best: false },
      ],
    },
    {
      id: "scenario-002",
      title: "Presupuesto",
      description: "Tu ingreso mensual es $12,000, ¿cómo lo distribuyes?",
      sort_order: 2,
      options: [
        { id: "opt_a", text: "50% necesidades, 30% gustos, 20% ahorro", feedback: "¡La regla 50/30/20! Es un marco probado que balancea tus necesidades actuales con tu futuro financiero.", is_best: true },
        { id: "opt_b", text: "80% gastos del mes, 20% salidas", feedback: "Sin un porcentaje dedicado al ahorro, cualquier imprevisto podría desbalancear tus finanzas.", is_best: false },
        { id: "opt_c", text: "Gasto según vaya surgiendo", feedback: "Sin plan es fácil perder el control. Un presupuesto básico te ayuda a saber a dónde va tu dinero.", is_best: false },
      ],
    },
    {
      id: "scenario-003",
      title: "Tarjeta de crédito",
      description: "Tienes una deuda de tarjeta de crédito, ¿qué estrategia sigues?",
      sort_order: 3,
      options: [
        { id: "opt_a", text: "Pagar solo el mínimo cada mes", feedback: "Pagar el mínimo puede costarte años de intereses. Los intereses compuestos trabajan en tu contra.", is_best: false },
        { id: "opt_b", text: "Pagar más del mínimo enfocándome en la deuda más cara", feedback: "¡Correcto! Atacar primero la deuda con mayor tasa de interés (método avalancha) te ahorra más dinero.", is_best: true },
        { id: "opt_c", text: "Sacar otro crédito para pagar este", feedback: "Endeudarte para pagar deuda rara vez funciona. Puede convertirse en un ciclo peligroso.", is_best: false },
      ],
    },
    {
      id: "scenario-004",
      title: "Fondo de emergencia",
      description: "Surge un gasto inesperado de $8,000, ¿cómo lo cubres?",
      sort_order: 4,
      options: [
        { id: "opt_a", text: "Usar mi fondo de emergencia", feedback: "¡Para eso existe! Un fondo de emergencia de 3-6 meses de gastos te protege sin recurrir a deudas.", is_best: true },
        { id: "opt_b", text: "Pedir prestado a familiares", feedback: "Puede funcionar a corto plazo, pero depender de otros no es sostenible. Mejor construir tu propio colchón.", is_best: false },
        { id: "opt_c", text: "Usar la tarjeta de crédito", feedback: "Si no puedes pagar el total al corte, los intereses convertirán $8,000 en mucho más. Úsala solo como último recurso.", is_best: false },
      ],
    },
    {
      id: "scenario-005",
      title: "CETES",
      description: "Tienes $10,000 ahorrados, ¿dónde los pones a trabajar?",
      sort_order: 5,
      options: [
        { id: "opt_a", text: "Dejarlos en la cuenta de ahorro del banco", feedback: "Las cuentas de ahorro dan rendimientos muy bajos, a veces por debajo de la inflación. Tu dinero pierde valor.", is_best: false },
        { id: "opt_b", text: "Invertir en CETES a 28 días", feedback: "¡Buena elección! CETES es seguro (respaldado por el gobierno), accesible desde $100 y da mejores rendimientos que el banco.", is_best: true },
        { id: "opt_c", text: "Comprar criptomonedas", feedback: "Las cripto pueden dar altos rendimientos pero son muy volátiles. No es ideal para tus primeros ahorros.", is_best: false },
      ],
    },
  ],
};

export const COURSES_LIST: PlaceholderCourse[] = [PILOT_COURSE];

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
}

export const BADGES: BadgeDef[] = [
  { id: "first_steps", name: "Primeros Brotes", description: "Completa tu primer escenario", icon: "Sprout" },
  { id: "steady_learner", name: "Aprendiz Constante", description: "Completa 3 escenarios", icon: "BookOpen" },
  { id: "financial_master", name: "Maestro Financiero", description: "Completa todos los escenarios de un curso", icon: "Trophy" },
  { id: "streak_3", name: "Racha de 3 Días", description: "3 días consecutivos de actividad", icon: "Flame" },
  { id: "streak_7", name: "Racha Semanal", description: "7 días consecutivos de actividad", icon: "Zap" },
  { id: "calculator_user", name: "Explorador de Cosecha", description: "Usa la calculadora por primera vez", icon: "Calculator" },
  { id: "debt_expert", name: "Experto en Poda", description: "Completa el escenario de Tarjeta de crédito", icon: "CreditCard" },
  { id: "saver", name: "Sembrador de Ahorro", description: "Completa el escenario de Fondo de emergencia", icon: "PiggyBank" },
];
