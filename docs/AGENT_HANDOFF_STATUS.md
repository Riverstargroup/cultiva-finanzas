# Agent Handoff Status

Last updated: 2026-04-26

This file is for any human or AI agent entering the project cold. Read this before editing product direction, garden, onboarding, courses, or games.

## Current Product Direction

The active direction is **Sendero Semilla**.

Semilla should feel like one coherent financial learning world. Home should become a vertical learning path, not a dashboard and not a decorative garden editor.

Read first:

1. `docs/SENDERO_SEMILLA_GAME_PLAN.md`
2. `docs/NOPALITO_ASSISTANT_PERSONA.md`
3. `docs/PIXEL_ART_DIRECTION.md`
4. `PROGRESSION-LOG.md`

## Current Live State

As of the latest merged work:

- PR #41 merged to `main`.
- Production deploy succeeded.
- Home/Jardin includes the new living path experiment.
- Supabase Edge Function `nopalito-chat` is deployed.
- Nopalito guide exists but is still too large/permanent for the final direction.

## Important Context

The current Home is not considered final.

Known problem:

- The new path is still layered on top of old Home/dashboard/garden concepts.
- The next work should clean the Home experience and make Sendero Semilla the main screen.

## Do Not Accidentally Revert

Do not remove without understanding:

- `supabase/functions/nopalito-chat/index.ts`
- `src/features/garden/components/GardenAdventureMap.tsx`
- `src/features/garden/components/NopalitoGuide.tsx`
- `src/assets/pixel/optimized/*`
- `src/assets/world/*`
- `src/components/courses/CoursePathMap.tsx`
- `src/features/minigames/games/*`

## Active Branching Guidance

Use branch prefix:

`codex/`

Recommended next branch:

`codex/home-cleanup-sendero`

## Immediate Next PR

Title:

`Home cleanup: make Sendero Semilla the primary experience`

Scope:

- Work mostly in `src/pages/Jardin.tsx`.
- Update `GardenAdventureMap` only as needed.
- Update `NopalitoGuide` into floating assistant.
- Avoid changing courses/games logic in this PR unless necessary.

Expected removals from Home first impact:

- `BackyardView`
- `GardenToolbar`
- `GardenEconomyBanner`
- `WeeklyRetos`
- large permanent `NopalitoGuide` panel

Expected additions:

- Sendero Semilla path as primary content.
- Compact HUD.
- Floating Nopalito assistant.
- Clear node actions.

## Current Bugs / UX Issues To Watch

| ID | Severity | Area | Description | Suggested Fix |
| --- | --- | --- | --- | --- |
| BUG-SEN-001 | High | Home | Home feels like stacked dashboard sections instead of one world. | Remove old garden/dashboard sections from first impact. |
| BUG-SEN-002 | Medium | Nopalito | Nopalito guide is too large and static. | Convert to floating button + sheet. |
| BUG-SEN-003 | Medium | Map | Node detail panel on desktop competes with the path. | Use bottom sheet/modal instead of permanent side panel. |
| BUG-SEN-004 | Medium | Visual | Some premium character sprites show square backgrounds. | Re-cut transparent sprites or mask better. |
| BUG-SEN-005 | Medium | Navigation | Bottom navigation can appear duplicated or visually disconnected. | Make a single nav system and remove embedded duplicates. |

## Validation Commands

Run before PR:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run test
```

Known lint warnings exist in the codebase. The current standard is: no lint errors.

## Production Deploy

Deploy happens automatically after merge to `main` through GitHub Actions.

Production URL:

`https://rsdemo3.site`

## Secrets / Security Notes

Never commit real API keys.

Supabase secrets used by Nopalito:

- `OPENROUTER_API_KEY`
- `OPENROUTER_API_KEY2`
- optional `NOPALITO_MODEL`
- optional `NOPALITO_FALLBACK_MODEL`

If tokens were pasted in chat or logs, rotate them.

## Agent Update Protocol

When completing meaningful work:

1. Update `PROGRESSION-LOG.md`.
2. If product direction changes, update `docs/SENDERO_SEMILLA_GAME_PLAN.md`.
3. If handoff context changes, update this file.
4. Include branch, PR, commit, verification commands, and unresolved issues.
