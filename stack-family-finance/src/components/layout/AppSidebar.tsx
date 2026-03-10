import { LayoutDashboard, Users, Gamepad2, Settings, LogOut, CheckSquare } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserRole, clearAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const parentItems = [
  { title: "Dashboard", path: "/parent/dashboard", icon: LayoutDashboard },
  { title: "Family", path: "/parent/family", icon: Users },
  { title: "Tasks", path: "/parent/tasks", icon: CheckSquare },
  { title: "Settings", path: "/settings", icon: Settings },
];

const childItems = [
  { title: "Dashboard", path: "/child/dashboard", icon: LayoutDashboard },
  { title: "Family", path: "/child/family", icon: Users },
  { title: "Tasks", path: "/child/tasks", icon: CheckSquare },
  { title: "Games", path: "/child/games", icon: Gamepad2 },
  { title: "Settings", path: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = getUserRole();
  const items = role === "PARENT" ? parentItems : childItems;

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <Sidebar 
      collapsible="icon" 
      style={{
        background: "linear-gradient(180deg, rgba(6, 16, 29, 0.95) 0%, rgba(10, 23, 48, 0.95) 100%)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderLeft: "none"
      }}
    >
      <SidebarHeader className="p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div 
            className="h-8 w-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1d64d6 0%, #19c7d8 60%, #70cf42 100%)",
              boxShadow: "0 4px 12px rgba(25, 120, 220, 0.3)"
            }}
          >
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-lg group-data-[collapsible=icon]:hidden" style={{ color: "#f4f8ff" }}>
            STACK
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel style={{ color: "#a5b7d0", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
            {role === "PARENT" ? "PARENT" : "CHILD"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = location.pathname.startsWith(item.path);
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={active}
                      onClick={() => navigate(item.path)}
                      className={cn("min-h-[44px] transition-all duration-200")}
                      style={{
                        color: active ? "#86f0ff" : "#a5b7d0",
                        background: active 
                          ? "linear-gradient(135deg, rgba(29,100,214,0.2), rgba(25,199,216,0.15))" 
                          : "transparent",
                        border: active ? "1px solid rgba(134, 240, 255, 0.3)" : "1px solid transparent",
                        borderRadius: "12px",
                        margin: "2px 0"
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                          e.currentTarget.style.color = "#dce8ff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#a5b7d0";
                        }
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              className="min-h-[44px] transition-all duration-200"
              style={{
                color: "#ff6b6b",
                borderRadius: "12px",
                margin: "2px 0"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 107, 107, 0.1)";
                e.currentTarget.style.borderColor = "rgba(255, 107, 107, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
