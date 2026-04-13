
# Bugfix: Login redirect + AuthCallback + Weekly chart local dates

## A) Login con soporte `?redirect=`

### Login.tsx
- Leer `searchParams.get("redirect")` de la URL
- En handleSubmit success: `navigate(redirectParam || "/dashboard", { replace: true })`

### ProtectedRoute.tsx
- Cambiar `<Navigate to="/login" />` a `<Navigate to={"/login?redirect=" + encodeURIComponent(location.pathname)} />`
- Asi cuando un usuario no autenticado intenta acceder a `/cursos/abc`, al loguearse vuelve a esa ruta

## B) AuthCallback con PKCE

### Nuevo archivo: `src/pages/AuthCallback.tsx`
- On mount: revisar si hay `code` en URL params (`new URLSearchParams(window.location.search).get("code")`)
- Si hay `code`: llamar `supabase.auth.exchangeCodeForSession(code)` y luego navegar a `/dashboard`
- Si no hay `code`: llamar `supabase.auth.getSession()` -- si hay session navegar a `/dashboard`, si no mostrar mensaje "Cuenta confirmada" + link a `/login`
- Estilo: misma card centrada que Login (reusar clases existentes)

### App.tsx
- Agregar ruta publica: `<Route path="/auth/callback" element={<AuthCallback />} />`

### AuthContext.tsx
- Cambiar `emailRedirectTo` en signUp: `${window.location.origin}/auth/callback`

## C) Fechas locales en weekly chart

### Escenario.tsx (linea 124)
- Cambiar `new Date().toISOString().split("T")[0]` a `new Date().toLocaleDateString('en-CA')`

### useDashboardStats.ts (lineas 82, 85, 99, 116)
- Reemplazar todos los `.toISOString().split("T")[0]` por `.toLocaleDateString('en-CA')` para consistencia local

## Archivos

| Archivo | Cambio |
|---------|--------|
| `src/pages/Login.tsx` | Leer `?redirect=`, navegar a redirect o `/dashboard` |
| `src/components/ProtectedRoute.tsx` | Pasar ruta actual como `?redirect=` al redirigir a login |
| `src/pages/AuthCallback.tsx` | **Nuevo**: PKCE exchange + fallback getSession + UI minima |
| `src/App.tsx` | Agregar ruta `/auth/callback` |
| `src/contexts/AuthContext.tsx` | emailRedirectTo apunta a `/auth/callback` |
| `src/pages/Escenario.tsx` | toLocaleDateString en linea 124 |
| `src/hooks/useDashboardStats.ts` | toLocaleDateString en lineas 82, 85, 99, 116 |

No se toca: ProtectedRoute logic (solo el `to` del Navigate), skin, DockNav, motor de aprendizaje.
