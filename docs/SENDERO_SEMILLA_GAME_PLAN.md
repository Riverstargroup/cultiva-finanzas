# Sendero Semilla Game Plan

Last updated: 2026-04-26
Owner: Product/Engineering
Status: Active product direction

## One Sentence Vision

Semilla is a financial education adventure where learners advance through the **Sendero Semilla**, guided by Nopalito, unlocking lessons, games, reviews, missions, and boss encounters that teach the foundations of becoming a functional financial adult.

## Product Rebrand

Internal legacy name: `Ruta Viva`

User-facing name: **Sendero Semilla**

Why this name:

- It belongs to the Semilla brand.
- It feels botanical without sounding childish.
- It communicates progression, direction, and discovery.
- It works naturally in UI copy:
  - "Continua tu Sendero Semilla"
  - "Nuevo nodo desbloqueado"
  - "Domina esta semilla"
  - "El Gasto Hormiga bloquea el sendero"

## Core Product Thesis

We are no longer building:

> A course app with a decorative garden attached.

We are building:

> A financial learning world where every course, game, review, mission, and reward exists inside one coherent garden path.

This means the decorative garden/Tamagotchi-style backyard is no longer core. It can be removed, hidden, or repurposed if it does not support the Sendero Semilla experience.

## What Must Be Preserved

The rebrand must keep the best parts of the existing product:

- Botanical Semilla identity: warm cream, soft greens, clay, subtle gold.
- Trustworthy education-first tone.
- Existing course/scenario engine.
- Existing games and simulations.
- Existing spaced repetition/flashcards logic.
- Existing achievements and progress systems.
- Existing premium pixel-art characters where they add personality.

The redesign should wrap these systems in a stronger world model, not throw them away.

## What Must Be Removed Or Deprioritized

Remove from the first-impact Home experience:

- Decorative backyard editor.
- Garden toolbar as primary UI.
- Shop/inventory controls shown before the learning path.
- Large static Nopalito dashboard panel.
- Repeated nav bars.
- Panels that do not lead to clear action.
- Dashboard-like content blocks that compete with the path.

If a feature is useful but not part of the first learning moment, move it into a node, modal, or secondary route.

## Experience Architecture

### Home

Home is the Sendero Semilla.

Required elements:

- Full-screen vertical learning path.
- Compact top HUD: streak, energy/water, coins, level.
- One bottom navigation system.
- Nopalito as floating guide/assistant.
- Nodes as primary actions.
- Bottom sheet or modal when tapping a node.

Home should not feel like a dashboard.

### Fase

A large narrative arc.

Example:

- Fase 1: Adulto Funcional

### Modulo

A major learning topic inside a phase.

Initial demo modules:

1. Finanzas Basicas
2. Credito Sin Miedo
3. Proteccion Financiera

Future modules:

- Primeras Inversiones
- Impuestos y Legalidad Basica
- Trabajo, Ingreso y Beneficios
- Planeacion y Metas

### Nodo

The smallest actionable unit on the path.

Node types:

- Lesson
- Review
- Game
- Simulation
- Chest
- Mission
- Boss
- Shop
- Story beat

Every node must have:

- Clear label.
- One clear action.
- Reward/impact.
- State: locked, available, next, completed, mastered, expired/review-due.

### Mastery

Mastery should encourage spaced repetition.

Suggested states:

- New: available but not completed.
- Completed: first pass done.
- Review due: memory needs watering.
- Strong: reviewed successfully.
- Mastered: repeated strong performance; shown as gold/dorado.

UX metaphor:

- Knowledge grows like a seed.
- Review waters the seed.
- Mastery makes it golden.

## First Three Demo Modules

### Module 1: Finanzas Basicas

Goal: help the learner understand their money flow and identify avoidable spending.

Example node sequence:

1. Story: Nopalito introduces the Sendero Semilla.
2. Lesson: Que es un presupuesto.
3. Decision scenario: Elegir entre gasto necesario y deseo.
4. Game: Identifica el Gasto Hormiga.
5. Review: 5 quick recall cards.
6. Chest: first reward.
7. Boss: Gasto Hormiga.

Boss concept:

Gasto Hormiga steals coins through small repeated expenses. It returns daily unless the user builds awareness and reviews.

### Module 2: Credito Sin Miedo

Goal: teach practical first-credit-card literacy.

Example node sequence:

1. Lesson: Que es credito.
2. Simulation: primera tarjeta.
3. Lesson: fecha de corte vs fecha de pago.
4. Game: paga o espera.
5. Review: interest and late fees.
6. Mini boss: Interes Travieso.

### Module 3: Proteccion Financiera

Goal: teach basic adult financial safety.

Example node sequence:

1. Lesson: fraudes comunes.
2. Simulation: mensaje sospechoso.
3. Lesson: datos personales.
4. Lesson: IMSS/derechos basicos.
5. Mission: crear fondo de emergencia.
6. Boss: Sombra del Fraude.

## Games Strategy

Games are embedded inside modules first.

After a user completes a game node for the first time:

