import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/lib/api";
import { clearAuth, getUser } from "@/lib/auth";
import { toast } from "sonner";
import "../Landing.css";

export default function AdminGames() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<any>(null);
  const [creatingGame, setCreatingGame] = useState(false);
  const [newGame, setNewGame] = useState({ code: "", title: "", description: "", rewardCoins: 10 });
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      toast.error("Access denied");
      navigate("/admin/login");
      return;
    }
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const data = await adminApi.getAllGames();
      setGames(data);
    } catch (error: any) {
      toast.error("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createGame(newGame);
      toast.success("Game created");
      setCreatingGame(false);
      setNewGame({ code: "", title: "", description: "", rewardCoins: 10 });
      loadGames();
    } catch (error: any) {
      toast.error(error.message || "Failed to create game");
    }
  };

  const handleUpdateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;

    try {
      await adminApi.updateGame(editingGame.id, {
        title: editingGame.title,
        description: editingGame.description,
        rewardCoins: editingGame.rewardCoins
      });
      toast.success("Game updated");
      setEditingGame(null);
      loadGames();
    } catch (error: any) {
      toast.error(error.message || "Failed to update game");
    }
  };

  const handleDeleteGame = async (gameId: number, title: string) => {
    if (!confirm(`Are you sure you want to delete game "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminApi.deleteGame(gameId);
      toast.success("Game deleted");
      loadGames();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete game");
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
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin/users"); }}>Users</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin/games"); }} style={{ color: "white" }}>Games</a>
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
                <i className="fa-solid fa-gamepad"></i>
                Game Management
              </div>
              <h2>All Games</h2>
              <p>Create, update, or remove games and configure rewards.</p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <button
                onClick={() => setCreatingGame(true)}
                className="btn btn-primary"
              >
                <i className="fa-solid fa-plus"></i>
                Create New Game
              </button>
            </div>

            <div className="feature-grid">
              {games.map((game) => (
                <div key={game.id} className="feature-card glass reveal up">
                  <div className="icon-box">
                    <i className="fa-solid fa-gamepad"></i>
                  </div>
                  <h3>{game.title}</h3>
                  <p style={{ minHeight: "60px" }}>{game.description || "No description"}</p>
                  <div style={{ marginTop: "16px", padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "#a5b7d0", fontSize: "0.9rem" }}>Code:</span>
                      <span style={{ color: "white", fontWeight: "600" }}>{game.code}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#a5b7d0", fontSize: "0.9rem" }}>Reward:</span>
                      <span style={{ color: "#70cf42", fontWeight: "600" }}>{game.rewardCoins} coins</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                    <button
                      onClick={() => setEditingGame(game)}
                      className="btn btn-outline"
                      style={{ flex: 1, minHeight: "42px" }}
                    >
                      <i className="fa-solid fa-edit"></i>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGame(game.id, game.title)}
                      className="btn btn-outline"
                      style={{ minHeight: "42px", borderColor: "rgba(255,100,100,0.3)" }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Create Game Modal */}
      {creatingGame && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setCreatingGame(false)}>
          <div className="glass" style={{
            padding: "36px",
            borderRadius: "28px",
            maxWidth: "500px",
            width: "90%"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: "24px", letterSpacing: "-0.03em" }}>
              Create New Game
            </h3>
            <form onSubmit={handleCreateGame} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>Game Code</label>
                <input
                  type="text"
                  value={newGame.code}
                  onChange={(e) => setNewGame({ ...newGame, code: e.target.value })}
                  required
                  placeholder="e.g., MATH_RUSH"
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
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>Title</label>
                <input
                  type="text"
                  value={newGame.title}
                  onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                  required
                  placeholder="Game title"
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
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>Description</label>
                <textarea
                  value={newGame.description}
                  onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                  placeholder="Game description"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    fontSize: "1rem",
                    resize: "vertical"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>Reward Coins</label>
                <input
                  type="number"
                  value={newGame.rewardCoins}
                  onChange={(e) => setNewGame({ ...newGame, rewardCoins: parseInt(e.target.value) })}
                  required
                  min="1"
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

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <i className="fa-solid fa-plus"></i>
                  Create Game
                </button>
                <button
                  type="button"
                  onClick={() => setCreatingGame(false)}
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

      {/* Edit Game Modal */}
      {editingGame && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setEditingGame(null)}>
          <div className="glass" style={{
            padding: "36px",
            borderRadius: "28px",
            maxWidth: "500px",
            width: "90%"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: "24px", letterSpacing: "-0.03em" }}>
              Edit Game
            </h3>
            <form onSubmit={handleUpdateGame} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>Title</label>
                <input
                  type="text"
                  value={editingGame.title}
                  onChange={(e) => setEditingGame({ ...editingGame, title: e.target.value })}
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
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>Description</label>
                <textarea
                  value={editingGame.description}
                  onChange={(e) => setEditingGame({ ...editingGame, description: e.target.value })}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    fontSize: "1rem",
                    resize: "vertical"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>Reward Coins</label>
                <input
                  type="number"
                  value={editingGame.rewardCoins}
                  onChange={(e) => setEditingGame({ ...editingGame, rewardCoins: parseInt(e.target.value) })}
                  min="1"
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

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <i className="fa-solid fa-save"></i>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingGame(null)}
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
