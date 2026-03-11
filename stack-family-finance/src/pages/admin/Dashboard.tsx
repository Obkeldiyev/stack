import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/lib/api";
import { AdminShell } from "@/components/admin/AdminShell";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    void loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setStats(await adminApi.getStats());
    } catch (error: any) {
      toast.error(error.message || "Failed to load admin stats");
    }
  };

  return (
    <AdminShell
      active="dashboard"
      title="Admin dashboard"
      subtitle="System-level visibility for users, families, games, and transactions without exposing admin entry points on the public marketing pages."
    >
      <section className="dashboard-grid stats">
        <div className="panel-card stat-card"><div className="stat-icon"><i className="fa-solid fa-users"></i></div><div className="stat-value">{stats?.totalUsers ?? 0}</div><div className="stat-label">All user accounts across roles.</div></div>
        <div className="panel-card stat-card"><div className="stat-icon"><i className="fa-solid fa-user-tie"></i></div><div className="stat-value">{stats?.totalParents ?? 0}</div><div className="stat-label">Parents with dashboard access.</div></div>
        <div className="panel-card stat-card"><div className="stat-icon"><i className="fa-solid fa-child-reaching"></i></div><div className="stat-value">{stats?.totalChildren ?? 0}</div><div className="stat-label">Children actively managed in the system.</div></div>
      </section>

      <section className="dashboard-grid stats">
        <div className="panel-card stat-card"><div className="stat-icon"><i className="fa-solid fa-users-between-lines"></i></div><div className="stat-value">{stats?.totalFamilies ?? 0}</div><div className="stat-label">Families currently configured.</div></div>
        <div className="panel-card stat-card"><div className="stat-icon"><i className="fa-solid fa-gamepad"></i></div><div className="stat-value">{stats?.totalGames ?? 0}</div><div className="stat-label">Games available to children.</div></div>
        <div className="panel-card stat-card"><div className="stat-icon"><i className="fa-solid fa-money-bill-transfer"></i></div><div className="stat-value">{stats?.totalTransactions ?? 0}</div><div className="stat-label">Financial events stored in the ledger.</div></div>
      </section>

      <section className="dashboard-grid two-up">
        <button className="panel-card action-card" onClick={() => navigate("/admin/users")}>
          <div className="stat-icon"><i className="fa-solid fa-user-pen"></i></div>
          <div className="section-heading">Manage users</div>
          <p className="section-subtitle">Edit usernames, roles, and account access.</p>
        </button>
        <button className="panel-card action-card" onClick={() => navigate("/admin/games")}>
          <div className="stat-icon"><i className="fa-solid fa-puzzle-piece"></i></div>
          <div className="section-heading">Manage games</div>
          <p className="section-subtitle">Create and configure games and rewards.</p>
        </button>
      </section>
    </AdminShell>
  );
}
