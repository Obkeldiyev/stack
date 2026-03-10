import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/lib/api";
import { clearAuth, getUser } from "@/lib/auth";
import { toast } from "sonner";
import "../Landing.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== "ADMIN") {
      toast.error("Access denied");
      navigate("/admin/login");
      return;
    }

    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminApi.getStats();
      setStats(data);
    } catch (error: any) {
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="landing-page">
        <div className="bg-noise"></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#86f0ff" }}></i>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>

      {/* Header */}
      <header className="header">
        <div className="container nav">
          <div className="brand">
            <img src="/logo.png" alt="Stack logo" />
            <span>Stack Admin</span>
          </div>

          <nav className="desktop-nav">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin/dashboard"); }}>Dashboard</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin/users"); }}>Users</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin/games"); }}>Games</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin/transactions"); }}>Transactions</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin/families"); }}>Families</a>
          </nav>

          <div className="nav-actions">
            <button onClick={handleLogout} className="btn btn-outline">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Dashboard Section */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-chart-line"></i>
                System Overview
              </div>
              <h2>Admin Control Panel</h2>
              <p>
                Welcome back, {user?.username}. Monitor and manage all aspects of the Stack Kids Bank platform.
              </p>
            </div>

            {/* Statistics Grid */}
            <div className="feature-grid" style={{ marginBottom: "48px" }}>
              <div className="feature-card glass reveal left">
                <div className="icon-box">
                  <i className="fa-solid fa-users"></i>
                </div>
                <h3>{stats?.totalUsers || 0}</h3>
                <p>Total Users</p>
              </div>

              <div className="feature-card glass reveal up stagger-1">
                <div className="icon-box">
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <h3>{stats?.totalParents || 0}</h3>
                <p>Parents</p>
              </div>

              <div className="feature-card glass reveal right">
                <div className="icon-box">
                  <i className="fa-solid fa-child"></i>
                </div>
                <h3>{stats?.totalChildren || 0}</h3>
                <p>Children</p>
              </div>

              <div className="feature-card glass reveal left stagger-2">
                <div className="icon-box">
                  <i className="fa-solid fa-house-user"></i>
                </div>
                <h3>{stats?.totalFamilies || 0}</h3>
                <p>Families</p>
              </div>

              <div className="feature-card glass reveal up stagger-2">
                <div className="icon-box">
                  <i className="fa-solid fa-gamepad"></i>
                </div>
                <h3>{stats?.totalGames || 0}</h3>
                <p>Games</p>
              </div>

              <div className="feature-card glass reveal right stagger-2">
                <div className="icon-box">
                  <i className="fa-solid fa-exchange-alt"></i>
                </div>
                <h3>{stats?.totalTransactions || 0}</h3>
                <p>Transactions</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="section-head reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-bolt"></i>
                Quick Actions
              </div>
              <h2>Management Tools</h2>
            </div>

            <div className="journey-grid">
              <div 
                className="journey-card glass reveal left"
                onClick={() => navigate("/admin/users")}
                style={{ cursor: "pointer" }}
              >
                <span>01</span>
                <h3>Manage Users</h3>
                <p>View, edit, enable, disable, or delete user accounts. Control access and permissions.</p>
              </div>

              <div 
                className="journey-card glass reveal up"
                onClick={() => navigate("/admin/games")}
                style={{ cursor: "pointer" }}
              >
                <span>02</span>
                <h3>Manage Games</h3>
                <p>Create, update, or remove games. Configure rewards and game settings.</p>
              </div>

              <div 
                className="journey-card glass reveal right"
                onClick={() => navigate("/admin/transactions")}
                style={{ cursor: "pointer" }}
              >
                <span>03</span>
                <h3>View Transactions</h3>
                <p>Monitor all financial transactions across the platform for oversight and auditing.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-wrap">
          <div>
            <div className="brand footer-brand">
              <img src="/logo.png" alt="Stack logo" />
              <span>Stack</span>
            </div>
            <p>Kids banking made beautiful, safe, and meaningful.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
