import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, Calculator, Trophy, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReducedMotion } from "@/hooks/useReducedMotion";
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

  const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      className="dashboard-skin fixed bottom-0 left-1/2 z-50 -translate-x-1/2"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div
        className="flex items-end gap-1 px-3 py-2.5 backdrop-blur-xl md:gap-2 md:px-5 md:py-3"
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "2px solid var(--clay-soft)",
          borderRadius: "30px 60px 40px 50px / 50px 30px 60px 40px",
          boxShadow: "0 4px 20px rgba(244, 236, 225, 0.5)",
        }}
      >
        {DOCK_ITEMS.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
          const Icon = item.icon;

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-label={`Ir a ${item.label}`}
              aria-current={isActive ? "page" : undefined}
              whileHover={reduced ? undefined : { scale: 1.08 }}
              whileTap={reduced ? undefined : { scale: 0.96 }}
              transition={spring}
              className="relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center rounded-xl px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:px-3"
              style={{
                // @ts-ignore
                "--tw-ring-color": "var(--leaf-bright)",
              }}
            >
              <Icon
                className="h-5 w-5 transition-colors"
                style={{ color: isActive ? "var(--leaf-bright)" : "var(--leaf-muted)" }}
              />
              <span
                className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors"
                style={{ color: isActive ? "var(--leaf-bright)" : "var(--leaf-muted)" }}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="dock-dot"
                  className="absolute -bottom-0.5 h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--leaf-bright)" }}
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
