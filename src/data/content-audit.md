# Auditoría de Contenido Financiero — Semilla / Cultiva Finanzas

> **Propósito:** Registro central de todas las cifras financieras del app, sus fuentes, y cuándo deben revisarse.
> **Responsable:** Equipo de contenido (Enactus ITESM)
> **Última actualización:** 2026-04-27
> **Próxima revisión completa:** 2026-07-27 (trimestral)

---

## 0. Historial de Correcciones

| Fecha | Qué se corrigió | Migración/Archivo | Motivo |
|-------|----------------|-------------------|--------|
| 2026-04-27 | Escenario 3 opt_b: **24 meses → ~47 meses**; **$8,640 → ~$11,000** en intereses; **$16,640 → ~$19,000** costo real | `20260427000001_fix_scenario3_math.sql` | Error aritmético: con $400/mes sobre $8,000 al 52% CAT nominal, n=47.5 meses, no 24 |
| 2026-04-27 | Escenario 3 opt_a: **$430 → ~$690** en intereses; **2 → 3 meses** para liquidar; **$7,600 → +$10,000** ahorro vs mínimo | `20260427000001_fix_scenario3_math.sql` | Corrección consistente con opt_b corregido |
| 2026-04-27 | Escenario 3 opt_c: **$3,800 → ~$3,000** en intereses (snapshot 12 meses) | `20260427000001_fix_scenario3_math.sql` | FV annuity con $6,500 balance @ 4.333%/mes × 12 meses da ~$3,000 |
| 2026-04-27 | DragDrop "Prioriza Deudas": tarjeta banco **30% → 60% CAT**, tienda **24% → 55% CAT**, personal **18% → 25%** | `src/features/dragdrop/data/exercises.ts` | Tasas <40% incumplen mandato de precisión; CAT real tarjetas MX: 50–90% (CNBV) |
| 2026-04-27 | Salario mínimo 2025 en InflacionChallenge: **marcado como OVERDUE** (valid_until era enero 2026) | `InflacionChallenge/data.ts` | Decreto CONASAMI 2026 debió publicarse en dic-2025; pendiente verificar |
| 2026-04-27 | ENIF "63%" y "89% crisis": **añadidos CONTENT_REVIEW comments** sin fuente confirmada | `PolinizacionSession.tsx` | Estadísticas sin cita adecuada identificadas en auditoría |
| 2026-04-24 | CETES 28d: 10.1 % → **8.25 %** en escenarios 2, 4, 5, 7 y flashcards seed 000004 | `20260424000001_cetes_rate_correction.sql` | Ciclo de recortes Banxico; tasa pico fue ~11.25 % (ago-2023), hoy ~8.25 % |
| 2026-04-24 | INPC: 4.5 % → **3.9 %** en escenarios 5, 7 y flashcards seed 000004 | `20260424000001_cetes_rate_correction.sql` | INEGI dato mensual actualizado |
| 2026-04-24 | Inflación acum. 2020-2025: ~40 % → **~32 %** en flashcard; $700 → **$660** | `20260424000001_cetes_rate_correction.sql` | INPC acumulado real (2020-2024) ≈ 31.7 % |
| 2026-04-24 | Metro CDMX 2025: $7 → **$5** (tarifa no aumentó 2012-2025) | `InflacionChallenge/data.ts` | STC Metro tarifa subsidiada sin variación; dato $7 era incorrecto |
| 2026-04-24 | MemoriaMercado CETES descriptor: ~10.5 % → **~8.25 %** | `MemoriaMercado/data.ts` | Consistencia con tasa Banxico actual |
| 2026-04-24 | Montos recalculados: $3,303→**$3,248**; $4,888→**$4,459**; $7,707→**$7,578**; $30,120→**$29,900** | `20260424000001_cetes_rate_correction.sql` | FV recalculado con 8.25 % en lugar de 10.1 % |

---

## 1. Tasas de Referencia Principales

