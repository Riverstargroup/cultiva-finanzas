import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sprout,
  Sun,
  Scissors,
  Droplets,
  Trophy,
  Calculator,
  Target,
  ShieldCheck,
  Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoSemilla from "@/assets/logo-semilla.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const valueProps = [
  {
    icon: Sprout,
    title: "Raíces Fuertes",
    desc: "Aprende desde la base con escenarios interactivos que simulan el ecosistema financiero real."
  },
  {
    icon: Sun,
    title: "Fotosíntesis de Datos",
    desc: "Convierte información en energía. Gráficos vivos que muestran cómo crecen tus ahorros."
  },
  {
    icon: Scissors,
    title: "Poda de Malos Hábitos",
    desc: "Identifica y recorta gastos innecesarios para permitir que tus finanzas crezcan frondosas."
  },
];

const lifecycleCtx = [
  {
    step: "1",
    title: "Siembra la Semilla",
    desc: "Regístrate gratis. Crea tu cuenta en suelo fértil en menos de 1 minuto y accede a todos los módulos.",
    color: "bg-semilla-green-light"
  },
  {
    step: "2",
    title: "Riega con Conocimiento",
    desc: "Toma decisiones en simulaciones. Observa cómo el agua de tus elecciones nutre o seca tu jardín financiero.",
    color: "bg-semilla-gold"
  },
  {
    step: "3",
    title: "Cosecha Abundancia",
    desc: "Aplica lo aprendido. Desbloquea logros y disfruta de los frutos de una estabilidad financiera duradera.",
    color: "bg-purple-400" // Custom accent for variety or use gold
  },
];

