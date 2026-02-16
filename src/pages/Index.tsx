import { motion, type Easing } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, PiggyBank, Calculator, Trophy, BookOpen, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoSemilla from "@/assets/logo-semilla.png";

const easeOut: Easing = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: easeOut },
  }),
};

const benefits = [
  { icon: BookOpen, title: "Cursos interactivos", desc: "Aprende finanzas con escenarios reales y decisiones prácticas." },
  { icon: Calculator, title: "Calculadora de intereses", desc: "Simula créditos y ahorros para tomar mejores decisiones." },
  { icon: Trophy, title: "Logros y racha", desc: "Gana insignias y mantén tu racha de aprendizaje." },
  { icon: PiggyBank, title: "Ahorro inteligente", desc: "Domina técnicas como el 50/30/20 para tu presupuesto." },
  { icon: Shield, title: "Crédito consciente", desc: "Entiende tasas, CAT y costo total antes de endeudarte." },
  { icon: TrendingUp, title: "Progreso visible", desc: "Visualiza tu avance con gráficas y métricas claras." },
];

const steps = [
  { num: "1", title: "Crea tu cuenta", desc: "Regístrate gratis en menos de 1 minuto." },
  { num: "2", title: "Elige un curso", desc: "Empieza con Ahorro, Crédito o Presupuesto." },
  { num: "3", title: "Aprende haciendo", desc: "Toma decisiones en escenarios interactivos." },
  { num: "4", title: "Crece financieramente", desc: "Aplica lo aprendido en tu vida diaria." },
];

const testimonials = [
  { name: "María G.", location: "Puebla", text: "Nunca entendí los intereses hasta que usé la calculadora de Semilla. ¡Ahora ahorro cada quincena!" },
  { name: "Carlos R.", location: "CDMX", text: "Los escenarios interactivos me ayudaron a decidir si pedir un crédito o ahorrar. Elegí bien." },
  { name: "Ana L.", location: "Guadalajara", text: "Me encantan las insignias. Mi racha de 15 días me motiva a seguir aprendiendo." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoSemilla} alt="Semilla" className="h-9 w-9" />
            <span className="text-xl font-extrabold text-primary">Semilla</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Registrarse</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-semilla-green-light/50 via-background to-semilla-earth-light/30" />
        <div className="container relative z-10 flex flex-col items-center text-center">
          <motion.img
            src={logoSemilla}
            alt="Semilla logo"
            className="mb-6 h-24 w-24 md:h-32 md:w-32"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />
          <motion.h1
            className="mb-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Tu camino hacia la{" "}
            <span className="text-primary">libertad financiera</span>{" "}
            comienza aquí
          </motion.h1>
          <motion.p
            className="mb-8 max-w-xl text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Aprende a ahorrar, manejar créditos y crear presupuestos con cursos
            interactivos y herramientas prácticas. 100% gratis.
          </motion.p>
          <motion.div
            className="flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button size="lg" asChild className="text-base">
              <Link to="/signup">
                Empezar gratis <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base">
              <Link to="/login">Ya tengo cuenta</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.h2
            className="mb-12 text-center text-3xl font-extrabold text-foreground md:text-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            ¿Por qué <span className="text-primary">Semilla</span>?
          </motion.h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-semilla-green-light text-primary">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-card-foreground">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-semilla-cream py-16 md:py-24">
        <div className="container">
          <motion.h2
            className="mb-12 text-center text-3xl font-extrabold text-foreground md:text-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            ¿Cómo funciona?
          </motion.h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                className="flex flex-col items-center text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-extrabold text-primary-foreground">
                  {s.num}
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.h2
            className="mb-12 text-center text-3xl font-extrabold text-foreground md:text-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            Lo que dicen nuestros usuarios
          </motion.h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="rounded-xl border border-border bg-card p-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <p className="mb-4 text-sm italic text-muted-foreground">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-card-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container flex flex-col items-center text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground md:text-4xl">
            ¿Listo para sembrar tu futuro financiero?
          </h2>
          <p className="mb-8 max-w-lg text-primary-foreground/80">
            Únete a miles de personas que están transformando su relación con el dinero.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-base font-bold">
            <Link to="/signup">
              Crear cuenta gratis <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-10">
        <div className="container flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <img src={logoSemilla} alt="Semilla" className="h-7 w-7" />
            <span className="font-bold text-foreground">Semilla</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Semilla — Educación financiera para todos.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <button className="hover:text-foreground transition-colors">Términos</button>
            <button className="hover:text-foreground transition-colors">Privacidad</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