| Figura | Valor Actual | Valor Anterior | Fuente | Cadencia de Revisión | Archivo(s) |
|--------|-------------|----------------|--------|----------------------|------------|
| CETES 28 días (tasa anual) | ~8.25 % | 10.1 % → corregido 2026-04-24 | Banxico subasta semanal: banxico.org.mx | **Semanal** (cambio cada subasta) | `PolinizacionSession.tsx`, flashcards `fc…019`, `fc…020`, seed 000004 |
| INPC / Inflación anual | ~3.9 % | 4.5 % → corregido 2026-04-24 | INEGI INPC: inegi.org.mx | **Mensual** (primera semana) | `PolinizacionSession.tsx`, flashcards `fc…008`, `fc…018`, seed 000004 |
| Inflación acumulada 2020-2025 | ~32 % | ~40 % (incorrecto) → corregido 2026-04-24 | INEGI INPC acumulado | Una vez (dato histórico) | flashcard seed 000004 |
| CAT promedio tarjetas grandes | 50–90 % | 30–60 % (incorrecto) → corregido 2026-04-23 | CNBV comparativo CAT: cnbv.gob.mx | **Semestral** | Scenario `111103`, flashcards `fc…009`, `fc…012`, `fc…013` |
| Tasa préstamo personal (grandes bancos) | 18–36 % anual | 28 % anual (preset) | CNBV / bancos grandes | Semestral | `debtPresets.ts` |
| Tasa microcrédito | 60–120 % CAT | 90 % anual (preset) | CONDUSEF / Kueski / Credijusto | Semestral | `debtPresets.ts` |
| Salario mínimo diario | $278.80 (2025) | $123.22 (2020) | CONASAMI decreto enero 2025 | **Anual** (enero) | `InflacionChallenge/data.ts` |
| Tarifa Metro CDMX | $5 (sin variación 2012-2025) | $7 (incorrecto) → corregido 2026-04-24 | STC Metro CDMX | **Anual** (enero) | `InflacionChallenge/data.ts` |
| CETES descriptor (minijuego) | ~8.25 % anual | ~10.5 % (incorrecto) → corregido 2026-04-24 | Banxico | Trimestral | `MemoriaMercado/data.ts` |

---

## 2. Precios de Referencia (Minijuego Inflación)

| Producto | Precio 2020 | Precio 2025 | Variación | Fuente | Estado |
|----------|------------|------------|-----------|--------|--------|
| Tortillas 1 kg | $19 | $28 | +47 % | INEGI INPC / SNIIM | ✅ Plausible |
| Gasolina Magna 1 L | $18.50 | $24 | +30 % | CRE / PROFECO | ✅ Plausible |
| Salario mínimo/día | $123 | $278 | +126 % | CONASAMI ✓ | ✅ Verificado |
| Aguacate 1 kg | $35 | $58 | +66 % | SNIIM (precio promedio) | ✅ Plausible (precio estacional) |
| Metro CDMX boleto | $5 | **$5** | **0 %** | STC Metro — tarifa subsidiada sin aumento 2012-2025 | ✅ **Corregido 2026-04-24** (era $7, incorrecto) |

> **Nota pedagógica:** El Metro CDMX NO aumentó su tarifa durante 2020-2025, ilustrando la política de subsidio al transporte público. Es una excepción interesante en el juego de inflación — revisar anualmente si la tarifa cambia.

---

## 3. Figuras en Escenarios (DB — Curso 1)

| Scenario | Figura | Valor | ¿Correcto? | Nota |
|----------|--------|-------|------------|------|
| `111101` — Primera quincena | Ingreso ejemplo | $6,000/quincena | ✅ Pedagógico | No es cifra real |
| `111102` — Presupuesto 50/30/20 | Ingreso ejemplo | $12,000/mes | ✅ Pedagógico | No es cifra real |
| `111103` — Tarjeta crédito | Deuda ejemplo | $8,000 | ✅ Pedagógico | No es cifra real |
| `111103` — Tarjeta crédito | CAT referencia | 40–70 % anual | ✅ Corregido (era 30–40 %) | Migration `000002` aplicada |
| `111103` — Tarjeta crédito | CAT recall q1 | 50–90 % CAT México | ✅ Corregido (era 30–60 %) | Migration `000002` aplicada |
| `111104` — Fondo emergencia | Gasto inesperado ejemplo | $4,000–$8,000 | ✅ Pedagógico | No es cifra real |
| `111105` — Ahorro vs inversión | Ahorros ejemplo | $15,000 | ✅ Pedagógico | No es cifra real |
| `111106` — Deudas inteligentes | Tarjeta tasa | 45 % anual | ✅ Dentro de rango (CAT real ~60 %) | Nota: es tasa nominal, no CAT |
| `111106` — Deudas inteligentes | Préstamo tasa | 18 % anual | ✅ Plausible | Rango bajo para préstamo personal |
| `111107` — Primera inversión | Mínimo CETES | $100 | ✅ Verificado | cetesdirecto.com |

