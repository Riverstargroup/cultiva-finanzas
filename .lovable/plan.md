

# Botanical Skin para todas las paginas protegidas

## Resumen

Aplicar el skin organico existente (botanical-bg, organic-card, card-stat, vibrant-btn, Fraunces/Quicksand via `.dashboard-skin`) a las 4 paginas restantes: Cursos, Calculadora, Logros, Perfil. Crear un wrapper reutilizable `BotanicalPage` para evitar duplicacion. Actualizar componentes compartidos (CourseCard, BadgeCard, StatCard, EmptyState) para usar estilos organicos.

---

## Archivos a crear/modificar

| Accion | Archivo | Descripcion |
|--------|---------|-------------|
| Crear | `src/components/layout/BotanicalPage.tsx` | Wrapper reutilizable con botanical-bg, dashboard-skin, header organico |
| Editar | `src/pages/Cursos.tsx` | Envolver con BotanicalPage, tabs organicos |
| Editar | `src/pages/Calculadora.tsx` | Envolver con BotanicalPage, form en organic-card, boton vibrant-btn, resultados card-stat |
| Editar | `src/pages/Logros.tsx` | Envolver con BotanicalPage, contador en chip organico |
| Editar | `src/pages/Perfil.tsx` | Envolver con BotanicalPage, avatar organico, stats card-stat, boton cerrar sesion organico |
| Editar | `src/components/CourseCard.tsx` | organic-card, tipografia organica, badge chip organico, progress bar con colores leaf |
| Editar | `src/components/BadgeCard.tsx` | organic-card, icon bubble organico, estados locked/unlocked con colores del skin |
| Editar | `src/components/StatCard.tsx` | Convertir a card-stat con icon bubble organico, value en font-heading, label uppercase |
| Editar | `src/components/EmptyState.tsx` | Estilizar dentro de organic-card compacto |
| Editar | `src/components/AppLayout.tsx` | Ocultar header en TODAS las paginas protegidas (BotanicalPage incluye su propio header) |

---

## Detalle tecnico

### 1. BotanicalPage.tsx (nuevo componente)

```text
Props:
  - title: string
  - subtitle: string
  - children: ReactNode

Render:
  <PageTransition>
    <div className="dashboard-skin botanical-bg -mx-4 -mt-4 min-h-screen px-4 pt-6 pb-28 md:-mx-6 md:-mt-6 md:px-6 md:pt-8 lg:-mx-8 lg:-mt-8 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-black md:text-3xl"
              style={{ color: "var(--forest-deep)" }}>
            {title}
          </h1>
          <p className="mt-1.5 text-xs font-medium uppercase tracking-widest"
             style={{ color: "var(--leaf-muted)" }}>
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  </PageTransition>
```

Usa los mismos margenes negativos y paddings que Dashboard.tsx para que el fondo botanico cubra toda la pantalla. Incluye `dashboard-skin` para activar Quicksand/Fraunces.

### 2. AppLayout.tsx

Eliminar el header condicional por completo (ya que TODAS las paginas protegidas ahora usan BotanicalPage con su propio titulo). Simplificar:

```text
return (
  <div className="flex min-h-screen w-full flex-col">
    <main className="flex-1 p-4 pb-28 md:p-6 md:pb-28 lg:p-8 lg:pb-28">
      <SwipeNavigator>
        <Outlet />
      </SwipeNavigator>
    </main>
    <DockNav />
  </div>
);
```

Eliminar imports de Sprout, useLocation, y el bloque header.

### 3. Cursos.tsx

- Envolver con `<BotanicalPage title="Cursos" subtitle="Explora y avanza en tu jardin financiero.">`
- Eliminar PageTransition (ya lo incluye BotanicalPage)
- Tabs: reemplazar TabsList/TabsTrigger con botones custom estilo chip organico:
  - Container: `flex gap-2 flex-wrap`
  - Cada tab: `px-4 py-2 rounded-full text-sm font-semibold border transition-all min-h-[44px]`
  - Activo: `bg-white border-[var(--leaf-bright)] text-[var(--forest-deep)] shadow-sm`
  - Inactivo: `bg-transparent border-[var(--clay-soft)] text-[var(--leaf-muted)] hover:border-[var(--leaf-fresh)]`
- Mantener grid y CourseCard (CourseCard se actualiza por separado)
- EmptyState dentro de organic-card (EmptyState se actualiza por separado)

### 4. Calculadora.tsx

