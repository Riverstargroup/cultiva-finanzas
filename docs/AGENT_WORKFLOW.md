# Semilla — Agent Workflow

> **Multi-agent orchestration playbook** for building Semilla V2. Defines who does what, how they talk, and what gates a merge.

---

## 1. Architecture

```
                    ┌───────────────────────────┐
                    │   SUPERVISOR (Sonnet 4.6) │
                    │   - Breaks down sprints   │
                    │   - Routes tasks          │
                    │   - Merges PRs            │
                    │   - Owns Linear board     │
                    └────────────┬──────────────┘
                                 │
        ┌───────────┬────────────┼────────────┬─────────────┐
        │           │            │            │             │
┌───────▼──────┐ ┌──▼────────┐ ┌─▼──────────┐ ┌▼──────────┐ ┌▼────────────┐
│  CODEX       │ │ LOGIC     │ │  TEST      │ │ REVIEW    │ │ SECURITY    │
│  VISUAL      │ │ AGENT     │ │  AGENT     │ │ AGENT     │ │ REVIEWER    │
│  AGENT       │ │ (Claude   │ │  (Claude   │ │ (Claude   │ │ (Claude     │
│  (Codex)     │ │  Code)    │ │   Code)    │ │  Code)    │ │  Code)      │
└──────────────┘ └───────────┘ └────────────┘ └───────────┘ └─────────────┘
   SVG/Lottie      Hooks,        Vitest,        PR review,      Migrations,
   icons,          components,   Playwright,    blocks          RLS, secrets
   sprites         Supabase      coverage       on CRIT/HIGH
                   queries
```

Optional satellites invoked on demand:
- **Build-error-resolver** — when CI build fails
- **Refactor-cleaner** — dead code after a sprint
- **Doc-updater** — keeps `docs/` in sync
- **E2E-runner** — Playwright suites for critical flows

---

## 2. Agent Responsibilities

### Supervisor (Sonnet 4.6)
- Owns the Linear board mirroring `docs/GAMEPLAN_V2.md` sprints
- Breaks sprint goals into atomic, self-contained tasks
- Generates task prompts and dispatches to correct agent
- Reviews agent PRs at the summary level
- Merges PRs in the coordinated queue order (see Rule V-6 in RETRO)
- Escalates anything ambiguous to the human product owner

### Codex Visual Agent
- Works only in `feat/visual-*` branches
- Generates SVG components and Lottie JSON
- Never edits logic, hooks, or data files
- Output ends in a PR with visual-regression screenshots attached
- Uses the prompt template in section 5

### Claude Code Logic Agent (Sonnet 4.6)
- One task at a time. No context window starvation.
- Follows **subagent-driven-development** pattern: self-contained prompt, explicit file paths, explicit acceptance criteria
- Writes hooks, components, utilities, Supabase queries
- Never generates SVG or Lottie — requests visual assets from Codex via supervisor

### Claude Code Test Agent (Haiku 4.5 acceptable — cost optimization)
- Triggered after every Logic Agent task
- Writes Vitest unit tests + Playwright e2e where appropriate
- Verifies 80%+ coverage on changed files
- Blocks merge if coverage regresses

### Claude Code Review Agent (Sonnet 4.6)
- Runs on every PR, no exceptions
- Reviews against `~/.claude/rules/common/code-review.md` checklist
- Assigns severity labels (CRITICAL, HIGH, MEDIUM, LOW)
- Blocks merge on CRITICAL or HIGH

### Claude Code Security Reviewer (Sonnet 4.6 or Opus 4.5 for migrations)
- Triggered on: auth code, Supabase migrations, RLS changes, external API calls, financial calculations
- Full OWASP + secrets + RLS audit
- Blocks merge on any finding until resolved

---

## 3. Sprint Execution Workflow

For each sprint in `GAMEPLAN_V2.md`:

