import { useState } from "react";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import DockNav from "@/components/navigation/DockNav";
import SwipeNavigator from "@/components/navigation/SwipeNavigator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSenderoProgress } from "@/features/sendero/useSenderoProgress";
import nopalitoIdle from "@/assets/pixel/optimized/plantamigo-nopalito-idle.webp";

interface AppLayoutProps {
  children?: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [nopalitoOpen, setNopalitoOpen] = useState(false);
  const sendero = useSenderoProgress();

  const currentNode = sendero.nodes.find(
    (n) => n.status === "next" || n.status === "available"
  ) ?? sendero.nodes[0];

  const nopalitoMessage = currentNode
    ? `Estás en "${currentNode.title}". ${currentNode.description}`
    : "¡Bienvenido al Sendero Semilla! Toca el primer nodo para comenzar tu viaje.";

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 pb-24 md:p-6 md:pb-24 lg:p-8 lg:pb-24">
        <SwipeNavigator>
          {children ?? <Outlet />}
        </SwipeNavigator>
      </main>

      <DockNav />

      {/* Botón flotante Nopalito — guía global en todas las páginas */}
      <button
        onClick={() => setNopalitoOpen(true)}
        className="fixed z-40 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 5.5rem)",
          right: "1rem",
          background: "transparent",
          border: "none",
          padding: 0,
        }}
        aria-label="Hablar con Nopalito"
      >
        <img
          src={nopalitoIdle}
          alt="Nopalito"
          style={{ width: 52, height: 52, imageRendering: "pixelated" }}
        />
      </button>

      {/* Sheet de Nopalito — mensaje contextual del sendero */}
      <Sheet open={nopalitoOpen} onOpenChange={setNopalitoOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-safe">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={nopalitoIdle}
                alt="Nopalito"
                style={{ width: 48, height: 48, imageRendering: "pixelated" }}
              />
              <SheetTitle
                className="font-heading text-xl"
                style={{ color: "var(--forest-deep)" }}
              >
                Nopalito
              </SheetTitle>
            </div>
            <p className="text-sm" style={{ color: "var(--text-warm)" }}>
              {nopalitoMessage}
            </p>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
