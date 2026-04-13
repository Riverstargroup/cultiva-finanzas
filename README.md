# Semilla - Cultiva Finanzas

> Plataforma de educacion financiera organica impulsada por Enactus Mexico

---

## Descripcion del Proyecto

**Semilla** es una aplicacion web de educacion financiera que utiliza metaforas botanicas para ensenar conceptos financieros a usuarios hispanohablantes. La plataforma combina aprendizaje basado en escenarios, repeticion espaciada (algoritmo SM-2) y gamificacion para crear habitos financieros saludables.

### Caracteristicas Principales

| Modulo | Descripcion |
|--------|-------------|
| Raices Fuertes | Educacion base: ahorro y presupuesto |
| Fotosintesis de Datos | Visualizacion de datos financieros |
| Poda de Malos Habitos | Gestion de deudas y reduccion de gastos |
| Invernadero Personal | Calculadora y herramientas personalizadas |

### Funcionalidades

- Autenticacion segura con verificacion por email (Supabase Auth + PKCE)
- Escenarios interactivos de toma de decisiones financieras
- Sistema de repeticion espaciada (SM-2) para refuerzo del aprendizaje
- Dashboard con estadisticas: tiempo invertido, racha, insignias
- Sistema de logros y gamificacion (8 insignias desbloqueables)
- Seguimiento de habilidades financieras por usuario
- Calculadora financiera integrada
- Diseno responsive con soporte movil (dock navigation)

---

## Stack Tecnologico

### Frontend
- **React 18.3** + **TypeScript 5.8**
- **Vite 5.4** (bundler con SWC)
- **TailwindCSS 3.4** con paleta botanica personalizada
- **Framer Motion 12** para animaciones fluidas
- **Radix UI + shadcn/ui** para componentes accesibles
- **TanStack React Query 5** para estado del servidor
- **React Router 6** para enrutamiento protegido

### Backend / Base de Datos
- **Supabase** (PostgreSQL + Auth + Real-time)
- Row-Level Security (RLS) habilitado
- 10 tablas: courses, scenarios, profiles, skills, user_*

### DevOps / Infraestructura AWS
- **Amazon S3** - Hosting del sitio estatico
- **Amazon CloudFront** - CDN global para distribucion de contenido
- **AWS CodePipeline** - Pipeline CI/CD automatizado
- **AWS CodeBuild** - Compilacion y testing automatizado
- **AWS CloudWatch** - Monitoreo, logs y alertas
- **AWS IAM** - Control de acceso y roles
- **AWS CloudFormation** - Infraestructura como codigo (IaC)

---

## Arquitectura AWS

```
GitHub Repository
       |
       v
  CodePipeline
  +-----------+
  |  Source   |  <-- GitHub (OAuth)
  |  Stage    |
  +-----------+
       |
       v
  +-----------+
  |   Build   |  <-- CodeBuild (npm install, npm run build, vitest)
  |   Stage   |
  +-----------+
       |
       v
  +-----------+
  |  Deploy   |  <-- S3 Sync + CloudFront Invalidation
  |   Stage   |
  +-----------+
       |
       v
  +------------------+        +------------------+
  |   S3 Bucket      | -----> | CloudFront CDN   | --> Usuarios
  |  (Static Files)  |        |  (HTTPS Global)  |
  +------------------+        +------------------+
                                      |
                                      v
                              +------------------+
                              |   CloudWatch     |
                              |  (Logs/Alertas)  |
                              +------------------+
```

---

## Estructura del Repositorio

```
cultiva-finanzas/
├── README.md                    # Documentacion principal
├── .gitignore                   # Exclusiones de git
├── index.html                   # Entrada HTML
├── package.json                 # Dependencias y scripts npm
├── vite.config.ts               # Configuracion Vite
├── tailwind.config.ts           # Tema y colores botanicos
├── tsconfig.json                # Configuracion TypeScript
├── components.json              # Configuracion shadcn/ui
│
├── src/                         # Codigo fuente
│   ├── App.tsx                  # Enrutamiento principal (10 rutas)
│   ├── main.tsx                 # Punto de entrada React
│   ├── index.css                # Variables CSS globales
│   ├── assets/                  # Imagenes y recursos
│   ├── components/              # Componentes reutilizables
│   │   ├── ui/                  # shadcn/ui base components
│   │   ├── layout/              # BotanicalPage layout
│   │   ├── navigation/          # DockNav, SwipeNavigator
│   │   └── scenario/            # DecisionStep, FeedbackStep, RecallStep
│   ├── contexts/
│   │   └── AuthContext.tsx      # Estado global de autenticacion
│   ├── hooks/                   # 14+ custom hooks
│   ├── integrations/
│   │   └── supabase/            # Cliente y tipos generados
│   ├── lib/
│   │   ├── spacedRepetition.ts  # Algoritmo SM-2
│   │   ├── achievementChecker.ts# Logica de insignias
│   │   └── skillUpdater.ts      # Progresion de habilidades
│   ├── pages/                   # 12 paginas (Dashboard, Cursos, etc.)
│   └── types/                   # Interfaces TypeScript
│
├── supabase/
│   ├── config.toml              # Configuracion local Supabase
│   └── migrations/              # Migraciones SQL de base de datos
│
├── scripts/                     # Scripts de automatizacion
│   ├── install-dependencies.sh  # Instalacion de dependencias Linux
│   ├── deploy.sh                # Despliegue a AWS S3 + CloudFront
│   ├── ec2-setup.sh             # Configuracion servidor EC2
│   ├── aws_manager.py           # Gestion de recursos AWS con Boto3
│   └── monitoring.py            # Configuracion CloudWatch con Boto3
│
├── infrastructure/              # Infraestructura como codigo
│   ├── cloudformation.yaml      # Plantilla AWS CloudFormation
│   ├── docker-compose.yaml      # Contenedores para desarrollo local
│   └── buildspec.yml            # Especificacion AWS CodeBuild
│
└── docs/
    └── architecture.md          # Documentacion de arquitectura detallada
```

