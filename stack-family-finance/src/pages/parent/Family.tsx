import { useEffect, useState } from "react";
import { familyApi } from "@/lib/api";
import { toast } from "sonner";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { getFamilyId, getFamilyTitle, normalizeFamilyMember } from "@/lib/view-models";

export default function ParentFamily() {
  const [families, setFamilies] = useState<any[]>([]);
  const [members, setMembers] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [inviteFamily, setInviteFamily] = useState<{ id: number; title: string; code: string } | null>(null);
  const [editDialog, setEditDialog] = useState<{ open: boolean; familyId: number; title: string }>({
    open: false,
    familyId: 0,
    title: "",
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; familyId: number; title: string }>({
    open: false,
    familyId: 0,
    title: "",
  });
  const [removeDialog, setRemoveDialog] = useState<{ open: boolean; familyId: number; userId: number; username: string }>({
    open: false,
    familyId: 0,
    userId: 0,
    username: "",
  });

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await familyApi.getMyFamilies();
      const memberships = Array.isArray(data) ? data : [];
      setFamilies(memberships);

      const memberEntries = await Promise.all(
        memberships.map(async (record: any) => {
          const familyId = getFamilyId(record);
          if (!familyId) return [0, []] as const;

          try {
            const familyMembers = await familyApi.getMembers(familyId);
            return [familyId, familyMembers.map(normalizeFamilyMember)] as const;
          } catch {
            return [familyId, []] as const;
          }
        })
      );

      setMembers(Object.fromEntries(memberEntries));
    } catch (error: any) {
      toast.error(error.message || "Failed to load families");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (familyId: number, title: string) => {
    try {
      const result = await familyApi.invite(familyId);
      setInviteFamily({ id: familyId, title, code: result.code });
    } catch (error: any) {
      toast.error(error.message || "Failed to create invite code");
    }
  };

  const handleEditFamily = async () => {
    if (!editDialog.title.trim()) {
      toast.error("Family name cannot be empty.");
      return;
    }

    try {
      await familyApi.update(editDialog.familyId, editDialog.title.trim());
      toast.success("Family updated.");
      setEditDialog({ open: false, familyId: 0, title: "" });
      await loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update family");
    }
  };

  const handleDeleteFamily = async () => {
    try {
      await familyApi.delete(deleteDialog.familyId);
      toast.success("Family deleted.");
      setDeleteDialog({ open: false, familyId: 0, title: "" });
      await loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete family");
    }
  };

  const handleRemoveMember = async () => {
    try {
      await familyApi.removeMember(removeDialog.familyId, removeDialog.userId);
      toast.success("Member removed.");
      setRemoveDialog({ open: false, familyId: 0, userId: 0, username: "" });
      await loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove member");
    }
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    toast.success("Invite code copied.");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container dashboard-stack">
        <section className="dashboard-hero">
          <div className="dashboard-eyebrow">
            <i className="fa-solid fa-people-roof"></i>
            Family control
          </div>
          <h1 className="dashboard-title">Manage members without generating clutter.</h1>
          <p className="dashboard-copy">
            Families are listed with their actual members. Invite codes are created only when you ask for one, so reloads do not generate new codes by accident.
          </p>
        </section>

        <section className="panel-card">
          <div className="section-title">
            <div>
              <h2 className="section-heading">Your families</h2>
              <p className="section-subtitle">Edit names, remove children, and create an invite code when needed.</p>
            </div>
          </div>

          {loading ? (
            <div className="empty-panel">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <p className="section-subtitle">Loading families...</p>
            </div>
          ) : families.length === 0 ? (
            <div className="empty-panel">
              <i className="fa-solid fa-users"></i>
              <h3 className="section-heading" style={{ fontSize: "1.2rem" }}>No families yet</h3>
              <p className="section-subtitle">Create one from the dashboard and it will appear here.</p>
            </div>
          ) : (
            <div className="family-card">
              {families.map((record: any) => {
                const familyId = getFamilyId(record);
                const title = getFamilyTitle(record);
                const familyMembers = members[familyId] ?? [];
                const childCount = familyMembers.filter((member) => member.role === "CHILD").length;

                return (
                  <div key={familyId} className="panel-card" style={{ padding: "20px" }}>
                    <div className="section-title">
                      <div>
                        <h3 className="section-heading">{title}</h3>
                        <p className="section-subtitle">{familyMembers.length} members, {childCount} child accounts connected</p>
                      </div>
                      <div className="button-row" style={{ justifyContent: "flex-end" }}>
                        <button className="btn btn-outline" onClick={() => handleInvite(familyId, title)}>
                          <i className="fa-solid fa-qrcode"></i>
                          Invite
                        </button>
                        <button className="btn btn-outline" onClick={() => setEditDialog({ open: true, familyId, title })}>
                          <i className="fa-solid fa-pen"></i>
                          Edit
                        </button>
                        <button className="btn btn-outline" onClick={() => setDeleteDialog({ open: true, familyId, title })}>
                          <i className="fa-solid fa-trash"></i>
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="goal-list">
                      {familyMembers.map((member) => (
                        <div key={`${familyId}-${member.userId}`} className="info-row">
                          <div>
                            <strong>{member.username}</strong>
                            <div className="muted-copy" style={{ marginTop: "4px" }}>{member.role}</div>
                          </div>
                          {member.role !== "PARENT" && (
                            <button
                              className="btn btn-outline"
                              onClick={() =>
                                setRemoveDialog({
                                  open: true,
                                  familyId,
                                  userId: member.userId,
                                  username: member.username,
                                })
                              }
                            >
                              <i className="fa-solid fa-user-minus"></i>
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {inviteFamily && (
        <div className="modal-overlay" onClick={() => setInviteFamily(null)}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">Invite to {inviteFamily.title}</h3>
            <p className="section-subtitle">Share this code or let the child scan the QR code.</p>
            <div className="info-row" style={{ marginTop: "18px", alignItems: "center" }}>
              <div>
                <div className="muted-heading" style={{ marginBottom: "6px" }}>Invite code</div>
                <strong style={{ fontSize: "1.6rem", letterSpacing: "0.18em" }}>{inviteFamily.code}</strong>
              </div>
              <button className="btn btn-primary" onClick={() => copyCode(inviteFamily.code)}>
                <i className="fa-solid fa-copy"></i>
                Copy
              </button>
            </div>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
              <QRCodeDisplay value={inviteFamily.code} />
            </div>
          </div>
        </div>
      )}

      {editDialog.open && (
        <div className="modal-overlay" onClick={() => setEditDialog({ open: false, familyId: 0, title: "" })}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">Edit family</h3>
            <input
              className="dashboard-input"
              style={{ marginTop: "18px" }}
              value={editDialog.title}
              onChange={(event) => setEditDialog({ ...editDialog, title: event.target.value })}
              placeholder="Family name"
            />
            <div className="button-row" style={{ marginTop: "18px" }}>
              <button className="btn btn-primary" onClick={handleEditFamily}>Save changes</button>
              <button className="btn btn-outline" onClick={() => setEditDialog({ open: false, familyId: 0, title: "" })}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteDialog.open && (
        <div className="modal-overlay" onClick={() => setDeleteDialog({ open: false, familyId: 0, title: "" })}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">Delete family</h3>
            <p className="section-subtitle">This removes {deleteDialog.title} and all related memberships.</p>
            <div className="button-row" style={{ marginTop: "18px" }}>
              <button className="btn btn-primary" onClick={handleDeleteFamily}>Delete family</button>
              <button className="btn btn-outline" onClick={() => setDeleteDialog({ open: false, familyId: 0, title: "" })}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {removeDialog.open && (
        <div className="modal-overlay" onClick={() => setRemoveDialog({ open: false, familyId: 0, userId: 0, username: "" })}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">Remove member</h3>
            <p className="section-subtitle">Remove {removeDialog.username} from this family? They can join again with a new invite code.</p>
            <div className="button-row" style={{ marginTop: "18px" }}>
              <button className="btn btn-primary" onClick={handleRemoveMember}>Remove member</button>
              <button className="btn btn-outline" onClick={() => setRemoveDialog({ open: false, familyId: 0, userId: 0, username: "" })}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
