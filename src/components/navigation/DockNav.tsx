import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, Calculator, Trophy, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/use-mobile";
import { SECTION_ORDER } from "@/hooks/useSectionNavigation";
import type { LucideIcon } from "lucide-react";

interface DockItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const DOCK_ITEMS: DockItem[] = [
  { path: SECTION_ORDER[0], label: "Inicio", icon: LayoutDashboard },
  { path: SECTION_ORDER[1], label: "Cursos", icon: BookOpen },
  { path: SECTION_ORDER[2], label: "Calculadora", icon: Calculator },
  { path: SECTION_ORDER[3], label: "Logros", icon: Trophy },
  { path: SECTION_ORDER[4], label: "Perfil", icon: User },
];

export default function DockNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      className="fixed bottom-0 left-1/2 z-50 -translate-x-1/2"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-end gap-1 rounded-2xl border border-border/50 bg-background/80 px-2 py-2 shadow-2xl backdrop-blur-xl md:gap-2 md:px-4 md:py-3">
        {DOCK_ITEMS.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
          const Icon = item.icon;

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-label={`Ir a ${item.label}`}
              aria-current={isActive ? "page" : undefined}
              whileHover={reduced || isMobile ? undefined : { scale: 1.08 }}
              whileTap={reduced ? undefined : { scale: 0.96 }}
              transition={spring}
              className="relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center rounded-xl px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:px-3"
            >
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              {!isMobile && (
                <span
                  className={`mt-0.5 text-[11px] font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="dock-pill"
                  className="absolute -bottom-0.5 h-1 w-8 rounded-full bg-primary"
                  transition={reduced ? { duration: 0.15 } : spring}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
