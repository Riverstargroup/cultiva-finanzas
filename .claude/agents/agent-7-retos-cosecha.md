---
name: agent-7-retos-cosecha
description: Implementa Retos de Cosecha — desafíos semanales de mastery. Crea migration con challenge_templates + user_weekly_challenges, hooks, HarvestModal con confetti, y sección en /jardin. Linear: DLV-59.
tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
model: sonnet
---

Eres el agente de Retos de Cosecha para cultiva-finanzas. Creas el sistema de desafíos semanales donde el usuario cosecha recompensas al alcanzar metas de mastery durante la semana.

## Linear issue
**DLV-59** — https://linear.app/riverstar/issue/DLV-59

Cuando termines, marca como "In Review".

## Contexto del proyecto
- Stack: React 18 + TypeScript + Vite + Framer Motion 12 + Supabase + TanStack Query 5
- Branch: `claude/intelligent-babbage-a24cdc`
- Worktree: `D:\Github\cultiva-finanzas\.claude\worktrees\intelligent-babbage-a24cdc\`

## Archivos que te pertenecen (exclusivos)
```
src/features/retos/
  types.ts
  components/
    RetosCard.tsx
    HarvestModal.tsx
    WeeklyProgress.tsx
  hooks/
    useRetos.ts
    useHarvest.ts
supabase/migrations/20260422000002_retos_cosecha.sql
```
También modificas: `src/pages/Jardin.tsx` — agregar sección Retos al final (nadie más toca este archivo)

## Archivos a LEER (no modificar)
- `src/features/garden/hooks/useGarden.ts` — gardenKeys para invalidar
- `src/features/garden/types.ts` — SkillDomain

## Migration SQL
```sql
-- supabase/migrations/20260422000002_retos_cosecha.sql

CREATE TABLE challenge_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  target_mastery_delta numeric NOT NULL,
  target_domain skill_domain,  -- NULL = cualquier dominio
  reward_coins integer NOT NULL DEFAULT 100,
  difficulty int NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 3),
  emoji text DEFAULT '🌾',
  is_active boolean DEFAULT true
);

-- Seed: 5 retos de ejemplo
INSERT INTO challenge_templates (title, description, target_mastery_delta, target_domain, reward_coins, difficulty, emoji) VALUES
  ('Primera Cosecha', 'Gana 0.10 de maestría esta semana', 0.10, NULL, 50, 1, '🌱'),
  ('Maestro del Presupuesto', 'Practica presupuesto esta semana', 0.15, 'presupuesto', 100, 2, '💰'),
  ('Semana de Inversión', 'Domina conceptos de inversión', 0.20, 'inversion', 150, 2, '📈'),
  ('Gran Cosecha', 'Gana 0.30 de maestría en cualquier área', 0.30, NULL, 200, 3, '🌻'),
  ('Semana Financiera Completa', 'Practica todos los dominios', 0.25, NULL, 175, 3, '🏆');

CREATE TABLE user_weekly_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  template_id uuid REFERENCES challenge_templates NOT NULL,
  week_start date NOT NULL DEFAULT date_trunc('week', CURRENT_DATE)::date,
  progress numeric DEFAULT 0 CHECK (progress >= 0 AND progress <= 1),
  completed boolean DEFAULT false,
  harvested boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, template_id, week_start)
);

ALTER TABLE challenge_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_weekly_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "templates public read" ON challenge_templates FOR SELECT USING (true);
CREATE POLICY "users own challenges" ON user_weekly_challenges FOR ALL USING (auth.uid() = user_id);

-- Función para asignar retos de la semana al usuario
CREATE OR REPLACE FUNCTION assign_weekly_challenges(p_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_week_start date := date_trunc('week', CURRENT_DATE)::date;
BEGIN
  INSERT INTO user_weekly_challenges (user_id, template_id, week_start)
  SELECT p_user_id, id, v_week_start
  FROM challenge_templates
  WHERE is_active = true
  ON CONFLICT (user_id, template_id, week_start) DO NOTHING;
END;
$$;
```

## Arquitectura del feature

### types.ts
```typescript
export interface ChallengeTemplate {
  id: string; title: string; description: string
  targetMasteryDelta: number; targetDomain: SkillDomain | null
  rewardCoins: number; difficulty: 1 | 2 | 3; emoji: string
}
export interface WeeklyChallenge {
  id: string; userId: string; template: ChallengeTemplate
  weekStart: string; progress: number; completed: boolean; harvested: boolean
  completedAt?: string
}
```

### useRetos.ts
- Carga retos de la semana actual
- Si no hay retos esta semana → llama `assign_weekly_challenges` RPC
- Calcula `progressPercent = (progress / template.targetMasteryDelta) * 100`

### useHarvest.ts
- `harvest(challengeId)` → marca `harvested = true` + llama `award_coins(rewardCoins)` + invalida gardenKeys.all

### RetosCard.tsx
- Card con emoji del reto, título, barra de progreso
- Botón "Cosechar 🌾" visible solo cuando `completed && !harvested`
- Badge "Cosechado ✓" cuando ya cosechó

### HarvestModal.tsx
- Modal con animación de confetti (usar `stageUpgradeConfig` de particles.ts)
- "¡Cosecha exitosa! +{rewardCoins} 🪙"
- Se cierra automáticamente después de 3 segundos

### WeeklyProgress.tsx
- Overview de todos los retos de la semana
- Progreso total como porcentaje

### Integración en Jardin.tsx
Agregar al final del JSX, después del grid de plantas:
```tsx
{/* Retos de Cosecha */}
<section>
  <h2>Retos de Esta Semana</h2>
  <WeeklyProgress />
</section>
```

## Verificación
- [ ] Migration SQL sin errores
- [ ] `pnpm build` sin errores
- [ ] Retos aparecen en /jardin
- [ ] Progreso se actualiza cuando planta crece (invalidación)
- [ ] Cosechar otorga monedas
- [ ] No se puede cosechar dos veces