### Step 1 — Supervisor breaks down
Supervisor reads the sprint section, produces Linear issues:
- Each issue has: title, acceptance criteria, file paths, dependencies, agent assignment
- Issues labeled `visual`, `logic`, `test`, `content`, `migration`, etc.

### Step 2 — Parallel dispatch
- Visual tasks → Codex (queue, one at a time per branch)
- Logic tasks → Logic Agent (parallel-safe tasks can run in separate worktrees)
- Content tasks → Human or content-writing agent

### Step 3 — Logic Agent workflow
For each logic task:
1. Agent reads task prompt + referenced files
2. Writes implementation
3. Runs locally: `npm run build && npm run test && npm run lint && npx tsc --noEmit`
4. Opens PR with checklist pasted in description

### Step 4 — Test Agent gate
1. Reads Logic Agent's PR diff
2. Adds/updates tests in the same PR
3. Runs coverage report
4. Comments coverage delta on PR

### Step 5 — Review Agent gate
1. Reads full PR diff
2. Runs checklist from `code-review.md`
3. Labels findings
4. If CRITICAL/HIGH: comments, blocks merge, Logic Agent fixes, loop back
5. If clean: approves

### Step 6 — Security Reviewer gate (conditional)
Triggered only on security-sensitive PRs. Same loop as Review Agent.

### Step 7 — Supervisor merges
- Verifies all checks green (CI + Review + Security)
- Rebases if main moved
- Merges (merge commit, not squash — preserves agent authorship)
- Deletes branch
- Closes Linear issue

### Step 8 — Scheduled verification
After merge, post-merge CI runs:
- Full test suite
- Build
- Lighthouse (on deployed preview)

---

## 4. Scheduled Agents (GitHub Actions cron)

| Schedule | Job | Trigger | On failure |
|---|---|---|---|
| Daily 06:00 UTC | `npm run test -- --coverage` | cron | Open Linear issue if coverage < 80% |
| Weekly Mon 04:00 UTC | `npm audit` + `supabase advisors` | cron | Open Linear issue, Security Reviewer assigned |
| Every PR | Build, lint, test, `tsc --noEmit` | PR event | Block merge |
| Every PR | Bundle-size diff | PR event | Comment on PR if > 30kb delta |
| Every PR | Playwright smoke tests | PR event | Block merge |
| Nightly | Visual regression (Percy/Chromatic) | cron | Block nightly promotion |

Cron definitions live in `.github/workflows/`.

---

## 5. Codex Prompt Template (Visual Work)

Every visual task dispatched to Codex uses this template. Supervisor fills in the specifics.

```
You are generating visual assets for Semilla, a financial education app with a
botanical garden theme targeting Mexican Gen Z and Millennial users.

## Style
Friendly, animated, botanical. Think Plants vs Zombies character style but with
financial-education personality — never aggressive, always warm. Characters have
eyes, expressive mouths, and tend to lean/sway. No copyright infringement on
any existing IP. Original silhouettes and palettes only.

## Task
[SPECIFIC VISUAL TASK, e.g. "Generate a Girasol sprite in 'cheer' mood at 'flor'
stage. Two large round eyes, open smiling mouth, petals angled slightly upward
as if arms raised. 240x240 SVG viewbox."]

## Constraints
- Output format: SVG preferred for icons/sprites, Lottie JSON for animations
- Color palette (CSS tokens, use exact values):
  - --leaf-bright:   #4CAF50
  - --forest-deep:   #1B3B26
  - --clay-soft:     #d4c5b0
  - --leaf-muted:    #5B7A3A
  - --coin-gold:     #E5B84B
  - --streak-flame:  #FF6A3D
- Mobile-safe: 44px minimum touch target on any interactive element
- Accessible: include `<title>` and `<desc>` elements; respect `prefers-reduced-motion`
- Optimized: no embedded bitmaps, no metadata, run through SVGO equivalent
- File size: SVG ≤ 8kb, Lottie JSON ≤ 50kb
- Naming: kebab-case filenames, e.g. `girasol-flor-cheer.svg`

## Output
1. The file contents
2. A short usage note (where it goes in the codebase, what props it expects)
3. A preview PNG (256x256) for the PR description

## Hard rules
- No emojis inside SVGs
- No external font dependencies (convert text to paths if used)
- No scripting inside SVG (no `<script>`)
- No trackers, no external URLs
```