---

## Configuracion Local

### Prerequisitos
- Node.js >= 18.x
- npm >= 9.x
- Cuenta Supabase (para backend)
- AWS CLI (para despliegue)

### Instalacion Rapida

```bash
# 1. Clonar el repositorio
git clone https://github.com/riverstargroup/cultiva-finanzas.git
cd cultiva-finanzas

# 2. Instalar dependencias (o usar el script)
npm install
# Alternativa: bash scripts/install-dependencies.sh

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales Supabase

# 4. Iniciar servidor de desarrollo
npm run dev
# Disponible en http://localhost:8080
```

### Variables de Entorno

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu-anon-key
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (puerto 8080)
npm run build        # Build de produccion
npm run build:dev    # Build modo desarrollo
npm run preview      # Preview del build local
npm run test         # Ejecutar tests con Vitest
npm run test:watch   # Tests en modo watch
npm run lint         # Verificacion ESLint
```

---

## Despliegue en AWS

### Despliegue Manual con Scripts

```bash
# Configurar AWS CLI
aws configure

# Instalar dependencias del sistema
bash scripts/install-dependencies.sh

# Crear infraestructura con CloudFormation
aws cloudformation deploy \
  --template-file infrastructure/cloudformation.yaml \
  --stack-name cultiva-finanzas-stack \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    GithubRepo=riverstargroup/cultiva-finanzas \
    GithubBranch=main \
    GithubToken=tu-token

# Desplegar la aplicacion
bash scripts/deploy.sh
```

### CI/CD Automatizado (CodePipeline)

El pipeline se activa automaticamente con cada push a `main`:

1. **Source Stage**: Detecta cambios en GitHub
2. **Build Stage**: CodeBuild ejecuta `npm install`, `npm test`, `npm run build`
3. **Deploy Stage**: Sincroniza archivos con S3 e invalida cache CloudFront

---

## Principios DevOps Aplicados

### 1. Automatizacion
- Scripts Bash para instalacion y despliegue
- Pipeline CI/CD completamente automatizado
- Infraestructura como codigo con CloudFormation

### 2. Colaboracion
- Repositorio GitHub con ramas protegidas (`main`)
- Pull Requests requeridos para cambios en produccion
- Commits semanticos y documentados

### 3. Monitoreo Continuo
- CloudWatch Logs para todos los procesos
- Alarmas configuradas para errores 5xx y latencia
- Dashboard de metricas en tiempo real

### 4. Seguridad
- IAM roles con principio de minimo privilegio
- CloudFront con HTTPS obligatorio
- Variables de entorno nunca en codigo fuente
- RLS en base de datos Supabase

### 5. Entrega Continua
- Build automatizado en cada commit
- Tests ejecutados antes del despliegue
- Rollback automatico en caso de fallo

---

## Base de Datos (Supabase / PostgreSQL)

### Tablas Principales

| Tabla | Descripcion |
|-------|-------------|
| `courses` | Cursos disponibles con metadatos |
| `scenarios` | Escenarios interactivos por curso |
| `profiles` | Perfiles de usuarios |
| `skills` | Habilidades financieras disponibles |
| `user_course_progress` | Progreso por curso y usuario |
| `user_scenario_state` | Estado SM-2 por escenario/usuario |
| `user_missions` | Historial de intentos |
| `user_achievements` | Insignias desbloqueadas |
| `user_skills` | Nivel de dominio por habilidad |
| `user_activity_days` | Registro de actividad diaria |

---

## Testing

```bash
# Ejecutar suite de tests
npm run test

# Tests con cobertura
npm run test -- --coverage

# Tests especificos
npm run test -- src/test/spacedRepetition.test.ts
```

---

## Contribucion

1. Crear rama desde `main`: `git checkout -b feature/nueva-funcionalidad`
2. Desarrollar cambios con commits semanticos
3. Ejecutar tests: `npm run test`
4. Abrir Pull Request hacia `main`
5. Requerir revision de al menos 1 colaborador

### Convencion de Commits

```
feat: nueva funcionalidad
fix: correccion de bug
docs: actualizacion de documentacion
style: cambios de formato
refactor: refactorizacion de codigo
test: agregar o modificar tests
ci: cambios en CI/CD
infra: cambios en infraestructura
```

---

## Impacto Social

Semilla es un proyecto de **Enactus Mexico** enfocado en inclusion financiera para comunidades de habla hispana. El objetivo es democratizar el acceso a educacion financiera de calidad mediante tecnologia accesible y pedagogia innovadora.

---

*Cultiva tu futuro financiero, planta una semilla hoy.*
