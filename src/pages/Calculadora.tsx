import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageTransition from "@/components/PageTransition";

export default function Calculadora() {
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
    // Phase 3: unlock calculator_user achievement
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Calculadora</h1>
          <p className="mt-1 text-muted-foreground">
            Simula el crecimiento de tu dinero con interés compuesto.
          </p>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="capital">Capital inicial ($)</Label>
                <Input
                  id="capital"
                  type="number"
                  min={0}
                  value={capital}
                  onChange={(e) => { setCapital(Number(e.target.value)); setCalculated(false); }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Tasa anual (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  min={0}
                  step={0.1}
                  value={rate}
                  onChange={(e) => { setRate(Number(e.target.value)); setCalculated(false); }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years">Plazo (años)</Label>
                <Input
                  id="years"
                  type="number"
                  min={1}
                  max={50}
                  value={years}
                  onChange={(e) => { setYears(Number(e.target.value)); setCalculated(false); }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly">Aportación mensual ($)</Label>
                <Input
                  id="monthly"
                  type="number"
                  min={0}
                  value={monthly}
                  onChange={(e) => { setMonthly(Number(e.target.value)); setCalculated(false); }}
                />
              </div>
            </div>

            <Button
              onClick={handleCalc}
              className="w-full min-h-[44px] rounded-full font-bold"
            >
              Calcular
            </Button>
          </CardContent>
        </Card>

        {calculated && data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground font-medium">Monto final</p>
                  <p className="text-2xl font-bold text-primary">
                    ${finalAmount.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground font-medium">Total invertido</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${totalInvested.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground font-medium">Intereses ganados</p>
                  <p className="text-2xl font-bold text-primary">
                    ${interestsEarned.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-primary">
                  Crecimiento proyectado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="year"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        label={{ value: "Años", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Total"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
