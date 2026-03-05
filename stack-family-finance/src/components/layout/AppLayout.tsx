import { Outlet, Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "@/lib/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { BottomTabs } from "./BottomTabs";

interface AppLayoutProps {
  requiredRole?: "PARENT" | "CHILD";
}

export function AppLayout({ requiredRole }: AppLayoutProps) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const role = getUserRole();
  if (requiredRole && role !== requiredRole) {
    const redirect = role === "PARENT" ? "/parent/dashboard" : "/child/dashboard";
    return <Navigate to={redirect} replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <header className="hidden md:flex h-14 items-center border-b px-4 bg-card">
            <SidebarTrigger />
          </header>
          <main className="flex-1 p-4 pb-20 md:pb-4 overflow-auto">
            <Outlet />
          </main>
        </div>
        <BottomTabs />
      </div>
    </SidebarProvider>
  );
}