- Envolver con `<BotanicalPage title="Calculadora" subtitle="Simula el crecimiento de tu dinero con interes compuesto.">`
- Formulario: reemplazar `<Card>` con `<div className="organic-card p-6 md:p-8 space-y-4">`
- Labels: agregar `className="text-[10px] font-semibold uppercase tracking-widest"` con `style={{ color: "var(--leaf-muted)" }}`
- Inputs: agregar estilos `bg-[var(--soil-warm)] border-[var(--clay-soft)]` via className
- Boton Calcular: reemplazar `<Button>` con `<button className="vibrant-btn w-full justify-center">`
- Resultados (3 cards): reemplazar `<Card>` con `<div className="card-stat p-4 text-center">`, valor en `font-heading font-bold text-2xl` con color forest-deep, label uppercase leaf-muted
- Chart Recharts: mantener pero estilizar:
  - Card contenedora: `organic-card p-5 md:p-6`
  - Titulo con barra verde accent (como en Dashboard chart)
  - Line stroke: `var(--leaf-bright)`
  - Dot fill: `var(--leaf-bright)`
  - CartesianGrid: stroke tenue `var(--clay-soft)`
  - Tooltip background: white con border clay-soft

### 5. Logros.tsx

- Envolver con `<BotanicalPage title="Logros" subtitle="0 de 8 insignias desbloqueadas.">`
- Agregar chip contador arriba del grid: `<div className="organic-card inline-flex px-4 py-2" style con colores organicos>`
- Mantener grid, BadgeCard se actualiza por separado
- Eliminar PageTransition (BotanicalPage lo incluye)

### 6. Perfil.tsx

- Envolver con `<BotanicalPage title="Perfil" subtitle={user?.email || "Tu invernadero personal"}>`
- Card avatar: reemplazar `<Card>` con `<div className="organic-card p-6">`
  - Avatar circulo: `organic-border` con `bg-[color-mix(in srgb, var(--leaf-fresh) 20%, transparent)]`, iniciales en `font-heading font-bold` color leaf-bright
  - Nombre: `font-heading font-bold text-lg` color forest-deep
  - Email: `text-sm` color leaf-muted
  - Boton editar: estilo secundario (bg white, border clay-soft, rounded-full)
  - Inputs (modo edicion): bg soil-warm, border clay-soft
  - Boton guardar: vibrant-btn
  - Boton cancelar: bg transparent, border clay-soft
- Stats: 3 StatCards (actualizados por separado a card-stat)
- Boton cerrar sesion: `vibrant-btn w-full justify-center` (terracotta, organico). No rojo destructivo sino terracotta con icono LogOut. Mantiene onClick handleSignOut.
- Contenedor: `max-w-4xl` (consistente con dashboard)

### 7. CourseCard.tsx

- Reemplazar `<Card>` con `<div className="organic-card overflow-hidden h-full">`
- Gradient header: mantener pero con organic-border arriba (agregar `style={{ borderRadius: "30px 60px 0 0 / 50px 30px 0 0" }}`)
- Badge dificultad: chip organico `bg-[var(--soil-warm)] text-[var(--forest-deep)] border-[var(--clay-soft)]`
- Titulo h3: `font-heading font-bold` color forest-deep
- Descripcion: color text-warm
- Progress bar: div custom con bg clay-soft, fill leaf-bright, border-radius organico
- Hover: ya tiene whileHover y whileTap, mantener

### 8. BadgeCard.tsx

- Reemplazar `<Card>` con `<div className="organic-card h-full">`
- Icon bubble: `organic-border` con `bg-[color-mix(in srgb, var(--leaf-fresh) 15%, transparent)]` cuando unlocked
- Locked: misma forma organica pero `bg-[var(--clay-soft)]`, icono color leaf-muted, opacidad 0.65 en vez de 0.5 (legible)
- Nombre: `font-heading font-bold text-sm` color forest-deep
- Descripcion: color text-warm
- unlockedAt: color leaf-bright

### 9. StatCard.tsx

- Reemplazar `<Card>` completo con `<div className="card-stat p-4 md:p-5">`
- Icon bubble organico arriba: `organic-border h-10 w-10` con bg `color-mix(in srgb, var(--leaf-fresh) 15%, transparent)`
- Icono: color leaf-bright (ignorar accentClass prop, usar siempre organico)
- Valor: `font-heading text-2xl font-bold` color forest-deep
- Label: `text-[10px] font-semibold uppercase tracking-widest` color leaf-muted
- Eliminar CardHeader/CardContent, render directo dentro del div

### 10. EmptyState.tsx

- Envolver contenido en `organic-card p-8`
- Icon bubble: `organic-border` con bg leaf-fresh/15 en vez de bg-muted
- Titulo: `font-heading font-bold` color forest-deep
- Descripcion: color text-warm
- Boton accion: vibrant-btn
- Reducir padding vertical (py-10 en vez de py-16)

---

## Impacto

- Dashboard.tsx: SIN CAMBIOS (ya tiene su propio wrapper skin)
- DockNav: SIN CAMBIOS (ya estilizado)
- Rutas, DB, auth: SIN CAMBIOS
- Body font global: SIN CAMBIOS (Nunito se mantiene fuera de .dashboard-skin)
- Todas las paginas protegidas ahora comparten el mismo fondo, tipografia y estilo de cards

## Responsive

- BotanicalPage usa max-w-4xl centrado, responsive padding
- Grids mantienen sus breakpoints existentes
- Tabs chip se hacen wrap en mobile
- Todos los botones >= 44px
- pb-28 en BotanicalPage asegura que dock no tape contenido

