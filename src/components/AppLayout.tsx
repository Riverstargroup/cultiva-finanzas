import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import DockNav from "@/components/navigation/DockNav";
import SwipeNavigator from "@/components/navigation/SwipeNavigator";

interface AppLayoutProps {
  children?: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 pb-28 md:p-6 md:pb-28 lg:p-8 lg:pb-28">
        <SwipeNavigator>
          {children ?? <Outlet />}
        </SwipeNavigator>
      </main>
      <DockNav />
    </div>
  );
}
