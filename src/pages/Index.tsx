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
  Leaf } from
"lucide-react";
import { Button } from "@/components/ui/button";
import logoSemilla from "@/assets/logo-semilla.png";

// Configuracion de animacion para desvanecimiento y desplazamiento hacia arriba
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }
  })
};

// Propuestas de valor principales con metaforas de crecimiento
const valueProps = [
{
  icon: Sprout,
  title: "Raices Fuertes",
  desc: "Aprende desde la base con escenarios interactivos que simulan el ecosistema financiero real."
},
{
  icon: Sun,
  title: "Fotosintesis de Datos",
  desc: "Convierte informacion en energia. Graficos vivos que muestran como crecen tus ahorros."
},
{
  icon: Scissors,
  title: "Poda de Malos Habitos",
  desc: "Identifica y recorta gastos innecesarios para permitir que tus finanzas crezcan frondosas."
}];


// Pasos del ciclo de vida del usuario en la plataforma
const lifecycleCtx = [
{
  step: "1",
  title: "Siembra la Semilla",
  desc: "Registrate gratis. Crea tu cuenta en suelo fertil en menos de 1 minuto y accede a todos los modulos.",
  color: "bg-semilla-green-light"
},
{
  step: "2",
  title: "Riega con Conocimiento",
  desc: "Toma decisiones en simulaciones. Observa como el agua de tus elecciones nutre o seca tu jardin financiero.",
  color: "bg-semilla-gold"
},
{
  step: "3",
  title: "Cosecha Abundancia",
  desc: "Aplica lo aprendido. Desbloquea logros y disfruta de los frutos de una estabilidad financiera duradera.",
  color: "bg-purple-400"
}];


// Listado de caracteristicas tecnicas y herramientas
const features = [
{ icon: Sprout, title: "5 Escenarios Vivos", desc: "Simulaciones que respiran y cambian." },
{ icon: Calculator, title: "Calculadora de Cosecha", desc: "Proyecta el crecimiento de tus intereses." },
{ icon: Trophy, title: "Insignias Botanicas", desc: "Logros desbloqueables por cada meta." },
{ icon: Target, title: "Crecimiento Organico", desc: "Rutas de aprendizaje personalizadas." },
{ icon: Leaf, title: "Semillas Gratuitas", desc: "Contenido accesible para todos." },
{ icon: ShieldCheck, title: "Sin Maleza", desc: "Experiencia limpia sin anuncios." }];


