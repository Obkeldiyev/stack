import { useEffect, useState } from "react";
import { accountsApi, dashboardApi, familyApi } from "@/lib/api";
import { toast } from "sonner";
import { formatCurrencyFromCents } from "@/lib/view-models";

export default function ParentBankingDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [familyTitle, setFamilyTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferNote, setTransferNote] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingFamily, setDeletingFamily] = useState<any>(null);

  useEffect(() => {
    void fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await dashboardApi.getParentDashboard();
      setDashboard(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFamily = async () => {
    if (!familyTitle.trim()) return;
    setCreating(true);
    try {
      await familyApi.create(familyTitle.trim());
      toast.success("Family created.");
      setFamilyTitle("");
      await fetchDashboard();
    } catch (error: any) {
      toast.error(error.message || "Failed to create family");
    } finally {
      setCreating(false);
    }
  };

  const handleInvite = async (familyId: number) => {
    try {
      const result = await familyApi.invite(familyId);
      setInviteCode(result.code);
    } catch (error: any) {
      toast.error(error.message || "Failed to create invite");
    }
  };

  const handleEdit = async () => {
    if (!editingFamily || !editTitle.trim()) return;
    try {
      await familyApi.update(editingFamily.familyId, editTitle.trim());
      toast.success("Family updated.");
      setEditOpen(false);
      await fetchDashboard();
    } catch (error: any) {
      toast.error(error.message || "Failed to update family");
    }
  };

  const handleDelete = async () => {
    if (!deletingFamily) return;
    try {
      await familyApi.delete(deletingFamily.familyId);
      toast.success("Family deleted.");
      setDeleteOpen(false);
      await fetchDashboard();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete family");
    }
  };

  const handleTransfer = async () => {
    if (!selectedChild || !transferAmount) return;
    const amount = Number(transferAmount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }

    setTransferring(true);
    try {
      await accountsApi.transfer(selectedChild.childId, Math.round(amount * 100), transferNote || undefined);
      toast.success(`Sent ${amount.toFixed(2)} dollars to ${selectedChild.childUsername}.`);
      setTransferOpen(false);
      setTransferAmount("");
      setTransferNote("");
      await fetchDashboard();
    } catch (error: any) {
      toast.error(error.message || "Transfer failed");
    } finally {
      setTransferring(false);
    }
  };

  const families = dashboard?.families ?? [];
  const stats = dashboard?.totalStats ?? { totalBalance: 0, activeGoals: 0, completedGoals: 0 };
  const childCount = families.reduce((total: number, family: any) => total + family.children.length, 0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container dashboard-stack">
        <section className="dashboard-hero">
          <div className="dashboard-eyebrow">
            <i className="fa-solid fa-wallet"></i>
            Parent banking
          </div>
          <h1 className="dashboard-title">One place to run every family wallet.</h1>
          <p className="dashboard-copy">
            Create families, send allowance, watch progress, and keep the dashboard readable on phones instead of squeezing everything into one row.
          </p>
          <div className="hero-balance">
            <div className="hero-balance-value">{formatCurrencyFromCents(stats.totalBalance)}</div>
            <div className="hero-balance-meta">Total child balance across all connected families</div>
          </div>
        </section>

        <section className="dashboard-grid stats">
          <div className="panel-card stat-card">
            <div className="stat-icon"><i className="fa-solid fa-sack-dollar"></i></div>
            <div className="stat-value">{formatCurrencyFromCents(stats.totalBalance)}</div>
            <div className="stat-label">Combined family balance visible to you.</div>
          </div>
          <div className="panel-card stat-card">
            <div className="stat-icon"><i className="fa-solid fa-bullseye"></i></div>
            <div className="stat-value">{stats.activeGoals}</div>
            <div className="stat-label">{stats.completedGoals} goals already completed.</div>
          </div>
          <div className="panel-card stat-card">
            <div className="stat-icon"><i className="fa-solid fa-users"></i></div>
            <div className="stat-value">{childCount}</div>
            <div className="stat-label">{families.length} families and children you can fund from here.</div>
          </div>
        </section>

        <section className="panel-card">
          <div className="section-title">
            <div>
              <h2 className="section-heading">Create a family</h2>
              <p className="section-subtitle">A short title is enough. Invite codes are created later only when needed.</p>
            </div>
          </div>
          <div className="dashboard-form-grid">
            <input
              className="dashboard-input"
              value={familyTitle}
              onChange={(event) => setFamilyTitle(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleCreateFamily()}
              placeholder="Family name"
            />
            <button className="btn btn-primary" disabled={creating || !familyTitle.trim()} onClick={handleCreateFamily}>
              {creating ? "Creating..." : "Create family"}
            </button>
          </div>
        </section>

        <section className="panel-card">
          <div className="section-title">
            <div>
              <h2 className="section-heading">Family overview</h2>
              <p className="section-subtitle">Each child card exposes balance, goals, tasks, and quick transfer actions.</p>
            </div>
          </div>

          {loading ? (
            <div className="empty-panel">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <p className="section-subtitle">Loading dashboard...</p>
            </div>
          ) : families.length === 0 ? (
            <div className="empty-panel">
              <i className="fa-solid fa-users"></i>
              <h3 className="section-heading" style={{ fontSize: "1.2rem" }}>No families yet</h3>
              <p className="section-subtitle">Create your first family to start using the rest of the dashboard.</p>
            </div>
          ) : (
            <div className="family-card">
              {families.map((family: any) => (
                <div key={family.familyId} className="panel-card" style={{ padding: "20px" }}>
                  <div className="section-title">
                    <div>
                      <h3 className="section-heading">{family.familyTitle}</h3>
                      <p className="section-subtitle">{family.children.length} connected children</p>
                    </div>
                    <div className="button-row" style={{ justifyContent: "flex-end" }}>
                      <span className="pill">
                        <i className="fa-solid fa-piggy-bank"></i>
                        {formatCurrencyFromCents(family.totalBalance)}
                      </span>
                      <button className="btn btn-outline" onClick={() => handleInvite(family.familyId)}>
                        <i className="fa-solid fa-qrcode"></i>
                        Invite
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          setEditingFamily(family);
                          setEditTitle(family.familyTitle);
                          setEditOpen(true);
                        }}
                      >
                        <i className="fa-solid fa-pen"></i>
                        Edit
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          setDeletingFamily(family);
                          setDeleteOpen(true);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                        Delete
                      </button>
                    </div>
                  </div>

                  {family.children.length === 0 ? (
                    <div className="info-row">
                      <span>No children joined this family yet. Create an invite code to add one.</span>
                    </div>
                  ) : (
                    <div className="dashboard-grid auto">
                      {family.children.map((child: any) => (
                        <div key={child.childId} className="panel-card" style={{ padding: "18px" }}>
                          <div className="section-title">
                            <div>
                              <h4 className="section-heading" style={{ fontSize: "1.1rem" }}>{child.childUsername}</h4>
                              <p className="section-subtitle">{child.accounts.length} accounts connected</p>
                            </div>
                            <span className="pill">
                              <i className="fa-solid fa-coins"></i>
                              {formatCurrencyFromCents(child.totalBalance)}
                            </span>
                          </div>

                          <div className="goal-list">
                            <div className="info-row">
                              <span>Active goals</span>
                              <strong>{child.activeGoals}</strong>
                            </div>
                            <div className="info-row">
                              <span>Completed tasks</span>
                              <strong>{child.completedTasks}</strong>
                            </div>
                          </div>

                          <div className="button-row" style={{ marginTop: "14px" }}>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                setSelectedChild(child);
                                setTransferOpen(true);
                              }}
                            >
                              <i className="fa-solid fa-paper-plane"></i>
                              Send money
                            </button>
                          </div>

                          {child.accounts.length > 0 && (
                            <div className="goal-list" style={{ marginTop: "14px" }}>
                              {child.accounts.map((account: any) => (
                                <div key={account.id} className="info-row">
                                  <span>{account.type}</span>
                                  <strong>{formatCurrencyFromCents(account.balance)}</strong>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {transferOpen && (
        <div className="modal-overlay" onClick={() => setTransferOpen(false)}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">Send money to {selectedChild?.childUsername}</h3>
            <div className="dashboard-stack" style={{ marginTop: "18px", gap: "14px" }}>
              <input
                className="dashboard-input"
                type="number"
                min="0.01"
                step="0.01"
                value={transferAmount}
                onChange={(event) => setTransferAmount(event.target.value)}
                placeholder="Amount in dollars"
              />
              <input
                className="dashboard-input"
                value={transferNote}
                onChange={(event) => setTransferNote(event.target.value)}
                placeholder="Optional note"
              />
              <div className="button-row">
                <button className="btn btn-primary" disabled={transferring} onClick={handleTransfer}>
                  {transferring ? "Sending..." : "Send money"}
                </button>
                <button className="btn btn-outline" onClick={() => setTransferOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {inviteCode && (
        <div className="modal-overlay" onClick={() => setInviteCode(null)}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">Invite code</h3>
            <div className="info-row" style={{ marginTop: "18px" }}>
              <strong style={{ fontSize: "1.6rem", letterSpacing: "0.18em" }}>{inviteCode}</strong>
              <button className="btn btn-primary" onClick={() => navigator.clipboard.writeText(inviteCode)}>
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {editOpen && (
        <div className="modal-overlay" onClick={() => setEditOpen(false)}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">Rename family</h3>
            <input
              className="dashboard-input"
              style={{ marginTop: "18px" }}
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
            />
            <div className="button-row" style={{ marginTop: "18px" }}>
              <button className="btn btn-primary" onClick={handleEdit}>Save</button>
              <button className="btn btn-outline" onClick={() => setEditOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {deleteOpen && (
        <div className="modal-overlay" onClick={() => setDeleteOpen(false)}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">Delete family</h3>
            <p className="section-subtitle">This removes {deletingFamily?.familyTitle} and all memberships.</p>
            <div className="button-row" style={{ marginTop: "18px" }}>
              <button className="btn btn-primary" onClick={handleDelete}>Delete</button>
              <button className="btn btn-outline" onClick={() => setDeleteOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
