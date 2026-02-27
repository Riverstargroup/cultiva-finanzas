import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import BotanicalPage from "@/components/layout/BotanicalPage";
import { useAchievements } from "@/hooks/useAchievements";
import { useAuth } from "@/contexts/AuthContext";

export default function Calculadora() {
  const { user } = useAuth();
  const { unlock } = useAchievements();
  const calculatorUnlocked = useRef(false);
  const [capital, setCapital] = useState(10000);
  const [rate, setRate] = useState(11);
  const [years, setYears] = useState(5);
  const [monthly, setMonthly] = useState(1000);
  const [calculated, setCalculated] = useState(false);

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

  const inputClass = "w-full rounded-lg px-3 py-2.5 text-sm border outline-none focus:ring-2 focus:ring-[var(--leaf-bright)]/30 transition-colors";

  return (
    <BotanicalPage title="Calculadora" subtitle="Simula el crecimiento de tu dinero con interés compuesto.">
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
    </BotanicalPage>
  );
}