const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-semilla-gold selection:text-primary">
      {/* Navegacion Principal */}
      <nav className="fixed top-0 z-50 w-full border-b border-primary/5 bg-background/95 backdrop-blur-md transition-all">
        <div className="container flex h-20 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-semilla-green to-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
              <Sprout className="h-6 w-6 text-semilla-gold" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-primary">Semilla</span>
          </Link>
          <div className="hidden gap-8 md:flex">
            {["Cursos", "Calculadora", "Comunidad"].map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden text-sm font-bold text-primary hover:underline underline-offset-4 transition-colors md:block">
              Entrar al jardin
            </Link>
            <Button className="rounded-full bg-primary px-6 py-5 font-bold text-white shadow-[0_5px_15px_-5px_rgba(20,83,45,0.4)] hover:bg-primary/90 hover:scale-105 transition-all">
              <Link to="/signup">Plantar mi futuro</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Seccion Hero: Introduccion y llamada a la accion principal */}
      <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-24 pb-32 md:pb-40 md:pt-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-semilla-green-light/20 via-background to-background opacity-100" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2548&auto=format&fit=crop')] opacity-5 mix-blend-overlay bg-cover bg-center" />
          <div className="absolute bottom-0 h-40 w-full bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto flex flex-col items-center text-center px-4 md:px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-semilla-green/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] md:h-24 md:w-24 md:rounded-3xl md:mb-8">

            <Sprout className="h-8 w-8 text-primary md:h-12 md:w-12" />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary md:mb-6 md:px-4 md:py-1.5 md:text-xs">

            Germinacion Digital
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-4 font-display text-5xl font-black leading-[1.05] tracking-tight text-primary md:mb-6 md:text-8xl lg:text-9xl">

            Semilla
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8 max-w-2xl text-base font-medium leading-relaxed text-foreground/80 md:mb-10 md:text-2xl">

            <span className="text-primary font-bold">Sembrando</span> habitos financieros saludables en tierra fertil.
            <br />
            <span className="mt-2 block text-sm font-normal text-muted-foreground md:mt-4 md:text-base">
              Cultiva tu conocimiento financiero de forma 100% gratuita y organica.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex w-full flex-col gap-3 px-4 sm:flex-row sm:justify-center sm:px-0 md:gap-4">

            <Button size="lg" asChild className="h-14 w-full rounded-full bg-primary px-8 text-lg font-bold text-white shadow-[0_10px_40px_-10px_rgba(20,83,45,0.4)] hover:bg-primary/90 hover:scale-105 transition-all duration-300 sm:w-auto md:h-16 md:px-10 md:text-xl">
              <Link to="/signup">Plantar mi futuro</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 w-full rounded-full border-primary/20 bg-white px-8 text-lg text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 sm:w-auto md:h-16 md:px-10 md:text-xl">
              <Link to="/login">Entrar al jardin</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Seccion de Filosofia y Propuestas de Valor */}
      <section className="relative z-20 -mt-10 pb-16 md:-mt-32 md:pb-40">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center md:mb-20">
            <motion.h2
              className="font-display text-3xl font-bold text-primary md:text-6xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}>

              Por que <span className="text-transparent bg-clip-text bg-gradient-to-r from-semilla-green to-semilla-gold ITALIC">florecer</span> aqui?
            </motion.h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {valueProps.map((item, i) =>
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-[1.5rem] border border-primary/5 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-semilla-gold/30 hover:shadow-xl md:rounded-[2rem] md:p-10 md:shadow-xl md:hover:shadow-2xl">

                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-semilla-green-light/20 text-primary ring-1 ring-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white md:mb-8 md:h-16 md:w-16 md:rounded-2xl`}>
                  <item.icon className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <h3 className="mb-2 font-display text-2xl font-bold text-primary md:mb-4 md:text-3xl">{item.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors md:text-lg">{item.desc}</p>

                {/* Grafico decorativo de fondo en las tarjetas */}
                <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-semilla-gold/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0 md:h-64 md:w-64 md:blur-3xl" />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Seccion de Ciclo de Vida: Pasos numerados con scroll horizontal/vertical */}
      <section className="bg-white py-20 relative overflow-hidden md:py-32">
        {/* Divisor organico superior */}
        <div className="absolute top-0 w-full overflow-hidden leading-none rotate-180">
          <svg className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
          </svg>
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="mb-16 text-center md:mb-24">
            <span className="text-semilla-earth font-bold tracking-widest uppercase text-xs mb-3 block md:text-sm md:mb-4">Tu Camino</span>
            <h2 className="font-display text-4xl font-bold text-primary md:text-7xl">Ciclo de Vida</h2>
          </div>

          <div className="relative space-y-12 md:space-y-20">
            {/* Linea conectora para escritorio */}
            <div className="absolute left-[24px] top-0 h-full w-[2px] bg-gradient-to-b from-semilla-green/10 via-semilla-gold to-semilla-green/10 md:left-1/2 md:w-[3px] md:-ml-[1.5px]" />

            {lifecycleCtx.map((step, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className={`relative flex flex-col gap-6 md:flex-row md:gap-8 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>

                {/* Contenido del paso */}
                <div className="flex-1 pl-16 md:pl-0 md:text-right">
                  <div className={`group rounded-[2rem] bg-background p-6 shadow-lg border border-border/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl md:p-10 ${i % 2 === 0 ? "md:mr-20" : "md:ml-20 md:text-left"}`}>
                    <h3 className={`mb-2 font-display text-2xl font-bold md:mb-4 md:text-3xl ${i % 2 === 0 ? "text-primary" : "text-semilla-earth"}`}>
                      {step.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed md:text-xl">{step.desc}</p>
                  </div>
                </div>

                {/* Marcador circular del paso */}
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border-[4px] border-white bg-primary shadow-xl z-10 md:relative md:top-10 md:h-16 md:w-16 md:border-[6px] md:-translate-y-1/2 transform transition-transform group-hover:scale-110">
                  <span className="font-display text-xl font-bold text-white md:text-2xl">{step.step}</span>
                </div>

                {/* Espaciador para balancear la cuadricula en escritorio */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Cuadricula de Funciones: Detalle de herramientas disponibles */}
      <section className="bg-primary py-20 text-white relative md:py-32">
        <div className="absolute top-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 120L0 16.48V0h1200v120z" className="fill-white"></path>
          </svg>
        </div>

        <div className="container relative z-20 font-sans px-4 md:px-6">
          <div className="mb-12 text-center md:mb-20">
            <h2 className="font-display text-4xl font-bold mb-4 md:text-6xl md:mb-6">
              Tu Invernadero <span className="text-semilla-gold italic">Personal</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto md:text-xl">
              Herramientas diseñadas para nutrir tu economia, sin distracciones ni complejidades innecesarias.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {features.map((f, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col items-start gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:border-semilla-gold/40 md:rounded-[2rem] md:p-8">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-semilla-gold group-hover:bg-semilla-gold group-hover:text-primary transition-colors md:h-12 md:w-12 md:rounded-2xl">
                  <f.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-white mb-1 md:text-2xl md:mb-2">{f.title}</h4>
                  <p className="text-sm text-white/70 leading-relaxed md:text-base">{f.desc}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Seccion Final: Llamada a la accion y cierre */}
      <section className="relative overflow-hidden py-24 border-t border-white/5 bg-primary md:py-40">
        <div className="container relative z-10 flex flex-col items-center text-center px-4 md:px-6">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-semilla-gold text-primary shadow-[0_20px_60px_-15px_rgba(234,179,8,0.5)] transform rotate-6 hover:rotate-12 transition-transform duration-500 md:mb-10 md:h-24 md:w-24">
            <Sprout className="h-8 w-8 md:h-12 md:w-12" />
          </div>
          <h2 className="mb-6 font-display text-4xl font-bold text-white md:mb-8 md:text-8xl">
            Listo para <br /> ver <span className="italic text-semilla-gold">brotar</span> tus finanzas?
          </h2>
          <p className="mb-10 max-w-lg text-lg text-white/60 font-light md:mb-14 md:text-2xl">
            Únete a un bosque de personas que están cultivando su libertad hoy mismo.
          </p>
          <Button size="lg" className="h-16 rounded-full bg-semilla-gold px-8 text-xl font-bold text-primary shadow-[0_10px_50px_-10px_rgba(234,179,8,0.5)] hover:bg-white hover:scale-105 transition-all duration-300 md:h-20 md:px-12 md:text-2xl">
            <Link to="/signup">Plantar mi primera semilla</Link>
          </Button>

          {/* Creditos y etiquetas secundarias */}
          <div className="mt-16 flex flex-col gap-3 text-[10px] font-bold uppercase tracking-widest text-white/30 md:mt-24 md:flex-row md:gap-6 md:text-xs">
            <span>. Proyecto Enactus Mexico .</span>
            <span className="hidden md:block">.</span>
            <span>100% Organico .</span>
            <span className="hidden md:block">.</span>
            <span>Crecimiento Real .</span>
          </div>
        </div>
      </section>

      {/* Pie de pagina simplificado */}
      <footer className="bg-[#051109] py-12 text-center text-white/40 text-xs md:py-16 md:text-sm">
        <div className="container flex flex-col items-center gap-6 md:gap-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-semilla-green-light grayscale hover:grayscale-0 transition-all md:h-14 md:w-14">
            <Sprout className="h-6 w-6 md:h-7 md:w-7" />
          </div>
          <div className="flex gap-6 md:gap-8">
            <a href="#" className="hover:text-white transition-colors">Terminos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
          <div>
            <p className="font-display text-base font-bold text-white/50 mb-1 md:text-lg">Semilla</p>
            <p>Proyecto de Emprendimiento Social Sostenible &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>);

};

export default Index;