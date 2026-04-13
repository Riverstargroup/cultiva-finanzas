# Cultiva Finanzas (Semilla) — Documentacion Tecnica y Arquitectura AWS

**Proyecto:** Semilla - Educacion Financiera Organica  
**Organizacion:** Enactus Mexico  
**Version:** 1.0.0  
**Fecha:** Abril 2026

---

## 1. Descripcion Tecnica del Proyecto

### 1.1 Proposito

Semilla es una plataforma web de educacion financiera que utiliza metaforas botanicas para ensenar conceptos de finanzas personales a usuarios hispanohablantes. La plataforma combina:

- **Aprendizaje basado en escenarios**: El usuario toma decisiones financieras en situaciones simuladas de la vida real.
- **Algoritmo de repeticion espaciada SM-2**: Optimiza el refuerzo de conocimiento segun el rendimiento del usuario.
- **Gamificacion**: Sistema de insignias, racha diaria y seguimiento de habilidades para motivar la constancia.
- **Calculadora financiera**: Herramienta de calculo de interes, ahorro y deuda.

### 1.2 Stack Tecnologico Completo

| Capa | Tecnologia | Version | Proposito |
|------|-----------|---------|-----------|
| Frontend | React | 18.3 | Interfaz de usuario |
| Lenguaje | TypeScript | 5.8 | Tipado estatico |
| Bundler | Vite + SWC | 5.4 | Compilacion ultra-rapida |
| Estilos | TailwindCSS | 3.4 | Utilidades CSS con tema botanico |
| Animaciones | Framer Motion | 12 | Transiciones fluidas |
| Componentes | Radix UI + shadcn/ui | Latest | Componentes accesibles |
| Estado del servidor | TanStack Query | 5.83 | Cache y sincronizacion |
| Formularios | React Hook Form + Zod | 7.61 / 3.25 | Validacion |
| Enrutamiento | React Router | 6.30 | Navegacion SPA |
| Backend | Supabase | Latest | PostgreSQL + Auth + Storage |
| Algoritmo | SM-2 | Custom | Repeticion espaciada |
| Tests | Vitest | Latest | Testing unitario |
| Linting | ESLint | Latest | Calidad de codigo |
| **Hosting** | **Amazon S3** | **Latest** | **Archivos estaticos** |
| **CDN** | **Amazon CloudFront** | **Latest** | **Distribucion global** |
| **CI/CD** | **AWS CodePipeline** | **Latest** | **Pipeline automatizado** |
| **Build** | **AWS CodeBuild** | **Latest** | **Compilacion en nube** |
| **Monitoreo** | **AWS CloudWatch** | **Latest** | **Logs y alertas** |
| **IaC** | **AWS CloudFormation** | **Latest** | **Infraestructura como codigo** |
| **IAM** | **AWS IAM** | **Latest** | **Control de acceso** |

---

## 2. Principios DevOps Aplicados

### 2.1 Las 5 Practicas Fundamentales

#### Automatizacion
Todo el ciclo de vida del software esta automatizado:
- **Instalacion**: `scripts/install-dependencies.sh` configura el entorno desde cero.
- **Build**: `npm run build` genera artefactos optimizados para produccion.
- **Pruebas**: Vitest ejecuta tests automaticamente en cada build.
- **Despliegue**: `scripts/deploy.sh` sincroniza con S3 e invalida cache CloudFront.
- **Infraestructura**: CloudFormation aprovisiona todos los recursos AWS con un solo comando.

