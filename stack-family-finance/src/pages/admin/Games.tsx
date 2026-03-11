import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { AdminShell } from "@/components/admin/AdminShell";
import { toast } from "sonner";

export default function AdminGames() {
  const [games, setGames] = useState<any[]>([]);
  const [editingGame, setEditingGame] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [newGame, setNewGame] = useState({ code: "", title: "", description: "", rewardCoins: 10 });

  useEffect(() => {
    void loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setGames(await adminApi.getAllGames());
    } catch (error: any) {
      toast.error(error.message || "Failed to load games");
    }
  };

  const createGame = async () => {
    try {
      await adminApi.createGame(newGame);
      setCreating(false);
      setNewGame({ code: "", title: "", description: "", rewardCoins: 10 });
      await loadGames();
    } catch (error: any) {
      toast.error(error.message || "Failed to create game");
    }
  };

  const saveGame = async () => {
    try {
      await adminApi.updateGame(editingGame.id, {
        title: editingGame.title,
        description: editingGame.description,
        rewardCoins: editingGame.rewardCoins,
      });
      setEditingGame(null);
      await loadGames();
    } catch (error: any) {
      toast.error(error.message || "Failed to update game");
    }
  };

  const deleteGame = async (id: number) => {
    try {
      await adminApi.deleteGame(id);
      await loadGames();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete game");
    }
  };

  return (
    <AdminShell active="games" title="Game management" subtitle="Control published games, reward levels, and presentation content used by children.">
      <section className="panel-card">
        <div className="section-title">
          <div>
            <h2 className="section-heading">Published games</h2>
            <p className="section-subtitle">Game questions are still driven by frontend game components, but titles, codes, and rewards are managed here.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setCreating(true)}>Create game</button>
        </div>
        <div className="dashboard-grid auto">
          {games.map((game) => (
            <div key={game.id} className="panel-card" style={{ padding: "18px" }}>
              <div className="section-heading" style={{ fontSize: "1.1rem" }}>{game.title}</div>
              <p className="section-subtitle">{game.description || "No description yet."}</p>
              <div className="button-row" style={{ marginTop: "12px" }}>
                <span className="pill">{game.code}</span>
                <span className="pill">{game.rewardCoins} coins / 100 pts</span>
              </div>
              <div className="button-row" style={{ marginTop: "14px" }}>
                <button className="btn btn-outline" onClick={() => setEditingGame(game)}>Edit</button>
                <button className="btn btn-outline" onClick={() => deleteGame(game.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {(creating || editingGame) && (
        <div className="modal-overlay" onClick={() => { setCreating(false); setEditingGame(null); }}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">{creating ? "Create game" : "Edit game"}</h3>
            <div className="dashboard-stack" style={{ marginTop: "18px", gap: "14px" }}>
              <input className="dashboard-input" placeholder="Game code" value={creating ? newGame.code : editingGame.code} onChange={(e) => creating ? setNewGame({ ...newGame, code: e.target.value }) : setEditingGame({ ...editingGame, code: e.target.value })} disabled={!creating} />
              <input className="dashboard-input" placeholder="Game title" value={creating ? newGame.title : editingGame.title} onChange={(e) => creating ? setNewGame({ ...newGame, title: e.target.value }) : setEditingGame({ ...editingGame, title: e.target.value })} />
              <textarea className="dashboard-textarea" placeholder="Description" value={creating ? newGame.description : editingGame.description} onChange={(e) => creating ? setNewGame({ ...newGame, description: e.target.value }) : setEditingGame({ ...editingGame, description: e.target.value })} />
              <input className="dashboard-input" type="number" min="1" value={creating ? newGame.rewardCoins : editingGame.rewardCoins} onChange={(e) => creating ? setNewGame({ ...newGame, rewardCoins: Number(e.target.value) }) : setEditingGame({ ...editingGame, rewardCoins: Number(e.target.value) })} />
              <div className="button-row">
                <button className="btn btn-primary" onClick={creating ? createGame : saveGame}>{creating ? "Create game" : "Save changes"}</button>
                <button className="btn btn-outline" onClick={() => { setCreating(false); setEditingGame(null); }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
