import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import logoSemilla from "@/assets/logo-semilla.png";

const passwordRules = [
  { test: (p: string) => p.length >= 8, label: "Mínimo 8 caracteres" },
  { test: (p: string) => /[A-Z]/.test(p), label: "Una letra mayúscula" },
  { test: (p: string) => /[0-9]/.test(p), label: "Un número" },
];

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const allValid = passwordRules.every((r) => r.test(password));

  // Check for recovery token in URL hash
  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setHasToken(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;
    setLoading(true);
    setError("");
    const { error } = await updatePassword(password);
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    }
    setLoading(false);
  };

  if (!hasToken && !success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-semilla-green-light/40 via-background to-semilla-earth-light/20 px-4">
        <Card className="w-full max-w-md border-border shadow-xl text-center">
          <CardHeader className="items-center">
            <img src={logoSemilla} alt="Semilla" className="h-12 w-12 mb-2" />
            <CardTitle className="text-xl">Enlace inválido</CardTitle>
            <CardDescription>Este enlace no es válido o ha expirado.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/forgot-password">Solicitar nuevo enlace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-semilla-green-light/40 via-background to-semilla-earth-light/20 px-4">
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardHeader className="items-center text-center">
          <img src={logoSemilla} alt="Semilla" className="h-12 w-12 mb-2" />
          <CardTitle className="text-2xl font-extrabold text-foreground">
            {success ? "¡Contraseña actualizada!" : "Nueva contraseña"}
          </CardTitle>
          <CardDescription>
            {success ? "Serás redirigido al login" : "Ingresa tu nueva contraseña"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-semilla-green-light mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Ir al login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Nueva contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password && (
                  <ul className="mt-2 space-y-1">
                    {passwordRules.map((r) => {
                      const valid = r.test(password);
                      return (
                        <li key={r.label} className={`flex items-center gap-2 text-xs ${valid ? "text-primary" : "text-muted-foreground"}`}>
                          {valid ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          {r.label}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <Button type="submit" className="w-full font-bold" disabled={!allValid || loading}>
                {loading ? "Actualizando..." : "Actualizar contraseña"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
