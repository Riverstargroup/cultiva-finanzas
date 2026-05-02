import { motion } from "framer-motion";
import { Sprout, BookOpen, User, Gamepad2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { LucideIcon } from "lucide-react";

interface DockItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const DOCK_ITEMS: DockItem[] = [
  { path: "/perfil", label: "Perfil", icon: User },
  { path: "/", label: "Sendero", icon: Sprout },
  { path: "/cursos", label: "Cursos", icon: BookOpen },
  { path: "/juegos", label: "Juegos", icon: Gamepad2 },
];

export default function DockNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

  return (
    <nav
      role="navigation"
      aria-label="Navegacion principal"
      className="dashboard-skin fixed bottom-0 left-1/2 z-50 w-[min(96vw,34rem)] -translate-x-1/2 px-2"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="world-dock flex items-end justify-between gap-1 px-2 py-2.5 backdrop-blur-xl md:gap-2 md:px-4 md:py-3">
        {DOCK_ITEMS.map((item) => {
          const isActive =
            item.path === "/"
              ? pathname === "/"
              : pathname === item.path || pathname.startsWith(item.path + "/");
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
              className="relative flex min-h-[48px] min-w-[58px] flex-1 flex-col items-center justify-center rounded-2xl px-2 py-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 md:min-w-[72px] md:px-3"
              style={{
                background: isActive ? "rgba(152, 198, 106, 0.18)" : "transparent",
                // @ts-expect-error CSS custom property
                "--tw-ring-color": "var(--leaf-bright)",
              }}
            >
              <Icon
                className="h-5 w-5 transition-colors"
                style={{ color: isActive ? "var(--forest-deep)" : "var(--leaf-muted)" }}
              />
              <span
                className="mt-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors"
                style={{ color: isActive ? "var(--forest-deep)" : "var(--leaf-muted)" }}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="dock-dot"
                  className="absolute bottom-1 h-1.5 w-5 rounded-full"
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
