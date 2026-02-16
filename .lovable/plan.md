

# 🌱 Semilla - Plataforma de Educación Financiera Gamificada

## Visión General
Aplicación web de educación financiera para comunidades de bajos ingresos en Latinoamérica. SPA construida con React + Vite + TypeScript, conectada a Supabase externo para autenticación, base de datos y storage. Identidad visual basada en el logo Semilla con tipografías Nunito/Chonburi y paleta de colores verde/tierra.

---

## Fase 1: Fundación y Autenticación

### Landing Page
- Página de bienvenida con logo Semilla, propuesta de valor, CTAs de registro/login
- Secciones: hero, beneficios, cómo funciona, testimonios, footer
- Diseño mobile-first, responsive

### Sistema de Autenticación Completo
- **Registro**: nombre, email, contraseña (validación en tiempo real con Zod)
- Modales obligatorios de Términos y Condiciones + Aviso de Privacidad (con timestamp)
- Verificación de email vía Supabase Auth
- **Login**: email + contraseña, mensajes genéricos de error
- **Recuperación de contraseña**: flujo completo con página /reset-password
- **Logout**: limpieza de sesión + redirección a landing

### Base de Datos (Supabase)
- Tablas: profiles, courses, user_progress, achievements, user_achievements, scenario_decisions, saved_calculations
- RLS policies en todas las tablas
- Trigger para crear perfil automáticamente al registrarse

---

## Fase 2: Dashboard y Navegación

### Dashboard Principal
- Saludo personalizado con nombre del usuario
- Cards de métricas: cursos completados, tiempo invertido, insignias, racha de días
- Gráfico de progreso semanal (Recharts - barras)
- Botón CTA "Continuar aprendiendo"
- Menú de navegación: Dashboard, Cursos, Calculadora, Logros, Perfil, Cerrar sesión

---

## Fase 3: Catálogo de Cursos y Escenarios Interactivos

### Catálogo de Cursos
- Grid de cards con título, descripción, duración, nivel y badge de progreso
- Filtros por categoría (Ahorro, Crédito, Presupuesto), nivel y estado
- 3 cursos hardcoded: "Fundamentos del Ahorro", "Crédito: Aliado o Enemigo", "Presupuesto Personal"

### Escenarios Interactivos (Feature Core)
- Escenarios de decisión financiera con múltiples opciones
- Resultados comparativos con gráficos (Recharts - barras horizontales)
- Tabla comparativa lado a lado con métricas financieras
- Mensajes educativos contextuales
- Barra de progreso por curso con auto-guardado
- Guardado de decisiones en BD para analytics

---

## Fase 4: Calculadora de Intereses

### Calculadora Completa
- Inputs: monto inicial (MXN), tasa de interés, plazo, tipo (simple/compuesto), operación (crédito/ahorro), frecuencia de capitalización
- Cálculos en tiempo real con debounce
- Card de resultado principal (monto final + interés total)
- Gráfica de crecimiento/decrecimiento (Recharts - línea con tooltips)
- Tabla de amortización scrolleable y responsive
- Recomendaciones contextuales automáticas (alertas según tasa y tipo)
- Exportación a CSV y PDF

---

## Fase 5: Gamificación y Perfil

### Sistema de Logros (5 Insignias)
- "Primer Paso", "Racha de 3", "Calculador Experto", "Graduado", "Imparable"
- Grid visual: bloqueadas (grises) vs desbloqueadas (color)
- Animación de desbloqueo con toast/modal y confetti
- Barra de progreso hacia próximo logro

### Perfil de Usuario
- Datos básicos: nombre (editable), email (readonly), fecha de registro, avatar con iniciales
- Cambio de contraseña
- Links a Términos y Aviso de Privacidad
- Botón "Descargar mis datos" (JSON)
- Botón "Eliminar cuenta" con confirmación doble

