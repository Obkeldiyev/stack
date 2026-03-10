import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/lib/api";
import { clearAuth, getUser } from "@/lib/auth";
import { toast } from "sonner";
import "../Landing.css";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      toast.error("Access denied");
      navigate("/admin/login");
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminApi.getAllUsers();
      setUsers(data);
    } catch (error: any) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (userId: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await adminApi.disableUser(userId);
        toast.success("User disabled");
      } else {
        await adminApi.enableUser(userId);
        toast.success("User enabled");
      }
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      toast.success("User deleted");
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await adminApi.updateUser(editingUser.id, {
        username: editingUser.username,
        role: editingUser.role,
        enabled: editingUser.enabled
      });
      toast.success("User updated");
      setEditingUser(null);
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
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

      <header className="header">
        <div className="container nav">
          <div className="brand">
            <img src="/logo.png" alt="Stack logo" />
            <span>Stack Admin</span>
          </div>

          <nav className="desktop-nav">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin/dashboard"); }}>Dashboard</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin/users"); }} style={{ color: "white" }}>Users</a>
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
        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-users"></i>
                User Management
              </div>
              <h2>All Users</h2>
              <p>Manage user accounts, permissions, and access control.</p>
            </div>

            <div className="glass" style={{ padding: "32px", borderRadius: "28px" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      <th style={{ padding: "16px", textAlign: "left", color: "#dce8ff" }}>ID</th>
                      <th style={{ padding: "16px", textAlign: "left", color: "#dce8ff" }}>Username</th>
                      <th style={{ padding: "16px", textAlign: "left", color: "#dce8ff" }}>Role</th>
                      <th style={{ padding: "16px", textAlign: "left", color: "#dce8ff" }}>Status</th>
                      <th style={{ padding: "16px", textAlign: "left", color: "#dce8ff" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "16px", color: "#a5b7d0" }}>{u.id}</td>
                        <td style={{ padding: "16px", color: "white" }}>{u.username}</td>
                        <td style={{ padding: "16px" }}>
                          <span style={{
                            padding: "6px 12px",
                            borderRadius: "999px",
                            fontSize: "0.85rem",
                            background: u.role === "ADMIN" ? "rgba(255,100,100,0.2)" : u.role === "PARENT" ? "rgba(100,200,255,0.2)" : "rgba(100,255,150,0.2)",
                            border: "1px solid rgba(255,255,255,0.1)"
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <span style={{
                            padding: "6px 12px",
                            borderRadius: "999px",
                            fontSize: "0.85rem",
                            background: u.enabled ? "rgba(100,255,150,0.2)" : "rgba(255,100,100,0.2)",
                            border: "1px solid rgba(255,255,255,0.1)"
                          }}>
                            {u.enabled ? "Enabled" : "Disabled"}
                          </span>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => setEditingUser(u)}
                              className="btn btn-outline"
                              style={{ minHeight: "38px", padding: "0 16px", fontSize: "0.9rem" }}
                            >
                              <i className="fa-solid fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleToggleEnabled(u.id, u.enabled)}
                              className="btn btn-outline"
                              style={{ minHeight: "38px", padding: "0 16px", fontSize: "0.9rem" }}
                            >
                              <i className={`fa-solid fa-${u.enabled ? "ban" : "check"}`}></i>
                            </button>
                            {u.role !== "ADMIN" && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.username)}
                                className="btn btn-outline"
                                style={{ minHeight: "38px", padding: "0 16px", fontSize: "0.9rem", borderColor: "rgba(255,100,100,0.3)" }}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Edit User Modal */}
      {editingUser && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setEditingUser(null)}>
          <div className="glass" style={{
            padding: "36px",
            borderRadius: "28px",
            maxWidth: "500px",
            width: "90%"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: "24px", letterSpacing: "-0.03em" }}>
              Edit User
            </h3>
            <form onSubmit={handleUpdateUser} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>Username</label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    fontSize: "1rem"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    fontSize: "1rem"
                  }}
                >
                  <option value="PARENT">PARENT</option>
                  <option value="CHILD">CHILD</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                  type="checkbox"
                  checked={editingUser.enabled}
                  onChange={(e) => setEditingUser({ ...editingUser, enabled: e.target.checked })}
                  style={{ width: "20px", height: "20px" }}
                />
                <label style={{ color: "#dce8ff" }}>Enabled</label>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <i className="fa-solid fa-save"></i>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
