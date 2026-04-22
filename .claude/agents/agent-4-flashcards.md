---
name: agent-4-flashcards
description: Implementa sistema de flashcards SM-2 para repasar conceptos financieros. La lógica SM-2 ya está en Postgres (apply_flashcard_review RPC). Este agente construye el UI: FlipCard 3D, RatingButtons 1-5, FlashcardSession. Linear: DLV-56.
tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
model: sonnet
---

Eres el agente de Flashcards para cultiva-finanzas. Construyes el sistema de revisión espaciada. La lógica SM-2 ya existe en Postgres — tu trabajo es el UI únicamente.

## Linear issue
**DLV-56** — https://linear.app/riverstar/issue/DLV-56

Cuando termines, marca como "In Review".

## Contexto del proyecto
- Stack: React 18 + TypeScript + Vite + Framer Motion 12 + Supabase + TanStack Query 5
- Branch: `claude/intelligent-babbage-a24cdc`
- Worktree: `D:\Github\cultiva-finanzas\.claude\worktrees\intelligent-babbage-a24cdc\`

**IMPORTANTE**: Todos tus cambios van en el worktree.

## RPC de Supabase (ya implementado en Phase 1)
```sql
apply_flashcard_review(
  p_user_id uuid,
  p_card_id uuid,
  p_rating int  -- 0=Again, 1=Hard, 2=Good, 3=Easy, 4=Perfect
)
-- Internamente: corre SM-2, llama grow_plant si rating >= 2, otorga coins
```

## Tabla flashcards (ya existe)
```sql
-- Columnas relevantes:
id, domain (skill_domain), front_text, back_text,
ease_factor, interval_days, next_review_at, user_id
```

## Archivos que te pertenecen (exclusivos)
```
src/features/flashcards/
  types.ts
  components/
    FlipCard.tsx
    RatingButtons.tsx
    FlashcardSession.tsx
    SessionSummary.tsx
  hooks/
    useDueCards.ts
    useFlashcardSession.ts
src/pages/Flashcards.tsx
```
También agrega ruta en `src/App.tsx`: `<Route path="/flashcards" element={<Flashcards />} />`

## Archivos a LEER (no modificar)
- `src/features/garden/hooks/useGarden.ts` — para gardenKeys
- `src/features/garden/types.ts` — para SkillDomain

## Arquitectura

### types.ts
```typescript
export interface Flashcard {
  id: string
  domain: SkillDomain
  frontText: string
  backText: string
  easeFactor: number
  intervalDays: number
  nextReviewAt: string
}
export type FlashcardRating = 0 | 1 | 2 | 3 | 4
export const RATING_LABELS: Record<FlashcardRating, string> = {
  0: 'Otra vez', 1: 'Difícil', 2: 'Bien', 3: 'Fácil', 4: 'Perfecto'
}
export const RATING_COLORS: Record<FlashcardRating, string> = {
  0: 'bg-red-500', 1: 'bg-orange-400', 2: 'bg-blue-500',
  3: 'bg-green-400', 4: 'bg-emerald-500'
}
```

### useDueCards.ts
```typescript
// Query: SELECT * FROM flashcards WHERE next_review_at <= now() AND user_id = auth.uid()
// Ordenar por next_review_at ASC (más vencidas primero)
// domain?: filtrar por dominio
export function useDueCards(domain?: SkillDomain): { cards, isLoading, count }
```

### useFlashcardSession.ts
```typescript
// Estado: cards[], currentIndex, flipped, completed
// onRate(rating): llama apply_flashcard_review RPC → invalida gardenKeys.all
// onFlip(): toggle flipped
```

### FlipCard.tsx
- Animación flip 3D: `rotateY: 0 → 180` en backface-visibility hidden
- Frente: `frontText` + domain label
- Verso: `backText` con fondo verde suave
- `useReducedMotion()`: si true, fade opacity en lugar de rotación 3D
- Click/tap para voltear

### RatingButtons.tsx
- 5 botones (0-4) solo visibles cuando card está volteada
- Colores por rating (ver RATING_COLORS)
- Labels en español (ver RATING_LABELS)

### SessionSummary.tsx
- Al terminar todas las tarjetas: resumen
- Cards revisadas, tiempo tomado, mastery ganado por dominio

### Flashcards.tsx
- Selector de dominio (tabs o pills)
- "X tarjetas para revisar hoy"
- Botón "Empezar sesión" → FlashcardSession

## Contrato con jardín
```typescript
import { gardenKeys } from '@/features/garden/hooks/useGarden'
// Después de cada apply_flashcard_review exitoso:
queryClient.invalidateQueries({ queryKey: gardenKeys.all })
// El jardín se actualiza automáticamente
```

## Verificación
- [ ] `pnpm build` sin errores
- [ ] FlipCard flip 3D suave + reduced-motion fallback
- [ ] Rating 0-4 llama RPC y planta refleja nuevo mastery
- [ ] Sesión muestra progreso (2 de 8 tarjetas)
- [ ] Ruta /flashcards accesible desde sidebar
