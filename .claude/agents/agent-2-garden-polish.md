---
name: agent-2-garden-polish
description: Conecta el sistema de partículas y animaciones del jardín (Phase 1 definió las constantes, este agente las activa). Crea ParticleEffect.tsx, conecta stage-up confetti, coins burst, ambient mastered glow, y health visual filter. Linear: DLV-54.
tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
model: sonnet
---

Eres el agente de animaciones del jardín para cultiva-finanzas. Tu trabajo es conectar el sistema de partículas y variantes de Framer Motion que ya están definidos en Phase 1 pero no están activos en el UI.

## Linear issue
**DLV-54** — https://linear.app/riverstar/issue/DLV-54

Cuando termines, marca el issue como "In Review" usando el MCP de Linear.

## Contexto del proyecto
- Stack: React 18 + TypeScript + Vite + Framer Motion 12 + Supabase + TanStack Query 5
- Branch: `claude/intelligent-babbage-a24cdc`
- Worktree: `D:\Github\cultiva-finanzas\.claude\worktrees\intelligent-babbage-a24cdc\`

**IMPORTANTE**: Todos tus cambios van en el worktree, NO en `D:\Github\cultiva-finanzas\`.

## Archivos que te pertenecen (exclusivos — no conflicto con otros agentes)
- `src/features/garden/components/sprites/*.tsx` — pulir animaciones por stage
- `src/features/garden/components/ParticleEffect.tsx` — CREAR
- `src/features/garden/constants/particles.ts` — ya existe, conectar
- `src/features/garden/constants/motion.ts` — ya existe, conectar

## Archivos a LEER pero no modificar
- `src/features/garden/components/GardenPlot.tsx` — entender props interface
- `src/features/garden/components/PlantSprite.tsx` — ya tiene `animation` prop
- `src/features/garden/components/GardenStats.tsx` — para coins burst trigger
- `src/features/garden/hooks/useGarden.ts` — para gardenKeys

## Tareas

### 1. Crear ParticleEffect.tsx
```tsx
// src/features/garden/components/ParticleEffect.tsx
// Consume ParticleConfig de constants/particles.ts
// Renderiza partículas con Framer Motion animate presence
// Props: config: ParticleConfig, active: boolean, onComplete?: () => void
// Respetar useReducedMotion(): si true, no renderizar partículas
```

### 2. Conectar stage-up confetti a GardenPlot
- Cuando `plant.stage` cambia a valor mayor → disparar `stageUpgradeConfig`
- Usar `usePrevious` pattern para detectar cambio de stage
- Posicionar partículas centradas en el plot

### 3. Conectar coins burst a GardenStats
- Cuando `coins` sube (comparar con valor anterior) → disparar `coinEarnedConfig`
- Posicionar burst cerca del coin counter

### 4. Ambient mastered glow
- Plantas con `stage === 'mastered'` → `masteredAmbientConfig` en loop continuo
- Detener cuando `stage` baja (no debería, pero defensivo)

### 5. Health visual filter en sprites
- `thriving`: sin filtro
- `healthy`: sin filtro  
- `wilting`: `filter: saturate(0.5) brightness(0.85)`
- `dying`: `filter: saturate(0.2) brightness(0.7) sepia(0.3)`
- Aplicar como style prop en PlantSprite o directo en cada sprite

### 6. useReducedMotion en todo
- Importar `useReducedMotion` de framer-motion en cada componente animado
- Si `shouldReduce`: solo transiciones de opacidad, duración máx 150ms, sin partículas

## Contratos que NO debes cambiar
```typescript
// NO cambiar estas interfaces en useGarden.ts:
export const gardenKeys = { all, plots(userId), coins(userId) }

// NO cambiar GardenPlot props — solo AGREGAR opcionales si necesitas
// NO cambiar PlantSprite props — ya tiene animation: PlantAnimationKey
```

## Verificación antes de marcar done
- [ ] `pnpm build` sin errores en el worktree
- [ ] ParticleEffect.tsx existe y compila
- [ ] stage-up animation se dispara al cambiar stage
- [ ] coins burst al subir monedas
- [ ] prefers-reduced-motion: solo opacity transitions
- [ ] Sprites dying/wilting tienen filtro de color
