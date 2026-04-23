# Semilla V1 — Honest Retrospective

> **Purpose:** Encode what broke, why, and what we now do differently. Vanguard agents read this and enforce the lessons as policy.

---

## What Went Wrong

### 1. Production crash: `oe.inventory is not a function`
- **Where:** Garden page, reported by end users after deploy.
- **Root cause:** `src/features/garden/hooks/useGarden.ts` defined `gardenKeys` as a plain object. One branch of code called `gardenKeys.inventory(...)` but the `inventory` key was never added. Minified as `oe.inventory` in prod, masking the real name.
- **Why it slipped:** No TypeScript interface enforced that every key existed. TS inferred the object's shape from its literal, so missing keys = silent `undefined`, which crashed only at runtime.
- **Impact:** Garden page unusable for ~hours until fix (commit `21de0ff`).

### 2. CI/CD broken for weeks — lint blocked every PR
- **Where:** GitHub Actions lint job, all PRs.
- **Root cause:** `@typescript-eslint/no-explicit-any` was treated as `error` severity in `eslint.config.js` with **no override** for legitimate `any` usage in Supabase generated types and test shims. 65 violations blocked merges.
- **Why it slipped:** Lint config was written by an agent that didn't run the full 65-file lint pass before merging. No one ran CI locally before pushing config changes.
- **Impact:** Rolling 3-week window where no PR could merge cleanly. Forced emergency overrides and bypass commits.

### 3. PR #14 — two-query SM-2 rewrite broke main
- **Where:** `src/features/flashcards/hooks/useDueCards.ts`.
- **Root cause:** PR rewrote the hook to use a two-query pattern (one for due flashcards, one for SM-2 scheduling) but tests were not updated. Old mocks returned the old shape. Tests passed locally because the agent ran only the single file's test. After merge, full test suite failed in CI, and main was broken for downstream branches.
- **Why it slipped:** Agent's local workflow ran only affected tests, not the full suite. PR was approved without CI being green.
- **Impact:** Three agent branches had to rebase against a broken main. Cascading merge conflicts in next bullet.

### 4. Three-PR merge conflict chaos — 12 files in conflict
- **Where:** `main` branch merging three long-lived feature branches.
- **Root cause:** PRs were not rebased regularly. Each touched overlapping files (`App.tsx`, route config, garden hooks). No merge order was coordinated.
- **Why it slipped:** No supervisor was orchestrating merge order. Agents pushed in parallel without communicating.
- **Impact:** Hours of manual conflict resolution. Two commits had to be reverted and reapplied.

### 5. Force-push attempts blocked by branch protection
- **Where:** `main`.
- **Root cause:** After the chaos above, an agent tried `git push --force` to "clean up history." Branch protection (correctly) blocked this.
- **Why it slipped:** Agent was unaware of branch protection policy.
- **Impact:** Wasted cycles; forced to use `git revert` + new commits instead.

### 6. ESLint scanning `.claude/worktrees/` locally
- **Where:** Local dev environment.
- **Root cause:** Claude Code worktrees live inside the repo under `.claude/worktrees/`. ESLint `ignores` did not include this path. Lint errors from worktree siblings contaminated the real working tree's lint output.
- **Why it slipped:** The `.claude/` directory was added to the workflow after the eslint config was written.
- **Impact:** Developers (and agents) saw confusing phantom errors; some attempted to "fix" files in sibling worktrees.

---

## What Could Have Been Better

### Engineering Discipline
- **TypeScript strictness configured before writing code, not after.** We turned on strict mode late and paid for it with every "sudden" error surge. Strict from day one, with all flags set, is the only path.
- **Test coverage required BEFORE merging architecture changes.** PR #14 should not have been mergeable. Enforce "changed files must have matching test updates" via CI.
- **ESLint config tested in CI environment, not just locally.** Local node version, cache, and filesystem diverged from CI. Always run `npm run lint` in the CI image (e.g., via a local docker compose) when editing eslint config.
- **Key-bearing objects (like `gardenKeys`) must have a TypeScript interface enforcing completeness.** Index signatures or exhaustive `Record<K, V>` types, not inferred object literals.
- **Supabase RLS policies need unit tests.** We had a `profiles` table RLS infinite recursion that was only caught in staging — tests at the SQL layer would have caught it pre-deploy.

