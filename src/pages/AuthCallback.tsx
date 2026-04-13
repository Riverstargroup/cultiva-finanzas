import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logoSemilla from "@/assets/logo-semilla.png";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "confirmed" | "error">("loading");

  useEffect(() => {
    const handle = async () => {
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          navigate("/dashboard", { replace: true });
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard", { replace: true });
        return;
      }

      setStatus("confirmed");
    };

    handle();
  }, [navigate]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-semilla-green-light/40 via-background to-semilla-earth-light/20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-semilla-green-light/40 via-background to-semilla-earth-light/20 px-4">
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardHeader className="items-center text-center">
          <Link to="/" className="mb-2 flex items-center gap-2">
            <img src={logoSemilla} alt="Semilla" className="h-12 w-12" />
          </Link>
          <CardTitle className="text-2xl font-extrabold text-foreground">¡Cuenta confirmada!</CardTitle>
          <CardDescription>Tu correo ha sido verificado. Ya puedes iniciar sesión.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild className="font-bold">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
