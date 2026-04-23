# Semilla V2 — Gameplan

> **Operational playbook.** Sprint-by-sprint plan to transform Semilla V1 (garden as tab) into Semilla V2 (garden as soul). Read `docs/VISION.md` first.

Each sprint lists: **Goals, Tasks (with file paths), Success Metrics, Dependencies, Agent Delegation**.

Sprint lengths assume a single solo supervisor orchestrating Codex + Claude Code agents. Expect 5–10 working days per sprint.

---

## Sprint 0 — Foundation: The Garden Is Home

**Goal:** Restructure routing and navigation so the garden is the landing page after auth. Kill the "Jardín" tab concept. Dashboard becomes HUD overlay on the garden, not a separate screen.

### Tasks

1. **Route restructure**
   - `src/App.tsx` → change `/` route from `Dashboard` to new `GardenHome` component
   - Move `src/pages/Jardin.tsx` logic into `src/pages/GardenHome.tsx`
   - Redirect legacy `/jardin` → `/`
   - `src/pages/Dashboard.tsx` deprecated; contents split into HUD + side panels

2. **Navigation shell overhaul**
   - Create `src/components/garden-shell/GardenShell.tsx` — layered layout:
     - Layer 0: garden canvas (full viewport)
     - Layer 1: floating HUD (coins, streak, level)
     - Layer 2: garden POI buttons (shop gate, flashcards bench, calculator mailbox)
     - Layer 3: modals / side drawers for deep features
   - Replace bottom nav with **garden-integrated POIs**. Tabs only for dense features (Cursos, Perfil) via a drawer.

3. **Remove garden-as-tab vestiges**
   - `src/components/AppSidebar.tsx` (or equivalent): remove Jardín link; treat home icon as "return to garden"
   - All deep pages get a persistent "← Volver al jardín" button

4. **Supabase: fix `gardenKeys.inventory`**
   - Root-cause of `oe.inventory is not a function` crash: `src/features/garden/hooks/useGarden.ts` query-key object was missing `inventory`. Add a TypeScript type that **exhaustively** enumerates keys:
     ```ts
     type GardenQueryKey = { all: QK; plants: QK; inventory: QK; stats: QK; events: QK }
     const gardenKeys: GardenQueryKey = { ... }
     ```
   - Add unit test `gardenKeys.test.ts` asserting every key resolves to an array.

### Success Metrics
- No route reaches `Dashboard.tsx` in analytics
- Garden loads as first authenticated screen in < 1.5s FCP
- Zero TypeScript errors on `gardenKeys`
- Lighthouse perf ≥ 90 on `/`

### Dependencies
None — this unblocks everything else.

### Agent Delegation
- **Claude Code Logic Agent:** routing, HUD layout, query-key fix
- **Claude Code Test Agent:** regression tests for routes, gardenKeys completeness test
- **Review Agent:** gates merge

---

## Sprint 1 — Plants Alive

**Goal:** Replace static SVG plants with animated, personified characters with eyes, expressions, idle motion, and reactive animations. Implement plant naming.

### Tasks

1. **Sprite system refactor**
   - Current: `src/features/garden/components/sprites/Girasol.tsx` etc. — static SVG
   - New: `src/features/garden/components/sprites/PlantCharacter.tsx` — parameterized character rig
     - Props: `species`, `stage`, `mood`, `customName`, `animationCue`
     - Internal: layered SVG (body, eyes, mouth, accessories slot) driven by Framer Motion
   - Keep one file per species for variant data (colors, proportions): `GirasolVariant.ts`, etc.

2. **Mood / expression system**
   - Types: `idle | happy | cheer | worried | sleeping | curious | celebrating`
   - Eye blink loop (every 3–6s random)
   - Mouth shapes driven by `mood`

3. **Reaction hooks**
   - `src/features/garden/hooks/usePlantReactions.ts`
   - Subscribes to: coin earn, streak increase, lesson complete, level up
   - Emits animation cues to visible plants: `wiggle`, `bounce`, `sparkle`, `grow`, `cheer`

4. **Stage transformations**
   - `usePlantStage.ts` already exists — extend to emit transform animation on stage change
   - New stages: `semilla | brote | plantula | planta | flor | arbol`
   - Stage transition = 600ms scale + particle burst

5. **Plant naming**
   - DB migration: `plants` table add `custom_name TEXT`
   - First-time plant flow: modal `NameYourPlant.tsx` — textbox, suggested names carousel, confirm
   - Display custom name in all plant dialogue, hover, and stats