### Process
- **PRs should be smaller and more focused.** Three-PR conflicts came from oversized branches. Target ≤ 400 LOC diff per PR.
- **Migration testing in a staging branch before main.** Supabase has branch support — use it. No migration touches production until tested on a branch.
- **Coordinated merge queue.** When multiple agents have branches touching shared files, the supervisor picks merge order and rebases the rest.
- **Pre-merge checklist on every PR**, enforced by PR template — not vibes.

---

## What We Learned → Encoded Policy (for Vanguard)

### Rule V-1: Pre-PR self-check
Every agent, before opening a PR, runs **locally** and pastes output into PR description:
```bash
npm run build
npm run test
npm run lint
npx tsc --noEmit
```
No output → no PR.

### Rule V-2: `.claude/` always in ignore lists
Every tool config (`eslint.config.js`, `.gitignore`, `tsconfig.json` exclude, Prettier ignore) must list `.claude/` explicitly. Enforce via a `scripts/check-ignores.ts` CI step.

### Rule V-3: Query-key objects are typed, not inferred
Any object used for TanStack Query keys (or similar registry pattern) must be declared against an explicit `interface` or `Record<Key, Fn>` type. Missing keys = compile error, not runtime crash.

Example pattern:
```ts
type GardenQK = {
  all: readonly unknown[];
  plants: (userId: string) => readonly unknown[];
  inventory: (userId: string) => readonly unknown[];
  stats: (userId: string) => readonly unknown[];
  events: (userId: string) => readonly unknown[];
};
export const gardenKeys: GardenQK = { /* ... */ };
```

### Rule V-4: Architecture-change PRs must include test updates in the SAME PR
When a hook signature, data shape, or interface changes, the PR MUST touch the corresponding test files. CI enforces: if a file in `src/**/hooks/` changes without its `.test.ts` sibling, block the merge.

### Rule V-5: Prefer merge over rebase when force-push is blocked
Branch protection on `main` blocks force push by design. Do not fight it. Resolve via merge commits; keep history messy-but-honest over clean-but-lost.

### Rule V-6: Multi-agent merge discipline
- Supervisor maintains a merge queue (simple ordered list in Linear)
- Each agent rebases against `main` before requesting review
- Only one PR merges at a time; next one rebases immediately
- If a merge breaks main, it is reverted within 30 min — no "fix-forward" on broken main

### Rule V-7: ESLint / TS config changes gate stricter
Any PR touching `eslint.config.js`, `tsconfig.json`, or `package.json` lint/test scripts requires:
- Full lint pass output attached
- Full test pass output attached
- Approval from Review Agent AND supervisor

### Rule V-8: Supabase migrations ship with RLS tests
Every migration that adds or changes RLS policies ships with a `*.rls-test.sql` file exercising:
- Owner can read/write their row
- Other user cannot read/write
- Anon cannot read/write
- No recursive policy chains

### Rule V-9: No hidden state in hooks
Hook outputs that callers depend on must be stable — renames/rewrites touch all call sites in the same PR. No "deprecated in this PR, callers fixed later." Grep your own API before renaming.

### Rule V-10: Production crash → immediate post-mortem
Any production crash (user-reported or Sentry-caught) triggers:
- Root cause in the PR fixing it
- Entry appended to this retro doc
- New Vanguard rule if pattern is novel

---

## Timeline of V1 Pain (condensed)

| Date | Event | Fix |
|---|---|---|
| Early | Lovable template bootstrapped | Later migrated off in `d8cc851` |
| Mid | PR #14 (two-query SM-2) broke main | Rebased, tests updated |
| Late | `gardenKeys.inventory` crash on prod | Fixed in `21de0ff`, TS interface added |
| Late | Profiles RLS infinite recursion | Fixed in `21de0ff`, policy rewritten |
| Late | ESLint config blocked all PRs | Override added, full audit pending |

---

## Culture Shift

V1 was built with "agents push, humans hope." V2 is built with **"agents push, supervisor merges, tests gate, retros teach."**

Every rule above is non-negotiable. Agents that skip them produce V1 outcomes. Agents that follow them produce a product.
