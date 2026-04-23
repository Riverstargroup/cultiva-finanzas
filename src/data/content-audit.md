# Auditoría de Contenido Financiero — Semilla / Cultiva Finanzas

> **Propósito:** Registro central de todas las cifras financieras del app, sus fuentes, y cuándo deben revisarse.
> **Responsable:** Equipo de contenido (Enactus ITESM)
> **Última actualización:** 2026-04-23
> **Próxima revisión completa:** 2026-07-23 (trimestral)

---

## 1. Tasas de Referencia Principales

| Figura | Valor Actual | Valor Anterior | Fuente | Cadencia de Revisión | Archivo(s) |
|--------|-------------|----------------|--------|----------------------|------------|
| CETES 28 días (tasa anual) | ~8.25 % | 10.1 % | Banxico subasta semanal: banxico.org.mx | **Semanal** (cambio cada subasta) | `PolinizacionSession.tsx`, flashcard `fc…019`, `fc…020` |
| INPC / Inflación anual | ~3.9 % | 4.5 % | INEGI INPC: inegi.org.mx | **Mensual** (primera semana) | `PolinizacionSession.tsx`, flashcard `fc…008`, `fc…018` |
| CAT promedio tarjetas grandes | 50–90 % | 30–60 % (incorrecto) | CNBV comparativo CAT: cnbv.gob.mx | **Semestral** | Scenario `111103`, flashcard `fc…009`, `fc…012`, `fc…013` |
| Tasa préstamo personal (grandes bancos) | 18–36 % anual | 28 % anual (preset) | CNBV / bancos grandes | Semestral | `debtPresets.ts` |
| Tasa microcrédito | 60–120 % CAT | 90 % anual (preset) | CONDUSEF / Kueski / Credijusto | Semestral | `debtPresets.ts` |
| Salario mínimo diario | $278.80 (2025) | $123.22 (2020) | CONASAMI decreto enero 2025 | **Anual** (enero) | `InflacionChallenge/data.ts` |

---

## 2. Precios de Referencia (Minijuego Inflación)

| Producto | Precio 2020 | Precio 2025 | Variación | Fuente | Estado |
|----------|------------|------------|-----------|--------|--------|
| Tortillas 1 kg | $19 | $28 | +47 % | INEGI INPC / SNIIM | ✅ Plausible |
| Gasolina Magna 1 L | $18.50 | $24 | +30 % | CRE / PROFECO | ✅ Plausible |
| Salario mínimo/día | $123 | $278 | +126 % | CONASAMI ✓ | ✅ Verificado |
| Aguacate 1 kg | $35 | $58 | +66 % | SNIIM (precio promedio) | ✅ Plausible (precio estacional) |
| Metro CDMX boleto | $5 | $7 | +40 % | ⚠️ STC Metro — **VERIFICAR** | ❌ **Pendiente**: tarifa ha sido $5 desde 2012 |

> **Acción urgente:** Confirmar tarifa actual del Metro CDMX antes del próximo release.
> Si la tarifa sigue en $5, actualizar `price2025: 5` en `InflacionChallenge/data.ts`.

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
| **Inmediato** | Tarifa Metro CDMX — confirmar si subió de $5 | stcmetro.cdmx.gob.mx |

---

## 9. Contenidos Pendientes (brechas identificadas)

Ver issues en Linear: [Contenido] tag en proyecto "Cultiva Finanzas — Garden Gamification"

- ❌ **Seguros**: No existe ningún escenario o flashcard que explique IMSS, ISSSTE, seguro de vida, ni cómo contratar GMM
- ❌ **AFORE / Retiro**: No hay contenido sobre SAR (2 % patrón + aportaciones voluntarias), subcuentas AFORE, rendimientos históricos
- ❌ **Impuestos**: Ningún escenario aborda SAT, RESICO (régimen para actividades empresariales), declaración anual para asalariados
- ❌ **Crédito hipotecario**: No hay escenario sobre Infonavit, fovissste, enganche, CAT hipotecario (~15–20 %)
- ⚠️ **ENIF**: La estadística "63 % sin presupuesto" cita ENIF 2021 — necesita actualización si hay ENIF 2024