6. **Codex visual work (parallel track)**
   - Generate 4 character sprites × 5 stages × 3 key moods = 60 SVG exports
   - Lottie JSON for idle breathe + cheer celebration
   - See Codex prompt template in `docs/AGENT_WORKFLOW.md`

### Success Metrics
- All 4 domain plants have eyes, blink, idle sway
- Naming modal completion rate > 85%
- Visual regression tests pass at 320/768/1440 breakpoints
- Plant reaction animations fire within 200ms of triggering event

### Dependencies
Sprint 0 (garden shell must exist for plants to live in).

### Agent Delegation
- **Codex Visual Agent:** all sprite + Lottie generation
- **Logic Agent:** PlantCharacter rig, reaction hook, naming flow
- **Supabase Agent (sub-task):** custom_name migration
- **Test Agent:** visual regression + reaction timing tests

---

## Sprint 2 — Garden Hub: HUD Overlay

**Goal:** Dashboard stats (coins, streak, level, quick actions) live as floating HUD on top of the garden. No separate dashboard screen.

### Tasks

1. **HUD components**
   - `src/components/hud/CoinCounter.tsx` — top-right, animated increment on earn, shimmer on hover
   - `src/components/hud/StreakFlame.tsx` — top-left, pulses with heartbeat if streak > 3
   - `src/components/hud/LevelBadge.tsx` — top-center, ring fills with progress
   - `src/components/hud/QuickActionsDock.tsx` — bottom dock: "Estudia hoy" / "Ejercicio" / "Mi Tienda"

2. **Garden POIs (Points of Interest)**
   - `src/features/garden/components/POI/ShopGate.tsx` — visible garden gate, click → shop drawer
   - `src/features/garden/components/POI/CalculatorMailbox.tsx` — click → calculator modal
   - `src/features/garden/components/POI/AchievementsNotebook.tsx` — click → logros drawer
   - `src/features/garden/components/POI/CoursesGreenhouse.tsx` — click → courses list

3. **Side drawer system**
   - `src/components/garden-shell/GardenDrawer.tsx` — slides in from right/left, garden still visible behind with slight blur
   - Keyboard accessible, `Esc` closes, focus trap

4. **Deprecation**
   - `src/pages/Dashboard.tsx` → delete (route already unused post-Sprint-0)
   - Any lingering imports updated

### Success Metrics
- Coin/streak/level always visible from any garden state
- HUD never covers > 15% of garden canvas
- Quick-action click → target screen in < 100ms
- Mobile: HUD collapses into pill, expandable

### Dependencies
Sprint 0 (routing), Sprint 1 (plants to populate garden scene)

### Agent Delegation
- **Logic Agent:** HUD components, drawer system
- **Codex:** icons for HUD (coin, flame, level ring, action icons) — no emoji
- **Test Agent:** overlap tests, accessibility (drawer focus trap)

---

## Sprint 3 — Cosmetics V2

**Goal:** Ship 4th special plant + expand cosmetics shop into real categories.

### Tasks

1. **4th special plant**
   - Design: see `docs/FOURTH_SPECIAL_PLANT.md`
   - Data: `src/features/garden/constants/specialPlants.ts` add entry
   - DB: seed via migration `add_fourth_special_plant.sql`
   - Mechanic implementation in `src/features/garden/hooks/useSpecialPlantEffects.ts`

2. **Cosmetic categories**
   - DB: `cosmetics` table add `category`, `rarity`, `season_tag`
   - Categories:
     - `hat` — cowboy, gamer cap, crown, graduation cap
     - `gaming` — controller, trophy, joystick
     - `object` — golden watering can, premium pot, garden cart
     - `set_anime | set_retro | set_cottagecore | set_space`
     - `easter_egg` — mustachioed plumber cap, wizard hat, detective glass
   - Rarity: `common | rare | epic | legendary | seasonal`

3. **Shop UI**
   - `src/features/shop/components/ShopDrawer.tsx`
   - Tabs: Especiales / Cosméticos / Temporadas
   - Filter by category, rarity
   - Preview on plant before purchase (drag accessory onto plant avatar)
   - Confirm modal with cost, coin balance

4. **Equip system**
   - `plant_cosmetics` junction table: one plant can wear 1 hat + N objects
   - `src/features/garden/components/sprites/PlantCharacter.tsx` accepts `equippedCosmetics` prop → renders on character

5. **Seasonal rotation scaffold**
   - Config: `src/features/shop/constants/seasons.ts`
   - Cron-style check: if current date in season window, unlock season items in shop

