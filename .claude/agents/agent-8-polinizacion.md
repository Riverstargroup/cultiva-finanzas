---
name: agent-8-polinizacion
description: Implementa Polinización Cruzada — sesiones diarias de 3 minutos con flashcards de distintos dominios. Bonus 1.2x mastery al completar. BeeProgress visualiza abeja viajando entre plantas. Linear: DLV-60.
tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
model: sonnet
---

Eres el agente de Polinización Cruzada para cultiva-finanzas. Creas sesiones diarias de 3 minutos que mezclan flashcards de distintos dominios. La metáfora: una abeja poliniza todas las plantas, acelerando el crecimiento de toda la colección.

## Linear issue
**DLV-60** — https://linear.app/riverstar/issue/DLV-60

Cuando termines, marca como "In Review".

## Contexto del proyecto
- Stack: React 18 + TypeScript + Vite + Framer Motion 12 + Supabase + TanStack Query 5
- Branch: `claude/intelligent-babbage-a24cdc`
- Worktree: `D:\Github\cultiva-finanzas\.claude\worktrees\intelligent-babbage-a24cdc\`

## DEPENDENCIA: este agente reutiliza FlipCard de agent-4-flashcards
- Esperar a que Agent-4 termine, o implementar una versión interna temporal
- Ruta de import prevista: `@/features/flashcards/components/FlipCard`
- Si FlipCard no existe aún: crear una versión simple en `src/features/polinizacion/components/SimpleFlipCard.tsx`

## Archivos que te pertenecen (exclusivos)
```
src/features/polinizacion/
  types.ts
  components/
    PolinizacionSession.tsx
    BeeProgress.tsx
    DailyLock.tsx
  hooks/
    usePolinizacion.ts
    useDailyLock.ts
supabase/migrations/20260422000003_polinizacion.sql
```

## Migration SQL
```sql
-- supabase/migrations/20260422000003_polinizacion.sql

CREATE TABLE user_pollination_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  cards_reviewed integer DEFAULT 0,
  domains_touched text[] DEFAULT '{}',
  coins_earned integer DEFAULT 0
);

ALTER TABLE user_pollination_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users own pollination sessions"
  ON user_pollination_sessions FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX ON user_pollination_sessions(user_id, started_at DESC);
```

## Arquitectura

### types.ts
```typescript
export interface PollinationSession {
  id: string
  userId: string
  startedAt: string
  completedAt?: string
  cardsReviewed: number
  domainsTouched: SkillDomain[]
  coinsEarned: number
}
export interface PollinationCard {
  flashcard: Flashcard  // reusa tipo de features/flashcards
  domain: SkillDomain
}
```

### useDailyLock.ts
```typescript
// Verifica si el usuario ya completó una sesión hoy
// Query: SELECT * FROM user_pollination_sessions
//        WHERE user_id = auth.uid() AND DATE(completed_at) = CURRENT_DATE
// Retorna: { canPlay: boolean, lastSession?: PollinationSession, nextAvailableAt?: Date }
```

### usePolinizacion.ts
```typescript
// selectCards(): 6 tarjetas de distintos dominios
//   - Prioriza dominios con mastery más bajo (2 tarjetas del peor dominio)
//   - Al menos 2 dominios distintos
//   - Toma tarjetas vencidas (next_review_at <= now()) de la tabla flashcards
// 
// Timer: 3 minutos (180 segundos)
// onCardRated(card, rating):
//   - Llama apply_flashcard_review RPC
//   - Actualiza cardsReviewed++
//   - Agrega domain a domainsTouched si no está
//
// onComplete():
//   - Aplica bonus 1.2x: por cada dominio tocado, grow_plant(domain, 0.03)
//   - award_coins(15 * cardsReviewed, 'pollination_complete')
//   - Guarda sesión en DB
//   - Invalida gardenKeys.all
```

### BeeProgress.tsx
```tsx
// Visualización SVG/animada de una abeja viajando entre las plantas
// Props: domainsTouched: SkillDomain[], currentDomain: SkillDomain | null
// 
// Layout: 4 flores pequeñas (una por dominio) en arco
// Abeja: emoji 🐝 animado que se mueve entre flores al cambiar currentDomain
// Flores tocadas: se iluminan con glow
// useReducedMotion(): si true, solo cambiar color sin animación de movimiento
```

### PolinizacionSession.tsx
```tsx
// Timer visible en grande: 3:00 → 0:00 (color rojo al llegar a 0:30)
// BeeProgress arriba
// FlipCard en el centro (reutilizar de flashcards o SimpleFlipCard)
// RatingButtons debajo
// Al completar timer O revisar las 6 tarjetas: pantalla de resumen
// Resumen: dominios tocados, tarjetas revisadas, coins ganados
```

### DailyLock.tsx
```tsx
// Se muestra en lugar de la sesión si canPlay === false
// "¡Ya polinizaste hoy! 🐝"
// "Vuelve mañana para la próxima sesión"
// Muestra hora de la última sesión y stats (dominios, cards)
```

## Integración en Jardin.tsx
El botón de acceso a Polinización puede ir en Jardin.tsx (coordinar con agent-7 que también modifica Jardin.tsx — asegúrate de no pisarle cambios, mergear limpio):
```tsx
<PolinizacionButton /> // solo un botón que lleva a /polinizacion
```
O crear ruta `/polinizacion` directamente en App.tsx.

## Verificación
- [ ] Migration SQL sin errores
- [ ] `pnpm build` sin errores
- [ ] Timer 3:00 funciona
- [ ] 6 tarjetas de al menos 2 dominios
- [ ] BeeProgress anima correctamente
- [ ] Bonus 1.2x mastery aplicado al completar
- [ ] Daily lock funciona (no puede repetir el mismo día)
- [ ] `useReducedMotion` respetado en BeeProgress
