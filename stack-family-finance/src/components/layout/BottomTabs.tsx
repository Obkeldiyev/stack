import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Gamepad2, Settings, CheckSquare } from "lucide-react";
import { getUserRole } from "@/lib/auth";
import { cn } from "@/lib/utils";

const parentTabs = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/parent/dashboard" },
  { label: "Family", icon: Users, path: "/parent/family" },
  { label: "Tasks", icon: CheckSquare, path: "/parent/tasks" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const childTabs = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/child/dashboard" },
  { label: "Family", icon: Users, path: "/child/family" },
  { label: "Tasks", icon: CheckSquare, path: "/child/tasks" },
  { label: "Games", icon: Gamepad2, path: "/child/games" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export function BottomTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = getUserRole();
  const tabs = role === "PARENT" ? parentTabs : childTabs;

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom md:hidden"
      style={{
        background: "linear-gradient(180deg, rgba(6, 16, 29, 0.95) 0%, rgba(10, 23, 48, 0.95) 100%)",
        backdropFilter: "blur(18px)",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.3)"
      }}
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = location.pathname.startsWith(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full min-h-[44px] transition-all duration-200 relative"
              )}
              style={{
                color: active ? "#86f0ff" : "#a5b7d0"
              }}
              onTouchStart={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }
              }}
              onTouchEnd={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {active && (
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #1d64d6, #19c7d8, #70cf42)"
                  }}
                />
              )}
              <tab.icon className="h-5 w-5" />
              <span 
                className="text-[10px] font-medium"
                style={{
                  fontWeight: active ? "600" : "500"
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
