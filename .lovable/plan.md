

# Fase 2: Dashboard Principal

## Resumen
Se creara el dashboard principal con saludo personalizado, tarjetas de metricas, grafico de progreso semanal, y un sistema de navegacion con sidebar. Tambien se corregira el error de TypeScript existente en la landing page.

## Cambios planificados

### 1. Corregir error de build en Index.tsx
El error esta en la variante `fadeUp` (linea 19-26). La propiedad `ease` usa un array de numeros `[0.22, 1, 0.36, 1]` que Framer Motion espera como tupla de tipo `[number, number, number, number]`. Se corregira usando `as const` o casteando el tipo.

### 2. Crear pagina Dashboard (`src/pages/Dashboard.tsx`)
- Saludo personalizado: "Hola, [nombre]" usando datos del perfil de Supabase
- 4 tarjetas de metricas con iconos:
  - Cursos completados (placeholder: 0)
  - Tiempo invertido (placeholder: 0h)
  - Insignias obtenidas (placeholder: 0/5)
  - Racha de dias (placeholder: 0)
- Grafico de barras de progreso semanal usando Recharts (datos placeholder)
- Boton CTA "Continuar aprendiendo"

### 3. Crear layout con Sidebar (`src/components/AppLayout.tsx`)
- Usar el sistema de Sidebar de shadcn/ui ya instalado
- Items de navegacion: Dashboard, Cursos, Calculadora, Logros, Perfil
- Boton de cerrar sesion en el footer del sidebar
- Responsive: sheet en mobile, sidebar colapsable en desktop
- Logo Semilla en el header del sidebar

### 4. Crear hook para perfil (`src/hooks/useProfile.ts`)
- Fetch del perfil del usuario desde la tabla `profiles`
- Retorna `full_name` para el saludo personalizado

### 5. Actualizar rutas en App.tsx
- Agregar ruta `/dashboard` con la nueva pagina
- Redirigir usuarios autenticados desde `/` al dashboard
- Proteger la ruta `/dashboard` (redirigir a login si no autenticado)

### 6. Crear componente de ruta protegida (`src/components/ProtectedRoute.tsx`)
- Wrapper que verifica autenticacion
- Redirige a `/login` si no hay sesion

---

## Detalles tecnicos

### Archivos nuevos
- `src/pages/Dashboard.tsx` - Pagina principal del dashboard
- `src/components/AppLayout.tsx` - Layout con sidebar para paginas autenticadas
- `src/components/AppSidebar.tsx` - Componente sidebar con navegacion
- `src/components/ProtectedRoute.tsx` - Wrapper de ruta protegida
- `src/hooks/useProfile.ts` - Hook para obtener perfil de usuario

### Archivos modificados
- `src/pages/Index.tsx` - Fix del error de TypeScript en `fadeUp` variants
- `src/App.tsx` - Agregar ruta `/dashboard` y proteccion de rutas

### Dependencias
No se requieren nuevas dependencias. Se usara Recharts (ya instalado) para el grafico y los componentes de sidebar de shadcn/ui (ya disponibles).

### Estructura de navegacion del sidebar
```text
[Logo Semilla]
----
Dashboard      (LayoutDashboard)
Cursos         (BookOpen)
Calculadora    (Calculator)
Logros         (Trophy)
Perfil         (User)
----
Cerrar sesion  (LogOut)
```

### Grafico de progreso
- Recharts BarChart con datos placeholder para 7 dias de la semana
- Usa la paleta de colores de Semilla (verde primario)
- Tooltips con formato en espanol

