import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { initTheme } from "@/lib/theme";
import { isAuthenticated, getUserRole } from "@/lib/auth";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ParentDashboard from "@/pages/parent/Dashboard";
import ParentFamily from "@/pages/parent/Family";
import ChildDashboard from "@/pages/child/Dashboard";
import ChildFamily from "@/pages/child/Family";
import Games from "@/pages/child/Games";
import GamePlay from "@/pages/child/GamePlay";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function RootRedirect() {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  const role = getUserRole();
  return <Navigate to={role === "PARENT" ? "/parent/dashboard" : "/child/dashboard"} replace />;
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Parent routes */}
            <Route element={<AppLayout requiredRole="PARENT" />}>
              <Route path="/parent/dashboard" element={<ParentDashboard />} />
              <Route path="/parent/family" element={<ParentFamily />} />
            </Route>

            {/* Child routes */}
            <Route element={<AppLayout requiredRole="CHILD" />}>
              <Route path="/child/dashboard" element={<ChildDashboard />} />
              <Route path="/child/family" element={<ChildFamily />} />
              <Route path="/child/games" element={<Games />} />
              <Route path="/child/games/:code" element={<GamePlay />} />
            </Route>

            {/* Shared routes */}
            <Route element={<AppLayout />}>
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
