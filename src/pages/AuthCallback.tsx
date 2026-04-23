import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logoSemilla from "@/assets/logo-semilla.png";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "confirmed" | "error">("loading");

  useEffect(() => {
    const handle = async () => {
      // Check for error in query params or hash
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const errorMsg =
        searchParams.get("error_description") ||
        hashParams.get("error_description") ||
        searchParams.get("error") ||
        hashParams.get("error");

      if (errorMsg) {
        toast.error(errorMsg);
        navigate("/login", { replace: true });
        return;
      }

      const code = searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          navigate("/", { replace: true });
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/", { replace: true });
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
