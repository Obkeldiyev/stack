import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "@/lib/auth";
import { toast } from "sonner";

interface AdminShellProps {
  title: string;
  subtitle: string;
  active: "dashboard" | "users" | "games" | "transactions" | "families";
  children: ReactNode;
}

const navItems = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { key: "users", label: "Users", path: "/admin/users" },
  { key: "games", label: "Games", path: "/admin/games" },
  { key: "transactions", label: "Transactions", path: "/admin/transactions" },
  { key: "families", label: "Families", path: "/admin/families" },
] as const;

export function AdminShell({ title, subtitle, active, children }: AdminShellProps) {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      toast.error("Admin access required.");
      navigate("/admin/login", { replace: true });
    }
  }, [navigate, user]);

  const logout = () => {
    clearAuth();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container dashboard-stack">
        <section className="dashboard-hero">
          <div className="section-title" style={{ alignItems: "start" }}>
            <div>
              <div className="dashboard-eyebrow">
                <i className="fa-solid fa-shield-halved"></i>
                Admin control
              </div>
              <h1 className="dashboard-title" style={{ marginBottom: "12px" }}>{title}</h1>
              <p className="dashboard-copy">{subtitle}</p>
            </div>
            <div className="button-row" style={{ justifyContent: "flex-end" }}>
              <span className="pill">
                <i className="fa-solid fa-user-shield"></i>
                {user?.username ?? "Admin"}
              </span>
              <button className="btn btn-outline" onClick={logout}>Logout</button>
            </div>
          </div>

          <div className="button-row">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={active === item.key ? "btn btn-primary" : "btn btn-outline"}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {children}
      </div>
    </div>
  );
}