---

## 4. Figuras en Escenarios (DB — Curso 2 "Crédito sin miedo")

| Scenario | Figura | Valor | ¿Correcto? | Nota |
|----------|--------|-------|------------|------|
| Escenario 4 — Tasas | 2.5 % mensual ≈ 30 % anual | ✅ Correcto (aprox.) | La fórmula exacta es (1+0.025)^12-1 = 34.5 % compuesto |
| Escenario 3 — Pago mínimo | Trampa pago mínimo | Conceptual | ✅ Correcto | Sin cifras específicas |
| Escenario 2 — Score Buró | 35% puntual / 30% saldo / 15% antigüedad | ✅ Referencia estándar | No hay metodología oficial publicada por Buró |

---

## 5. Figuras en Minijuego Presupuesto Rápido

| Ítem | Valor | Categoría | Fuente | Estado |
|------|-------|-----------|--------|--------|
| Renta del departamento | Sin cifra específica | necesidades | N/A | ✅ |
| Netflix | Sin cifra específica | deseos | N/A | ✅ |
| Fondo de emergencia | Sin cifra específica | ahorro | N/A | ✅ |
| Comida | Sin cifra específica | necesidades | N/A | ✅ |
| Salida a restaurante | Sin cifra específica | deseos | N/A | ✅ |
| Seguro médico | Sin cifra específica | necesidades | N/A | ✅ |

---

## 6. Figuras en PolinizacionSession (Tips diarios)

| Dominio | Tip | Figura | Estado | Fuente |
|---------|-----|--------|--------|--------|
| control | 63 % mexicanos sin presupuesto | 63 % | ⚠️ Verificar | ENIF 2021 (próxima ENIF prevista 2024-2025) |
| control | Gastos hormiga ~$3,000/mes | $3,000 | ✅ Estimado razonable | Dato educativo |
| credito | Score: 35 % puntual / 30 % saldo | Factores | ⚠️ Referencia | Buró no publica metodología oficial |
| credito | Pago mínimo triplica deuda en 3 años | x3 en 3 años | ✅ Plausible | Verificable con simulador Banxico |
| crecimiento | CETES ~8.25 % supera inflación ~3.9 % | **Actualizado** | ✅ | Banxico / INEGI (verificar trimestralmente) |
| crecimiento | $1,000/mes × 20 años × 8 % = $589,000 | $589,000 | ✅ Verificado | Valor futuro: $1,000 × ((1.08^240-1)/0.08/12) |
| proteccion | Fondo emergencia cubre 89 % de crisis | 89 % | ⚠️ Fuente incierta | Dato requiere cita específica — candidato a revisión |

---

## 7. Flashcards v2 (nuevas — migration 20260423000001)

