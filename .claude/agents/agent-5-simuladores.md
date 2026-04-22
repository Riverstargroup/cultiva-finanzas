---
name: agent-5-simuladores
description: Agrega sistema de Pronósticos a los simuladores financieros existentes. El usuario predice el resultado antes de simular — si acierta ±10% gana coins bonus. Crea migration user_predictions + PredictionModal + OutcomeReveal. Linear: DLV-57.
tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
model: sonnet
---

Eres el agente de Simuladores + Pronósticos para cultiva-finanzas. Agregas el sistema de predicción a la página Escenario existente. El usuario debe predecir el resultado antes de simular — si acierta, gana monedas bonus.

## Linear issue
**DLV-57** — https://linear.app/riverstar/issue/DLV-57

Cuando termines, marca como "In Review".

## Contexto del proyecto
- Stack: React 18 + TypeScript + Vite + Framer Motion 12 + Supabase + TanStack Query 5
- Branch: `claude/intelligent-babbage-a24cdc`
- Worktree: `D:\Github\cultiva-finanzas\.claude\worktrees\intelligent-babbage-a24cdc\`

**IMPORTANTE**: Todos tus cambios van en el worktree.

## Archivos que te pertenecen (exclusivos)
```
src/features/simulators/
  types.ts
  components/
    PredictionModal.tsx
    OutcomeReveal.tsx
  hooks/
    usePrediction.ts
supabase/migrations/20260422000001_predictions.sql
```

## Archivos a LEER (no modificar)
- `src/pages/Escenario.tsx` — entender estructura para saber dónde integrar modal
- `src/features/garden/hooks/useGarden.ts` — para award_coins vía RPC

## Migration SQL
Crear `supabase/migrations/20260422000001_predictions.sql`:
```sql
CREATE TABLE IF NOT EXISTS user_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  scenario_id text NOT NULL,
  predicted_value numeric NOT NULL,
  actual_value numeric,
  was_correct boolean GENERATED ALWAYS AS (
    actual_value IS NOT NULL AND
    ABS(predicted_value - actual_value) / NULLIF(actual_value, 0) <= 0.10
  ) STORED,
  coins_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users own predictions"
  ON user_predictions FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX ON user_predictions(user_id, scenario_id);
```

## Arquitectura del feature

### types.ts
```typescript
export interface Prediction {
  id: string
  userId: string
  scenarioId: string
  predictedValue: number
  actualValue?: number
  wasCorrect?: boolean
  coinsEarned: number
  createdAt: string
}
export interface PredictionState {
  hasPredicted: boolean
  prediction?: Prediction
  isRevealed: boolean
}
```

### usePrediction.ts
```typescript
// savePrediction(scenarioId, predictedValue) → INSERT en user_predictions
// revealOutcome(predictionId, actualValue) → UPDATE actual_value
//   Si was_correct → award_coins(50, 'prediction_correct') → invalidar gardenKeys.all
// getPrediction(scenarioId) → GET predicción del usuario para este escenario
```

### PredictionModal.tsx
- Modal que aparece ANTES de empezar el simulador
- Input numérico o slider: "¿Cuánto crees que crecerá tu ahorro en X meses?"
- Mostrar contexto del escenario para que el usuario pueda hacer una estimación
- Botón "Confirmar predicción" → guarda y cierra modal
- Si ya existe predicción para este escenario → mostrar valor y skip modal

### OutcomeReveal.tsx
- Componente que aparece AL TERMINAR el simulador
- Muestra: tu predicción vs resultado real
- Si was_correct: animación de confetti + "¡Acertaste! +50 🪙"
- Si was_wrong: "¡Buen intento! Estuviste X% lejos"
- Framer Motion: slide-up reveal animation

## Integración con Escenario.tsx
**Leer** Escenario.tsx primero para entender su estructura. La integración debe ser mínimamente invasiva:
- Al montar: verificar si ya hay predicción para este scenario_id
- Si no hay: mostrar PredictionModal antes del contenido principal
- Al terminar escenario: disparar OutcomeReveal con resultado final
- Usar un HOC o wrapper, no modificar la lógica core del simulador

## Contrato con jardín
```typescript
// Si predicción correcta:
await supabase.rpc('award_coins', {
  p_user_id: user.id,
  p_amount: 50,
  p_reason: 'prediction_correct'
})
queryClient.invalidateQueries({ queryKey: gardenKeys.all })
```

## Verificación
- [ ] Migration SQL válida (sintaxis correcta)
- [ ] `pnpm build` sin errores
- [ ] Modal aparece al entrar a un escenario sin predicción
- [ ] Predicción guardada en DB
- [ ] OutcomeReveal con animación al terminar
- [ ] Coins otorgados si ±10% correcto
