

# Dock Navigation + Swipe Navigator + Dashboard Refactor

## Context Confirmed

- **Routing**: React Router v6 with `useLocation`, `useNavigate`, and `<Outlet />` inside `AppLayout.tsx`.
- **Layout**: `AppLayout.tsx` wraps all protected routes with `SidebarProvider` + `AppSidebar` + `<Outlet />`.
- **Icons**: Lucide-react (already used throughout).
- **Reduced motion**: `useReducedMotion` hook exists and is used by `PageTransition`, `StatCard`, etc.
- **Viewport meta**: Missing `viewport-fit=cover` (needs adding to `index.html`).
- **Mobile breakpoint**: 768px (defined in `use-mobile.tsx`).

---

## Phase 1 -- Structure (DockNav + Layout Changes)

### 1.1 Update `index.html` viewport meta
Add `viewport-fit=cover` to the existing viewport meta tag for safe-area support on notched devices.

### 1.2 Create `src/hooks/useSectionNavigation.ts`
- Exports `SECTION_ORDER = ['/dashboard', '/cursos', '/calculadora', '/logros', '/perfil']`
- Exports `useSectionNavigation()` hook that returns:
  - `currentIndex`: index of current route in `SECTION_ORDER` (using `useLocation().pathname`)
  - `goNext()` / `goPrev()`: navigate to next/prev section (clamped at bounds)
  - `goTo(path)`: navigate to specific section
  - `canGoNext` / `canGoPrev`: boolean flags
- Uses `useNavigate()` and `useLocation()` from react-router-dom.

### 1.3 Create `src/components/navigation/DockNav.tsx`
- **Position**: `fixed bottom-0 left-1/2 -translate-x-1/2 z-50` with `pb-[max(1rem,env(safe-area-inset-bottom))]`
- **Container**: `bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl`
- **Items**: 5 nav items matching `SECTION_ORDER` (Dashboard, Cursos, Calculadora, Logros, Perfil) using same Lucide icons as `AppSidebar`
- **Active indicator**: Framer Motion `layoutId="dock-pill"` pill that slides between items (animated underline bar `h-1 w-8 bg-primary rounded-full`)
- **Responsive behavior**:
  - Mobile (<768px): icons only, `gap-1`, `px-2 py-3`
  - Desktop (>=768px): icon + label, `gap-2`, `px-4 py-3`
- **Animations** (framer-motion, respects `useReducedMotion`):
  - `whileHover={{ scale: 1.08 }}` on desktop (spring stiffness 400, damping 30)
  - `whileTap={{ scale: 0.96 }}`
  - Reduced motion: no scale, only opacity
- **Accessibility**:
  - `<nav role="navigation" aria-label="Navegacion principal">`
  - Each item: `<button aria-label="Ir a {label}" aria-current={isActive ? "page" : undefined}>`
  - Touch targets: `min-h-[44px] min-w-[44px]`
  - Focus visible: `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`
- Uses `useLocation()` to determine active item, `useNavigate()` to navigate on click.

### 1.4 Modify `src/components/AppLayout.tsx`
- **Mobile (<768px)**: Hide the sidebar entirely. Show a compact header with:
  - Hamburger button (SidebarTrigger) that opens the sidebar as a Sheet/Drawer (this behavior already exists in the shadcn Sidebar component when `isMobile` is true)
  - App logo/name centered
- **Desktop (>=768px)**: Keep sidebar as-is (complementary navigation)
- **All viewports**: Render `<DockNav />` as the primary fixed bottom navigation
- Add `pb-24` to the main content area to prevent Dock from covering content
- Wrap `<Outlet />` content area -- keep the existing structure, just add bottom padding

### 1.5 Add safe-area CSS
In `src/index.css`, add a utility for safe-area bottom padding on the main content container.

---

## Phase 2 -- Swipe Navigation

### 2.1 Create `src/components/navigation/SwipeNavigator.tsx`
- Wraps the `<Outlet />` content
- Touch event handling (onTouchStart, onTouchMove, onTouchEnd):
  - Track `startX`, `startY`, `deltaX`, `deltaY`
  - **Activation conditions** (ALL must be true):
    - `Math.abs(deltaX) > Math.abs(deltaY) * 1.5` (predominantly horizontal)
    - `Math.abs(deltaX) > 60` (minimum threshold)
    - Touch did NOT start on: `input[type=range]`, elements with class `no-swipe`, or elements inside a container with `overflow-x: scroll` or `overflow-x: auto`
  - **Exclusion detection**: Walk up the DOM from `event.target` checking for `scrollWidth > clientWidth` (has horizontal scroll content) or `.no-swipe` class
