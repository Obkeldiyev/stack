import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { AdminShell } from "@/components/admin/AdminShell";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    void loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setUsers(await adminApi.getAllUsers());
    } catch (error: any) {
      toast.error(error.message || "Failed to load users");
    }
  };

  const toggleEnabled = async (userId: number, enabled: boolean) => {
    try {
      if (enabled) await adminApi.disableUser(userId);
      else await adminApi.enableUser(userId);
      await loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to change access");
    }
  };

  const saveUser = async () => {
    try {
      await adminApi.updateUser(editingUser.id, {
        username: editingUser.username,
        role: editingUser.role,
        enabled: editingUser.enabled,
      });
      setEditingUser(null);
      await loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await adminApi.deleteUser(id);
      await loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  return (
    <AdminShell active="users" title="User management" subtitle="Edit roles, disable access, and manage user profiles from one place.">
      <section className="panel-card">
        <div className="section-title">
          <div>
            <h2 className="section-heading">All users</h2>
            <p className="section-subtitle">Admin accounts stay undeletable, while parent and child accounts can be edited directly.</p>
          </div>
        </div>
        <div className="goal-list">
          {users.map((user) => (
            <div key={user.id} className="info-row">
              <div>
                <strong>{user.username}</strong>
                <div className="button-row" style={{ marginTop: "8px" }}>
                  <span className="pill">{user.role}</span>
                  <span className="pill">{user.enabled ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
              <div className="button-row">
                <button className="btn btn-outline" onClick={() => setEditingUser(user)}>Edit</button>
                <button className="btn btn-outline" onClick={() => toggleEnabled(user.id, user.enabled)}>
                  {user.enabled ? "Disable" : "Enable"}
                </button>
                {user.role !== "ADMIN" && <button className="btn btn-outline" onClick={() => deleteUser(user.id)}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {editingUser && (
        <div className="modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">Edit user</h3>
            <div className="dashboard-stack" style={{ marginTop: "18px", gap: "14px" }}>
              <input className="dashboard-input" value={editingUser.username} onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })} />
              <select className="dashboard-select" value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                <option value="PARENT">PARENT</option>
                <option value="CHILD">CHILD</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <label className="pill" style={{ justifyContent: "space-between" }}>
                Enabled
                <input type="checkbox" checked={editingUser.enabled} onChange={(e) => setEditingUser({ ...editingUser, enabled: e.target.checked })} />
              </label>
              <div className="button-row">
                <button className="btn btn-primary" onClick={saveUser}>Save changes</button>
                <button className="btn btn-outline" onClick={() => setEditingUser(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
