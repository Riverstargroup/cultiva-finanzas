# Cultiva Finanzas - Vertical Slice Backlog

> Backlog listo para segmentarse en Linear. El MCP de Linear disponible en este entorno permite leer perfil/issues, pero no expone crear o actualizar issues; por eso queda aqui como fuente operativa para copiar o sincronizar.

## Epic 1 - Primer mundo jugable

**Objetivo:** que un usuario nuevo entienda en menos de 4 minutos que Cultiva no es un dashboard: es un jardin vivo donde aprende, desbloquea companeros y derrota malos habitos.

### CF-VS-001 - Jardin full-screen con mapa vivo

- **Prioridad:** P0
- **Resultado:** la home autenticada muestra escena de jardin amplia, camino de nodos, enemigo financiero y acciones claras.
- **Criterios de aceptacion:**
  - El jardin deja de sentirse como card estrecha.
  - Hay 5 nodos visibles: primer curso, practica, mini-juego, tienda, jefe.
  - Cada nodo comunica recompensa y siguiente accion.
  - Build y tests pasan.

### CF-VS-002 - Primer enemigo: Gasto Hormiga

- **Prioridad:** P0
- **Resultado:** aparece un enemigo/bloqueo narrativo que conecta aprendizaje con progreso.
- **Criterios de aceptacion:**
  - Tiene nombre, barra de poder y debilidades.
  - Indica como bajarle poder: curso, repaso, racha, juego.
  - No requiere nuevo backend para MVP.

### CF-VS-003 - Roster MVP de 5 plantamigos

- **Prioridad:** P0
- **Resultado:** el jardin muestra cinco companeros con personalidad, rol y desbloqueo.
- **Criterios de aceptacion:**
  - 4 dominios base + 1 especial.
  - Cada plantamigo tiene rol financiero y forma de desbloqueo.
  - La UI evita nombres de IP externa; usar "plantamigos" o "guardianes".

### CF-VS-004 - Onboarding emocional: primer plantamigo

- **Prioridad:** P0
- **Resultado:** usuario recibe, nombra y ve reaccionar a su primera planta.
- **Criterios de aceptacion:**
  - El flujo actual de onboarding se reemplaza por una historia corta.
  - Primer CTA lleva a una micro-leccion o curso inicial.
  - Plant naming queda conectado a la escena real, no solo probado aislado.

## Epic 2 - Dos cursos gamificados

### CF-VS-005 - Curso Raices como ruta de nodos

- **Prioridad:** P1
- **Resultado:** "Raices" deja de ser lista de escenarios y se convierte en camino jugable.
- **Criterios de aceptacion:**
  - Escenarios con decisiones de trade-off, no obvias.
  - Consecuencia financiera visible.
  - Recompensa de planta/monedas al terminar.

### CF-VS-006 - Curso Credito sin miedo como ruta de nodos

- **Prioridad:** P1
- **Resultado:** credito se juega como progreso contra deuda/interes.
- **Criterios de aceptacion:**
  - Opciones muestran costo, motivacion y riesgo.
  - Integracion con mini-juego o simulador al final.

## Epic 3 - Validacion de competencia

### CF-VS-007 - E2E autenticado demo

- **Prioridad:** P0
- **Resultado:** Playwright valida el flujo real de usuario demo.
- **Criterios de aceptacion:**
  - Login o sesion mock.
  - Home jardin carga.
  - Usuario entra a curso, completa semilla, gana monedas.
  - Se verifica que el mapa/jardin reacciona.

### CF-VS-008 - Paquete de validacion con usuarios

- **Prioridad:** P1
- **Resultado:** guia de prueba para 10-20 usuarios.
- **Criterios de aceptacion:**
  - Script de entrevista de 8 minutos.
  - Encuesta post-test de 3 preguntas.
  - Metricas: naming rate, primer curso completado, "volveria manana".

## Epic 4 - Asset pipeline GPT Image 2

### CF-VS-009 - Prompt pack visual

- **Prioridad:** P1
- **Resultado:** prompts consistentes para plantamigos, enemigo, casa, tienda e iconos.
- **Criterios de aceptacion:**
  - Style bible de pixel art cozy con vista frontal/3-4, fondo transparente, paleta Cultiva.
  - Export plan: PNG/WebP, tamanos, naming y reglas `image-rendering: pixelated`.
  - No usar assets de marcas o personajes protegidos.
