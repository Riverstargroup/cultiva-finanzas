import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
