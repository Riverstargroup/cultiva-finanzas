import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import BotanicalPage from "@/components/layout/BotanicalPage";
import { useAchievements } from "@/hooks/useAchievements";
import { useAuth } from "@/contexts/AuthContext";
import { DEBT_PRESETS, type DebtItem } from "@/data/debtPresets";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

type DebtStrategy = "snowball" | "avalanche";

interface SimResult {
  months: number;
  totalPaid: number;
  totalInterest: number;
}

function simulateDebt(
  debts: DebtItem[],
  extraPayment: number,
  strategy: DebtStrategy
): SimResult {
  if (debts.length === 0) return { months: 0, totalPaid: 0, totalInterest: 0 };

  let balances = debts.map((d) => d.balance);
  const rates = debts.map((d) => d.annual_rate / 100 / 12);
  const mins = debts.map((d) => d.min_payment);
  let months = 0;
  let totalPaid = 0;
  const maxMonths = 600;

  while (balances.some((b) => b > 0.01) && months < maxMonths) {
    months++;
    // Sort indices for extra payment
    const indices = balances.map((_, i) => i).filter((i) => balances[i] > 0.01);
    if (strategy === "snowball") {
      indices.sort((a, b) => balances[a] - balances[b]);
    } else {
      indices.sort((a, b) => rates[b] - rates[a]);
    }

    let extra = extraPayment;
    for (let i = 0; i < balances.length; i++) {
      if (balances[i] <= 0.01) continue;
      const interest = balances[i] * rates[i];
      balances[i] += interest;
      const minPay = Math.min(mins[i], balances[i]);
      balances[i] -= minPay;
      totalPaid += minPay;
    }

    // Apply extra to priority debt
    for (const idx of indices) {
      if (extra <= 0) break;
      if (balances[idx] <= 0.01) continue;
      const payment = Math.min(extra, balances[idx]);
      balances[idx] -= payment;
      totalPaid += payment;
      extra -= payment;
    }
  }

  const totalOriginal = debts.reduce((s, d) => s + d.balance, 0);
  return {
    months,
    totalPaid: Math.round(totalPaid),
    totalInterest: Math.round(totalPaid - totalOriginal),
  };
}

