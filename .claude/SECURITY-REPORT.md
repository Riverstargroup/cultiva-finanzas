# Security Audit Report — 2026-04-22

## Antes
- High: 9
- Moderate: 6
- Low: 3
- **Total: 18**

## Después
- High: 0
- Moderate: 2
- Low: 3
- **Total: 5**

## Resueltos (via `npm audit fix`)

| Paquete | Vuln | Método |
|---------|------|--------|
| `@remix-run/router <=1.23.1` | XSS via Open Redirects | npm audit fix |
| `ajv <6.14.0` | ReDoS via `$data` option | npm audit fix |
| `brace-expansion` | Zero-step sequence DoS | npm audit fix |
| `flatted <=3.4.1` | Unbounded recursion DoS + Prototype Pollution | npm audit fix |
| `glob 10.2.0-10.4.5` | CLI command injection | npm audit fix |
| `js-yaml 4.0.0-4.1.0` | Prototype pollution in merge | npm audit fix |
| `lodash <=4.17.23` | Prototype Pollution + Code Injection | npm audit fix |
| `minimatch` | ReDoS múltiples variantes | npm audit fix |
| `picomatch` | Method Injection + ReDoS | npm audit fix |
| `rollup 4.0.0-4.58.0` | Arbitrary File Write via Path Traversal | npm audit fix |
| `yaml 2.0.0-2.8.2` | Stack Overflow via deeply nested YAML | npm audit fix |
| `react-router` | Transitivo de @remix-run/router | npm audit fix |
| `react-router-dom` | Transitivo de react-router | npm audit fix |

## Pendientes (requieren breaking changes)

| Paquete | Vuln | Razón no resuelta |
|---------|------|-------------------|
| `esbuild <=0.24.2` | Dev server CORS bypass | Fix requiere vite@8 (major breaking change — pendiente migración planificada) |
| `@tootallnate/once <3.0.1` | Incorrect Control Flow Scoping | Fix requiere jsdom@29 (breaking change en tests) |

## Bugs adicionales corregidos
- `src/pages/Jardin.tsx`: JSX tag mismatch — `</PageTransition>` sin cerrar `<div>` outer. Fix: agregado `</div>` faltante en línea 163.

## Recomendaciones
- Planificar migración a Vite 8.x en próximo sprint mayor para resolver vuln de esbuild
- Actualizar jsdom cuando se migre el setup de tests (actualmente ~0% coverage de todas formas)
- Configurar `npm audit --audit-level=high` como gate en CI/CD — actualmente 0 HIGH
