# Guía de Despliegue — Semilla

Escrita para integrantes de Enactus ITESM sin experiencia previa en DevOps.
Si es tu primera vez, lee todo antes de ejecutar cualquier comando.

---

## 1. Prerrequisitos

### Cuentas y accesos que necesitas

| Recurso | Dónde pedirlo | Para qué |
|---|---|---|
| Acceso al repositorio GitHub | Lider técnico del equipo | Hacer push y ver los workflows |
| Acceso al proyecto Supabase | `https://app.supabase.com` | Ver logs, correr migraciones |
| Acceso a AWS Console | Lider técnico / coordinador | Ver S3, CloudFront, logs |
| Secrets de GitHub Actions | Lider técnico | Ya configurados; no los necesitas tú directamente |

> Si no tienes acceso a AWS Console, no pasa nada para el flujo normal.
> Solo lo necesitas para el despliegue manual de emergencia.

### Herramientas locales

```bash
# Verifica que tienes lo necesario:
node --version   # debe ser >= 20
npm --version    # cualquier versión reciente
git --version    # cualquier versión reciente
```

Si `node` no está instalado: descarga desde https://nodejs.org (LTS).

---

## 2. Configuración por primera vez

```bash
# 1. Clona el repositorio
git clone https://github.com/Riverstargroup/cultiva-finanzas.git
cd cultiva-finanzas

# 2. Instala dependencias (usa npm ci, no npm install)
npm ci

# 3. Crea tu archivo de variables de entorno
cp .env.example .env
```

Abre `.env` en cualquier editor y reemplaza los valores de ejemplo con los reales.
Los valores reales los encuentras en:
- **Supabase**: `app.supabase.com` → tu proyecto → Settings → API
- **AWS**: pídelos al lider técnico (no los necesitas para desarrollo local)

```bash
# 4. Verifica que la app corre
npm run dev
# Abre http://localhost:8080 en el navegador
```

---

## 3. Flujo normal de despliegue

**Resumen: haz tu cambio → abre PR → espera el check → fusiona → CI despliega.**

```
Tu computadora          GitHub                    AWS
     │                     │                       │
     ├─ git push ─────────>│                       │
     │                     ├─ PR Check workflow ──>│ (solo build, no deploy)
     │                     │  ✅ Build passed       │
     │                     ├─ Merge to main        │
     │                     ├─ Deploy workflow ────>│
     │                     │                       ├─ S3 sync
     │                     │                       ├─ CloudFront invalidation
     │                     │                       └─ Sitio actualizado ~60s
```

### Paso a paso

```bash
# 1. Asegúrate de estar en main y actualizado
git checkout main
git pull origin main

# 2. Crea una rama para tu cambio
git checkout -b feature/nombre-de-tu-cambio

# 3. Haz tus cambios, luego verifica que compila
npm run build   # debe terminar sin errores

# 4. Sube tu rama y abre un Pull Request en GitHub
git add .
git commit -m "feat: descripción de tu cambio"
git push -u origin feature/nombre-de-tu-cambio
```

En GitHub verás que el workflow **PR Check** corre automáticamente.
Espera a que aparezca el comentario "✅ Build passed" en el PR antes de fusionar.

Cuando fusionas el PR a `main`, el workflow **Deploy to Production** corre solo.
Cuando termina, comenta en tu PR con la URL de producción.

---

## 4. Despliegue manual (cuando CI está caído)

Solo usa esto si GitHub Actions no funciona y necesitas desplegar urgentemente.

### Requisitos adicionales

```bash
# AWS CLI instalado y configurado
aws --version
aws configure   # ingresa Access Key, Secret Key, Region

# Variables de entorno de AWS
export S3_BUCKET="semilla-hosting-275202517479"      # pregunta al lider técnico
export CF_DISTRIBUTION_ID="E..."                      # pregunta al lider técnico
```

### Comandos

