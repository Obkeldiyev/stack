import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { initTheme } from "@/lib/theme";
import { isAuthenticated, getUserRole } from "@/lib/auth";
import { AppLayout } from "@/components/layout/AppLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ParentBankingDashboard from "@/pages/parent/BankingDashboard";
import ParentFamily from "@/pages/parent/Family";
import ParentTasks from "@/pages/parent/Tasks";
import ChildBankingDashboard from "@/pages/child/BankingDashboard";
import ChildFamily from "@/pages/child/Family";
import ChildTasks from "@/pages/child/Tasks";
import Games from "@/pages/child/Games";
import GamePlay from "@/pages/child/GamePlay";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminGames from "@/pages/admin/Games";
import AdminTransactions from "@/pages/admin/Transactions";
import AdminFamilies from "@/pages/admin/Families";
import About from "@/pages/About";
import Features from "@/pages/Features";
import Developers from "@/pages/Developers";
import Privacy from "@/pages/Privacy";
import Documentation from "@/pages/Documentation";
import Integration from "@/pages/Integration";
import Presentation from "@/pages/Presentation";
import "@/styles/dashboard.css";

const queryClient = new QueryClient();

// Detect if running in Electron or Capacitor
function isNativeApp() {
  // Check for Electron
  if (window.navigator.userAgent.toLowerCase().includes('electron')) {
    return true;
  }
  
  // Check for Capacitor
  if ((window as any).Capacitor) {
    return true;
  }
  
  return false;
}

function RootRedirect() {
  // If native app (Electron/Capacitor), go to login
  if (isNativeApp()) {
    if (!isAuthenticated()) return <Navigate to="/login" replace />;
    const role = getUserRole();
    return <Navigate to={role === "PARENT" ? "/parent/dashboard" : "/child/dashboard"} replace />;
  }
  
  // If web browser, show landing page
  return <Navigate to="/landing" replace />;
}

const App = () => {
  useEffect(() => { initTheme(); }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Parent routes */}
            <Route element={<AppLayout requiredRole="PARENT" />}>
              <Route path="/parent/dashboard" element={<ParentBankingDashboard />} />
              <Route path="/parent/family" element={<ParentFamily />} />
              <Route path="/parent/tasks" element={<ParentTasks />} />
            </Route>

            {/* Child routes */}
            <Route element={<AppLayout requiredRole="CHILD" />}>
              <Route path="/child/dashboard" element={<ChildBankingDashboard />} />
              <Route path="/child/family" element={<ChildFamily />} />
              <Route path="/child/tasks" element={<ChildTasks />} />
              <Route path="/child/games" element={<Games />} />
              <Route path="/child/games/:code" element={<GamePlay />} />
            </Route>

            {/* Shared routes */}
            <Route element={<AppLayout />}>
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Admin routes - No layout, standalone pages */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/games" element={<AdminGames />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
            <Route path="/admin/families" element={<AdminFamilies />} />

            {/* Presentation pages - No layout, standalone pages */}
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/integration" element={<Integration />} />
            <Route path="/presentation" element={<Presentation />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
