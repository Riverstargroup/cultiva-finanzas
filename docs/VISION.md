# Semilla — Vision & Product Philosophy

> **North Star Document.** Every agent (human, Claude, Codex) reads this first before touching code. If a feature, copy, animation, or PR does not serve the vision described here, it does not ship.

---

## 1. What Semilla Is

Semilla is a **financial education app for Mexican Gen Z and Millennials** that teaches personal finance through a **living botanical garden metaphor**. The garden is not a feature of the app — the garden **is** the app.

Users do not "use an app to track their learning." They **tend a garden** that grows as they understand their money. Every lesson, every exercise, every peso saved in a simulation is a drop of water, a ray of sunlight, a nutrient that keeps their plants — and their financial literacy — alive.

We are not building Duolingo for money. We are building a **place** that feels alive, that users return to because the garden is waiting for them.

---

## 2. Target User

### Primary Persona — "Luz, 22, CDMX"
- University student, first job in retail/delivery apps
- Uses TikTok 3+ hrs/day, Spotify, WhatsApp, Mercado Libre
- Never taken a formal finance class
- Anxious about money but avoids budgeting apps because they feel like "tax software"
- Attention span: 15–90 seconds per screen before needing a hook
- Kinesthetic learner — wants to **do**, not read
- Cares about aesthetics. Will uninstall an ugly app.
- Speaks Spanish natively, slips English gaming/meme vocabulary

### Secondary Persona — "Diego, 29, Guadalajara"
- Junior professional, earns in pesos, dreams in dollars
- Has a savings account but no investment
- Plays Clash Royale, Genshin Impact, Stardew Valley
- Wants financial literacy but has been burned by "finfluencer" scams
- Values: trust, concreteness, jokes that land

### What both have in common
They will tolerate learning **if** it:
1. Looks and feels like a game they already love
2. Gives them visible progress every 30 seconds
3. Respects their time (no 15-minute lessons)
4. Never patronizes them
5. Speaks like a friend, not a bank

---

## 3. The Garden-Centric Model

### The Core Insight
Finance apps fail because money is abstract. **Plants are not.** A plant that wilts when you miss a streak is *felt*. A plant that blooms when you master compound interest is *earned*.

Every mechanic in Semilla must answer: **"How does this feed the garden?"**

### The House Metaphor
> "You are looking out from inside a house into the garden."

The garden is the world. The dashboard, shop, flashcards, and courses are windows, doors, and side rooms that open onto it. You never leave the garden — you step briefly into another room and return.

Concretely:
- **The home screen IS the garden.** Not a tab. Not a button. The garden.
- Coins, streak, level: floating HUD elements **on top of** the garden, like status in an MMO.
- Achievements, calculator, profile: signposts or objects inside the garden (a mailbox, a notebook on a bench, a gate).
- Navigation feels spatial, not hierarchical. You don't "go to the shop" — you walk to the garden gate where the shopkeeper lives.

### The 4 Plant Domains
The garden is divided into four beds, each representing a financial pillar:

| Domain | Spanish | Teaches | Plant archetype |
|---|---|---|---|
| Control | Control | Budgeting, tracking, spending awareness | Girasol (sunflower) — bright, disciplined |
| Crédito | Crédito | Credit, debt, interest, scores | Helecho (fern) — resilient, patient |
| Protección | Protección | Insurance, emergency fund, risk | Lirio (lily) — sturdy, defensive |
| Crecimiento | Crecimiento | Savings, investing, compounding | Margarita (daisy) — cheerful, expanding |

Each domain has its own **plant personality archetype** (see Sprint 1). As users learn in a domain, that plant grows.

### Special Plants (Shop / Legendary Tier)
Mechanical buffs purchased with coins. Current roster + planned:
1. 🔥 **Streak Shield** — protects streak from one missed day
2. 🏅 **Passive Income Plant** — generates small coin trickle daily
3. 🧊 **Frozen Rent** — locks expense category in simulator for X days
4. **TBD** — see `docs/FOURTH_SPECIAL_PLANT.md` (compound-interest-themed)

---

## 4. Ludic Learning Framework

### Why courses currently fail
Our V1 courses are **multiple choice with obvious answers**. "Would you rather save or spend everything?" This insults Luz and Diego. They know the answer. They click. They learn nothing.

### The Five Rules of Ludic Learning in Semilla

**Rule 1: No question has an obvious right answer.**
Every question presents a real trade-off. "You have $3,000 MXN. Emergency fund at 50% target, or pay down a 24% APR credit card with $1,500 balance?" Both are defensible. Teach the reasoning.

**Rule 2: Theory is delivered in ≤ 3 sentences, then immediately applied.**
Never a 6-paragraph lecture. One concept → one exercise. Rinse.

**Rule 3: Plants are the teachers.**
A Girasol explains budgeting. A Helecho warns you about interest. The garden is literally present in the course.

