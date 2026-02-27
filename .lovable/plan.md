
# Semilla: Curso 1 Completo + Motor de Aprendizaje

## Resumen

Implementar el sistema completo de aprendizaje con persistencia en DB: schema con 6 tablas, seed del curso "Raices" con 7 seeds (escenarios + recall quiz), hooks de datos, motor de espaciado SM-2, sistema de logros real, y la integracion en todas las paginas existentes sin romper el Botanical Skin.

---

## FASE 1 -- Migracion SQL + RLS + Seed

### 1.1 Tablas a crear (1 migracion SQL)

| Tabla | Proposito |
|-------|-----------|
| `courses` | Cursos publicados (slug, title, level, etc.) |
| `scenarios` | Seeds/lecciones con opciones, recall quiz, mision |
| `user_course_progress` | Progreso del usuario por curso (completed_scenarios[], mastery_score) |
| `user_scenario_state` | Estado de espaciado SM-2 por escenario (interval, ease_factor, next_due_at) |
| `user_achievements` | Insignias desbloqueadas |
| `user_activity_days` | Actividad diaria para streak real |

### 1.2 RLS Policies

- `courses` y `scenarios`: SELECT para authenticated (lectura). No INSERT/UPDATE/DELETE desde cliente.
- `user_course_progress`, `user_scenario_state`, `user_achievements`, `user_activity_days`: SELECT/INSERT/UPDATE con `user_id = auth.uid()`.

### 1.3 Triggers

- `update_updated_at` en `user_course_progress` y `user_scenario_state` (reutilizar la funcion existente `update_updated_at_column`).

### 1.4 Seed Data

Insertar 1 curso: **"Raices: Control de dinero sin dolor"** con 7 scenarios. Cada scenario tiene:
- `options` jsonb: 3 opciones con `id`, `text`, `feedback`, `is_best`
- `recall` jsonb: 2-3 preguntas multiple choice con `correct_choice_id` y `explanation`
- `mission` text: mini accion 60-120s sin datos sensibles
- `tags` text[]: para logros tematicos

Contenido de los 7 seeds:

1. **Tu primer quincena** -- Recibes tu primer pago, como lo distribuyes
2. **El presupuesto 50/30/20** -- Crear un presupuesto basico
3. **Tarjeta de credito: amiga o enemiga** -- Manejo de deuda de tarjeta
4. **Tu fondo de emergencia** -- Prepararse para imprevistos
5. **Ahorro vs inversion** -- Diferencia entre guardar y hacer crecer
6. **Deudas inteligentes** -- Priorizar pagos de deuda
7. **Tu primera inversion** -- CETES y opciones accesibles

Cada uno con tags relevantes para logros (`deuda`, `ahorro`, `inversion`, `presupuesto`).

---

## FASE 2 -- Types + Hooks

### 2.1 Tipos manuales

Dado que `types.ts` se autogenera pero puede tardar, crear un archivo auxiliar `src/types/learning.ts` con interfaces TypeScript para los datos de las tablas nuevas, y usar casting generico con `.from()` donde sea necesario hasta que types.ts se regenere.

### 2.2 Hooks a crear

| Hook | Archivo | Descripcion |
|------|---------|-------------|
| `useCourses` | `src/hooks/useCourses.ts` | Lista cursos publicados desde DB |
| `useCourseDetail` | `src/hooks/useCourseDetail.ts` | Curso + scenarios ordenados por order_index |
| `useScenario` | `src/hooks/useScenario.ts` | Un scenario con options/recall parsed |
| `useProgress` | `src/hooks/useProgress.ts` | user_course_progress + user_scenario_state del curso |
| `useReviewQueue` | `src/hooks/useReviewQueue.ts` | Scenarios con next_due_at <= now() |
| `useStreak` | `src/hooks/useStreak.ts` | Calcula racha consecutiva desde user_activity_days |
| `useAchievements` | `src/hooks/useAchievements.ts` | Logros del usuario + funcion unlock() idempotente |
| `useDashboardStats` | `src/hooks/useDashboardStats.ts` | Stats agregados para dashboard (escenarios, tiempo, insignias, racha) |

### 2.3 Utilidad: Motor SM-2

Archivo: `src/lib/spacedRepetition.ts`

