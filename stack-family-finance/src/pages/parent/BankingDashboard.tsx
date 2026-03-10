import { useEffect, useState } from "react";
import { dashboardApi, accountsApi, familyApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { toast } from "sonner";
import "../Landing.css";

export default function ParentBankingDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferNote, setTransferNote] = useState("");
  const [transferring, setTransferring] = useState(false);
  
  // Create family state
  const [familyTitle, setFamilyTitle] = useState("");
  const [creating, setCreating] = useState(false);
  
  // Invite code state
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  
  // Edit family state
  const [editOpen, setEditOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  
  // Delete family state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingFamily, setDeletingFamily] = useState<any>(null);
  
  const user = getUser();

  const fetchDashboard = async () => {
    try {
      const data = await dashboardApi.getParentDashboard();
      setDashboard(data);
    } catch (err: any) {
      console.error('Error fetching dashboard:', err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const handleCreateFamily = async () => {
    if (!familyTitle.trim()) return;
    setCreating(true);
    try {
      await familyApi.create(familyTitle);
      toast.success("Family created!");
      setFamilyTitle("");
      fetchDashboard();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleInvite = async (familyId: number) => {
    try {
      const res = await familyApi.invite(familyId);
      setInviteCode(res.code);
      setInviteOpen(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openEdit = (family: any) => {
    setEditingFamily(family);
    setEditTitle(family.familyTitle || "");
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editTitle.trim() || !editingFamily) return;
    try {
      await familyApi.update(editingFamily.familyId, editTitle);
      toast.success("Family updated!");
      setEditOpen(false);
      fetchDashboard();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openDelete = (family: any) => {
    setDeletingFamily(family);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingFamily) return;
    try {
      await familyApi.delete(deletingFamily.familyId);
      toast.success("Family deleted!");
      setDeleteOpen(false);
      fetchDashboard();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const copyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast.success("Copied!");
    }
  };

  const openTransfer = (child: any) => {
    setSelectedChild(child);
    setTransferAmount("");
    setTransferNote("");
    setTransferOpen(true);
  };

  const handleTransfer = async () => {
    if (!selectedChild || !transferAmount) return;
    const amount = parseFloat(transferAmount);
    if (amount <= 0 || isNaN(amount)) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    const amountInCents = Math.round(amount * 100);

    setTransferring(true);
    try {
      await accountsApi.transfer(selectedChild.childId, amountInCents, transferNote || undefined);
      toast.success(`Sent $${amount.toFixed(2)} to ${selectedChild.childUsername}`);
      setTransferOpen(false);
      setTransferAmount("");
      setTransferNote("");
      fetchDashboard();
    } catch (err: any) {
      toast.error(err.message || "Transfer failed");
    } finally {
      setTransferring(false);
    }
  };

  const formatMoney = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
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

  if (!dashboard) {
    return (
      <div className="landing-page">
        <div className="bg-noise"></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <p style={{ color: "#a5b7d0" }}>Unable to load dashboard</p>
        </div>
      </div>
    );
  }

  const { families, totalStats } = dashboard;

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>

      <main>
        <section style={{ padding: "16px 16px 80px 16px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ marginBottom: "24px" }}>
              <div className="eyebrow" style={{ marginBottom: "12px" }}>
                <i className="fa-solid fa-users"></i>
                Family Banking
              </div>
              <h2 style={{ 
                fontSize: "2.5rem", 
                lineHeight: "1.1", 
                letterSpacing: "-0.05em", 
                margin: "0 0 12px 0",
                color: "white"
              }}>
                Monitor & Manage Your Family's Finances
              </h2>
              <p style={{ color: "#a5b7d0", margin: 0, fontSize: "1.05rem", lineHeight: "1.6" }}>
                Create families, invite children, send money, and track their financial progress all in one place.
              </p>
            </div>

            {/* Create Family Section */}
            <div className="glass" style={{ padding: "32px", borderRadius: "28px", marginBottom: "32px", border: "2px solid rgba(25,199,216,0.2)" }}>
              <h3 style={{ marginTop: 0, marginBottom: "20px", color: "white", letterSpacing: "-0.03em", display: "flex", alignItems: "center", gap: "12px" }}>
                <i className="fa-solid fa-plus" style={{ color: "#86f0ff" }}></i>
                Create New Family
              </h3>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <input
                  placeholder="Enter family name"
                  value={familyTitle}
                  onChange={(e) => setFamilyTitle(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCreateFamily()}
                  style={{
                    flex: 1,
                    minWidth: "300px",
                    padding: "14px 18px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    fontSize: "1rem"
                  }}
                />
                <button
                  onClick={handleCreateFamily}
                  disabled={creating || !familyTitle.trim()}
                  className="btn btn-primary"
                  style={{ fontSize: "1rem", minWidth: "160px" }}
                >
                  {creating ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-plus"></i>
                      Create Family
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Total Overview */}
            <div className="feature-grid" style={{ marginBottom: "32px" }}>
              <div className="feature-card glass reveal left">
                <div className="icon-box">
                  <i className="fa-solid fa-wallet"></i>
                </div>
                <h3>{formatMoney(totalStats.totalBalance)}</h3>
                <p>Total Family Balance</p>
              </div>

              <div className="feature-card glass reveal up stagger-1">
                <div className="icon-box">
                  <i className="fa-solid fa-bullseye"></i>
                </div>
                <h3>{totalStats.activeGoals}</h3>
                <p>Active Goals ({totalStats.completedGoals} completed)</p>
              </div>

              <div className="feature-card glass reveal right">
                <div className="icon-box">
                  <i className="fa-solid fa-users"></i>
                </div>
                <h3>{families.length}</h3>
                <p>Families Managed</p>
              </div>
            </div>

            {/* Families */}
            {families.length === 0 ? (
              <div className="glass" style={{ padding: "48px", borderRadius: "28px", textAlign: "center" }}>
                <i className="fa-solid fa-users" style={{ fontSize: "3rem", color: "#86f0ff", marginBottom: "16px", display: "block" }}></i>
                <h3 style={{ marginBottom: "12px", color: "white" }}>No Families Yet</h3>
                <p style={{ color: "#a5b7d0", margin: 0 }}>
                  Create your first family to start managing your children's finances.
                </p>
              </div>
            ) : (
              families.map((family: any) => (
                <div key={family.familyId} className="glass" style={{ padding: "32px", borderRadius: "28px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <i className="fa-solid fa-users" style={{ color: "#86f0ff", fontSize: "1.5rem" }}></i>
                      <h3 style={{ margin: 0, color: "white", letterSpacing: "-0.03em" }}>{family.familyTitle}</h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                      <div style={{ fontSize: "2rem", fontWeight: "700", color: "#70cf42" }}>
                        {formatMoney(family.totalBalance)}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleInvite(family.familyId)}
                          className="btn btn-outline"
                          style={{ fontSize: "0.9rem" }}
                        >
                          <i className="fa-solid fa-copy"></i>
                          Invite Code
                        </button>
                        <button
                          onClick={() => openEdit(family)}
                          className="btn btn-outline"
                          style={{ fontSize: "0.9rem", minWidth: "44px" }}
                        >
                          <i className="fa-solid fa-pencil"></i>
                        </button>
                        <button
                          onClick={() => openDelete(family)}
                          className="btn btn-outline"
                          style={{ 
                            fontSize: "0.9rem", 
                            minWidth: "44px",
                            borderColor: "rgba(255,100,100,0.3)",
                            color: "#ff6b6b"
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {family.children.length === 0 ? (
                    <p style={{ color: "#a5b7d0", textAlign: "center", padding: "24px", margin: 0 }}>
                      No children in this family yet. Share the invite code to add members.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {family.children.map((child: any) => (
                        <div key={child.childId} style={{ 
                          border: "1px solid rgba(255,255,255,0.08)", 
                          borderRadius: "20px", 
                          padding: "24px",
                          background: "rgba(255,255,255,0.02)"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "16px" }}>
                            <div>
                              <h4 style={{ margin: "0 0 8px 0", color: "white", fontSize: "1.2rem" }}>{child.childUsername}</h4>
                              <p style={{ margin: 0, color: "#a5b7d0", fontSize: "0.9rem" }}>
                                {child.accounts.length} account{child.accounts.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#70cf42", marginBottom: "8px" }}>
                                {formatMoney(child.totalBalance)}
                              </div>
                              <button
                                onClick={() => openTransfer(child)}
                                className="btn btn-primary"
                                style={{ fontSize: "0.9rem" }}
                              >
                                <i className="fa-solid fa-paper-plane"></i>
                                Send Money
                              </button>
                            </div>
                          </div>

                          {/* Child Stats */}
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                            <div>
                              <p style={{ margin: "0 0 4px 0", color: "#a5b7d0", fontSize: "0.8rem" }}>Active Goals</p>
                              <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "600", color: "white", display: "flex", alignItems: "center", gap: "6px" }}>
                                <i className="fa-solid fa-bullseye" style={{ color: "#86f0ff" }}></i>
                                {child.activeGoals}
                              </p>
                            </div>
                            <div>
                              <p style={{ margin: "0 0 4px 0", color: "#a5b7d0", fontSize: "0.8rem" }}>Completed Tasks</p>
                              <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "600", color: "white", display: "flex", alignItems: "center", gap: "6px" }}>
                                <i className="fa-solid fa-chart-line" style={{ color: "#70cf42" }}></i>
                                {child.completedTasks}
                              </p>
                            </div>
                            <div>
                              <p style={{ margin: "0 0 4px 0", color: "#a5b7d0", fontSize: "0.8rem" }}>Accounts</p>
                              <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "600", color: "white", display: "flex", alignItems: "center", gap: "6px" }}>
                                <i className="fa-solid fa-piggy-bank" style={{ color: "#19c7d8" }}></i>
                                {child.accounts.length}
                              </p>
                            </div>
                          </div>

                          {/* Accounts List */}
                          {child.accounts.length > 0 && (
                            <div style={{ paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "16px" }}>
                              <p style={{ margin: "0 0 12px 0", color: "#dce8ff", fontSize: "0.9rem", fontWeight: "600" }}>Accounts:</p>
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {child.accounts.map((account: any) => (
                                  <div key={account.id} style={{ 
                                    display: "flex", 
                                    justifyContent: "space-between", 
                                    alignItems: "center", 
                                    padding: "12px", 
                                    borderRadius: "12px", 
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.08)"
                                  }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "#dce8ff" }}>
                                      <i className="fa-solid fa-coins" style={{ color: "#86f0ff" }}></i>
                                      {account.type}
                                    </span>
                                    <span style={{ fontWeight: "600", color: "#70cf42" }}>{formatMoney(account.balance)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Transfer Modal */}
      {transferOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setTransferOpen(false)}>
          <div className="glass" style={{
            padding: "36px",
            borderRadius: "28px",
            maxWidth: "500px",
            width: "90%"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: "24px", color: "white" }}>
              Send Money to {selectedChild?.childUsername}
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                  Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  autoFocus
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
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                  Note (optional)
                </label>
                <input
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  placeholder="e.g., Weekly allowance"
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
              
              {transferAmount && parseFloat(transferAmount) > 0 && (
                <div style={{ 
                  padding: "16px", 
                  borderRadius: "14px", 
                  background: "rgba(112,207,66,0.1)",
                  border: "1px solid rgba(112,207,66,0.2)"
                }}>
                  <p style={{ margin: "0 0 8px 0", color: "#a5b7d0", fontSize: "0.9rem" }}>Transfer Summary:</p>
                  <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "#70cf42" }}>
                    ${parseFloat(transferAmount).toFixed(2)} → {selectedChild?.childUsername}
                  </p>
                </div>
              )}
            </div>
            
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button 
                onClick={handleTransfer} 
                disabled={transferring || !transferAmount || parseFloat(transferAmount) <= 0}
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                {transferring ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i>
                    Send Money
                  </>
                )}
              </button>
              <button
                onClick={() => setTransferOpen(false)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Code Modal */}
      {inviteOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setInviteOpen(false)}>
          <div className="glass" style={{
            padding: "36px",
            borderRadius: "28px",
            maxWidth: "400px",
            width: "90%"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "white" }}>
              Family Invite Code
            </h3>
            
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input 
                value={inviteCode ?? ""} 
                readOnly 
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: "1.2rem",
                  fontFamily: "monospace",
                  textAlign: "center",
                  letterSpacing: "0.1em"
                }}
              />
              <button 
                onClick={copyCode}
                className="btn btn-outline"
                style={{ minWidth: "44px" }}
              >
                <i className="fa-solid fa-copy"></i>
              </button>
            </div>
            
            <p style={{ color: "#a5b7d0", fontSize: "0.9rem", marginBottom: "20px" }}>
              Share this code with your child so they can join the family.
            </p>
            
            <button 
              onClick={() => setInviteOpen(false)} 
              className="btn btn-primary" 
              style={{ width: "100%" }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Edit Family Modal */}
      {editOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setEditOpen(false)}>
          <div className="glass" style={{
            padding: "36px",
            borderRadius: "28px",
            maxWidth: "400px",
            width: "90%"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "white" }}>
              Edit Family Name
            </h3>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                Family Name
              </label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter family name"
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
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={handleEdit}
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditOpen(false)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Family Modal */}
      {deleteOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setDeleteOpen(false)}>
          <div className="glass" style={{
            padding: "36px",
            borderRadius: "28px",
            maxWidth: "500px",
            width: "90%"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", color: "white" }}>
              Delete Family?
            </h3>
            <p style={{ color: "#a5b7d0", marginBottom: "24px", lineHeight: "1.6" }}>
              This will permanently delete "{deletingFamily?.familyTitle}" and remove all members. This action cannot be undone.
            </p>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setDeleteOpen(false)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="btn btn-primary" 
                style={{ 
                  flex: 1,
                  background: "linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)",
                  boxShadow: "0 12px 40px rgba(255, 107, 107, 0.35)"
                }}
              >
                Delete Family
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}