export default function Calculadora() {
  const { user } = useAuth();
  const { unlock } = useAchievements();
  const calculatorUnlocked = useRef(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<"compound" | "debt">("compound");

  // Compound interest state
  const [capital, setCapital] = useState(10000);
  const [rate, setRate] = useState(11);
  const [years, setYears] = useState(5);
  const [monthly, setMonthly] = useState(1000);
  const [calculated, setCalculated] = useState(false);

  // Debt simulator state
  const [debtItems, setDebtItems] = useState<DebtItem[]>([
    { name: "", balance: 0, annual_rate: 0, min_payment: 0 },
  ]);
  const [extraPayment, setExtraPayment] = useState(0);
  const [strategy, setStrategy] = useState<DebtStrategy>("avalanche");
  const [debtResult, setDebtResult] = useState<SimResult | null>(null);

  const data = useMemo(() => {
    if (!calculated) return [];
    const points: { year: number; total: number }[] = [];
    let total = capital;
    const monthlyRate = rate / 100 / 12;
    for (let y = 0; y <= years; y++) {
      points.push({ year: y, total: Math.round(total) });
      for (let m = 0; m < 12; m++) {
        total = total * (1 + monthlyRate) + monthly;
      }
    }
    return points;
  }, [calculated, capital, rate, years, monthly]);

  const finalAmount = data.length > 0 ? data[data.length - 1].total : 0;
  const totalInvested = capital + monthly * 12 * years;
  const interestsEarned = finalAmount - totalInvested;

  const handleCalc = () => {
    setCalculated(true);
    if (!calculatorUnlocked.current && user) {
      calculatorUnlocked.current = true;
      unlock("calculator_user");
    }
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = DEBT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setDebtItems(preset.debts.map((d) => ({ ...d })));
    setExtraPayment(preset.extra_payment);
    setDebtResult(null);
  };

  const handleSimulateDebt = () => {
    const valid = debtItems.filter((d) => d.balance > 0);
    if (valid.length === 0) return;
    setDebtResult(simulateDebt(valid, extraPayment, strategy));
  };

  const updateDebtItem = (index: number, field: keyof DebtItem, value: string | number) => {
    setDebtItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: typeof value === "string" && field !== "name" ? Number(value) : value } : item
      )
    );
    setDebtResult(null);
  };

  const addDebtItem = () => {
    setDebtItems((prev) => [...prev, { name: "", balance: 0, annual_rate: 0, min_payment: 0 }]);
  };

  const removeDebtItem = (index: number) => {
    setDebtItems((prev) => prev.filter((_, i) => i !== index));
    setDebtResult(null);
  };

  const inputClass = "w-full rounded-lg px-3 py-2.5 text-sm border outline-none focus:ring-2 focus:ring-[var(--leaf-bright)]/30 transition-colors";

  const tabs = [
    { id: "compound" as const, label: "Interés compuesto" },
    { id: "debt" as const, label: "Deuda" },
  ];

  return (
    <BotanicalPage title="Calculadora" subtitle="Simula el crecimiento de tu dinero o tu plan de salida de deudas.">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all min-h-[44px]"
            style={{
              border: `1.5px solid ${activeTab === t.id ? "var(--leaf-bright)" : "var(--clay-soft)"}`,
              background: activeTab === t.id ? "color-mix(in srgb, var(--leaf-fresh) 12%, transparent)" : "transparent",
              color: activeTab === t.id ? "var(--leaf-bright)" : "var(--text-warm)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== TAB: Interés compuesto ===== */}
      {activeTab === "compound" && (
        <>
          <div className="organic-card p-6 md:p-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { id: "capital", label: "Capital inicial ($)", value: capital, set: setCapital, min: 0 },
                { id: "rate", label: "Tasa anual (%)", value: rate, set: setRate, min: 0, step: 0.1 },
                { id: "years", label: "Plazo (años)", value: years, set: setYears, min: 1, max: 50 },
                { id: "monthly", label: "Aportación mensual ($)", value: monthly, set: setMonthly, min: 0 },
              ].map((f) => (
                <div key={f.id} className="space-y-1.5">
                  <label
                    htmlFor={f.id}
                    className="text-[10px] font-semibold uppercase tracking-widest block"
                    style={{ color: "var(--leaf-muted)" }}
                  >
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    type="number"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={f.value}
                    onChange={(e) => { f.set(Number(e.target.value)); setCalculated(false); }}
                    className={inputClass}
                    style={{ background: "var(--soil-warm)", borderColor: "var(--clay-soft)" }}
                  />
                </div>
              ))}
            </div>

            <button onClick={handleCalc} className="vibrant-btn w-full justify-center min-h-[44px] font-bold">
              Calcular
            </button>
          </div>

          {calculated && data.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Monto final", value: finalAmount, highlight: true },
                  { label: "Total invertido", value: totalInvested, highlight: false },
                  { label: "Intereses ganados", value: interestsEarned, highlight: true },
                ].map((r) => (
                  <div key={r.label} className="card-stat p-4 text-center space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--leaf-muted)" }}>
                      {r.label}
                    </p>
                    <p
                      className="font-heading text-2xl font-bold"
                      style={{ color: r.highlight ? "var(--leaf-bright)" : "var(--forest-deep)" }}
                    >
                      ${r.value.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="organic-card p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1.5 rounded-full" style={{ background: "var(--leaf-bright)" }} />
                  <h3 className="font-heading text-lg font-bold" style={{ color: "var(--forest-deep)" }}>
                    Crecimiento proyectado
                  </h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--clay-soft)" />
                      <XAxis
                        dataKey="year"
                        tick={{ fill: "var(--leaf-muted)", fontSize: 12 }}
                        label={{ value: "Años", position: "insideBottom", offset: -5, fill: "var(--leaf-muted)" }}
                      />
                      <YAxis
                        tick={{ fill: "var(--leaf-muted)", fontSize: 12 }}
                        tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1.5px solid var(--clay-soft)",
                          borderRadius: "12px",
                          fontFamily: "Quicksand, sans-serif",
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Total"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="var(--leaf-bright)"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "var(--leaf-bright)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* ===== TAB: Deuda ===== */}
      {activeTab === "debt" && (
        <div className="space-y-4">
          {/* Preset selector */}
          <div className="organic-card p-4">
            <label className="text-[10px] font-semibold uppercase tracking-widest block mb-2" style={{ color: "var(--leaf-muted)" }}>
              Cargar ejemplo
            </label>
            <Select onValueChange={handleLoadPreset}>
              <SelectTrigger
                className="w-full"
                style={{ background: "var(--soil-warm)", borderColor: "var(--clay-soft)" }}
              >
                <SelectValue placeholder="Selecciona un ejemplo..." />
              </SelectTrigger>
              <SelectContent>
                {DEBT_PRESETS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Debt items form */}
          <div className="organic-card p-5 md:p-6 space-y-4">
            <h3 className="font-heading text-lg font-bold" style={{ color: "var(--forest-deep)" }}>
              Tus deudas
            </h3>
            {debtItems.map((item, i) => (
              <div key={i} className="grid gap-3 sm:grid-cols-4 items-end p-3 rounded-lg" style={{ background: "color-mix(in srgb, var(--soil-warm) 60%, transparent)" }}>
                <div className="space-y-1.5 sm:col-span-4 flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: "var(--forest-deep)" }}>Deuda {i + 1}</span>
                  {debtItems.length > 1 && (
                    <button onClick={() => removeDebtItem(i)} className="p-1" aria-label="Eliminar deuda">
                      <Trash2 className="h-4 w-4" style={{ color: "var(--terracotta-vivid)" }} />
                    </button>
                  )}
                </div>
                {[
                  { label: "Nombre", field: "name" as const, type: "text", value: item.name },
                  { label: "Saldo ($)", field: "balance" as const, type: "number", value: item.balance },
                  { label: "Tasa anual (%)", field: "annual_rate" as const, type: "number", value: item.annual_rate },
                  { label: "Pago mínimo ($)", field: "min_payment" as const, type: "number", value: item.min_payment },
                ].map((f) => (
                  <div key={f.field} className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-widest block" style={{ color: "var(--leaf-muted)" }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      value={f.value}
                      onChange={(e) => updateDebtItem(i, f.field, f.type === "number" ? Number(e.target.value) : e.target.value)}
                      className={inputClass}
                      style={{ background: "var(--soil-warm)", borderColor: "var(--clay-soft)" }}
                    />
                  </div>
                ))}
              </div>
            ))}
            <button
              onClick={addDebtItem}
              className="flex items-center gap-2 text-sm font-semibold min-h-[44px] px-4 py-2 rounded-lg transition-colors"
              style={{ border: "1.5px solid var(--clay-soft)", color: "var(--text-warm)" }}
            >
              <Plus className="h-4 w-4" /> Agregar deuda
            </button>
          </div>

          {/* Extra payment + strategy */}
          <div className="organic-card p-5 md:p-6 space-y-4">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest block" style={{ color: "var(--leaf-muted)" }}>
                  Pago extra mensual ($)
                </label>
                <input
                  type="number"
                  min={0}
                  value={extraPayment}
                  onChange={(e) => { setExtraPayment(Number(e.target.value)); setDebtResult(null); }}
                  className={inputClass}
                  style={{ background: "var(--soil-warm)", borderColor: "var(--clay-soft)" }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest block" style={{ color: "var(--leaf-muted)" }}>
                  Estrategia
                </label>
                <div className="flex gap-2">
                  {([
                    { id: "avalanche" as const, label: "Avalanche" },
                    { id: "snowball" as const, label: "Snowball" },
                  ]).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setStrategy(s.id); setDebtResult(null); }}
                      className="flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all min-h-[44px]"
                      style={{
                        border: `1.5px solid ${strategy === s.id ? "var(--leaf-bright)" : "var(--clay-soft)"}`,
                        background: strategy === s.id ? "color-mix(in srgb, var(--leaf-fresh) 12%, transparent)" : "var(--soil-warm)",
                        color: strategy === s.id ? "var(--leaf-bright)" : "var(--text-warm)",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={handleSimulateDebt} className="vibrant-btn w-full justify-center min-h-[44px] font-bold">
              Simular
            </button>
          </div>

          {/* Results */}
          {debtResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Meses para salir", value: debtResult.months >= 600 ? "50+ años" : `${debtResult.months}`, highlight: true },
                { label: "Total pagado", value: `$${debtResult.totalPaid.toLocaleString()}`, highlight: false },
                { label: "Intereses pagados", value: `$${debtResult.totalInterest.toLocaleString()}`, highlight: true },
              ].map((r) => (
                <div key={r.label} className="card-stat p-4 text-center space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--leaf-muted)" }}>
                    {r.label}
                  </p>
                  <p
                    className="font-heading text-2xl font-bold"
                    style={{ color: r.highlight ? "var(--leaf-bright)" : "var(--forest-deep)" }}
                  >
                    {r.value}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </BotanicalPage>
  );
}