### Success Metrics
- Shop has ≥ 30 cosmetics at launch
- ≥ 20% of active users purchase at least one cosmetic in first week
- Preview-on-plant animation < 150ms
- Zero visual clipping on equipped cosmetics across 5 plant stages

### Dependencies
Sprint 1 (PlantCharacter rig with accessory slot)

### Agent Delegation
- **Codex:** all cosmetic SVGs (hats, objects, gaming gear, themed sets)
- **Logic Agent:** shop drawer, equip system, seasonal scaffold
- **Supabase Agent:** table migrations
- **Test Agent:** equip persistence, visual regression on each cosmetic

---

## Sprint 4 — Courses Reborn

**Goal:** Replace multiple-choice-with-obvious-answers with a ludic learning framework. Drag-drop, scenarios, fill-in, matching — all inside courses. Plant guide characters narrate.

### Tasks

1. **Course content model v2**
   - DB: `course_steps` table, `step_type enum ('theory' | 'dragdrop' | 'scenario' | 'numeric' | 'match' | 'predict')`
   - Theory steps = 1–3 sentences + plant avatar delivering dialogue
   - Each exercise step has: setup, interaction, feedback, garden reward

2. **Course runner**
   - `src/features/courses/components/CourseRunner.tsx` — orchestrates step sequence
   - Step renderers:
     - `TheoryStep.tsx` — plant avatar + dialogue bubble + continue
     - `DragDropStep.tsx` — reuse `src/features/dragdrop/`
     - `ScenarioStep.tsx` — branching Escenario-style mini
     - `NumericStep.tsx` — input field, range feedback (close / warm / cold)
     - `MatchStep.tsx` — pair concepts to definitions
     - `PredictStep.tsx` — user draws/selects prediction before reveal

3. **Plant guide system**
   - Each course has a designated plant guide (by domain)
   - Guide appears bottom-left during course, reacts to answers
   - Mistake → guide says empathic line + shows consequence sim

4. **Rewrite existing courses**
   - `src/data/courses/*` — audit all, flag multiple-choice-obvious answers
   - Rewrite each course to: theory → exercise → theory → exercise (4–6 steps)
   - Target: ≤ 5 min per course

5. **Sound + micro-animations**
   - `src/lib/sound.ts` — SFX manager, respects mute toggle
   - Sounds: correct (soft chime), wrong (gentle pluck), level up (bloom), plant cheer
   - Each correct answer: coin spawn animates into HUD counter

### Success Metrics
- Course completion rate ≥ 60% (baseline V1: est 20%)
- Avg course duration 3–5 min
- Content audit: 0 remaining "obvious answer" questions
- NPS on courses ≥ 40

### Dependencies
Sprint 1 (plant guides need animated character rig), Sprint 2 (coin HUD for reward animation)

### Agent Delegation
- **Logic Agent:** CourseRunner, step renderers
- **Content Agent (human or Claude):** rewrite course content to new model
- **Codex:** dialogue bubble UI, plant guide pose variants
- **Test Agent:** step-type coverage, course completion telemetry

---

## Sprint 5 — Visual Identity

**Goal:** Kill all emojis in production UI. Replace with custom SVG icons + Lottie animations. Elevate the entire visual system.

### Tasks

1. **Icon audit**
   - Grep for all emoji usages across `src/`
   - Produce `docs/ICON_INVENTORY.md` — every emoji → icon it needs to become

2. **Icon system**
   - `src/components/icons/` — one file per icon, all SVG React components
   - Unified props: `size`, `color`, `className`
   - Storybook-style index page at `src/pages/_dev/Icons.tsx` (dev-only) to preview

3. **Lottie integration**
   - `lottie-react` install + wrapper: `src/components/LottieIcon.tsx`
   - Assets in `src/assets/lottie/` — coin-shimmer, streak-flame, level-up-bloom, plant-cheer

4. **Component polish pass**
   - HUD: add shimmer to coin counter, heartbeat to streak
   - Buttons: hover lift, press depression, focus ring (not default Tailwind blue)
   - Cards: soft shadow system with 3 depth tiers
   - Type: confirm display pair decision (e.g., Fraunces + Inter, or Recoleta + Manrope)

5. **Design tokens file**
   - `src/styles/tokens.css` — all colors, spacing, radii, durations, easings
   - Eliminate hardcoded Tailwind palette usage

### Success Metrics
- Zero emojis in production bundle (lint rule enforces)
- First Contentful Paint ≤ 1.5s
- Bundle size growth ≤ 30kb gzipped (Lottie JSON is small)
- Design QA: all surfaces pass anti-template checklist

