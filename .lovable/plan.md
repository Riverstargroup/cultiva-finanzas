

# Semilla -- Implementacion Completa en 3 Fases

## Estado actual del TARGET

- 1 ruta protegida: `/dashboard` (placeholder con metricas hardcodeadas)
- Sidebar con links a `/cursos`, `/calculadora`, `/logros`, `/perfil` (todos dan 404)
- DB: solo tabla `profiles` (id, full_name, avatar_url)
- `types.ts` solo tiene `profiles` -- **no se puede llamar `supabase.from("courses")` sin romper TS**
- Framer Motion instalado, Recharts instalado, shadcn/ui completo
- Design system: Nunito + Playfair Display, tokens Semilla (green, earth, gold, cream)

---

## FASE 1: UI con datos placeholder (sin tocar DB)

Todas las paginas usan constantes locales hardcodeadas. Cero llamadas a `supabase.from()` para tablas inexistentes. Build limpio garantizado.

### Archivos nuevos

| Archivo | Proposito |
|---------|-----------|
| `src/hooks/useReducedMotion.ts` | Hook: `prefers-reduced-motion` media query |
| `src/components/PageTransition.tsx` | Wrapper framer-motion con soporte reduced-motion |
| `src/components/StatCard.tsx` | Card de metrica reutilizable (icono, titulo, valor, acento) |
| `src/components/CourseCard.tsx` | Card de curso con progreso, dificultad badge, tap/hover |
| `src/components/EmptyState.tsx` | Estado vacio con icono + texto + CTA |
| `src/components/SkeletonCard.tsx` | Skeleton loading card |
| `src/components/BadgeCard.tsx` | Card de logro (desbloqueado/bloqueado) |
| `src/components/ProgressRing.tsx` | Anillo SVG circular de progreso |
| `src/components/ScenarioCard.tsx` | Card de escenario con estado (locked/in_progress/completed) |
| `src/pages/Cursos.tsx` | Lista de cursos con tabs (Todos/En progreso/Completados) |
| `src/pages/CursoDetalle.tsx` | Detalle de curso con lista de 5 escenarios y estados |
| `src/pages/Escenario.tsx` | Escenario interactivo con 3 opciones y feedback |
| `src/pages/Perfil.tsx` | Info basica, estadisticas, editar nombre, cerrar sesion |
| `src/pages/Logros.tsx` | Grid de 8 badges (alineados con Kimi IDs) |
| `src/pages/Calculadora.tsx` | Calculadora de interes compuesto con grafico Recharts |

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/App.tsx` | Agregar 6 rutas nuevas dentro del ProtectedRoute/AppLayout |
| `src/pages/Dashboard.tsx` | Refactor completo: PageTransition, StatCards, seccion "Continuar", empty state, accesos rapidos, animaciones stagger |
| `src/components/AppLayout.tsx` | Envolver Outlet con PageTransition |

### Datos placeholder (constantes locales)

Curso piloto "Fundamentos Financieros" con 5 escenarios:

1. **Aguinaldo** -- "Recibes tu aguinaldo, que haces?" -- opciones con id estable: `opt_a`, `opt_b`, `opt_c`
2. **Presupuesto** -- "Tu ingreso mensual es $12,000, como lo distribuyes?"
3. **Tarjeta de credito** -- "Tienes una deuda de tarjeta, que estrategia sigues?"
4. **Fondo de emergencia** -- "Surge un gasto inesperado, como lo cubres?"
5. **CETES** -- "Tienes un ahorro, donde lo pones a trabajar?"

Cada opcion: `{ id: "opt_a" | "opt_b" | "opt_c", text, feedback, is_best: boolean }`

8 badges con IDs de Kimi: `first_steps`, `steady_learner`, `financial_master`, `streak_3`, `streak_7`, `calculator_user`, `debt_expert`, `saver`

### Animaciones (Fase 1)

- `PageTransition`: fade + slide-up (0.28s, easeOut). Reduced-motion: solo opacity 0.15s
- Cards: `whileTap={{ scale: 0.98 }}` mobile, `whileHover={{ y: -4 }}` desktop (spring stiffness 300, damping 30)
- Listas: stagger children 0.06s delay
- Escenario feedback: scale-in al seleccionar opcion

### Tipografia y accesibilidad

- Body: `text-base` (16px), lectura: `text-lg` (18px)
- `leading-relaxed` (line-height 1.625) en contenido
- Botones: `min-h-[44px]` en mobile
- Font weights: minimo `font-normal` (400), labels `font-medium` (500)
- Focus visible (ya provisto por shadcn)

---

## FASE 2: Migracion DB + Seed + RLS

Se ejecuta despues de que Fase 1 compile correctamente.

### Migracion SQL

```text
-- Tabla courses
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  category text,
  difficulty text,
  duration_min integer DEFAULT 0,
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Tabla scenarios
CREATE TABLE public.scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  options jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Tabla user_course_progress
CREATE TABLE public.user_course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed_scenarios uuid[] DEFAULT '{}',        -- uuid[], no text[]
  last_scenario_id uuid,                          -- uuid, no text
  last_selected_option_id text,                   -- guarda opt_a/opt_b/opt_c
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Tabla user_achievements
CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
```

### RLS Policies

- `courses`: SELECT para authenticated (lectura publica dentro de sesion)
- `scenarios`: SELECT para authenticated
- `user_course_progress`: SELECT/INSERT/UPDATE donde `user_id = auth.uid()`
- `user_achievements`: SELECT/INSERT donde `user_id = auth.uid()`

### Seed Data

1 curso "Fundamentos Financieros" (basico, ~30min) con 5 escenarios insertados en `scenarios`, cada uno con `options` jsonb usando IDs estables (`opt_a`, `opt_b`, `opt_c`).

### Trigger

`update_updated_at` trigger en `user_course_progress` para auto-actualizar `updated_at`.

### Post-migracion: types.ts

Tras ejecutar la migracion, verificar que `types.ts` se regenero con las nuevas tablas. Si no se actualizo automaticamente, se actualizara manualmente agregando las definiciones de `courses`, `scenarios`, `user_course_progress` y `user_achievements` al tipo `Database`.

---

## FASE 3: Hooks de datos + integracion real + motion polish

### Hooks nuevos

| Hook | Funcion |
|------|---------|
| `src/hooks/useCourses.ts` | Fetch cursos con escenarios desde DB |
| `src/hooks/useCourseProgress.ts` | CRUD progreso: iniciar curso, completar escenario (guardar `last_selected_option_id`), verificar finalizacion |
| `src/hooks/useAchievements.ts` | Fetch logros, desbloquear nuevos (con logica de condiciones) |

### Integracion por pagina

- **Dashboard**: queries reales (cursos en progreso, escenarios completados count, logros count). Empty state si 0 cursos iniciados
- **Cursos**: fetch `courses` + left join progreso del usuario para mostrar estado por curso
- **CursoDetalle**: fetch `scenarios` del curso + progreso para marcar estados (locked si el anterior no completado, in_progress, completed)
- **Escenario**: al elegir opcion, upsert en `user_course_progress` agregando scenario_id a `completed_scenarios[]` y guardando `last_selected_option_id`. Verificar y desbloquear logros
- **Perfil**: stats reales desde progreso + logros count
- **Logros**: cruzar 8 badges estaticos con `user_achievements`
- **Calculadora**: al usarla por primera vez, desbloquear logro `calculator_user`

### Logica de logros

| Badge ID | Condicion |
|----------|-----------|
| `first_steps` | `completed_scenarios.length >= 1` |
| `steady_learner` | `completed_scenarios.length >= 3` |
| `financial_master` | Todos los escenarios del curso completados |
| `streak_3` | Placeholder (no hay tabla de actividad diaria aun) |
| `streak_7` | Placeholder |
| `calculator_user` | Usuario visita `/calculadora` y ejecuta un calculo |
| `debt_expert` | Completar escenario "Tarjeta de credito" |
| `saver` | Completar escenario "Fondo de emergencia" |

### Motion polish final

- Verificar que todas las animaciones respetan `prefers-reduced-motion`
- Transiciones de pagina consistentes via PageTransition
- Feedback visual en escenarios: opcion seleccionada escala + color + texto feedback con fade-in
- Cards con spring physics en hover/tap

---

## Checklist de calidad (aplicado al final)

- Sin overflow-x en 360/390/430/768/1024/1440
- Todos los botones >= 44px en mobile
- Body text >= 16px, lectura >= 18px
- line-height >= 1.55
- Skeleton loading en cada pagina
- Empty state con CTA en listas vacias
- Error handling con toast
- Build sin errores TS
- Componentes reutilizados sin duplicacion
- `prefers-reduced-motion` respetado
- Focus visible en interactivos
- IDs de opciones estables (opt_a/opt_b/opt_c)
- `completed_scenarios` es uuid[]
- `last_selected_option_id` se guarda al completar escenario

---

## Orden de ejecucion

1. `useReducedMotion` + componentes compartidos (PageTransition, StatCard, CourseCard, EmptyState, SkeletonCard, BadgeCard, ProgressRing, ScenarioCard)
2. Paginas con placeholder: Cursos, CursoDetalle, Escenario, Perfil, Logros, Calculadora
3. Dashboard refactor
4. App.tsx: agregar rutas
5. AppLayout.tsx: PageTransition wrapper
6. Migracion SQL (tablas + seed + RLS + trigger)
7. Verificar/actualizar types.ts post-migracion
8. Hooks de datos (useCourses, useCourseProgress, useAchievements)
9. Reemplazar placeholders por datos reales en todas las paginas
10. Polish final: animaciones, responsive QA, accesibilidad

