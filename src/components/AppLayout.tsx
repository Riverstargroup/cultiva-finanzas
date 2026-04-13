import { Outlet } from "react-router-dom";
import DockNav from "@/components/navigation/DockNav";
import SwipeNavigator from "@/components/navigation/SwipeNavigator";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 pb-28 md:p-6 md:pb-28 lg:p-8 lg:pb-28">
        <SwipeNavigator>
          <Outlet />
        </SwipeNavigator>
      </main>
      <DockNav />
    </div>
  );
}
