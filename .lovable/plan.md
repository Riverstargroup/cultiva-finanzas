

# Dashboard Re-skin: Mockup Organico Fiel

## Resumen

Transformar visualmente el Dashboard y DockNav para coincidir con el mockup HTML organico. Fuentes Fraunces+Quicksand se aplican SOLO dentro de `.dashboard-skin` (Dashboard y DockNav), sin tocar el body global. Colores via CSS variables, no hex hardcodeado.

---

## Archivos a modificar/crear

| Accion | Archivo | Descripcion |
|--------|---------|-------------|
| Editar | `src/index.css` | Agregar imports de Fraunces, Quicksand, Material Symbols. Agregar CSS vars del dashboard. Agregar clases utilitarias organicas. NO cambiar body font-family |
| Editar | `tailwind.config.ts` | Agregar fontFamily heading/body, colores `dash.*` mapeados a CSS vars |
| Reescribir | `src/pages/Dashboard.tsx` | Layout completo del mockup: header organico, hero card con blobs, stat grid, chart con div bars (tap tooltip + aria-label), todo dentro de `.dashboard-skin` |
| Editar | `src/components/navigation/DockNav.tsx` | Re-estilizar con look organico (bg-white/90, border clay, labels siempre visibles, dot activo con layoutId) |
| Editar | `src/components/AppLayout.tsx` | Ocultar header global en /dashboard (dashboard tiene su propio header inline) |

---

## Detalle tecnico

### 1. CSS Variables (src/index.css, bajo :root)

Agregar al bloque `:root` existente (NO reemplazar):

```css
--forest-deep: #1b2e1f;
--leaf-bright: #78a94b;
--leaf-fresh: #98c66a;
--terracotta-vivid: #d4633d;
--terracotta-warm: #e57c5a;
--clay-soft: #f4ece1;
--soil-warm: #fcfaf5;
--text-warm: #4a4f41;
--leaf-muted: #889e81;
--dashboard-bg: #faf9f6;
```

### 2. Font imports (src/index.css)

Agregar (sin eliminar Nunito/Playfair):
```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Quicksand:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
```

### 3. Scoped font application

Clase `.dashboard-skin` en CSS:
```css
.dashboard-skin {
  font-family: 'Quicksand', sans-serif;
}
.dashboard-skin h1,
.dashboard-skin h2,
.dashboard-skin h3 {
  font-family: 'Fraunces', serif;
}
```

El Dashboard wrapper y DockNav aplican esta clase. NO se toca `body { font-family }`.

### 4. Clases utilitarias organicas (@layer components)

- `.botanical-bg`: fondo SVG botanico con opacidad 0.03, bg dashboard-bg
- `.organic-border`: border-radius irregular (30px 60px 40px 50px / 50px 30px 60px 40px)
- `.organic-card`: bg white, border 1.5px clay-soft, organic-border, shadow sutil
- `.card-stat`: organic-card + hover translateY(-4px) rotate(1deg) + border leaf-fresh
- `.vibrant-btn`: bg terracotta-vivid, texto blanco, organic-border, hover scale(1.05) rotate(-1deg) + bg terracotta-warm

### 5. Tailwind config (tailwind.config.ts)

Agregar a `extend.fontFamily`:
```ts
heading: ["Fraunces", "serif"],
body: ["Quicksand", "sans-serif"],
```

Agregar a `extend.colors` usando CSS vars:
```ts
dash: {
  bg: "var(--dashboard-bg)",
  forest: "var(--forest-deep)",
  "leaf-bright": "var(--leaf-bright)",
  "leaf-fresh": "var(--leaf-fresh)",
  terracotta: "var(--terracotta-vivid)",
  "terracotta-warm": "var(--terracotta-warm)",
  clay: "var(--clay-soft)",
  soil: "var(--soil-warm)",
  text: "var(--text-warm)",
  "leaf-muted": "var(--leaf-muted)",
},
```

### 6. Dashboard.tsx (reescritura visual)

Mantiene: `useProfile`, `useNavigate`, `useReducedMotion`, `PageTransition`, datos placeholder, logica greeting/fecha.