#### Colaboracion (GitFlow)
- **Rama main**: Codigo de produccion, protegida con requerimiento de Pull Request.
- **Ramas feature/**: `feature/nombre-funcionalidad` para nuevas caracteristicas.
- **Ramas fix/**: `fix/descripcion-bug` para correcciones.
- **Commits semanticos**: `feat:`, `fix:`, `docs:`, `ci:`, `infra:`.
- **Code review**: Minimo 1 aprobacion requerida antes de merge a main.

#### Integracion Continua (CI)
En cada Pull Request hacia `main`, CodeBuild ejecuta automaticamente:
1. `npm ci` - Instalacion limpia de dependencias
2. `npm run lint` - Verificacion de calidad del codigo
3. `npm run test -- --run` - Suite de tests unitarios
4. `npm run build` - Verificacion de que el build compila correctamente

#### Entrega Continua (CD)
Al hacer merge a `main`:
1. CodePipeline detecta el cambio via webhook GitHub
2. CodeBuild compila y genera artefactos en `dist/`
3. Los archivos se sincronizan con el bucket S3
4. Se invalida la cache de CloudFront
5. El sitio actualizado esta disponible globalmente en segundos

#### Monitoreo Continuo
- **CloudWatch Logs**: Todos los logs de Nginx, CodeBuild y la aplicacion.
- **CloudWatch Metrics**: Solicitudes, errores 4xx/5xx, latencia CloudFront.
- **CloudWatch Alarms**: Alertas automaticas por email via SNS cuando se detectan anomalias.
- **Dashboard**: Panel unificado con todas las metricas del proyecto.
- **Metricas personalizadas**: Conteo de despliegues, builds exitosos y fallidos.

#### Seguridad (DevSecOps)
- **IAM con minimo privilegio**: Cada servicio (CodeBuild, CodePipeline) tiene solo los permisos estrictamente necesarios.
- **CloudFront HTTPS obligatorio**: Todo el trafico es redirigido a HTTPS.
- **Origin Access Control (OAC)**: El bucket S3 solo es accesible via CloudFront, nunca directamente.
- **Variables de entorno seguras**: Nunca credenciales en el codigo fuente; se usan parametros seguros de CloudFormation.
- **Encriptacion en reposo**: El bucket de artefactos usa AES-256.
- **IMDSv2 obligatorio**: Las instancias EC2 usan el endpoint de metadatos seguro.
- **RLS en Supabase**: Row-Level Security garantiza aislamiento de datos por usuario.

---

## 3. Arquitectura AWS

### 3.1 Diagrama General

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INTERNET                                      │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Amazon CloudFront (CDN Global)                    │
│  • Distribucion global (Edge Locations)                              │
│  • HTTPS obligatorio + HTTP/3                                        │
│  • Cache de assets estaticos (1 año)                                 │
│  • Cache de HTML (10 minutos)                                        │
│  • SPA fallback: 403/404 → index.html                                │
│  • Security Headers (X-Frame-Options, CSP, etc.)                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │ Origin Request (OAC)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Amazon S3 (Static Hosting)                        │
│  • Archivos estaticos: index.html, JS, CSS, assets                  │
│  • Versionado habilitado                                             │
│  • Acceso exclusivo via CloudFront (OAC)                             │
│  • Ciclo de vida: elimina versiones viejas (30 dias)                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE                                     │
│                                                                      │
│  GitHub ──webhook──► CodePipeline ──► CodeBuild ──► S3              │
│  (Source)            (Orchestrator)   (Build/Test)   (Deploy)        │
│                                           │                          │
│                                           ▼                          │
│                                    CloudFront Invalidation           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    MONITOREO Y ALERTAS                               │
│                                                                      │
│  CloudWatch Logs ──► CloudWatch Metrics ──► CloudWatch Alarms        │
│  (Nginx, App,         (Solicitudes, Errores,   (5xx > 5%,            │
│   CodeBuild)          Latencia, Builds)         Build fallidos)       │
│                                │                                     │
│                                ▼                                     │
│                          SNS Topic ──► Email Notificaciones          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    IAM (Control de Acceso)                           │
│  • CodeBuildRole: S3, CloudFront, CloudWatch                         │
│  • CodePipelineRole: S3, CodeBuild, SNS                              │
│  • EC2InstanceProfile: SSM, CloudWatch Agent                         │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Flujo del Pipeline CI/CD

```
Developer
    │
    │  git push origin main
    ▼
GitHub Repository
    │
    │  Webhook HTTP POST
    ▼
AWS CodePipeline
    │
    ├──► Stage 1: SOURCE
    │        └── Descarga el codigo fuente del commit
    │            └── Artefacto: SourceArtifact.zip → S3 (Artifacts Bucket)
    │
    ├──► Stage 2: BUILD (CodeBuild)
    │        ├── npm ci                    (instalar dependencias)
    │        ├── npm run lint              (verificar calidad)
    │        ├── npm run test -- --run     (ejecutar tests)
    │        ├── npm run build             (compilar React → dist/)
    │        └── Artefacto: dist/*.{html,js,css} → S3 (Artifacts Bucket)
    │
    └──► Stage 3: DEPLOY
             ├── aws s3 sync dist/ s3://website-bucket/
             │       ├── HTML: Cache-Control: max-age=600
             │       └── Assets: Cache-Control: max-age=31536000, immutable
             ├── aws cloudfront create-invalidation --paths "/*"
             └── aws cloudwatch put-metric-data (DeploymentCount +1)

         ✓ Sitio actualizado globalmente
```

### 3.3 Servicios AWS y su Funcion

| Servicio | Rol | Configuracion Clave |
|---------|-----|---------------------|
| **S3 (Website)** | Hosting de archivos estaticos | Versionado ON, OAC exclusivo, ciclo de vida 30 dias |
| **S3 (Artifacts)** | Artefactos del pipeline | Versionado ON, AES-256, TTL 90 dias |
| **CloudFront** | CDN global HTTPS | HTTP/3, SPA fallback, Security Headers, OAC |
| **CodePipeline** | Orquestador CI/CD | 3 stages: Source → Build → Deploy |
| **CodeBuild** | Compilacion y tests | Node 20, cache local, buildspec.yml |
| **IAM** | Control de acceso | Minimo privilegio por servicio |
| **CloudWatch Logs** | Centralizacion de logs | 4 grupos: app, nginx, codebuild, pipeline |
| **CloudWatch Metrics** | Metricas de rendimiento | Namespace: CultivaFinanzas/ |
| **CloudWatch Alarms** | Alertas automaticas | 5xx > 5%, builds fallidos > 2/dia |
| **CloudWatch Dashboard** | Panel unificado | Solicitudes, errores, builds, despliegues |
| **SNS** | Notificaciones | Email en alarmas y OK recovery |
| **EC2 (opcional)** | Servidor de aplicacion | t3.micro, IMDSv2, encrypted EBS |

---

## 4. Estructura de Archivos de Infraestructura

```
infrastructure/
├── cloudformation.yaml    # Plantilla IaC completa (S3, CloudFront, CodePipeline, IAM, CloudWatch)
├── buildspec.yml          # Especificacion de build para CodeBuild (fases: install, pre_build, build, post_build)
└── docker-compose.yaml    # Entorno de desarrollo local (App, Nginx, Supabase completo)

scripts/
├── install-dependencies.sh  # Bash: Instala Node.js, Python3, AWS CLI, Boto3, Docker en Linux
├── deploy.sh                # Bash: Build + S3 sync + CloudFront invalidation + CloudWatch metric
├── ec2-setup.sh             # Bash: Configura EC2 (Nginx, Node.js, CodeDeploy Agent, CloudWatch Agent)
├── aws_manager.py           # Python/Boto3: Crea y gestiona S3 buckets, EC2, CloudFormation stacks
└── monitoring.py            # Python/Boto3: Configura alarmas, dashboards y consulta metricas CloudWatch
```

---

## 5. Planificacion y Cronograma del Proyecto

### 5.1 Fases de Desarrollo

| Fase | Descripcion | Estado |
|------|-------------|--------|
| **Fase 1** | Diseno de arquitectura y stack tecnologico | Completado |
| **Fase 2** | Desarrollo del MVP: autenticacion, cursos, escenarios | Completado |
| **Fase 3** | Motor de aprendizaje: SM-2, logros, habilidades | Completado |
| **Fase 4** | Dashboard, calculadora, gamificacion | Completado |
| **Fase 5** | Infraestructura AWS: S3, CloudFront, IaC | Completado |
| **Fase 6** | CI/CD Pipeline: CodePipeline, CodeBuild | Completado |
| **Fase 7** | Monitoreo: CloudWatch, alarmas, dashboard | Completado |
| **Fase 8** | Documentacion tecnica, scripts de automatizacion | Completado |

### 5.2 Cronograma Resumido

```
Semana 1-2:  Arquitectura y diseno
             └── Definicion de stack, base de datos, rutas, componentes base

Semana 3-5:  Desarrollo del core
             └── Autenticacion, cursos, escenarios, algoritmo SM-2

Semana 6-7:  Funcionalidades avanzadas
             └── Dashboard, gamificacion, logros, calculadora

Semana 8:    Infraestructura AWS
             └── CloudFormation, S3, CloudFront, IAM

Semana 9:    CI/CD Pipeline
             └── CodePipeline, CodeBuild, buildspec.yml, scripts Bash

Semana 10:   Monitoreo y documentacion
             └── CloudWatch, alarmas, scripts Python/Boto3, README, architecture.md

Semana 11:   QA y despliegue
             └── Testing, correcciones, despliegue final a produccion
```

---

## 6. Configuraciones de Seguridad Implementadas

### IAM - Roles y Politicas

**CodeBuildRole** - Permisos del servicio de compilacion:
```json
{
  "Actions permitidas": [
    "logs:CreateLogGroup, CreateLogStream, PutLogEvents",
    "s3:GetObject, PutObject, DeleteObject (solo buckets del proyecto)",
    "s3:ListBucket (solo buckets del proyecto)",
    "cloudfront:CreateInvalidation (solo la distribucion del proyecto)",
    "cloudwatch:PutMetricData"
  ]
}
```

**CodePipelineRole** - Permisos del orquestador CI/CD:
```json
{
  "Actions permitidas": [
    "s3:GetObject, PutObject, GetBucketVersioning, ListBucket (solo artifacts bucket)",
    "codebuild:BatchGetBuilds, StartBuild",
    "sns:Publish (solo topic del proyecto)"
  ]
}
```

### CloudFront - Headers de Seguridad

```
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### S3 - Politica de Acceso

El bucket de sitio web solo acepta solicitudes cuyo origen sea la distribucion CloudFront especifica, usando Origin Access Control (OAC) con firma SigV4. Ninguna solicitud directa al bucket S3 es permitida.

---

## 7. Variables de Entorno

### Desarrollo Local (.env)
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu-anon-key-publica
```

### CodeBuild (variables de entorno del proyecto)
```
ENVIRONMENT=production
S3_BUCKET=cultiva-finanzas-production-website-{account-id}
CLOUDFRONT_ID=E1234ABCDEF567
NODE_ENV=production
```

### Docker Compose (.env local)
```env
POSTGRES_PASSWORD=tu-password-seguro
JWT_SECRET=tu-jwt-secret-de-al-menos-32-caracteres
VITE_SUPABASE_PUBLISHABLE_KEY=anon-key-local
SUPABASE_SERVICE_KEY=service-role-key-local
```

---

## 8. Comandos de Referencia Rapida

```bash
# ===== DESARROLLO LOCAL =====
npm run dev                          # Servidor de desarrollo (http://localhost:8080)
docker compose up -d                 # Levantar Supabase local completo
docker compose down                  # Detener entorno local

# ===== TESTING =====
npm run test                         # Tests interactivos
npm run test -- --run                # Tests una sola vez (CI)
npm run lint                         # Verificacion ESLint

# ===== BUILD =====
npm run build                        # Build de produccion → dist/
npm run preview                      # Preview del build en local

# ===== INFRAESTRUCTURA AWS =====
# Desplegar stack completo
aws cloudformation deploy \
  --template-file infrastructure/cloudformation.yaml \
  --stack-name cultiva-finanzas-production \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    Environment=production \
    GithubOwner=riverstargroup \
    GithubRepo=cultiva-finanzas \
    GithubBranch=main \
    GithubToken=ghp_xxxx \
    NotificationEmail=equipo@enactus.mx

# Ver outputs del stack
aws cloudformation describe-stacks \
  --stack-name cultiva-finanzas-production \
  --query "Stacks[0].Outputs" --output table

# ===== SCRIPTS DE AUTOMATIZACION =====
bash scripts/install-dependencies.sh        # Configurar entorno
bash scripts/deploy.sh                      # Desplegar a produccion
bash scripts/deploy.sh staging              # Desplegar a staging
python3 scripts/aws_manager.py --action s3  # Gestionar S3
python3 scripts/aws_manager.py --action ec2 # Lanzar EC2
python3 scripts/aws_manager.py --action stack  # Desplegar CloudFormation
python3 scripts/monitoring.py --action setup   # Configurar monitoreo completo
python3 scripts/monitoring.py --action metrics --hours 48  # Ver metricas
python3 scripts/monitoring.py --action alarms              # Ver estado alarmas
```

---

## 9. Estimacion de Costos AWS (Tier Gratuito + Produccion)

| Servicio | Uso Estimado | Costo Estimado/Mes |
|---------|-------------|-------------------|
| S3 (Website) | 100 MB almacenamiento, 50k solicitudes | ~$0.01 |
| S3 (Artifacts) | 1 GB almacenamiento | ~$0.02 |
| CloudFront | 10 GB transferencia, 1M solicitudes | ~$1.20 |
| CodeBuild | 20 builds/mes x 5 min = 100 min | Gratis (primeros 100 min) |
| CodePipeline | 1 pipeline activo | $1.00 |
| CloudWatch | Logs 5 GB, 10 metricas, 5 alarmas | ~$3.50 |
| SNS | 100 notificaciones | ~$0.00 |
| **Total estimado** | | **~$5.73/mes** |

> Nota: Costos estimados para carga baja de educacion. AWS Free Tier cubre gran parte durante el primer ano.

---

*Documento generado para el proyecto Semilla - Enactus Mexico*  
*Cultiva tu futuro financiero, planta una semilla hoy.*