### Dependencies
Sprint 2 (HUD components exist to be polished)

### Agent Delegation
- **Codex:** all SVG + Lottie asset generation
- **Logic Agent:** icon component library, Lottie wrapper, token refactor
- **Test Agent:** bundle-size budget test, visual regression

---

## Sprint 6 — Onboarding: First Seed

**Goal:** New user completes first course, receives first seed, names first plant. Tutorial introduces garden as home.

### Tasks

1. **Onboarding flow**
   - `src/features/onboarding/components/OnboardingFlow.tsx`
   - Steps:
     1. Welcome scene — empty garden, camera pans over 4 empty beds
     2. First course (short, 3 steps) — intro to Control domain
     3. Seed reward — animated seed drops into Control bed
     4. Seed hatches — brote appears with eyes opening
     5. Name modal — user names the plant
     6. Greeting — plant says "¡Hola [user name]! Soy [plant name]. Vamos a crecer juntos."
     7. Garden tour — HUD elements highlighted one by one

2. **Skip / restart controls**
   - Can skip naming (default name = species name)
   - Can redo tutorial from Perfil → Ayuda

3. **Tutorial copy**
   - All in warm Mexican Spanish. No corporate tone.
   - Reviewed by content lead

4. **Persistence**
   - `profiles.onboarding_completed_at` column
   - Block main garden until onboarding done; allow resume mid-flow

### Success Metrics
- Onboarding completion rate ≥ 70%
- Plant-naming rate ≥ 85% of onboarding completers
- Avg onboarding duration ≤ 4 min
- D1 retention ≥ 55% post-onboarding

### Dependencies
Sprint 1 (plant hatching animation), Sprint 4 (first course content)

### Agent Delegation
- **Logic Agent:** flow orchestrator
- **Codex:** seed → brote transform Lottie
- **Content:** copy
- **Test Agent:** end-to-end Playwright test of full flow

---

## Sprint 7 — Polish & Scale

**Goal:** Performance budget hit, accessibility gold, A/B test hooks, monitoring.

### Tasks

1. **Performance**
   - Lighthouse ≥ 95 on all main routes
   - Code-split heavy features (Lottie, drag-drop, simulators)
   - Image optimization (AVIF/WebP, explicit dims, preload hero)
   - Font subsetting

2. **Accessibility**
   - Full keyboard nav through garden + HUD + drawers
   - ARIA labels on all plant characters ("Girasol Churro, stage flor, nivel 4")
   - `prefers-reduced-motion` fallbacks on all animations
   - Color contrast audit ≥ WCAG AA everywhere

3. **A/B test hooks**
   - Feature flag system: `src/lib/featureFlags.ts`
   - Supabase `feature_flags` table + `user_feature_flags`
   - First experiments: onboarding variants, shop placement, streak mechanic

4. **Monitoring**
   - Sentry or equivalent for FE error tracking
   - Supabase logs → alerting on error rate spikes
   - Analytics: PostHog or Plausible event taxonomy

5. **Offline / resilience**
   - Service worker for offline garden view (cached plant state)
   - Optimistic UI for coin/streak updates with rollback

### Success Metrics
- Lighthouse perf ≥ 95, a11y ≥ 100
- Zero CRITICAL Sentry errors per 1000 sessions
- A/B test framework proven with 1 live experiment

### Dependencies
All prior sprints.

### Agent Delegation
- **Logic Agent:** perf passes, feature flags
- **Security Reviewer Agent:** audit before launch
- **E2E Runner Agent:** full Playwright suite

---

## Cross-Sprint Principles

- **No sprint ships without** `npm run build && npm run test` passing locally AND in CI.
- **Every PR** runs through Code Review Agent.
- **Visual work** always goes through Codex Visual Agent, never hand-coded SVG by Logic Agent.
- **Supabase migrations** are reviewed by Security Reviewer before apply.
- **Content rewrites** pass through a bilingual (ES/EN) review before merge.

---

## Risk Register

| Risk | Mitigation |
|---|---|
| Codex output inconsistent style | Lock style guide in prompt template; reject PRs that drift |
| Plant animation perf on low-end Android | Budget 60fps on mid-tier device; fallback to CSS-only on low-end |
| Content rewrite is slow | Start Sprint 4 content track in parallel with Sprint 1 |
| Supabase RLS regressions (we already hit one) | Every migration ships with RLS test SQL |
| Scope creep on cosmetics | Lock Sprint 3 cosmetic count at 30; anything more is post-launch |