| ID | Dominio | Figura Clave | Fuente | Revisión |
|----|---------|-------------|--------|----------|
| fc…001 | Presupuesto | 50/30/20 regla | Estándar | Atemporal |
| fc…002 | Presupuesto | $12,000 → $3,600 gustos | Ejemplo pedagógico | N/A |
| fc…003 | Presupuesto | Gastos hormiga $2,000–$3,000/mes | Estimado | Anual |
| fc…004 | Presupuesto | — | — | — |
| fc…005 | Ahorro | Fondo 3–6 meses gastos | Estándar | Atemporal |
| fc…006 | Ahorro | CETES 28d mínimo $100 | cetesdirecto.com | Verificar si cambia mínimo |
| fc…007 | Ahorro | — | — | — |
| fc…008 | Ahorro | CETES ~8.25 %; INPC ~3.9 % | Banxico / INEGI | **Trimestral** |
| fc…009 | Crédito | CAT 50–90 % bancos grandes | CNBV | Semestral |
| fc…010 | Crédito | Score: 35/30/15/20 % | Referencia estándar | — |
| fc…011 | Crédito | 1 reporte gratis/año LPDUSF Art. 40 | Ley | Verificar si cambia ley |
| fc…012 | Crédito | 3.5 %/mes = ~42 % anual nominal | Matemática | Atemporal |
| fc…013 | Crédito | $10,000 × 60 % CAT → interés $500/mes | Matemática | Atemporal (verificar tasa) |
| fc…014 | Deuda | Método avalancha | Conceptual | Atemporal |
| fc…015 | Deuda | Método bola de nieve | Conceptual | Atemporal |
| fc…016 | Deuda | $5,000×60 % vs $20,000×20 % | Matemática | Atemporal |
| fc…017 | Deuda | 4 pasos plan deuda | Conceptual | Atemporal |
| fc…018 | Inversión | INPC ~3.9 % → $100,000 = $96,100 real | INEGI | **Mensual** |
| fc…019 | Inversión | CETES ~8.25 % anual, mínimo $100 | Banxico / cetesdirecto.com | **Semanal** |
| fc…020 | Inversión | $5,000 × 8.25 % = $412 brutos; ISR ~0.97 % | Banxico / Ley de Ingresos | **Trimestral** |
| fc…021 | Inversión | Regla: fondo de emergencia antes de invertir | Principio | Atemporal |
| fc…022 | Seguros | GMM vs IMSS; costo catastrófico >$500,000 | Referencia general | Anual |
| fc…023 | Seguros | Señales fraude: >20 % garantizado | Referencia | Atemporal |
| fc…024 | Seguros | NIP/token nunca por teléfono | Regulación | Atemporal |

---

## 8. Calendario de Revisiones

| Cadencia | Qué revisar | Fuente |
|----------|-------------|--------|
| **Semanal** (cada lunes) | Tasa CETES 28d (cambia cada subasta martes) | banxico.org.mx → Subastas |
| **Mensual** (primera semana) | INPC / inflación (se publica ~día 8) | inegi.org.mx → INPC |
| **Trimestral** (enero, abril, julio, octubre) | CETES rate en flashcards y tips; ISR retención | banxico.org.mx, cetesdirecto.com, SAT |
| **Semestral** (enero y julio) | CAT promedio tarjetas; tasas préstamos | cnbv.gob.mx → Banca Múltiple; banxico.org.mx |
| **Anual** (enero) | Salario mínimo (decreto CONASAMI), precios InflacionChallenge, tarifa Metro CDMX | conasami.gob.mx, STC Metro |
| **Inmediato (RESUELTO 2026-04-24)** | Metro CDMX: tarifa $5 sin cambio 2012-2025; corregido en `InflacionChallenge/data.ts` | stcmetro.cdmx.gob.mx |

---

## 9a. Auditoría 2026-04-27 — Hallazgos de precisión matemática

### Error crítico corregido: Escenario 3 (Tarjeta de crédito)

La migración `20260423000001_scenario_numerical_consequences.sql` contenía errores aritméticos
materiales en las consecuencias del escenario de tarjeta de crédito ($8,000 @ 52% CAT):

| Opción | Figura anterior | Figura corregida | Impacto pedagógico |
|--------|----------------|-----------------|-------------------|
| opt_b meses | 24 meses | **~47 meses** | Subestimaba en 96 % el tiempo real |
| opt_b intereses | $8,640 | **~$11,000** | Subestimaba el costo en $2,360 |
| opt_b costo total | $16,640 | **~$19,000** | Subestimaba en 14 % |
| opt_a intereses | $430 | **~$690** | No correspondía al cálculo |
| opt_a meses | 2 | **3** | Corregido por consistencia |
| opt_a ahorro vs mínimo | $7,600 | **>$10,000** | Ahora reflejan comparación real |
| opt_c intereses 12 meses | $3,800 | **~$3,000** | Overstated 27 % |