const features = [
  { icon: Sprout, title: "5 Escenarios Vivos", desc: "Simulaciones que respiran y cambian." },
  { icon: Calculator, title: "Calculadora de Cosecha", desc: "Proyecta el crecimiento de tus intereses." },
  { icon: Trophy, title: "Insignias Botánicas", desc: "Logros desbloqueables por cada meta." },
  { icon: Target, title: "Crecimiento Orgánico", desc: "Rutas de aprendizaje personalizadas." },
  { icon: Leaf, title: "Semillas Gratuitas", desc: "Contenido accesible para todos." },
  { icon: ShieldCheck, title: "Sin Maleza", desc: "Experiencia limpia sin anuncios." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-semilla-gold selection:text-primary">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-primary/10 bg-background/90 backdrop-blur-md transition-all">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-semilla-green to-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
              <Sprout className="h-6 w-6" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-primary">Semilla</span>
          </Link>
          <div className="hidden gap-8 md:flex">
            {["Cursos", "Calculadora", "Comunidad"].map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-primary hover:underline underline-offset-4">
              Entrar al jardín
            </Link>
            <Button className="rounded-full bg-primary px-6 font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90">
              <Link to="/signup">Plantar mi futuro</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-semilla-green to-primary opacity-100" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2041&auto=format&fit=crop')] opacity-10 mix-blend-overlay bg-cover bg-center" />
          <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-semilla-green-light to-semilla-green shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            <Sprout className="h-12 w-12 text-primary-foreground" />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-semilla-green-light"
          >
            Germinación Digital
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-6 font-display text-6xl font-bold leading-[1.1] text-white md:text-8xl lg:text-9xl"
          >
            Semilla
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-10 max-w-2xl text-lg font-medium text-semilla-green-light/90 md:text-2xl"
          >
            <span className="text-white font-bold">Sembrando</span> hábitos financieros saludables en tierra fértil.
            <br />
            <span className="mt-2 block text-base font-normal opacity-80">
              Cultiva tu conocimiento financiero de forma orgánica y gratuita.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Button size="lg" className="h-14 rounded-full bg-semilla-gold px-8 text-lg font-bold text-primary shadow-xl shadow-semilla-gold/20 hover:bg-semilla-gold/90">
              <Link to="/signup">Plantar mi futuro</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 rounded-full border-semilla-green-light/30 bg-transparent px-8 text-lg text-semilla-green-light hover:bg-white/10 hover:text-white">
              <Link to="/login">Entrar al jardín</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Philosophy / Value Props */}
      <section className="relative z-20 -mt-20 pb-20 md:pb-32">
        <div className="container">
          <div className="mb-16 text-center">
            <motion.h2
              className="font-display text-4xl font-bold text-white md:text-5xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              ¿Por qué <span className="text-semilla-green-light italic">florecer</span> aquí?
            </motion.h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {valueProps.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-primary/40 p-8 backdrop-blur-sm transition-colors hover:bg-primary/60 hover:border-semilla-gold/30"
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-semilla-gold ring-1 ring-white/10 transition-colors group-hover:bg-semilla-gold group-hover:text-primary`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 font-display text-2xl font-bold text-white">{item.title}</h3>
                <p className="text-semilla-green-light/80 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifecycle Steps */}
      <section className="bg-primary/5 py-24 md:py-32">
        <div className="container">
          <div className="mb-20 text-center">
            <h2 className="font-display text-4xl font-bold text-primary md:text-5xl">Ciclo de Vida</h2>
          </div>

          <div className="relative space-y-12">
            {/* Connecting Line (Desktop) */}
            <div className="absolute left-[28px] top-0 h-full w-[2px] bg-gradient-to-b from-semilla-green/20 via-semilla-gold to-semilla-green/20 md:left-1/2 md:-ml-[1px]" />

            {lifecycleCtx.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className={`relative flex flex-col gap-8 md:flex-row ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Content */}
                <div className="flex-1 md:text-right">
                  <div className={`rounded-3xl border border-border/50 bg-card p-8 shadow-sm transition-transform hover:-translate-y-1 ${i % 2 === 0 ? "md:mr-12" : "md:ml-12 md:text-left"}`}>
                    <h3 className={`mb-3 font-display text-2xl font-bold ${i % 2 === 0 ? "text-semilla-green" : "text-semilla-earth"}`}>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </div>

                {/* Marker */}
                <div className="absolute left-0 top-8 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-semilla-green to-primary shadow-lg md:relative md:left-auto md:top-auto md:translate-y-0">
                  <span className="font-display text-xl font-bold text-white">{step.step}</span>
                </div>

                {/* Spacer for layout balance */}
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid: "Invernadero" */}
      <section className="bg-primary py-24 text-white">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="font-display text-4xl font-bold md:text-5xl">
              Tu Invernadero <span className="text-semilla-green-light">Personal</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 rounded-2xl bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-semilla-green-light/10 text-semilla-green-light">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{f.title}</h4>
                  <p className="text-sm text-white/60">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative overflow-hidden py-32">
        <div className="container relative z-10 flex flex-col items-center text-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-semilla-gold text-primary shadow-xl shadow-semilla-gold/30">
            <Sprout className="h-10 w-10" />
          </div>
          <h2 className="mb-6 font-display text-5xl font-bold text-primary md:text-6xl">
            ¿Listo para ver <span className="italic text-semilla-green">brotar</span> <br /> tus finanzas?
          </h2>
          <p className="mb-10 max-w-lg text-xl text-muted-foreground">
            Únete a un bosque de personas que están cultivando su libertad hoy mismo.
          </p>
          <Button size="lg" className="h-14 rounded-full bg-semilla-gold px-10 text-lg font-bold text-primary shadow-xl hover:bg-semilla-gold/90">
            <Link to="/signup">Plantar mi primera semilla</Link>
          </Button>

          <div className="mt-16 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/30">
            <span>• Proyecto Enactus México • 100% Orgánico •</span>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-primary py-12 text-center text-primary-foreground/30 text-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-semilla-green-light text-primary">
            <Sprout className="h-6 w-6" />
          </div>
          <p className="font-display text-lg font-bold text-white">Semilla</p>
          <p>Proyecto de Emprendimiento Social Sostenible</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
