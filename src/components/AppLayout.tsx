import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import DockNav from "@/components/navigation/DockNav";
import SwipeNavigator from "@/components/navigation/SwipeNavigator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sprout } from "lucide-react";

export default function AppLayout() {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar: visible on desktop, Sheet/Drawer on mobile via shadcn default */}
        <AppSidebar />

        <main className="flex-1">
          <header className="flex h-14 items-center border-b border-border px-4">
            {isMobile ? (
              <>
                <SidebarTrigger />
                <div className="flex flex-1 items-center justify-center gap-2">
                  <Sprout className="h-5 w-5 text-primary" />
                  <span className="font-display text-lg font-bold text-primary">
                    Semilla
                  </span>
                </div>
                {/* Spacer to balance hamburger */}
                <div className="w-10" />
              </>
            ) : (
              <SidebarTrigger />
            )}
          </header>

          <div className="p-4 pb-28 md:p-6 md:pb-28 lg:p-8 lg:pb-28">
            <SwipeNavigator>
              <Outlet />
            </SwipeNavigator>
          </div>
        </main>

        <DockNav />
      </div>
    </SidebarProvider>
  );
}
