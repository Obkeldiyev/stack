import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { toast } from "sonner";
import "./Landing.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"PARENT" | "CHILD">("CHILD");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger form animation after component mounts
    const timer = setTimeout(() => setShowForm(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res: any = await authApi.register({ username, password, role });
      if (res.token) {
        setAuth(res.token, res.user ?? { id: 0, username, role });
        toast.success("Welcome to STACK!");
        setTimeout(() => {
          navigate(role === "PARENT" ? "/parent/dashboard" : "/child/dashboard", { replace: true });
        }, 500);
      } else {
        toast.success("Account created! Please log in now.");
        navigate("/login");
      }
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>

      {/* Animated Background Shapes */}
      <div className="hero-bg-shape hero-shape-1 parallax" data-speed="0.12" style={{
        position: "fixed",
        width: "700px",
        height: "700px",
        left: "-250px",
        top: "5%",
        background: "radial-gradient(circle, rgba(112,207,66,0.18), transparent 70%)",
        borderRadius: "50%",
        filter: "blur(50px)",
        animation: "float 7s ease-in-out infinite"
      }}></div>
      
      <div className="hero-bg-shape hero-shape-2 parallax" data-speed="0.08" style={{
        position: "fixed",
        width: "550px",
        height: "550px",
        right: "-200px",
        bottom: "5%",
        background: "radial-gradient(circle, rgba(25,199,216,0.16), transparent 70%)",
        borderRadius: "50%",
        filter: "blur(35px)",
        animation: "float 9s ease-in-out infinite reverse"
      }}></div>

      <main style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "520px",
          transform: showForm ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
          opacity: showForm ? 1 : 0,
          transition: "all 0.8s cubic-bezier(0.2, 0.7, 0.2, 1)"
        }}>
          {/* Logo and Header */}
          <div style={{ 
            textAlign: "center", 
            marginBottom: "40px",
            transform: showForm ? "translateY(0)" : "translateY(-20px)",
            opacity: showForm ? 1 : 0,
            transition: "all 1s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 24px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #70cf42 0%, #19c7d8 60%, #1d64d6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 60px rgba(112, 207, 66, 0.4)",
              animation: showForm ? "logoGlow 2s ease-in-out infinite alternate" : "none"
            }}>
              <img src="/logo.png" alt="Stack logo" style={{ width: "50px", height: "50px" }} />
            </div>
            
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              letterSpacing: "-0.05em",
              margin: "0 0 12px 0",
              background: "linear-gradient(135deg, #ffffff 0%, #79d748 45%, #86f0ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Join STACK
            </h1>
            
            <p style={{ 
              color: "#a5b7d0", 
              fontSize: "1.1rem", 
              margin: 0,
              lineHeight: "1.6"
            }}>
              Start your family's financial journey today
            </p>
          </div>

          {/* Register Form */}
          <div className="glass" style={{
            padding: "48px",
            borderRadius: "32px",
            border: "2px solid rgba(112,207,66,0.2)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))",
            backdropFilter: "blur(20px)",
            boxShadow: "0 32px 80px rgba(0, 0, 0, 0.4)",
            transform: showForm ? "translateY(0)" : "translateY(20px)",
            opacity: showForm ? 1 : 0,
            transition: "all 1s cubic-bezier(0.2, 0.7, 0.2, 1) 0.4s"
          }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Role Selection */}
              <div style={{
                transform: showForm ? "translateY(0)" : "translateY(-20px)",
                opacity: showForm ? 1 : 0,
                transition: "all 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.6s"
              }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "16px", 
                  color: "#dce8ff", 
                  fontSize: "1rem", 
                  fontWeight: "600",
                  letterSpacing: "-0.02em"
                }}>
                  <i className="fa-solid fa-users" style={{ marginRight: "8px", color: "#86f0ff" }}></i>
                  I am a...
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setRole("PARENT")}
                    style={{
                      padding: "16px 20px",
                      borderRadius: "16px",
                      border: role === "PARENT" ? "2px solid rgba(25,199,216,0.5)" : "2px solid rgba(255,255,255,0.12)",
                      background: role === "PARENT" ? "linear-gradient(135deg, rgba(25,199,216,0.2), rgba(112,207,66,0.1))" : "rgba(255,255,255,0.08)",
                      color: "white",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      if (role !== "PARENT") {
                        e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (role !== "PARENT") {
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                      }
                    }}
                  >
                    <i className="fa-solid fa-user-tie"></i>
                    Parent
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setRole("CHILD")}
                    style={{
                      padding: "16px 20px",
                      borderRadius: "16px",
                      border: role === "CHILD" ? "2px solid rgba(25,199,216,0.5)" : "2px solid rgba(255,255,255,0.12)",
                      background: role === "CHILD" ? "linear-gradient(135deg, rgba(25,199,216,0.2), rgba(112,207,66,0.1))" : "rgba(255,255,255,0.08)",
                      color: "white",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      if (role !== "CHILD") {
                        e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (role !== "CHILD") {
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                      }
                    }}
                  >
                    <i className="fa-solid fa-child"></i>
                    Child
                  </button>
                </div>
              </div>

              {/* Username Field */}
              <div style={{
                transform: showForm ? "translateX(0)" : "translateX(-30px)",
                opacity: showForm ? 1 : 0,
                transition: "all 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.8s"
              }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "12px", 
                  color: "#dce8ff", 
                  fontSize: "1rem", 
                  fontWeight: "600",
                  letterSpacing: "-0.02em"
                }}>
                  <i className="fa-solid fa-user" style={{ marginRight: "8px", color: "#86f0ff" }}></i>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Choose a username"
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: "16px",
                    border: "2px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    fontSize: "1.1rem",
                    transition: "all 0.3s ease",
                    outline: "none"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(112,207,66,0.5)";
                    e.target.style.background = "rgba(255,255,255,0.12)";
                    e.target.style.boxShadow = "0 0 0 4px rgba(112,207,66,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.12)";
                    e.target.style.background = "rgba(255,255,255,0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Password Field */}
              <div style={{
                transform: showForm ? "translateX(0)" : "translateX(30px)",
                opacity: showForm ? 1 : 0,
                transition: "all 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 1s"
              }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "12px", 
                  color: "#dce8ff", 
                  fontSize: "1rem", 
                  fontWeight: "600",
                  letterSpacing: "-0.02em"
                }}>
                  <i className="fa-solid fa-lock" style={{ marginRight: "8px", color: "#86f0ff" }}></i>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a secure password"
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: "16px",
                    border: "2px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    fontSize: "1.1rem",
                    transition: "all 0.3s ease",
                    outline: "none"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(112,207,66,0.5)";
                    e.target.style.background = "rgba(255,255,255,0.12)";
                    e.target.style.boxShadow = "0 0 0 4px rgba(112,207,66,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.12)";
                    e.target.style.background = "rgba(255,255,255,0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: "100%",
                  minHeight: "56px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  borderRadius: "16px",
                  background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #70cf42 0%, #19c7d8 60%, #1d64d6 100%)",
                  border: "none",
                  color: "white",
                  cursor: loading ? "not-allowed" : "pointer",
                  transform: showForm ? "translateY(0)" : "translateY(20px)",
                  opacity: showForm ? 1 : 0,
                  transition: "all 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 1.2s",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 20px 60px rgba(112, 207, 66, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(112, 207, 66, 0.35)";
                  }
                }}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                    Creating account...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-rocket" style={{ marginRight: "8px" }}></i>
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div style={{ 
              textAlign: "center", 
              marginTop: "32px",
              transform: showForm ? "translateY(0)" : "translateY(20px)",
              opacity: showForm ? 1 : 0,
              transition: "all 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 1.4s"
            }}>
              <p style={{ color: "#a5b7d0", margin: "0 0 16px 0", fontSize: "1rem" }}>
                Already have an account?
              </p>
              <Link 
                to="/login" 
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#86f0ff",
                  textDecoration: "none",
                  fontSize: "1rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(134, 240, 255, 0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <i className="fa-solid fa-sign-in-alt"></i>
                Sign In
              </Link>
            </div>
          </div>

          {/* Back to Landing Link */}
          <div style={{ 
            textAlign: "center", 
            marginTop: "24px",
            transform: showForm ? "translateY(0)" : "translateY(20px)",
            opacity: showForm ? 1 : 0,
            transition: "all 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 1.6s"
          }}>
            <Link 
              to="/" 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#a5b7d0",
                textDecoration: "none",
                fontSize: "0.95rem",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#86f0ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#a5b7d0";
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-3deg); }
        }
        
        @keyframes logoGlow {
          0% { box-shadow: 0 20px 60px rgba(112, 207, 66, 0.4); }
          100% { box-shadow: 0 25px 80px rgba(112, 207, 66, 0.6), 0 0 30px rgba(121, 215, 72, 0.3); }
        }
        
        .btn-primary:hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .btn-primary:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  );
}
