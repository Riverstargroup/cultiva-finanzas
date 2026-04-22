---
name: agent-6-minigames
description: Crea página Juegos con 2 mini-juegos financieros: Presupuesto Rápido (60s drag classify) y Inflación Challenge (slider guess). Ambos otorgan grow_plant o award_coins al ganar. Linear: DLV-58.
tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
model: sonnet
---

Eres el agente de Mini-Juegos para cultiva-finanzas. Creas 2 mini-juegos financieros que hacen que aprender sea divertido y que otorgan mastery y monedas al ganar.

## Linear issue
**DLV-58** — https://linear.app/riverstar/issue/DLV-58

Cuando termines, marca como "In Review".

## Contexto del proyecto
- Stack: React 18 + TypeScript + Vite + Framer Motion 12 + Supabase + TanStack Query 5
- Branch: `claude/intelligent-babbage-a24cdc`
- Worktree: `D:\Github\cultiva-finanzas\.claude\worktrees\intelligent-babbage-a24cdc\`

## Archivos que te pertenecen (exclusivos)
```
src/features/minigames/
  types.ts
  components/
    GameCard.tsx
  games/
    PresupuestoRapido/
      index.tsx
      usePresupuestoGame.ts
      data.ts          -- gastos y categorías hardcoded inicialmente
    InflacionChallenge/
      index.tsx
      useInflacionGame.ts
      data.ts          -- productos y precios históricos hardcoded
  hooks/
    useMinigameSession.ts
src/pages/Juegos.tsx
```
También agrega ruta en `src/App.tsx`: `<Route path="/juegos" element={<Juegos />} />`

## Archivos a LEER (no modificar)
- `src/features/garden/hooks/useGarden.ts` — useGrowPlant + gardenKeys
- `src/features/garden/types.ts` — SkillDomain

## Juego 1: Presupuesto Rápido

**Concepto**: 6 gastos aparecen uno por uno. El usuario los clasifica arrastrando a: Necesidades / Deseos / Ahorro. Timer de 60 segundos.

```
Datos ejemplo (data.ts):
[
  { id: '1', label: 'Renta del departamento', emoji: '🏠', correct: 'necesidades' },
  { id: '2', label: 'Netflix', emoji: '📺', correct: 'deseos' },
  { id: '3', label: 'Fondo de emergencia', emoji: '💰', correct: 'ahorro' },
  { id: '4', label: 'Comida', emoji: '🛒', correct: 'necesidades' },
  { id: '5', label: 'Salida a restaurante', emoji: '🍽️', correct: 'deseos' },
  { id: '6', label: 'Seguro médico', emoji: '🏥', correct: 'necesidades' },
]
```

**Mecánica**:
- Drag simple (puede rehusar @dnd-kit si ya está instalado, sino HTML5 drag API)
- Puntaje: 10 pts por gasto correcto, -5 por incorrecto
- Al terminar (todos clasificados O timer llega a 0): mostrar resultado
- Si puntaje >= 40: `growPlant.mutate({ domain: 'presupuesto', masteryDelta: 0.04 })`

### usePresupuestoGame.ts
- Estado: timer, currentItems, classifications, score, gameState (idle/playing/done)
- `startGame()`, `classify(itemId, zone)`, `tick()` (via setInterval)

## Juego 2: Inflación Challenge

**Concepto**: Se muestra un producto con su precio de hace 5 años. El usuario mueve un slider para adivinar el precio actual. Se revela el precio real con dato de inflación.

```
Datos ejemplo (data.ts):
[
  { product: 'Tortillas 1kg', emoji: '🫓', year: 2020, price2020: 19, price2025: 28, category: 'inflacion' },
  { product: 'Gasolina 1L', emoji: '⛽', year: 2020, price2020: 18.5, price2025: 24, category: 'inflacion' },
  { product: 'Salario mínimo diario', emoji: '💵', year: 2020, price2020: 123, price2025: 278, category: 'ahorro' },
]
```

**Mecánica**:
- Slider con rango [precio_base * 0.5, precio_base * 3]
- El usuario mueve el slider, ve precio en tiempo real
- Al confirmar: revelar precio real con animación
- Si error < 15%: `award_coins(30, 'inflation_guess')` + efecto de confetti

## GameCard.tsx (para página Juegos)
```typescript
interface GameCardProps {
  title: string
  description: string
  emoji: string
  difficulty: 1 | 2 | 3
  highScore?: number
  onPlay: () => void
}
```

## useMinigameSession.ts
- Guarda intento en `user_activity_attempts` (tabla ya existe en DB Phase 1)
- Campos: user_id, activity_type ('presupuesto_rapido' | 'inflacion_challenge'), score, completed_at

## Recompensas
```typescript
// Presupuesto Rápido ganado:
const growPlant = useGrowPlant()
growPlant.mutate({ domain: 'presupuesto', masteryDelta: 0.04 })

// Inflación Challenge acertado:
await supabase.rpc('award_coins', { p_user_id, p_amount: 30, p_reason: 'inflation_guess' })
queryClient.invalidateQueries({ queryKey: gardenKeys.all })
```

## Verificación
- [ ] `pnpm build` sin errores
- [ ] Ambos juegos funcionan con touch (mobile)
- [ ] Timer visible en Presupuesto Rápido
- [ ] Slider funciona en mobile
- [ ] Coins/mastery otorgados al ganar
- [ ] Ruta /juegos accesible desde sidebar