- On valid swipe:
  - Left swipe (deltaX < -60): `goNext()`
  - Right swipe (deltaX > 60): `goPrev()`
- **Page transition direction**: Pass direction to `PageTransition` via context or prop:
  - Forward (higher index): slide from right (`x: 30 -> 0`)
  - Backward (lower index): slide from left (`x: -30 -> 0`)
- Uses `useSectionNavigation` hook
- CSS on wrapper: `touch-action: pan-y` and `overscroll-behavior-x: none` to prevent iOS Safari back-swipe interference

### 2.2 Keyboard shortcuts
- In `SwipeNavigator` or `useSectionNavigation`, add `useEffect` for keydown:
  - `Alt + ArrowRight`: `goNext()` with `e.preventDefault()`
  - `Alt + ArrowLeft`: `goPrev()` with `e.preventDefault()`
  - Only Alt key (not Cmd/Ctrl which is browser history)

---

## Phase 3 -- Dashboard Refactor

### 3.1 Modify `src/pages/Dashboard.tsx`
Restructure the visual hierarchy (top to bottom):

**A) Header (compact)**
- Time-based greeting: "Buenos dias/tardes/noches" + profile name
- Subtitle: current date formatted in Spanish (`text-sm text-muted-foreground`)
- Skeleton during loading

**B) Card Hero "Continuar" (max-h ~140px)**
- If course in progress: compact card with progress %, title (1 line truncated), "Continuar" button
- If empty: compact card (NOT full EmptyState) with small icon (40px), 1-line text "Empieza tu primer curso", secondary CTA "Ver cursos"
- Max height constrained, no full-page empty state

**C) Quick Access Launcher (horizontal scroll)**
- `overflow-x-auto` with `scroll-snap-type: x mandatory`
- 5 items: Dashboard, Cursos, Calculadora, Logros, Perfil
- Each: small card with icon + label, `border border-border/50`, `hover:bg-accent/10`
- **Critical**: Add `className="no-swipe"` to the scroll container to prevent swipe navigation conflict
- Touch-friendly: `min-h-[44px]` per item

**D) Stats Grid**
- Same 4 StatCards but with improved visual:
  - Icon wrapped in `bg-primary/10 rounded-xl p-2` for visual grouping
  - Larger number (`text-2xl font-bold`), smaller label (`text-xs text-muted-foreground`)
  - Better `gap-4` spacing

**E) Weekly Chart**
- Keep as-is, ensure container has `className="no-swipe"` if it has any horizontal interaction

---

## Phase 4 -- Polish

### 4.1 Accessibility verification
- All Dock buttons >= 44px touch target
- Focus ring visible on all interactive elements
- `aria-current="page"` on active Dock item
- `prefers-reduced-motion` respected in all new animations (DockNav pill, SwipeNavigator transitions)

### 4.2 Overflow prevention
- No `overflow-x` issues at 360, 390, 430, 768, 1024, 1440px
- Dock centered and never wider than viewport
- Quick Access launcher contained within padding

### 4.3 iOS Safari considerations
- `overscroll-behavior-x: none` on SwipeNavigator wrapper
- `touch-action: pan-y` to prevent competing with browser gestures
- Safe-area inset on Dock via `env(safe-area-inset-bottom)`

### 4.4 Z-index hierarchy
- Dock: `z-50`
- Sheet/Drawer (sidebar mobile): `z-50` (shadcn default, Sheet overlay covers Dock)
- Modals: `z-50` (Dialog overlay covers Dock)
- The Sheet overlay (`fixed inset-0 z-50 bg-black/80`) will naturally cover the Dock

---

## Files Summary

| Action | File | Description |
|--------|------|-------------|
| Edit | `index.html` | Add `viewport-fit=cover` to meta viewport |
| Create | `src/hooks/useSectionNavigation.ts` | Route order + navigation hook |
| Create | `src/components/navigation/DockNav.tsx` | Fixed bottom dock navigation |
| Create | `src/components/navigation/SwipeNavigator.tsx` | Gesture-based page navigation wrapper |
| Edit | `src/components/AppLayout.tsx` | Integrate DockNav, SwipeNavigator, adjust padding, simplify mobile header |
| Edit | `src/pages/Dashboard.tsx` | Compact hero, time-based greeting, horizontal launcher with no-swipe, improved stats |
| Edit | `src/index.css` | Add safe-area utility if needed |

No database, auth, or routing changes. Pure UI/UX layer.

