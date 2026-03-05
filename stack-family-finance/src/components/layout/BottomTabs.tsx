import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Gamepad2, Settings } from "lucide-react";
import { getUserRole } from "@/lib/auth";
import { cn } from "@/lib/utils";

const parentTabs = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/parent/dashboard" },
  { label: "Family", icon: Users, path: "/parent/family" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const childTabs = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/child/dashboard" },
  { label: "Family", icon: Users, path: "/child/family" },
  { label: "Games", icon: Gamepad2, path: "/child/games" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export function BottomTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = getUserRole();
  const tabs = role === "PARENT" ? parentTabs : childTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card safe-bottom md:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = location.pathname.startsWith(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full min-h-[44px] transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