**Rule 4: Every correct answer has a garden consequence.**
Not an abstract XP bar — a specific plant shakes, drops a coin, levels a leaf.

**Rule 5: Mistakes are plot, not failure.**
When a user gets an answer wrong, the plant doesn't frown. It says: "Interesante elección. Vamos a ver qué pasó." The wrong path is shown as a short sim. The correct framing is taught through consequence, not shame.

### Exercise types used inside courses
- **Drag-and-drop** (categorize expenses, sort risk levels)
- **Scenario decision** (Escenario-style mini-branches)
- **Numeric fill-in** (calculate real interest, real savings rates)
- **Match** (definition ↔ concept)
- **Predict** (before revealing graph, user draws their guess)

Reference apps to study and borrow from: **Duolingo** (streak psychology), **Brilliant** (interactive math proofs), **Kahoot** (speed pressure), **Finimize** (Gen Z finance tone), **Stardew Valley** (ambient joy loop).

---

## 5. Personified Plants — The Emotional Core

Plants are not progress bars. Plants are **characters**.

### The PvZ-Inspired Design Brief
Inspiration: Plants vs Zombies. Each plant has:
- **Two eyes** that blink and track
- **A mouth** that smiles, frowns, cheers
- **Idle animation** (gentle sway, breathe)
- **Reactive animations** on events (wiggle, bounce, sparkle)
- **Stage transformations** (Semilla → Brote → Planta → Flor → Árbol/Fruto)

### Personalities by domain
- **Girasol (Control):** Disciplined coach. Proud when you log a budget. Disappointed but encouraging when you overspend.
- **Helecho (Crédito):** Wise elder. Patient, speaks in metaphors, warns gently.
- **Lirio (Protección):** Protective older sibling. Calm under stress, alert to danger.
- **Margarita (Crecimiento):** Enthusiastic friend. Gets visibly excited about compounding.

### Naming + Greeting
On first plant hatch, user **names their plant**. From then on:
- "¡Hola Liam! Tu Girasol 'Churro' te saluda. Creció 2cm desde ayer."
- The plant greets the user by **user's name** every morning.
- Plant's custom name appears in all dialogue bubbles.

This is the emotional hook. Luz does not come back for her streak. She comes back for **Churro**.

---

## 6. Economy — Everything Feeds the Garden

| Currency / Resource | Earned by | Spent on |
|---|---|---|
| Coins (monedas) | Completing exercises, flashcards, scenarios | Cosmetics, special plants, shop |
| Streak | Daily return | Passive multiplier on coin earn |
| Level (plant level) | XP from domain-matched lessons | Visual stage transformation |
| Achievements | Milestone completion | Badges, rare cosmetics unlock |

**Rule:** No currency exists outside the garden metaphor. No "gems" vs "coins" vs "stars." One visible economy. No pay-to-win. We are not F2P predators.

---

## 7. Visual Identity Principles

- **No emojis in production UI.** Emojis are placeholders only. Final UI uses custom SVG icons and Lottie animations.
- **Botanical but elevated.** Forest greens, clay browns, golden yellow accents. No cheap neon. No default Tailwind palette that screams "AI startup 2024."
- **Premium feel.** Every animation has easing curves. Every shadow is intentional. Every type scale is harmonic.
- **Palette tokens (CSS variables):**
  - `--leaf-bright: #4CAF50`
  - `--forest-deep: #1B3B26`
  - `--clay-soft: #d4c5b0`
  - `--leaf-muted: #5B7A3A`
  - `--coin-gold: #E5B84B`
  - `--streak-flame: #FF6A3D`
- **Typography:** one warm display font (hero / plant dialogue), one neutral humanist sans (body). Deliberate pairing, not defaults.
- **Motion:** compositor-only (`transform`, `opacity`, `filter`). Respects `prefers-reduced-motion`.

---

## 8. The Anti-Template Commitment

We will not ship a dashboard with a sidebar, 4 uniform stat cards, and a chart. That is the default shape of every SaaS onboarding tutorial in 2024. Semilla's home is a **garden scene with floating, contextual HUD**, closer to a mobile JRPG town than a finance dashboard.

See `C:\Users\SER5-Liam\.claude\rules\web\design-quality.md` — we adhere to every banned-pattern rule in that doc.

---

## 9. What Success Looks Like (North-Star Metrics)

- **D7 retention ≥ 40%** — user comes back a week later to check on their plant
- **Avg session length: 3–6 min** — short, sweet, return tomorrow
- **Plant naming rate ≥ 85%** — users feel ownership
- **Cosmetic purchase rate ≥ 20%** — users care enough to decorate
- **Course completion rate ≥ 60%** (currently ~15–25% for similar apps with boring quizzes)

---

## 10. What Semilla Is NOT

- Not a bank
- Not a budgeting tracker (we don't connect to real accounts in MVP)
- Not gamified finance bros content
- Not crypto-pilled
- Not another Duolingo clone
- Not a dashboard with a garden button

It is a place you care about, which happens to teach you money.