---

## 6. Logic Agent Prompt Template

```
## Task
[SPECIFIC TASK, e.g. "Implement usePlantReactions hook at
src/features/garden/hooks/usePlantReactions.ts"]

## Context files (read first)
- docs/VISION.md
- docs/GAMEPLAN_V2.md (Sprint N section)
- src/features/garden/hooks/useGarden.ts
- src/features/garden/components/sprites/PlantCharacter.tsx
- [other relevant existing files]

## Acceptance criteria
- [ ] [Specific, testable criterion 1]
- [ ] [Specific, testable criterion 2]
- [ ] Types pass `tsc --noEmit`
- [ ] Lint passes `npm run lint`
- [ ] Vitest unit tests for each exported function
- [ ] 80%+ coverage on new files
- [ ] PR description includes paste of local build+test+lint+tsc output

## Constraints
- No emojis in production code
- Immutable data patterns (see rules/common/coding-style.md)
- File size ≤ 800 lines; function ≤ 50 lines
- Prefer existing utilities over new ones
- Supabase queries use typed keys from the gardenKeys pattern (see RETRO Rule V-3)

## Forbidden
- Do not generate SVG/Lottie (request from supervisor)
- Do not touch unrelated files
- Do not add new dependencies without supervisor approval
- Do not skip hooks or bypass signing
```

---

## 7. Branching & PR Policy

- **Main is always green.** If a merge breaks main, revert within 30 min.
- **Branch naming:**
  - `feat/<sprint>-<short-desc>` for features
  - `visual/<sprint>-<short-desc>` for Codex work
  - `fix/<ticket>-<short-desc>` for bugfixes
  - `chore/<short-desc>` for maintenance
- **PR size:** target ≤ 400 LOC diff. Bigger PRs need supervisor pre-approval.
- **PR description template:** copy from `.github/PULL_REQUEST_TEMPLATE.md` — must include:
  - Linked Linear issue
  - Local build/test/lint output
  - Screenshots (for visual PRs)
  - Migration risk assessment (if DB changes)

---

## 8. Communication Protocol

Agents are stateless. Prompts are self-contained. Cross-agent communication goes through:
- **Linear comments** on the shared issue
- **PR comments** for technical detail
- **Supervisor** as the human-facing broker

No "previous conversation" context is assumed. If agent A needs output from agent B, supervisor pastes the relevant artifact into agent A's prompt.

---

## 9. Handling Failure

| Failure | Response |
|---|---|
| CI build fails | Build-error-resolver agent dispatched with full error log |
| Test fails | Test Agent investigates; fixes implementation not tests (unless test is wrong) |
| Review Agent finds CRITICAL | Logic Agent fixes; loop back through Review |
| Security finding | Security Reviewer drafts fix; Logic Agent implements under supervision |
| Production incident | Supervisor freezes merges; root cause before any new PR |

---

## 10. Tooling & Environment

- **Repo:** `cultiva-finanzas` (main branch `main`)
- **CI:** GitHub Actions
- **Hosting:** AWS S3 + CloudFront
- **DB/Auth:** Supabase
- **Package manager:** npm
- **Node version:** pin in `.nvmrc` (enforced by CI)
- **Worktrees:** `.claude/worktrees/` — always in ignore lists (see RETRO V-2)

---

## 11. Continuous Improvement

After each sprint, supervisor:
1. Writes a micro-retro (1-page markdown in `docs/retros/sprint-N.md`)
2. Extracts any new pattern → appends to `docs/RETRO_V1.md` rules
3. Adjusts prompt templates if they drove confusion
4. Updates Linear templates if they missed fields

This is how Vanguard learns from every sprint.
