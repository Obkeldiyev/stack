import { useEffect, useState } from "react";
import { familyApi, accountsApi } from "@/lib/api";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { toast } from "sonner";
import "../Landing.css";

export default function ParentFamily() {
  const [families, setFamilies] = useState<any[]>([]);
  const [members, setMembers] = useState<Record<number, any[]>>({});
  const [inviteCodes, setInviteCodes] = useState<Record<number, string>>({});
  const [showQR, setShowQR] = useState<Record<number, boolean>>({});
  const [familyBalances, setFamilyBalances] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  
  // Edit dialog
  const [editDialog, setEditDialog] = useState<{ open: boolean; familyId: number; title: string }>({ open: false, familyId: 0, title: "" });
  const [editLoading, setEditLoading] = useState(false);
  
  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; familyId: number; title: string }>({ open: false, familyId: 0, title: "" });
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Remove member dialog
  const [removeMemberDialog, setRemoveMemberDialog] = useState<{ open: boolean; familyId: number; userId: number; username: string }>({ open: false, familyId: 0, userId: 0, username: "" });
  const [removeMemberLoading, setRemoveMemberLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await familyApi.getMyFamilies();
      const fams = Array.isArray(data) ? data : [];
      setFamilies(fams);
      const membersMap: Record<number, any[]> = {};
      const codesMap: Record<number, string> = {};
      const balancesMap: Record<number, number> = {};
      
      for (const fm of fams) {
        const fid = fm.family?.id ?? fm.id ?? fm.familyId;
        try {
          const mems = await familyApi.getMembers(fid);
          membersMap[fid] = mems;
          
          // Calculate family balance (sum of all member accounts)
          let totalBalance = 0;
          for (const mem of mems) {
            try {
              const accounts = await accountsApi.getMyAccounts();
              totalBalance += accounts.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0);
            } catch {}
          }
          balancesMap[fid] = totalBalance;
        } catch { 
          membersMap[fid] = [];
          balancesMap[fid] = 0;
        }
        
        try {
          const inviteData = await familyApi.getInviteCode(fid);
          codesMap[fid] = inviteData.inviteCode || inviteData.code || "";
        } catch { codesMap[fid] = ""; }
      }
      
      setMembers(membersMap);
      setInviteCodes(codesMap);
      setFamilyBalances(balancesMap);
    } catch { }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleQR = (fid: number) => {
    setShowQR(prev => ({ ...prev, [fid]: !prev[fid] }));
  };

  const handleEditFamily = async () => {
    if (!editDialog.title.trim()) {
      toast.error("Family name cannot be empty");
      return;
    }
    
    setEditLoading(true);
    try {
      await familyApi.update(editDialog.familyId, editDialog.title);
      toast.success("Family updated successfully");
      setEditDialog({ open: false, familyId: 0, title: "" });
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update family");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteFamily = async () => {
    setDeleteLoading(true);
    try {
      await familyApi.delete(deleteDialog.familyId);
      toast.success("Family deleted successfully");
      setDeleteDialog({ open: false, familyId: 0, title: "" });
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete family");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    setRemoveMemberLoading(true);
    try {
      await familyApi.removeMember(removeMemberDialog.familyId, removeMemberDialog.userId);
      toast.success("Member removed successfully");
      setRemoveMemberDialog({ open: false, familyId: 0, userId: 0, username: "" });
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove member");
    } finally {
      setRemoveMemberLoading(false);
    }
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

  if (families.length === 0) {
    return (
      <div className="landing-page">
        <div className="cursor-glow"></div>
        <div className="bg-noise"></div>

        <main>
          <section className="section">
            <div className="container" style={{ maxWidth: "800px" }}>
              <div className="glass" style={{ padding: "48px", borderRadius: "28px", textAlign: "center" }}>
                <i className="fa-solid fa-users" style={{ fontSize: "3rem", color: "#86f0ff", marginBottom: "24px", display: "block" }}></i>
                <h3 style={{ marginBottom: "16px", color: "white" }}>No Families Yet</h3>
                <p style={{ color: "#a5b7d0", margin: 0 }}>
                  Create a family from the dashboard to start managing your children's finances.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>

      <main>
        <section className="section" style={{ paddingTop: "0px", paddingBottom: "40px" }}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <div className="section-head reveal up" style={{ marginBottom: "16px" }}>
              <div className="eyebrow">
                <i className="fa-solid fa-users"></i>
                Family Management
              </div>
              <h2>Manage Your Families</h2>
              <p>View family members, share invite codes, and manage family settings.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {families.map((fm) => {
                const fam = fm.family ?? fm;
                const fid = fam.id ?? fm.familyId;
                const mems = members[fid] ?? [];
                const inviteCode = inviteCodes[fid] || "";
                const isQRVisible = showQR[fid] || false;
                const balance = familyBalances[fid] || 0;
                
                return (
                  <div key={fid} className="glass" style={{ padding: "32px", borderRadius: "28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <i className="fa-solid fa-users" style={{ color: "#86f0ff", fontSize: "1.5rem" }}></i>
                        <h3 style={{ margin: 0, color: "white", letterSpacing: "-0.03em" }}>
                          {fam.title ?? "Family"}
                        </h3>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => setEditDialog({ open: true, familyId: fid, title: fam.title ?? "" })}
                          className="btn btn-outline"
                          style={{ fontSize: "0.9rem", minWidth: "44px" }}
                        >
                          <i className="fa-solid fa-pencil"></i>
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ open: true, familyId: fid, title: fam.title ?? "" })}
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

                    {/* Family Balance */}
                    <div style={{ 
                      padding: "20px", 
                      borderRadius: "16px", 
                      background: "linear-gradient(135deg, rgba(29,100,214,0.15), rgba(25,199,216,0.1))",
                      border: "1px solid rgba(25,199,216,0.2)",
                      marginBottom: "24px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <i className="fa-solid fa-wallet" style={{ color: "#86f0ff", fontSize: "1.2rem" }}></i>
                          <span style={{ color: "white", fontWeight: "600" }}>Family Balance</span>
                        </div>
                        <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "#70cf42" }}>
                          ${(balance / 100).toFixed(2)}
                        </span>
                      </div>
                      <p style={{ margin: "8px 0 0 0", color: "#a5b7d0", fontSize: "0.9rem" }}>
                        Total across all family members
                      </p>
                    </div>

                    {/* Invite Code */}
                    {inviteCode && (
                      <div style={{ marginBottom: "24px" }}>
                        <button
                          onClick={() => toggleQR(fid)}
                          className="btn btn-outline"
                          style={{ width: "100%", marginBottom: "16px" }}
                        >
                          <i className="fa-solid fa-qrcode"></i>
                          {isQRVisible ? "Hide" : "Show"} Invite QR Code
                        </button>
                        
                        {isQRVisible && (
                          <div style={{ 
                            padding: "20px", 
                            borderRadius: "16px", 
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            textAlign: "center"
                          }}>
                            <QRCodeDisplay value={inviteCode} title="Family Invite" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Members List */}
                    <div>
                      <h4 style={{ margin: "0 0 16px 0", color: "white", fontSize: "1.1rem", fontWeight: "600" }}>
                        Members ({mems.length})
                      </h4>
                      {mems.length === 0 ? (
                        <p style={{ color: "#a5b7d0", margin: 0, textAlign: "center", padding: "20px" }}>
                          No members yet. Share the invite code!
                        </p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {mems.map((m: any, i: number) => {
                            const userId = m.user?.id ?? m.userId ?? m.id;
                            const username = m.username ?? m.user?.username ?? "User";
                            const role = m.role ?? m.user?.role ?? "MEMBER";
                            
                            return (
                              <div key={i} style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "16px", 
                                padding: "16px", 
                                borderRadius: "12px", 
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)"
                              }}>
                                <div style={{ 
                                  width: "40px", 
                                  height: "40px", 
                                  borderRadius: "50%", 
                                  background: "linear-gradient(135deg, rgba(134,240,255,0.2), rgba(25,199,216,0.2))",
                                  display: "flex", 
                                  alignItems: "center", 
                                  justifyContent: "center",
                                  border: "1px solid rgba(134,240,255,0.3)"
                                }}>
                                  <i className="fa-solid fa-user" style={{ color: "#86f0ff" }}></i>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "white" }}>
                                    {username}
                                  </p>
                                  <span style={{
                                    padding: "4px 8px",
                                    borderRadius: "999px",
                                    fontSize: "0.75rem",
                                    fontWeight: "600",
                                    background: role === "PARENT" 
                                      ? "linear-gradient(135deg, rgba(29,100,214,0.2), rgba(25,199,216,0.2))" 
                                      : "rgba(255,255,255,0.1)",
                                    color: role === "PARENT" ? "#86f0ff" : "#a5b7d0",
                                    border: "1px solid " + (role === "PARENT" ? "rgba(134,240,255,0.3)" : "rgba(255,255,255,0.1)")
                                  }}>
                                    {role}
                                  </span>
                                </div>
                                {role !== "PARENT" && (
                                  <button
                                    onClick={() => setRemoveMemberDialog({ open: true, familyId: fid, userId, username })}
                                    className="btn btn-outline"
                                    style={{ 
                                      fontSize: "0.9rem", 
                                      minWidth: "44px",
                                      borderColor: "rgba(255,100,100,0.3)",
                                      color: "#ff6b6b"
                                    }}
                                  >
                                    <i className="fa-solid fa-user-minus"></i>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Edit Family Modal */}
      {editDialog.open && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setEditDialog({ open: false, familyId: 0, title: "" })}>
          <div className="glass" style={{
            padding: "36px",
            borderRadius: "28px",
            maxWidth: "500px",
            width: "90%"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: "24px", color: "white" }}>
              Edit Family
            </h3>
            
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                Family Name
              </label>
              <input
                value={editDialog.title}
                onChange={(e) => setEditDialog({ ...editDialog, title: e.target.value })}
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
                onClick={handleEditFamily} 
                disabled={editLoading}
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                {editLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-save"></i>
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={() => setEditDialog({ open: false, familyId: 0, title: "" })}
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
      {deleteDialog.open && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setDeleteDialog({ open: false, familyId: 0, title: "" })}>
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
              Are you sure you want to delete "{deleteDialog.title}"? This action cannot be undone and will remove all family members.
            </p>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setDeleteDialog({ open: false, familyId: 0, title: "" })}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteFamily} 
                disabled={deleteLoading}
                className="btn btn-primary" 
                style={{ 
                  flex: 1,
                  background: "linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)",
                  boxShadow: "0 12px 40px rgba(255, 107, 107, 0.35)"
                }}
              >
                {deleteLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-trash"></i>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Modal */}
      {removeMemberDialog.open && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setRemoveMemberDialog({ open: false, familyId: 0, userId: 0, username: "" })}>
          <div className="glass" style={{
            padding: "36px",
            borderRadius: "28px",
            maxWidth: "500px",
            width: "90%"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", color: "white" }}>
              Remove Member?
            </h3>
            <p style={{ color: "#a5b7d0", marginBottom: "24px", lineHeight: "1.6" }}>
              Are you sure you want to remove "{removeMemberDialog.username}" from the family? They will lose access to family features.
            </p>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setRemoveMemberDialog({ open: false, familyId: 0, userId: 0, username: "" })}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleRemoveMember} 
                disabled={removeMemberLoading}
                className="btn btn-primary" 
                style={{ 
                  flex: 1,
                  background: "linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)",
                  boxShadow: "0 12px 40px rgba(255, 107, 107, 0.35)"
                }}
              >
                {removeMemberLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Removing...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-user-minus"></i>
                    Remove
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}