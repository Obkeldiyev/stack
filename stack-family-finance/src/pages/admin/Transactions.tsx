import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/lib/api";
import { clearAuth, getUser } from "@/lib/auth";
import { toast } from "sonner";
import "../Landing.css";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      toast.error("Access denied");
      navigate("/admin/login");
      return;
    }
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await adminApi.getAllTransactions();
      setTransactions(data);
    } catch (error: any) {
      toast.error("Failed to load transactions");
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
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
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
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin/transactions"); }} style={{ color: "white" }}>Transactions</a>
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
        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-exchange-alt"></i>
                Transaction Management
              </div>
              <h2>All Transactions</h2>
              <p>Monitor all financial transactions across the platform.</p>
            </div>

            <div className="glass" style={{ padding: "32px", borderRadius: "28px" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      <th style={{ padding: "16px", textAlign: "left", color: "#dce8ff" }}>ID</th>
                      <th style={{ padding: "16px", textAlign: "left", color: "#dce8ff" }}>Type</th>
                      <th style={{ padding: "16px", textAlign: "left", color: "#dce8ff" }}>Amount</th>
                      <th style={{ padding: "16px", textAlign: "left", color: "#dce8ff" }}>Account</th>
                      <th style={{ padding: "16px", textAlign: "left", color: "#dce8ff" }}>Note</th>
                      <th style={{ padding: "16px", textAlign: "left", color: "#dce8ff" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#a5b7d0" }}>
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr key={tx.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "16px", color: "#a5b7d0" }}>{tx.id}</td>
                          <td style={{ padding: "16px" }}>
                            <span style={{
                              padding: "6px 12px",
                              borderRadius: "999px",
                              fontSize: "0.85rem",
                              background: tx.type === "DEPOSIT" ? "rgba(100,255,150,0.2)" : tx.type === "WITHDRAWAL" ? "rgba(255,100,100,0.2)" : "rgba(100,200,255,0.2)",
                              border: "1px solid rgba(255,255,255,0.1)"
                            }}>
                              {tx.type}
                            </span>
                          </td>
                          <td style={{ 
                            padding: "16px", 
                            color: tx.type === "DEPOSIT" ? "#70cf42" : tx.type === "WITHDRAWAL" ? "#ff6b6b" : "white",
                            fontWeight: "600"
                          }}>
                            {formatAmount(tx.amount)}
                          </td>
                          <td style={{ padding: "16px", color: "white" }}>
                            Account #{tx.accountId}
                          </td>
                          <td style={{ padding: "16px", color: "#a5b7d0", maxWidth: "200px" }}>
                            {tx.note || "-"}
                          </td>
                          <td style={{ padding: "16px", color: "#a5b7d0", fontSize: "0.9rem" }}>
                            {formatDate(tx.createdAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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
