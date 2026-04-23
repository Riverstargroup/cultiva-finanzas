# The Fourth Special Plant — Design Spec

> **Tier:** Legendary. The capstone special plant. Unlocked by dedicated users who have internalized the compound-interest mindset.

---

## TL;DR

**Name:** **El Roble Compuesto** ("The Compound Oak")
**Emoji stand-in:** 🌳 (until Codex ships the sprite)
**Financial concept:** Compound interest + long-term investing
**Mechanic:** Slow-starting passive coin generator that accelerates **exponentially** the longer it lives in your garden.
**Vibe:** Legendary-tier, patient, wise, slightly mystical — a character that *rewards patience itself*.

---

## 1. Why This Plant Exists

The first three specials teach defense and stability:
- 🔥 **Streak Shield** → discipline (protect what you have)
- 🏅 **Passive Income Plant** → cashflow (small daily yield)
- 🧊 **Frozen Rent** → planning (lock predictable costs)

But nothing in V1 teaches **the single most important concept in personal finance**: **compounding over time**. El Roble fills that gap.

It is the only plant in the game that rewards the user for *not touching it*. Every day it survives, it grows more valuable. If the user breaks their streak, the Roble does not die — but its growth rate **resets**. This mirrors reality: interrupting an investment costs you the curve, not the principal.

---

## 2. Mechanic (Detailed)

### Base state
- User purchases El Roble for **2,000 coins** (premium tier — highest shop price)
- Unlock condition: account has been active ≥ 14 days AND user has completed the Crecimiento domain's intro course

### Growth formula
- The Roble has an internal counter, `compound_days_alive` (days since planted without streak break)
- Daily passive yield = `floor( 2 * (1.05 ^ compound_days_alive) )` coins
- Day 1: ~2 coins/day
- Day 7: ~3 coins/day
- Day 30: ~9 coins/day
- Day 60: ~37 coins/day
- Day 90: ~158 coins/day
- Day 180: ~12,540 coins/day (capped at **500/day** for game balance)

### Streak break penalty
- If user breaks streak → `compound_days_alive` halves (not resets to zero — we are kind)
- Visual: tree loses some leaves, mood becomes `worried`, dialogue says "Perdimos algo de terreno, pero seguimos en pie."

### Interaction with other specials
- **Streak Shield protects the Roble** → Shield consumed absorbs the streak-break penalty, Roble's compound days untouched. Synergy.
- **Passive Income Plant stacks** → Roble yield and Passive plant yield both claimable
- **Frozen Rent is independent** → no interaction

### Cap
- Yield capped at 500/day after ~day 120 — prevents runaway economy
- But cosmetic growth continues visually (bigger tree, more birds, aura effects)

---

## 3. Visual Direction

### Stage progression
| Stage | Visual | Mood |
|---|---|---|
| Bellota (acorn) | Small nut with two closed eyes, tucked in garden | sleeping |
| Brote (sapling) | Thin shoot, two curious eyes peek out | curious |
| Arbolito (young tree) | 4ft tree, full face, small smile | happy |
| Roble (mature oak) | Full oak canopy, wise half-closed eyes, long beard of moss | wise |
| Roble Ancestral (ancient, day 90+) | Massive gnarled oak, golden leaves, soft glow aura, birds perched | serene |
| Roble Legendario (day 180+, capped) | Mythic — subtle particle sparkles, coins occasionally drop from canopy | transcendent |

### Character personality
- Speaks slowly, in short aphorisms
- Every milestone (day 7, 30, 60, 90, 180) triggers a dialogue
  - Day 7: "Las raíces se sienten."
  - Day 30: "Un mes. Muchos abandonan aquí."
  - Day 60: "Ahora crezco más rápido de lo que ves."
  - Day 90: "Tres meses. La magia no es magia; es tiempo."
  - Day 180: "Has aprendido la única lección que importa."

### Animations
- Idle: extremely slow sway (8s cycle) — other plants sway at 3s; the Roble's slowness is its character
- Day advance: brief golden particle burst at dawn, coins visibly drop into HUD counter
- Streak break: leaves fall, eyes close sadly for a beat, then reopen resolute
- Cap reached (day 120+): rare bird (different species daily) perches on a branch — 10% spawn rate, collectible easter egg

