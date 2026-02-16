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
    color: "bg-purple-400"
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
      <nav className="fixed top-0 z-50 w-full border-b border-primary/5 bg-background/95 backdrop-blur-md transition-all">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-semilla-green to-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
              <Sprout className="h-6 w-6 text-semilla-gold" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-primary">Semilla</span>
          </Link>
          <div className="hidden gap-8 md:flex">
            {["Cursos", "Calculadora", "Comunidad"].map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-primary hover:underline underline-offset-4 transition-colors">
              Entrar al jardín
            </Link>
            <Button className="rounded-full bg-primary px-6 py-5 font-bold text-white shadow-[0_5px_15px_-5px_rgba(20,83,45,0.4)] hover:bg-primary/90 hover:scale-105 transition-all">
              <Link to="/signup">Plantar mi futuro</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-semilla-green-light/20 via-background to-background opacity-100" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2548&auto=format&fit=crop')] opacity-5 mix-blend-overlay bg-cover bg-center" />
          <div className="absolute bottom-0 h-40 w-full bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white border border-semilla-green/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]"
          >
            <Sprout className="h-12 w-12 text-primary" />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary"
          >
            Germinación Digital
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-6 font-display text-6xl font-black leading-[1.05] tracking-tight text-primary md:text-8xl lg:text-9xl"
          >
            Semilla
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-10 max-w-2xl text-lg font-medium leading-relaxed text-foreground/80 md:text-2xl"
          >
            <span className="text-primary font-bold">Sembrando</span> hábitos financieros saludables en tierra fértil.
            <br />
            <span className="mt-4 block text-base font-normal text-muted-foreground">
              Cultiva tu conocimiento financiero de forma 100% gratuita y orgánica.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Button size="lg" className="h-16 rounded-full bg-primary px-10 text-xl font-bold text-white shadow-[0_10px_40px_-10px_rgba(20,83,45,0.4)] hover:bg-primary/90 hover:scale-105 transition-all duration-300">
              <Link to="/signup">Plantar mi futuro</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 rounded-full border-primary/20 bg-white px-10 text-xl text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-300">
              <Link to="/login">Entrar al jardín</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Philosophy / Value Props */}
      <section className="relative z-20 -mt-32 pb-24 md:pb-40">
        <div className="container">
          <div className="mb-20 text-center">
            <motion.h2
              className="font-display text-4xl font-bold text-primary md:text-6xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              ¿Por qué <span className="text-transparent bg-clip-text bg-gradient-to-r from-semilla-green to-semilla-gold ITALIC">florecer</span> aquí?
            </motion.h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {valueProps.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-[2rem] border border-primary/5 bg-white p-10 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-semilla-gold/30 hover:shadow-2xl"
              >
                <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-semilla-green-light/20 text-primary ring-1 ring-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-4 font-display text-3xl font-bold text-primary">{item.title}</h3>
                <p className="text-lg leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">{item.desc}</p>

                {/* Decorative blob */}
                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-semilla-gold/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifecycle Steps - Light Theme Section */}
      <section className="bg-white py-32 relative overflow-hidden">
        {/* Organic shape divider top */}
        <div className="absolute top-0 w-full overflow-hidden leading-none rotate-180">
          <svg className="relative block w-[calc(100%+1.3px)] h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
          </svg>
        </div>

        <div className="container relative z-10">
          <div className="mb-24 text-center">
            <span className="text-semilla-earth font-bold tracking-widest uppercase text-sm mb-4 block">Tu Camino</span>
            <h2 className="font-display text-5xl font-bold text-primary md:text-7xl">Ciclo de Vida</h2>
          </div>

          <div className="relative space-y-20">
            {/* Connecting Line (Desktop) */}
            <div className="absolute left-[28px] top-0 h-full w-[3px] bg-gradient-to-b from-semilla-green/10 via-semilla-gold to-semilla-green/10 md:left-1/2 md:-ml-[1.5px]" />

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
                  <div className={`group rounded-[2.5rem] bg-background p-10 shadow-xl border border-border/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${i % 2 === 0 ? "md:mr-20" : "md:ml-20 md:text-left"}`}>
                    <h3 className={`mb-4 font-display text-3xl font-bold ${i % 2 === 0 ? "text-primary" : "text-semilla-earth"}`}>
                      {step.title}
                    </h3>
                    <p className="text-xl text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                {/* Marker */}
                <div className="absolute left-0 top-10 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full border-[6px] border-white bg-primary shadow-2xl z-10 md:relative md:left-auto md:top-auto md:translate-y-0 transform transition-transform group-hover:scale-110">
                  <span className="font-display text-2xl font-bold text-white">{step.step}</span>
                </div>

                {/* Spacer for layout balance */}
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid: "Invernadero" */}
      <section className="bg-primary py-32 text-white relative">
        <div className="absolute top-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-[calc(100%+1.3px)] h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 120L0 16.48V0h1200v120z" className="fill-white"></path>
          </svg>
        </div>

        <div className="container relative z-20 font-sans">
          <div className="mb-20 text-center">
            <h2 className="font-display text-5xl font-bold md:text-6xl mb-6">
              Tu Invernadero <span className="text-semilla-gold italic">Personal</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Herramientas diseñadas para nutrir tu economía, sin distracciones ni complejidades innecesarias.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col items-start gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all hover:bg-white/10 hover:border-semilla-gold/40"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-semilla-gold group-hover:bg-semilla-gold group-hover:text-primary transition-colors">
                  <f.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-display text-2xl font-bold text-white mb-2">{f.title}</h4>
                  <p className="text-base text-white/70 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative overflow-hidden py-40 border-t border-white/5 bg-primary">
        <div className="container relative z-10 flex flex-col items-center text-center">
          <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-semilla-gold text-primary shadow-[0_20px_60px_-15px_rgba(234,179,8,0.5)] transform rotate-6 hover:rotate-12 transition-transform duration-500">
            <Sprout className="h-12 w-12" />
          </div>
          <h2 className="mb-8 font-display text-6xl font-bold text-white md:text-8xl">
            ¿Listo para <br /> ver <span className="italic text-semilla-gold">brotar</span> tus finanzas?
          </h2>
          <p className="mb-14 max-w-lg text-2xl text-white/60 font-light">
            Únete a un bosque de personas que están cultivando su libertad hoy mismo.
          </p>
          <Button size="lg" className="h-20 rounded-full bg-semilla-gold px-12 text-2xl font-bold text-primary shadow-[0_10px_50px_-10px_rgba(234,179,8,0.5)] hover:bg-white hover:scale-105 transition-all duration-300">
            <Link to="/signup">Plantar mi primera semilla</Link>
          </Button>

          <div className="mt-24 flex flex-col md:flex-row items-center gap-6 text-xs font-bold uppercase tracking-widest text-white/30">
            <span>• Proyecto Enactus México •</span>
            <span className="hidden md:block">•</span>
            <span>100% Orgánico •</span>
            <span className="hidden md:block">•</span>
            <span>Crecimiento Real •</span>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-[#051109] py-16 text-center text-white/40 text-sm">
        <div className="container flex flex-col items-center gap-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-semilla-green-light grayscale hover:grayscale-0 transition-all">
            <Sprout className="h-7 w-7" />
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-white/50 mb-1">Semilla</p>
            <p>Proyecto de Emprendimiento Social Sostenible &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