```bash
# 1. Construye la app
npm ci
npm run build

# 2. Sube archivos estáticos con cache largo (imágenes, JS, CSS)
aws s3 sync dist/ s3://$S3_BUCKET \
  --delete \
  --exclude "index.html" \
  --cache-control "public, max-age=31536000, immutable"

# 3. Sube index.html sin cache (para que los usuarios siempre vean la última versión)
aws s3 cp dist/index.html s3://$S3_BUCKET/index.html \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"

# 4. Invalida el cache de CloudFront (hace que los cambios sean visibles)
aws cloudfront create-invalidation \
  --distribution-id $CF_DISTRIBUTION_ID \
  --paths "/*"
```

La invalidación tarda ~60 segundos en propagarse globalmente.

---

## 5. Procedimiento de rollback

Si desplegaste algo que rompió la app y necesitas revertir.

### Opción A: Revertir en Git (recomendada)

```bash
# Encuentra el commit al que quieres volver
git log --oneline -10

# Crea un commit que revierte el cambio problemático
git revert <hash-del-commit-malo>
git push origin main
```

Esto dispara el workflow de deploy automáticamente con la versión anterior.

### Opción B: Restaurar versión anterior desde S3 (emergencia)

```bash
# Lista las versiones disponibles de index.html en S3
aws s3api list-object-versions \
  --bucket $S3_BUCKET \
  --prefix "index.html" \
  --query "Versions[*].{ID:VersionId,Date:LastModified}" \
  --output table

# Restaura una versión anterior de index.html
aws s3api copy-object \
  --bucket $S3_BUCKET \
  --copy-source "$S3_BUCKET/index.html?versionId=<VERSION_ID>" \
  --key "index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --metadata-directive REPLACE

# Invalida CloudFront
aws cloudfront create-invalidation \
  --distribution-id $CF_DISTRIBUTION_ID \
  --paths "/*"
```

> Nota: el versionado de S3 debe estar habilitado en el bucket.
> Si no está habilitado, solo la Opción A está disponible.

---

## 6. Migraciones de Supabase

**Nunca modifiques la base de datos directamente en producción desde el Dashboard
sin crear primero una migración.**

### Crear una nueva migración

```bash
# Instala Supabase CLI si no lo tienes
npm install -g supabase

# Autentícate
supabase login

# Crea el archivo de migración
supabase migration new nombre_de_tu_migracion
# Crea: supabase/migrations/<timestamp>_nombre_de_tu_migracion.sql
```

Edita el archivo SQL generado con tus cambios (`ALTER TABLE`, `CREATE TABLE`, etc.).

### Probar la migración localmente

```bash
# Inicia Supabase local (requiere Docker)
supabase start

# Aplica las migraciones pendientes
supabase db push
```

### Aplicar la migración en producción

```bash
# Enlaza con el proyecto de producción (solo la primera vez)
supabase link --project-ref wnvdjhwceywfbcwvkrla

# Aplica la migración
supabase db push

# Verifica en el dashboard de Supabase que los cambios están aplicados
# https://app.supabase.com/project/wnvdjhwceywfbcwvkrla/database/migrations
```

### Sincronizar tipos TypeScript después de un cambio de esquema

Cuando cambias el esquema de la base de datos, los tipos TypeScript quedan desactualizados.
Para regenerarlos:

1. Ve a GitHub → Actions → **Sync Supabase Types**
2. Haz clic en "Run workflow"
3. Espera a que termine — creará un commit automático con los tipos actualizados

Para correrlo localmente:

```bash
export SUPABASE_ACCESS_TOKEN=<tu-token-personal>
npx supabase gen types typescript \
  --project-id wnvdjhwceywfbcwvkrla \
  > src/integrations/supabase/types.ts
```

Tu token personal de Supabase: https://app.supabase.com/account/tokens

---

## 7. Monitoreo

### Dónde revisar cuando algo falla

| Síntoma | Dónde mirar |
|---|---|
| App no carga / error 403-404 | AWS Console → CloudFront → Error pages |
| App carga pero datos no aparecen | Supabase Dashboard → Logs → API |
| Error de autenticación | Supabase → Authentication → Logs |
| Build falla en CI | GitHub → Actions → último workflow fallido |
| Error en base de datos | Supabase → Database → Logs |