```text
calculateSM2(quality: number, currentState):
  - quality 0..5 derivado de score (0..1)
  - score = (bestOption ? 0.5 : 0) + (recallCorrectRatio * 0.5)
  - quality = round(score * 5)
  - Si quality < 3: repetitions=0, interval=1
  - Si quality >= 3: incrementar repetitions, calcular interval y ease_factor
  - Retorna { repetitions, interval_days, ease_factor, next_due_at, last_quality, last_score }
```

### 2.4 Utilidad: Verificador de logros

Archivo: `src/lib/achievementChecker.ts`

Funcion `checkAndUnlockAchievements(context)` que evalua:
- `first_steps`: completed_scenarios.length >= 1
- `steady_learner`: completed_scenarios.length >= 3
- `financial_master`: completed_scenarios.length === total scenarios del curso
- `debt_expert`: scenario completado con tag `deuda` o titulo contiene "Tarjeta"
- `saver`: scenario completado con tag `ahorro` o titulo contiene "Fondo"
- `calculator_user`: se desbloquea desde Calculadora
- `streak_3`: racha >= 3
- `streak_7`: racha >= 7

---

## FASE 3 -- Integracion UI

### 3.1 Dashboard.tsx

Cambios dentro del layout existente (no redisenar):

- **"Semilla de hoy"**: Nuevo bloque entre header y hero card
  - Si hay reviews due: `organic-card` con CTA "Repasar (X min)" que navega al primer scenario due
  - Si no hay due: "Todo al dia" + CTA "Continuar curso"
  - Si no ha empezado: mantener hero card actual "Empieza tu primer curso"
- **Stats reales**: Reemplazar los valores hardcoded "0" por datos de `useDashboardStats`
  - Escenarios: count completed_scenarios
  - Tiempo: sum user_activity_days.minutes (formatear como "Xh Xm")
  - Insignias: count user_achievements / total BADGES
  - Racha: useStreak (dias consecutivos)
- **Progreso semanal**: Reemplazar weeklyData hardcoded por ultimos 7 dias desde user_activity_days

### 3.2 Cursos.tsx

- Reemplazar `COURSES_LIST` por `useCourses()` (datos de DB)
- Reemplazar `userProgress` placeholder por `useProgress` real
- Tabs filtran por: user_course_progress existente (en progreso) y completed_at (completados)
- Mantener exactamente el mismo layout y estilos

### 3.3 CursoDetalle.tsx

- Reemplazar `COURSES_LIST.find()` por `useCourseDetail(id)`
- Reemplazar `completedScenarioIds` placeholder por datos de `useProgress(courseId)`
- Agregar estado "mastered" al ScenarioCard (ademas de locked/in_progress/completed)
- Mostrar doble barra: % completados y % dominados
- CTA navega al primer scenario no completado
- Usar botanical skin (BotanicalPage wrapper, organic-card para hero)

### 3.4 Escenario.tsx (CAMBIO MAS GRANDE)

Convertir a flujo de 3 pasos dentro del mismo layout:

**Estado interno**: `step: 'decision' | 'feedback' | 'recall'`

**Paso 1 - Decision**: (similar al actual)
- Mostrar prompt del scenario
- 3 opciones en organic-cards
- Al seleccionar: registrar eleccion y avanzar a feedback

**Paso 2 - Feedback**:
- Mostrar coaching del scenario
- Feedback especifico de la opcion elegida
- Si hay mission: mostrar la mision
- Boton "Continuar al repaso"

**Paso 3 - Recall Quiz**:
- Mostrar 2-3 preguntas multiple choice una por una
- Al responder cada una: mostrar si es correcta + explicacion
- Al terminar todas: calcular score, actualizar DB

**Al finalizar (despues de recall)**:
- Calcular score: `(bestOption ? 0.5 : 0) + (recallCorrectRatio * 0.5)`
- Upsert `user_scenario_state` con SM-2
- Agregar scenario_id a `completed_scenarios` en `user_course_progress`
- Upsert `user_activity_days` (sumar ~5 min)
- Verificar y desbloquear logros
- Boton: "Siguiente seed" o "Volver al curso"

**Estilo**: Usar botanical skin (BotanicalPage o dashboard-skin wrapper), organic-cards para opciones y preguntas.

### 3.5 ScenarioCard.tsx

- Agregar estado `mastered` (ademas de locked/in_progress/completed)
- Mastered: icono estrella/corona en color leaf-bright, borde leaf-fresh
- Usar colores organicos en vez de los genericos (primary/accent/muted)

### 3.6 Logros.tsx