Estructura del mockup:

**Wrapper**: `<div className="dashboard-skin botanical-bg max-w-4xl mx-auto">`

**A) Header organico**
- Icono Sprout en circulo verde (bg leaf-fresh/20) + "Buenos dias, {nombre}" en font-heading text-3xl font-black color forest-deep
- Fecha en uppercase tracking-widest text-xs color leaf-muted
- Desktop: botones notificacion + avatar decorativos (hidden en mobile)

**B) Hero card "Empieza tu primer curso"**
- `organic-card` con overflow hidden, position relative
- Dos blobs decorativos (divs absolutos con border-radius organico, bg leaf-fresh/15 y terracotta/10, blur)
- Icono BookOpen en boton verde organico
- Titulo en font-heading font-bold
- CTA "Ver cursos" con `.vibrant-btn`

**C) Stats grid (2x2 mobile, 4 cols desktop)**
- 4 `.card-stat` cards
- Icono en burbuja organica (bg leaf-fresh/15)
- Valor en font-heading font-bold text-2xl color forest-deep
- Label uppercase tracking-widest text-xs color leaf-muted

**D) Chart "Progreso semanal" con div bars**
- `organic-card` con titulo + barra accent verde
- 7 barras HTML (divs) con alturas proporcionales
- Border-radius organico en cada barra (redondeado arriba)
- Color leaf-bright, hover leaf-fresh
- **Mobile**: tap en barra muestra tooltip (estado React: `activeBar`)
- **Desktop**: hover CSS muestra tooltip
- **Accesibilidad**: cada barra tiene `aria-label="Lunes: 25 minutos"` y `role="img"`

**E) Eliminar Quick Access Launcher** (redundante con Dock)

### 7. DockNav.tsx

Cambios visuales (mantener logica, aria, framer-motion):

- Agregar `className="dashboard-skin"` al `<nav>` wrapper
- Container: `bg-white/90 backdrop-blur-xl border-2 border-[var(--clay-soft)] organic-border`
- Labels: siempre visibles (mobile y desktop), uppercase, text-[10px], font-semibold
- Iconos: mantener Lucide, 20px
- Activo: color `var(--leaf-bright)`, inactivo: color `var(--leaf-muted)`
- Reemplazar pill (`layoutId="dock-pill"`) por DOT circular (`w-1.5 h-1.5 rounded-full bg-[var(--leaf-bright)]`) con **layoutId="dock-dot"** para animacion Apple-like deslizante
- Transicion: spring stiffness 400 damping 30, reduced-motion: duration 0.15

### 8. AppLayout.tsx

Usar `useLocation` para ocultar el header cuando `pathname === "/dashboard"` (el dashboard tiene su propio header inline):

```tsx
const { pathname } = useLocation();
const showHeader = pathname !== "/dashboard";
```

Envolver header en `{showHeader && (...)}`.

---

## Impacto en otras paginas

- Body font-family NO cambia (sigue Nunito)
- Los colores `dash.*` son nuevos y no afectan tokens existentes
- Las clases organicas (.organic-card, etc.) son aditivas
- El DockNav cambia visualmente en toda la app (deseable para consistencia)
- Otras paginas NO tienen `.dashboard-skin`, asi que conservan Nunito/Playfair

## Responsive

- Stats grid: `grid-cols-2` mobile, `grid-cols-4` en lg
- Chart barras: flex con gap, se adaptan al ancho
- Header: avatar/notificacion ocultos en mobile (`hidden md:flex`)
- Hero card: layout flexible
- Dock: padding y gap ajustados para 360-430px
- Max-width `max-w-4xl` centrado en desktop

## Checklist

- Sin overflow-x en 360/390/430/768/1024/1440
- Botones >= 44px en mobile
- Fuentes Fraunces/Quicksand SOLO dentro de .dashboard-skin
- Colores via CSS vars, no hex directo en componentes
- Chart bars con aria-label por barra y tap tooltip mobile
- DockNav dot activo con layoutId para animacion deslizante
- prefers-reduced-motion respetado
- Body font-family global intacto (Nunito)