**Método de cálculo aplicado** (nominal 52%/12 = 4.333%/mes):
- n = −ln(1 − r×PV/PMT) / ln(1+r) con r=0.04333, PV=8000, PMT=400 → **n ≈ 47.5 meses**
- Este es el único correcto para comparar con el CAT nominal 52 % usado en el resto del contenido

### Datos identificados sin fuente verificable

| Dato | Archivo | Acción tomada |
|------|---------|---------------|
| "63 % mexicanos sin presupuesto (ENIF 2021)" | `PolinizacionSession.tsx` | `CONTENT_REVIEW` añadido — ENIF 2021 es la fuente pero se necesita ENIF 2024 si ya se publicó |
| "89 % de crisis protege fondo de emergencia" | `PolinizacionSession.tsx` | `CONTENT_REVIEW` añadido — fuente NO encontrada; debe citarse o reemplazarse antes de siguiente release |

### Tasas irrealistas en DragDrop corregidas

El ejercicio "Prioriza tus deudas" usaba tasas de interés (30%, 24%, 18%) por debajo del
CAT real del mercado mexicano. Actualizado a tasas realistas (60%, 55%, 25%) que cumplen
el mandato: CAT ≥ 40% para tarjetas de crédito. La priorización relativa (mayor tasa = mayor
urgencia) se mantiene igual.

---

## 9. Contenidos Pendientes (brechas identificadas)

Issues creados en Linear (proyecto "Cultiva Finanzas — Garden Gamification", equipo Delivery):

| Issue | Dominio | Prioridad | Estado |
|-------|---------|-----------|--------|
| [DLV-105](https://linear.app/riverstar/issue/DLV-105) | Seguros: IMSS, GMM, seguro de vida | **Alta** | Backlog |
| [DLV-106](https://linear.app/riverstar/issue/DLV-106) | AFORE / Retiro: SAR, subcuentas, rendimientos | **Alta** | Backlog |
| [DLV-107](https://linear.app/riverstar/issue/DLV-107) | Impuestos: SAT, RESICO, declaración anual | Normal | Backlog |
| [DLV-108](https://linear.app/riverstar/issue/DLV-108) | Crédito hipotecario: Infonavit, CAT hipotecario | Normal | Backlog |
| [DLV-116](https://linear.app/riverstar/issue/DLV-116) | Salario mínimo 2026 — dato vencido en InflacionChallenge | **Alta** | Backlog |
| [DLV-117](https://linear.app/riverstar/issue/DLV-117) | ENIF 63% — verificar edición 2024, citar tabla exacta | Normal | Backlog |
| [DLV-118](https://linear.app/riverstar/issue/DLV-118) | "89% de crisis" — sin fuente; reemplazar o citar | **Alta** | Backlog |
| [DLV-119](https://linear.app/riverstar/issue/DLV-119) | AFORE flashcards — contenido retiro no existe (≥4 cards) | **Alta** | Backlog |

- ❌ **Seguros** (DLV-105): IMSS, ISSSTE, seguro de vida, cómo contratar GMM — **High priority**
- ❌ **AFORE / Retiro** (DLV-106 + DLV-119): SAR (patrón 5.15 % + empleado 1.125 % + cuota social), subcuentas, rendimientos históricos, flashcards — **High priority**
- ❌ **Impuestos** (DLV-107): SAT, RESICO, declaración anual para asalariados, ISR freelance — Normal
- ❌ **Crédito hipotecario** (DLV-108): Infonavit, fovissste, enganche, CAT hipotecario (~15–20 %) — Normal
- ⚠️ **Salario mínimo 2026** (DLV-116): dato $278/día en InflacionChallenge vencido desde enero 2026 — **High priority, overdue**
- ⚠️ **ENIF 63 %** (DLV-117): cita ENIF 2021, verificar si hay edición 2024; identificar tabla exacta — Normal
- ⚠️ **"89 % de crisis"** (DLV-118): estadística sin fuente citada en PolinizacionSession — **High priority**
