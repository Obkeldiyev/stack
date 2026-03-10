import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/lib/api";
import { clearAuth, getUser } from "@/lib/auth";
import { toast } from "sonner";
import "../Landing.css";

export default function AdminFamilies() {
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      toast.error("Access denied");
      navigate("/admin/login");
      return;
    }
    loadFamilies();
  }, []);

  const loadFamilies = async () => {
    try {
      const data = await adminApi.getAllFamilies();
      setFamilies(data);
    } catch (error: any) {
      toast.error("Failed to load families");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin/families"); }} style={{ color: "white" }}>Families</a>
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
        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-house-user"></i>
                Family Management
              </div>
              <h2>All Families</h2>
              <p>View all registered families and their information.</p>
            </div>

            <div className="feature-grid">
              {families.length === 0 ? (
                <div className="glass" style={{ padding: "48px", borderRadius: "28px", gridColumn: "1 / -1", textAlign: "center" }}>
                  <i className="fa-solid fa-house-user" style={{ fontSize: "3rem", color: "#86f0ff", marginBottom: "16px", display: "block" }}></i>
                  <h3 style={{ marginBottom: "12px" }}>No Families Found</h3>
                  <p style={{ color: "#a5b7d0", margin: 0 }}>No families have been created yet.</p>
                </div>
              ) : (
                families.map((family) => (
                  <div key={family.id} className="feature-card glass reveal up">
                    <div className="icon-box">
                      <i className="fa-solid fa-house-user"></i>
                    </div>
                    <h3>{family.title}</h3>
                    <div style={{ marginTop: "16px", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span style={{ color: "#a5b7d0", fontSize: "0.9rem" }}>Family ID:</span>
                        <span style={{ color: "white", fontWeight: "600" }}>#{family.id}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span style={{ color: "#a5b7d0", fontSize: "0.9rem" }}>Created By:</span>
                        <span style={{ color: "white", fontWeight: "600" }}>User #{family.createdBy}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#a5b7d0", fontSize: "0.9rem" }}>Created:</span>
                        <span style={{ color: "#a5b7d0", fontSize: "0.9rem" }}>{formatDate(family.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

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
