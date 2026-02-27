import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { lovable } from "@/integrations/lovable/index";
import { Eye, EyeOff, Mail, Lock, User, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logoSemilla from "@/assets/logo-semilla.png";

const passwordRules = [
  { test: (p: string) => p.length >= 8, label: "Mínimo 8 caracteres" },
  { test: (p: string) => /[A-Z]/.test(p), label: "Una letra mayúscula" },
  { test: (p: string) => /[0-9]/.test(p), label: "Un número" },
];

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const allPasswordValid = passwordRules.every((r) => r.test(password));
  const canSubmit = name.trim() && email && allPasswordValid && termsAccepted && privacyAccepted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    const { error } = await signUp(email, password, name);
    if (error) {
      setError(error);
    } else {
      toast({
        title: "¡Cuenta creada!",
        description: "Revisa tu correo para verificar tu cuenta.",
      });
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-semilla-green-light/40 via-background to-semilla-earth-light/20 px-4 py-8">
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardHeader className="items-center text-center">
          <Link to="/" className="mb-2">
            <img src={logoSemilla} alt="Semilla" className="h-12 w-12" />
          </Link>
          <CardTitle className="text-2xl font-extrabold text-foreground">Crea tu cuenta</CardTitle>
          <CardDescription>Empieza tu camino hacia la libertad financiera</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
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
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(v === true)} />
                <label htmlFor="terms" className="text-xs leading-tight text-muted-foreground">
                  Acepto los{" "}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button type="button" className="font-semibold text-primary underline">Términos y Condiciones</button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader><DialogTitle>Términos y Condiciones</DialogTitle></DialogHeader>
                      <ScrollArea className="max-h-80">
                        <div className="space-y-3 pr-4 text-sm text-muted-foreground">
                          <p>Bienvenido a Semilla. Al registrarte y utilizar nuestra plataforma, aceptas los siguientes términos y condiciones de uso.</p>
                          <p><strong>1. Uso de la plataforma:</strong> Semilla es una herramienta educativa. La información proporcionada no constituye asesoría financiera profesional.</p>
                          <p><strong>2. Cuenta de usuario:</strong> Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades realizadas bajo tu cuenta.</p>
                          <p><strong>3. Contenido:</strong> Todo el contenido educativo es propiedad de Semilla y no puede ser reproducido sin autorización.</p>
                          <p><strong>4. Privacidad:</strong> Tus datos se manejan según nuestro Aviso de Privacidad.</p>
                          <p><strong>5. Modificaciones:</strong> Nos reservamos el derecho de modificar estos términos. Te notificaremos de cambios significativos.</p>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </label>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="privacy" checked={privacyAccepted} onCheckedChange={(v) => setPrivacyAccepted(v === true)} />
                <label htmlFor="privacy" className="text-xs leading-tight text-muted-foreground">
                  Acepto el{" "}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button type="button" className="font-semibold text-primary underline">Aviso de Privacidad</button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader><DialogTitle>Aviso de Privacidad</DialogTitle></DialogHeader>
                      <ScrollArea className="max-h-80">
                        <div className="space-y-3 pr-4 text-sm text-muted-foreground">
                          <p>En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP):</p>
                          <p><strong>Datos recopilados:</strong> Nombre, correo electrónico, progreso educativo y decisiones en escenarios interactivos.</p>
                          <p><strong>Finalidad:</strong> Personalizar tu experiencia educativa, medir tu progreso y mejorar nuestros contenidos.</p>
                          <p><strong>Derechos ARCO:</strong> Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos personales.</p>
                          <p><strong>Seguridad:</strong> Implementamos medidas técnicas y organizativas para proteger tus datos.</p>
                          <p><strong>Contacto:</strong> Para ejercer tus derechos ARCO, envía un correo a privacidad@semilla.app</p>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </label>
              </div>
            </div>
            <Button type="submit" className="w-full font-bold" disabled={!canSubmit || loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">o regístrate con</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full font-bold"
            disabled={loading}
            onClick={async () => {
              setError("");
              setLoading(true);
              const { error } = await lovable.auth.signInWithOAuth("google", {
                redirect_uri: window.location.origin,
              });
              if (error) setError(error.message ?? "Error al registrarse con Google");
              setLoading(false);
            }}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </Button>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">Inicia sesión</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
