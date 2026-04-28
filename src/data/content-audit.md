# Auditoría de Contenido Financiero — Semilla / Cultiva Finanzas

> **Propósito:** Registro central de todas las cifras financieras del app, sus fuentes, y cuándo deben revisarse.
> **Responsable:** Equipo de contenido (Enactus ITESM)
> **Última actualización:** 2026-04-28
> **Próxima revisión completa:** 2026-07-28 (trimestral)

---

## 0. Historial de Correcciones

| Fecha | Qué se corrigió | Migración/Archivo | Motivo |
|-------|----------------|-------------------|--------|
| 2026-04-24 | CETES 28d: 10.1 % → **8.25 %** en escenarios 2, 4, 5, 7 y flashcards seed 000004 | `20260424000001_cetes_rate_correction.sql` | Ciclo de recortes Banxico; tasa pico fue ~11.25 % (ago-2023), hoy ~8.25 % |
| 2026-04-24 | INPC: 4.5 % → **3.9 %** en escenarios 5, 7 y flashcards seed 000004 | `20260424000001_cetes_rate_correction.sql` | INEGI dato mensual actualizado |
| 2026-04-24 | Inflación acum. 2020-2025: ~40 % → **~32 %** en flashcard; $700 → **$660** | `20260424000001_cetes_rate_correction.sql` | INPC acumulado real (2020-2024) ≈ 31.7 % |
| 2026-04-24 | Metro CDMX 2025: $7 → **$5** (tarifa no aumentó 2012-2025) | `InflacionChallenge/data.ts` | STC Metro tarifa subsidiada sin variación; dato $7 era incorrecto |
| 2026-04-28 | Dragdrop 'prioriza-deudas': tasas irrealistas → corregidas (tarjeta 30%→60% CAT, tienda 24%→80% CAT, auto 8%→14%, hipoteca 6%→9%) | `exercises.ts` | CNBV comparativo de CAT y tasas hipotecarias — DLV-120 |
| 2026-04-28 | Scenario 1 CETES FV: **$3,025 → ~$3,052** (recalculado a 8.25 %) | `20260428000002_scenario_content_fixes.sql` | FV anualidad 6 meses, $500/mes, r=8.25 %/12 |
| 2026-04-28 | Scenario 1: "52% CAT mensual" → **"52% CAT anual"** + $2,600 → **~$2,608** | `20260428000002_scenario_content_fixes.sql` | CAT es siempre anual (CNBV definición); 52%/12=4.33%/mes |
| 2026-04-28 | Scenario 6: "45% anual" → **"tasa nominal 45% ≈ CAT ~55%"** | `20260428000002_scenario_content_fixes.sql` | CNBV diferencia tasa nominal vs CAT; CAT incluye comisiones/seguros |
| 2026-04-28 | 8 nuevas flashcards v3: AFORE (fc-025, fc-026), Seguros de vida (fc-027, fc-028), ISR (fc-029, fc-030), Infonavit (fc-031), SMART saving (fc-032) | `20260428000001_seed_flashcards_v3.sql` | LSS art. 168; LFT art. 136; Ley ISR art. 113-E |
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
| AFORE contribución patronal 2026 | ~8.635 % SBC | n/a (nueva cifra) | Reforma LSS 2020 art. 168 | **Anual** (escalada hasta 2030) | flashcard fc-025 |
| AFORE contribución empleado | 1.125 % SBC | n/a | Ley del Seguro Social | Estable | flashcard fc-025 |
| Infonavit contribución patronal | 5 % SBC | n/a | LFT art. 136 | Estable | flashcard fc-031 |
| RESICO tasa mínima | 1 % (hasta $25k/mes) | n/a | Ley ISR art. 113-E | **Anual** (enero) | flashcard fc-030 |
| RESICO tasa máxima | 2.5 % (hasta $291k/mes) | n/a | Ley ISR art. 113-E | **Anual** (enero) | flashcard fc-030 |
| Infonavit crédito para $15k/mes | $600k–$1,200k estimado | n/a | Infonavit precalificación | **Anual** | flashcard fc-031 |
| Tarjeta crédito dragdrop | 60 % CAT | 30 % (incorrecto) → corregido 2026-04-28 | CNBV comparativo CAT | **Semestral** | `exercises.ts` |
| Tarjeta departamental dragdrop | 80 % CAT | 24 % (incorrecto) → corregido 2026-04-28 | CNBV / CONDUSEF | **Semestral** | `exercises.ts` |
| Crédito auto dragdrop | 14 % anual | 8 % (incorrecto) → corregido 2026-04-28 | CNBV bancos grandes | **Semestral** | `exercises.ts` |
| Hipoteca dragdrop | 9 % anual | 6 % (incorrecto) → corregido 2026-04-28 | Banxico / CNBV | **Semestral** | `exercises.ts` |

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

## 7b. Flashcards v3 (nuevas — migration 20260428000001)