### Color
- Bark: `--forest-deep` (#1B3B26) deepening over stages
- Leaves: start `--leaf-bright` (#4CAF50), gradually tinge golden at mature stages toward `--coin-gold` (#E5B84B)
- Aura (legendary): soft radial `--coin-gold` glow at 15% opacity

---

## 4. Unlock & Purchase Experience

### Discovery
- Appears grayed-out in shop from day 1, labeled "Legendario — requiere 14 días"
- Tooltip on hover teaches compounding visually: a tiny animated graph of the yield curve

### Purchase flow
- On day 14+, user completes Crecimiento intro course → shop notification: "El Roble está disponible"
- Purchase modal is ceremonial: full-screen, darker background, slow zoom onto the acorn
- Confirmation dialogue from a Margarita guide: "Este no es como los demás. Plántalo y olvídalo un tiempo. Regresa en un mes."

### First plant moment
- User names the Roble (our naming system from Sprint 1)
- Roble opens its eyes for the first time, says (using user's name): "Hola, [user name]. Soy [plant name]. Tendremos tiempo."

---

## 5. How It Fits the Four-Plant System

Current specials are **reactive tools** (shield, income, freeze).
El Roble is the **only proactive teacher** — it teaches by existing.

Synergy map:
```
    Streak Shield  ──protects──►  El Roble's compound days
    Passive Income ──stacks──►    Daily coin total
    Frozen Rent    ──independent
    El Roble       ──centerpiece──► Long-term economy anchor
```

This gives the shop a shape: three defensive/tactical tools + one strategic endgame plant. Matches the "4 pillars" symmetry of the four domains.

---

## 6. Why Gen Z Will Care

Gen Z understands "let it cook." They understand Stardew Valley's "plant a crop, come back in 3 days." They understand Neopets, Tamagotchi, passive gacha.

El Roble is **the endgame**. Having a mature Roble Ancestral in your garden is social proof among Semilla users: *I've been here 90 days. I get it.*

It is also the perfect Instagram/TikTok moment — "My Roble just hit day 180, look at this golden canopy."

And the financial lesson is genuinely one of the top 3 things anyone can learn about money. We are not gamifying junk. We are gamifying **the truth**.

---

## 7. Open Questions for Product Owner

- **Cap value:** 500 coins/day ceiling — is this too generous / too stingy? Model against full coin economy before ship.
- **Multiple Robles?** First pass: one per account. Consider a legacy/heirloom variant post-launch.
- **Cosmetic variants of Roble:** cherry-blossom season, autumn-orange season — seasonal skins rather than separate plants?
- **Death condition:** should the Roble ever be fully lost (e.g., 30-day inactivity)? Recommendation: **no**. Losing the Roble teaches the wrong lesson (fear). Halving `compound_days_alive` on break is enough.

---

## 8. Implementation Checklist (for Sprint 3 agents)

- [ ] DB migration: `special_plants` row for El Roble with full config
- [ ] DB migration: `user_special_plants.compound_days_alive` counter
- [ ] `src/features/garden/hooks/useCompoundOakYield.ts` — daily yield calc + cap
- [ ] `src/features/garden/hooks/useSpecialPlantEffects.ts` — hook into streak-break event for penalty
- [ ] `src/features/garden/components/sprites/RobleCharacter.tsx` — 6 stages, 4 moods
- [ ] Codex: 6 stages × 4 moods = 24 SVG sprite exports + 1 Lottie (idle sway + particle aura)
- [ ] Shop tile with compound curve mini-graph
- [ ] Ceremonial purchase modal
- [ ] Milestone dialogue triggers (days 7/30/60/90/180)
- [ ] Rare-bird spawn system (easter egg, post-day-120)
- [ ] Tests: yield formula, cap enforcement, streak-break halving, unlock condition
- [ ] Telemetry: track purchase rate, day-distribution of active Robles, cap-reach rate
