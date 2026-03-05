import { LayoutDashboard, Users, Gamepad2, Settings, LogOut } from "lucide-react";
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
  { title: "Settings", path: "/settings", icon: Settings },
];

const childItems = [
  { title: "Dashboard", path: "/child/dashboard", icon: LayoutDashboard },
  { title: "Family", path: "/child/family", icon: Users },
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
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">STACK</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{role === "PARENT" ? "Parent" : "Child"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = location.pathname.startsWith(item.path);
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={active}
                      onClick={() => navigate(item.path)}
                      className={cn("min-h-[44px]", active && "bg-primary/10 text-primary")}
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
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="min-h-[44px] text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