- The game unlocks in the Games section.
- The user can replay it anytime for practice.
- Replays can give smaller rewards or mastery progress.

This keeps games meaningful in the learning path and still useful as standalone practice.

Current and proposed games:

- Presupuesto Rapido
- Memoria de Mercado
- Ahorra Cosecha
- Semillas de Credito
- Identifica el Gasto Hormiga
- Reto de Inflacion

## Nopalito Role

Nopalito is the mascot and guide of the entire platform.

Nopalito should:

- Welcome the user into the world.
- Explain what each node means.
- Give contextual hints.
- Answer finance questions through the assistant.
- Celebrate progress.
- Warn about risky decisions.

Nopalito should not:

- Occupy a large permanent dashboard panel.
- Replace real UI hierarchy.
- Give personalized investment/tax/legal advice.

Preferred UI pattern:

- Floating character button.
- Opens a chat/guide sheet.
- Contextual line appears near the current node.

## Monetization Healthy Principles

Working principle:

> Essential financial education should remain free. Premium should personalize, deepen, or accelerate learning without blocking the basics of becoming a functional financial adult.

Free:

- Finanzas basicas
- Credito basico
- Proteccion financiera
- First investment basics
- Core games and reviews

Premium possibilities:

- Advanced modules.
- Deep simulations.
- Extra analytics.
- Cosmetic customization.
- Family/team plans.
- Collaborative challenges.

Healthy viral model:

- Individual plan has one price.
- Inviting a friend/team can reduce cost per person.
- Collaboration should be framed as learning together, not spam.

## Visual Direction

Use:

- Minimal cozy botanical UI.
- Soft pixel-art inspired assets.
- Clean UX-first layouts.
- Premium pixel-art characters only where personality matters.

Avoid:

- RPG/medieval style.
- Hyper-detailed AI fantasy illustration.
- Heavy wood UI.
- Dashboard clutter.
- Generated text baked into assets.
- One giant static PNG for interactive screens.

Asset architecture:

- Backgrounds as image layers.
- Nodes as React buttons.
- HUD and nav as React/CSS.
- Characters as separate sprites.
- Text always real HTML.

## Implementation Roadmap

### PR 1: Home Cleanup

Goal: make Home equal Sendero Semilla.

Tasks:

- Remove decorative backyard from Home first impact.
- Remove GardenToolbar from Home.
- Remove GardenEconomyBanner from Home.
- Remove WeeklyRetos from Home scroll.
- Keep route/path as primary content.
- Convert NopalitoGuide from large panel into floating assistant.
- Ensure all visible buttons lead somewhere real.

### PR 2: Sendero Semilla Data Model

Goal: make nodes data-driven.

Tasks:

- Create `src/features/sendero/`.
- Define `Phase`, `Module`, `PathNode`, `NodeState`, `MasteryState`.
- Map existing courses/scenarios/games to nodes.
- Add first three demo modules as structured data.

### PR 3: Node Bottom Sheet

Goal: remove permanent side panels.

Tasks:

- Tapping node opens bottom sheet.
- Sheet shows title, type, reward, mastery, action.
- Keep mobile-first layout.

### PR 4: Nopalito Floating Guide

Goal: make Nopalito platform mascot.

Tasks:

- Floating Nopalito button.
- Context-aware guide sheet.
- Keep OpenRouter-backed assistant integration.
- Add safe fallback messages.

### PR 5: Course/Game Integration

Goal: make modules feel unified.

Tasks:

- Course detail shows module context.
- Games unlock after first node completion.
- Review/mastery states feed back into node visuals.

### PR 6: Onboarding Playable Prologue

Goal: make first session story-driven.

Tasks:

- Mandatory but skippable prologue.
- Gasto Hormiga steals coins.
- Nopalito introduces the path.
- User takes first seed.
- First node begins immediately.

## Validation Checklist

For each release:

- Can a new user understand what to do in under 5 seconds?
- Is there only one obvious primary action?
- Does every visible button lead somewhere real?
- Does Home feel like one world, not stacked dashboards?
- Is the path readable on mobile and desktop?
- Does Nopalito help without dominating the UI?
- Are courses/games still accessible and recognizable?
- Do rewards make sense?
- Does the app avoid paywalling essential financial literacy?

## Current Known Product Risks

- Home can become visually cluttered if old dashboard sections remain.
- Large static panels can break immersion.
- Overusing AI-generated art can make the product feel generic.
- Replacing too much existing course/game UX at once can slow validation.
- Keeping both decorative garden and Sendero Semilla can make the app feel like two products.

## Current Decision Log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-04-26 | Use "Sendero Semilla" as product-facing name for Ruta Viva. | More branded, botanical, and marketable. |
| 2026-04-26 | Decorative garden is no longer core Home experience. | It competes with learning path and weakens clarity. |
| 2026-04-26 | Keep existing course/game systems. | They work and should be wrapped in the new world, not discarded. |
| 2026-04-26 | Use minimal botanical UI with premium characters. | Preserves Semilla identity while adding personality. |