### Supabase Dashboard

URL: https://app.supabase.com/project/wnvdjhwceywfbcwvkrla

- **Table Editor**: ver y editar datos
- **Authentication**: usuarios registrados, sesiones activas
- **Logs → API**: todas las peticiones a la API (busca errores 4xx y 5xx)
- **Database → Logs**: queries lentas y errores de SQL

### CloudFront Access Logs

Si los logs de acceso están habilitados, los encontrarás en:
AWS Console → S3 → (bucket de logs, pregunta al lider técnico) → fecha de hoy

Para ver errores recientes en CloudFront:
AWS Console → CloudFront → tu distribución → Monitoring → Error rate

---

## 8. Errores comunes y cómo resolverlos

### Error: Temporal Dead Zone (TDZ) crash en el bundle de Rollup

**Síntoma**: La app explota en producción con `ReferenceError: Cannot access 'X' before initialization`, pero funciona bien en desarrollo.

**Causa**: Vite/Rollup reorganiza módulos y crea referencias circulares que violan el TDZ de `let`/`const`.

**Fix**: Convierte la variable problemática de `const` a función lazy, o mueve la declaración antes de su uso:

```typescript
// ❌ Puede fallar en el bundle
export const CONFIG = { supabase: createClient(URL, KEY) };

// ✅ Seguro
export function getConfig() {
  return { supabase: createClient(URL, KEY) };
}
```

---

### Error: Supabase RLS — recursión infinita

**Síntoma**: Queries a Supabase retornan error `infinite recursion detected in policy for relation "X"`.

**Causa**: Una política RLS llama a una función que a su vez consulta la misma tabla, creando un ciclo.

**Fix**: Usa `SECURITY DEFINER` en la función o reescribe la política para evitar la autoconsulta:

```sql
-- ❌ Causa recursión si la tabla users tiene RLS habilitado
CREATE POLICY "users can read own data" ON users
  USING (id = (SELECT id FROM users WHERE auth.uid() = user_id));

-- ✅ Referencia directa sin subconsulta a la misma tabla
CREATE POLICY "users can read own data" ON users
  USING (id = auth.uid());
```

---

### Error: 406 de Supabase cuando la tabla está vacía

**Síntoma**: `.single()` en una query de Supabase lanza un error 406 (PGRST116) cuando no hay filas.

**Causa**: `.single()` espera exactamente una fila. Con cero filas lanza error.

**Fix**: Usa `.maybeSingle()` cuando el resultado puede ser nulo:

```typescript
// ❌ Falla si no hay resultados
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

// ✅ Retorna null si no hay resultados
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .maybeSingle();
```

---

## Secretos de GitHub Actions requeridos

Para que los workflows funcionen, estos secretos deben estar configurados en:
**GitHub → Riverstargroup/cultiva-finanzas → Settings → Secrets and variables → Actions**

| Secreto | Descripción | Quién lo configura |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | ID de la clave de acceso AWS del usuario de despliegue | Lider técnico |
| `AWS_SECRET_ACCESS_KEY` | Clave secreta AWS correspondiente | Lider técnico |
| `AWS_REGION` | Región AWS (ej. `us-east-1`) | Lider técnico |
| `S3_BUCKET` | Nombre del bucket S3 de producción | Lider técnico |
| `CF_DISTRIBUTION_ID` | ID de la distribución CloudFront | Lider técnico |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase | Lider técnico |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave anónima de Supabase | Lider técnico |
| `SUPABASE_ACCESS_TOKEN` | Token personal de Supabase (para sync de tipos) | Lider técnico |

> El usuario IAM de AWS debe tener permisos: `s3:PutObject`, `s3:DeleteObject`,
> `s3:ListBucket`, `cloudfront:CreateInvalidation`.
> Crea un usuario IAM dedicado para CI/CD — no uses las credenciales de tu cuenta personal.