- Reemplazar `unlockedBadges` placeholder por `useAchievements()`
- Contador dinamico en chip y subtitle
- BadgeCard muestra `unlocked_at` si esta desbloqueado

### 3.7 Perfil.tsx

- Stats reales: usar `useDashboardStats` para escenarios/cursos/logros counts

### 3.8 Calculadora.tsx

- Al presionar "Calcular" por primera vez: desbloquear `calculator_user` via `useAchievements().unlock()`

---

## FASE 4 -- QA / Checklist

- Build TypeScript limpio (sin errores de tipos)
- Sin overflow-x en 360/390/430/768/1024/1440
- Dock no tapa contenido (pb-28 en todas las paginas)
- Botones >= 44px en mobile
- prefers-reduced-motion: desactivar springs, usar fades
- RLS: usuario A no puede leer/modificar progreso de usuario B
- Idempotencia: achievements no se duplican (UNIQUE constraint + ON CONFLICT DO NOTHING)
- completed_scenarios se deduplica antes de upsert
- SM-2 funciona: next_due_at avanza al futuro, si falla recall interval vuelve a 1
- Navegacion completa: Cursos -> Detalle -> Seed 1..7 -> progreso actualizado -> logros -> dashboard

---

## Archivos a crear/modificar

### Nuevos archivos:
| Archivo | Descripcion |
|---------|-------------|
| `src/types/learning.ts` | Interfaces TS para tablas nuevas |
| `src/lib/spacedRepetition.ts` | Motor SM-2 |
| `src/lib/achievementChecker.ts` | Logica de desbloqueo de logros |
| `src/hooks/useCourses.ts` | Hook: lista cursos |
| `src/hooks/useCourseDetail.ts` | Hook: curso + scenarios |
| `src/hooks/useScenario.ts` | Hook: un scenario |
| `src/hooks/useProgress.ts` | Hook: progreso del usuario |
| `src/hooks/useReviewQueue.ts` | Hook: cola de repaso |
| `src/hooks/useStreak.ts` | Hook: racha |
| `src/hooks/useAchievements.ts` | Hook: logros |
| `src/hooks/useDashboardStats.ts` | Hook: stats agregados |

### Archivos modificados:
| Archivo | Cambio |
|---------|--------|
| `src/pages/Dashboard.tsx` | Stats reales, semilla de hoy, progreso semanal real |
| `src/pages/Cursos.tsx` | Datos de DB en vez de placeholders |
| `src/pages/CursoDetalle.tsx` | Datos de DB, estado mastered, BotanicalPage wrapper |
| `src/pages/Escenario.tsx` | Flujo 3 pasos (decision/feedback/recall), persistencia DB |
| `src/pages/Logros.tsx` | Datos reales de achievements |
| `src/pages/Perfil.tsx` | Stats reales |
| `src/pages/Calculadora.tsx` | Unlock calculator_user |
| `src/components/ScenarioCard.tsx` | Estado mastered + colores organicos |
| `src/data/placeholders.ts` | Mantener como fallback pero ya no se usa como fuente primaria |

### Migracion SQL: 1 archivo
- 6 tablas + RLS + triggers + seed data completo (1 curso, 7 scenarios con opciones, recall y misiones)

---

## Riesgos y mitigaciones

| Riesgo | Mitigacion |
|--------|------------|
| types.ts no se regenera inmediatamente | Crear src/types/learning.ts con interfaces manuales; usar `.from('table').select()` con tipo generico |
| Escenario.tsx se vuelve muy complejo | Extraer sub-componentes: DecisionStep, FeedbackStep, RecallStep |
| Overflow en mobile con recall quiz | Usar scroll natural, no fixed positioning, max-w-2xl |
| SM-2 produce intervalos incorrectos | Implementar funcion pura con tests unitarios posibles |

## Orden de implementacion

1. Migracion SQL (todas las tablas + RLS + seed)
2. src/types/learning.ts
3. src/lib/spacedRepetition.ts + src/lib/achievementChecker.ts
4. Todos los hooks (en paralelo, no tienen dependencias entre si)
5. ScenarioCard.tsx (agregar estado mastered)
6. Escenario.tsx (flujo 3 pasos + persistencia)
7. CursoDetalle.tsx (datos reales + BotanicalPage)
8. Cursos.tsx (datos reales)
9. Dashboard.tsx (stats reales + semilla de hoy + weekly chart real)
10. Logros.tsx + Perfil.tsx + Calculadora.tsx (datos reales)
