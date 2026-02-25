import { Outlet, useLocation } from "react-router-dom";
import DockNav from "@/components/navigation/DockNav";
import SwipeNavigator from "@/components/navigation/SwipeNavigator";
import { Sprout } from "lucide-react";

export default function AppLayout() {
  const { pathname } = useLocation();
  const showHeader = pathname !== "/dashboard";

  return (
    <div className="flex min-h-screen w-full flex-col">
      {showHeader && (
        <header className="flex h-14 items-center border-b border-border px-4">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold text-primary">
              Semilla
            </span>
          </div>
        </header>
      )}

      <main className="flex-1 p-4 pb-28 md:p-6 md:pb-28 lg:p-8 lg:pb-28">
        <SwipeNavigator>
          <Outlet />
        </SwipeNavigator>
      </main>

      <DockNav />
    </div>
  );
}
