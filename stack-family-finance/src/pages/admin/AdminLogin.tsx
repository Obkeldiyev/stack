import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { toast } from "sonner";
import "../Landing.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response: any = await authApi.login({ username, password });
      
      if (response.token && response.user) {
        setAuth(response.token, response.user);
        
        // Check if user is admin
        if (response.user.role === "ADMIN") {
          toast.success("Welcome back, Admin!");
          navigate("/admin/dashboard");
        } else {
          toast.error("Access denied. Admin credentials required.");
          setLoading(false);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>

      {/* Header */}
      <header className="header">
        <div className="container nav">
          <a href="/" className="brand">
            <img src="/logo.png" alt="Stack logo" />
            <span>Stack Admin</span>
          </a>
        </div>
      </header>

      <main>
        {/* Admin Login Section */}
        <section className="hero">
          <div className="hero-bg-shape hero-shape-1 parallax" data-speed="0.18"></div>
          <div className="hero-bg-shape hero-shape-2 parallax" data-speed="0.1"></div>

          <div className="container" style={{ maxWidth: "520px", paddingTop: "60px", paddingBottom: "60px" }}>
            <div className="glass" style={{ padding: "48px", borderRadius: "32px" }}>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <div className="eyebrow" style={{ display: "inline-flex" }}>
                  <i className="fa-solid fa-shield-halved"></i>
                  Admin Access
                </div>
                <h1 style={{ fontSize: "2.5rem", letterSpacing: "-0.05em", marginTop: "16px", marginBottom: "12px" }}>
                  System Control Panel
                </h1>
                <p style={{ color: "#a5b7d0", margin: 0 }}>
                  Secure authentication required for administrative access
                </p>
              </div>

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff", fontSize: "0.95rem" }}>
                    <i className="fa-solid fa-user" style={{ marginRight: "8px" }}></i>
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter admin username"
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.05)",
                      color: "white",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "all 0.25s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(134, 240, 255, 0.4)";
                      e.target.style.background = "rgba(255,255,255,0.08)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.12)";
                      e.target.style.background = "rgba(255,255,255,0.05)";
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff", fontSize: "0.95rem" }}>
                    <i className="fa-solid fa-lock" style={{ marginRight: "8px" }}></i>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter admin password"
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.05)",
                      color: "white",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "all 0.25s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(134, 240, 255, 0.4)";
                      e.target.style.background = "rgba(255,255,255,0.08)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.12)";
                      e.target.style.background = "rgba(255,255,255,0.05)";
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "12px", minHeight: "56px", fontSize: "1.05rem" }}
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-arrow-right"></i>
                      Access Control Panel
                    </>
                  )}
                </button>
              </form>

              <div style={{ marginTop: "28px", padding: "18px", borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <i className="fa-solid fa-shield-halved" style={{ color: "#96f1ff", fontSize: "1.2rem", marginTop: "2px" }}></i>
                  <div>
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "0.95rem", letterSpacing: "-0.02em" }}>
                      Secure Access
                    </h4>
                    <p style={{ color: "#a5b7d0", fontSize: "0.9rem", margin: 0, lineHeight: "1.6" }}>
                      All administrative actions are logged and monitored for security purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-wrap">
          <div>
            <a href="/" className="brand footer-brand">
              <img src="/logo.png" alt="Stack logo" />
              <span>Stack</span>
            </a>
            <p>Kids banking made beautiful, safe, and meaningful.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
