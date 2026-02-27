

# Curso 2 + Presets Deuda + Tags-Skills + Misiones Gamificadas

## Resumen

Bundle de 4 features independientes que se implementan en secuencia:
1. Seed del Curso 2 "Credito sin miedo" (9 scenarios) en DB
2. Tab "Deuda" en Calculadora con presets y simulador snowball/avalanche
3. Sistema de Skills (DB + logica de actualizacion al completar escenarios)
4. Misiones guiadas con persistencia (user_missions) y UI en FeedbackStep

---

## FASE 1: Migracion SQL (3 tablas nuevas + seed)

### 1.1 Nuevas tablas

| Tabla | Columnas clave |
|-------|---------------|
| `skills` | id(text PK), domain(text), title(text), description(text), icon(text), sort_order(int) |
| `user_skills` | user_id(uuid default auth.uid()), skill_id(text references skills), mastery(numeric default 0), status(text default 'locked'), updated_at(timestamptz) -- UNIQUE(user_id, skill_id) |
| `user_missions` | user_id(uuid default auth.uid()), scenario_id(uuid references scenarios on delete cascade), status(text default 'pending'), done_at(timestamptz) -- UNIQUE(user_id, scenario_id) |

### 1.2 RLS

- `skills`: SELECT para authenticated (lectura publica)
- `user_skills`: SELECT/INSERT/UPDATE con user_id = auth.uid()
- `user_missions`: SELECT/INSERT/UPDATE con user_id = auth.uid()

### 1.3 Seed Skills (15 skills) + Edges

Insertar los 15 skills con ids estables (control_basics, budget_3_buckets, etc.) usando ON CONFLICT DO NOTHING.

Nota: "edges" (path entre skills) se implementan como constante front en `src/data/skillEdges.ts`, no como tabla DB. Esto simplifica y evita queries innecesarios.

### 1.4 Seed Curso 2

Insertar curso 'credito-sin-miedo' + 9 scenarios con el SQL exacto proporcionado por el usuario. Para idempotencia: DELETE scenarios del curso antes de re-insertar (dentro de la misma transaccion).

---

## FASE 2: Archivos nuevos (constantes + logica)

### 2.1 `src/data/debtPresets.ts`
Constante DEBT_PRESETS con los 3 presets exactos del usuario.

### 2.2 `src/data/skillEdges.ts`
Constante SKILL_EDGES con los 4 paths definidos por el usuario.

### 2.3 `src/lib/tagSkillMap.ts`
Constante TAG_SKILL_MAP con el mapeo exacto tags-to-skillIds.

### 2.4 `src/lib/skillUpdater.ts`
Funcion `updateSkillsOnCompletion(userId, tags, lastScore, isFirstCompletion)`:
- Determina skillIds desde TAG_SKILL_MAP
- Calcula delta = clamp(0.08 + 0.22 * lastScore, 0.08, 0.30)
- Solo aplica delta si isFirstCompletion = true (evita exploit)
- Upsert user_skills con mastery_new = min(1.0, mastery_old + delta)
- Status: mastery >= 0.8 = 'mastered', else 'unlocked'

---

## FASE 3: Integracion UI

### 3.1 Escenario.tsx -- handleFinish

Agregar al flujo de finalizacion (despues de achievements):
1. Determinar `isFirstCompletion` = !completedArr.includes(scenarioId) (ya se calcula)
2. Si isFirstCompletion: llamar `updateSkillsOnCompletion(user.id, scenario.tags, score, true)`
3. Invalidar query key ["user-skills"]

### 3.2 FeedbackStep.tsx -- Misiones interactivas

Agregar props: `scenarioId`, `userId`, `missionStatus` (loaded from parent)

Cambiar el bloque de mission para incluir 2 botones:
- "Marcar como hecha" -> upsert user_missions status='done', done_at=now()
- "Omitir" -> upsert user_missions status='skipped'
- Si ya completada: mostrar checkmark verde "Mision completada"

El estado de mision se carga en Escenario.tsx con un query simple al montar.

### 3.3 Calculadora.tsx -- Tab Deuda

Agregar tabs "Interes compuesto" / "Deuda" con chip organico (mismos estilos que Cursos.tsx tabs).

**Tab Deuda**:
- Dropdown "Cargar ejemplo" (Select de Radix) con los 3 presets
- Al seleccionar: llena campos del formulario
- Formulario en organic-card: lista de deudas (nombre, saldo, tasa anual, pago minimo) + pago extra + estrategia (snowball/avalanche)
- CTA "Simular" con vibrant-btn
- Resultados en card-stat: meses para salir, total pagado, intereses totales
- Logica de simulacion pura (iterar mes a mes hasta saldo 0)

### 3.4 Dashboard.tsx -- Momentum mini-metrica

Agregar un 5to stat o chip con "Impulso" = count user_missions done ultimos 7 dias.

Alternativa mas simple: agregar dentro del bloque de stats existente, reemplazando o agregando un dato.

Para MVP: solo mostrar si hay al menos 1 mision completada. Si no, no mostrar.

---

## FASE 4: Types

### 4.1 `src/types/learning.ts`
Agregar interfaces: Skill, UserSkill, UserMission.

### 4.2 Hooks nuevos

| Hook | Archivo | Descripcion |
|------|---------|-------------|
| `useUserSkills` | `src/hooks/useUserSkills.ts` | Lista user_skills del usuario actual |
| `useUserMission` | `src/hooks/useUserMission.ts` | Estado de mision para un scenario_id |

---

## Archivos a crear

| Archivo | Descripcion |
|---------|-------------|
| `src/data/debtPresets.ts` | 3 presets de deuda |
| `src/data/skillEdges.ts` | Paths entre skills |
| `src/lib/tagSkillMap.ts` | Mapeo tags -> skillIds |
| `src/lib/skillUpdater.ts` | Logica de actualizacion de skills |
| `src/hooks/useUserSkills.ts` | Hook: skills del usuario |
| `src/hooks/useUserMission.ts` | Hook: estado mision por scenario |

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/types/learning.ts` | Agregar Skill, UserSkill, UserMission interfaces |
| `src/pages/Escenario.tsx` | Llamar skillUpdater + cargar missionStatus + pasar props a FeedbackStep |
| `src/components/scenario/FeedbackStep.tsx` | Botones "Marcar como hecha" / "Omitir" en bloque mission |
| `src/pages/Calculadora.tsx` | Tabs + tab Deuda completo con presets y simulador |
| `src/pages/Dashboard.tsx` | Momentum mini-metrica (opcional, solo si hay misiones hechas) |

## Migracion SQL: 1 archivo

- 3 tablas nuevas (skills, user_skills, user_missions) + RLS
- Seed: 15 skills + curso 2 con 9 scenarios (copy exacto del usuario)

---

## Checklist

- No se rompe diseno (organic-card, botanical-bg, pb-28)
- No overflow-x en 360-1440
- No se rompen rutas existentes
- Seed idempotente (ON CONFLICT)
- Skills solo se actualizan en primera completion (no exploit)
- Misiones persisten por usuario (auth.uid())
- Presets son constantes front, no afectan DB
- Tab Deuda es simulacion local (no persiste en DB)
- Copy exacto del usuario, sin inventar
- Build TS limpio