| ID | Dominio | Figura Clave | Fuente | Revisión |
|----|---------|-------------|--------|----------|
| fc…025 | Retiro/AFORE | Patrón ~8.6 % SBC (2026); empleado 1.125 % | Reforma LSS 2020 art. 168 | **Anual** (escala hasta 2030) |
| fc…026 | Retiro/AFORE | $500/mes×45 años@7–8% = $1.9M–$2.6M | FV matemático + CONSAR | Atemporal (matemática); rendimiento **Trimestral** |
| fc…027 | Seguros GMM | Cirugía grave $400k–$800k; prima ~$6k–$18k/año | Referencia editorial mercado | **Anual** |
| fc…028 | Seguros de vida | Dependientes = necesario; sin dep. = no urgente | Principio | Atemporal; precios **Anual** |
| fc…029 | ISR empleado | Tasa efectiva ~8–12 % @ $10k/mes; ~15–20 % @ $20k/mes | SAT tabla retención | **Anual** (enero) |
| fc…030 | SAT/RESICO | Tasa 1–2.5 % mensual; límite $3.5M/año | Ley ISR art. 113-E | **Anual** (enero) |
| fc…031 | Infonavit | Patrón 5 % SBC; 1,080 puntos para crédito | LFT art. 136 | **Anual** |
| fc…032 | Ahorro SMART | Principio conceptual SMART | Principio | Atemporal |

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
| **Inmediato (RESUELTO 2026-04-28)** | Dragdrop rates, Scenario 1 FV+CAT label, Scenario 6 nominal vs CAT | `exercises.ts`, `20260428000002_*` |

---

## 9. Contenidos Pendientes (brechas identificadas)

Issues creados en Linear (proyecto "Cultiva Finanzas — Garden Gamification", equipo Delivery):

| Issue | Dominio | Prioridad | Estado | Nota |
|-------|---------|-----------|--------|------|
| [DLV-105](https://linear.app/riverstar/issue/DLV-105) | Seguros: IMSS, GMM, seguro de vida | **Alta** | Backlog | ⚠️ Parcialmente atendido: flashcards fc-027, fc-028 añadidas (2026-04-28) |
| [DLV-106](https://linear.app/riverstar/issue/DLV-106) | AFORE / Retiro: SAR, subcuentas, rendimientos | **Alta** | Backlog | ⚠️ Parcialmente atendido: flashcards fc-025, fc-026 añadidas (2026-04-28) |
| [DLV-107](https://linear.app/riverstar/issue/DLV-107) | Impuestos: SAT, RESICO, declaración anual | Normal | Backlog | ⚠️ Parcialmente atendido: flashcards fc-029, fc-030 añadidas (2026-04-28) |
| [DLV-108](https://linear.app/riverstar/issue/DLV-108) | Crédito hipotecario: Infonavit, CAT hipotecario | Normal | Backlog | ⚠️ Parcialmente atendido: flashcard fc-031 añadida (2026-04-28) |
| [DLV-112](https://linear.app/riverstar/issue/DLV-112) | Fuente: "fondo de emergencia 89% de crisis" | **Alta** | Backlog | No puede corregirse sin modificar componente (ver mandato) |
| [DLV-113](https://linear.app/riverstar/issue/DLV-113) | ENIF: 63% sin presupuesto → actualización | Normal | Backlog | Pendiente verificación ENIF 2024 |
| [DLV-115](https://linear.app/riverstar/issue/DLV-115) | Fuente "89% de crisis" | Normal | Backlog | Duplicado de DLV-112 |
| [DLV-116](https://linear.app/riverstar/issue/DLV-116) | Salario mínimo 2026 CONASAMI | **Alta** | Backlog | El juego muestra datos 2020→2025 — el precio2025=$278 es correcto para el rango del juego; actualizar si el juego migra a 2020→2026 |
| [DLV-117](https://linear.app/riverstar/issue/DLV-117) | ENIF 63% | Normal | Backlog | Duplicado de DLV-113 |
| [DLV-118](https://linear.app/riverstar/issue/DLV-118) | Fuente "89% de crisis" | **Alta** | Backlog | Duplicado de DLV-112 |
| [DLV-119](https://linear.app/riverstar/issue/DLV-119) | Flashcards AFORE / SAR | **Alta** | Backlog | ✅ Atendido: fc-025 y fc-026 añadidas en v3 (2026-04-28) |
| [DLV-120](https://linear.app/riverstar/issue/DLV-120) | Dragdrop tasas irrealistas para México | **Alta** | Backlog | ✅ Corregido en `exercises.ts` (2026-04-28) |

### Notas sobre los "89% de crisis" (DLV-112/115/118)

El tip en `PolinizacionSession.tsx` no puede modificarse según el mandato actual (no tocar componentes). El siguiente paso es:
1. Reemplazar la cifra por "protege de la mayoría de emergencias financieras" sin porcentaje ficticio
2. O citar la ENIF / una fuente académica verificada

### Nota sobre DLV-116 (salario mínimo 2026)

El juego `InflacionChallenge` muestra comparación **2020 → 2025**. El precio2025 de $278.80 es correcto para la fecha señalada (CONASAMI decreto enero 2025). Si el juego se actualiza a 2020→2026, usar el decreto CONASAMI de enero 2026.
