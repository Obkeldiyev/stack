import { useEffect, useState } from "react";
import { familyApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { toast } from "sonner";
import { Users, QrCode, Copy, Pencil, Trash2, UserMinus, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";

export default function ParentFamily() {
  const [families, setFamilies] = useState<any[]>([]);
  const [members, setMembers] = useState<Record<number, any[]>>({});
  const [inviteCodes, setInviteCodes] = useState<Record<number, string>>({});
  const [showQR, setShowQR] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState<{ open: boolean; familyId: number; title: string }>({ open: false, familyId: 0, title: "" });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; familyId: number; title: string }>({ open: false, familyId: 0, title: "" });
  const [removeMemberDialog, setRemoveMemberDialog] = useState<{ open: boolean; familyId: number; userId: number; username: string }>({ open: false, familyId: 0, userId: 0, username: "" });
  const user = getUser();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await familyApi.getMyFamilies();
      const fams = Array.isArray(data) ? data : [];
      setFamilies(fams);
      const membersMap: Record<number, any[]> = {};
      const codesMap: Record<number, string> = {};
      
      for (const fm of fams) {
        const fid = fm.family?.id ?? fm.id ?? fm.familyId;
        try {
          const mems = await familyApi.getMembers(fid);
          membersMap[fid] = mems;
        } catch { membersMap[fid] = []; }
        
        try {
          const inviteData = await familyApi.getInviteCode(fid);
          codesMap[fid] = inviteData.inviteCode || inviteData.code || "";
        } catch { codesMap[fid] = ""; }
      }
      
      setMembers(membersMap);
      setInviteCodes(codesMap);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const toggleQR = (fid: number) => {
    setShowQR(prev => ({ ...prev, [fid]: !prev[fid] }));
  };

  const handleEditFamily = async () => {
    if (!editDialog.title.trim()) {
      toast.error("Family name cannot be empty");
      return;
    }
    try {
      await familyApi.update(editDialog.familyId, editDialog.title);
      toast.success("Family updated!");
      setEditDialog({ open: false, familyId: 0, title: "" });
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update family");
    }
  };

  const handleDeleteFamily = async () => {
    try {
      await familyApi.delete(deleteDialog.familyId);
      toast.success("Family deleted!");
      setDeleteDialog({ open: false, familyId: 0, title: "" });
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete family");
    }
  };

  const handleRemoveMember = async () => {
    try {
      await familyApi.removeMember(removeMemberDialog.familyId, removeMemberDialog.userId);
      toast.success("Member removed!");
      setRemoveMemberDialog({ open: false, familyId: 0, userId: 0, username: "" });
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove member");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-slate-400 text-sm">Family Management</p>
            <h1 className="text-2xl font-bold text-white">Your Families</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Family Management</h1>
        <p className="text-slate-400">Manage your families and invite members</p>
      </div>

      <div className="px-4 md:px-6 pb-24 md:pb-8 space-y-4">
        {loading ? (
          <div className="space-y-3">
            <div className="h-48 bg-slate-800/50 rounded-2xl animate-pulse" />
            <div className="h-48 bg-slate-800/50 rounded-2xl animate-pulse" />
          </div>
        ) : families.length === 0 ? (
          <div className="bg-slate-800/30 rounded-2xl p-12 text-center border border-slate-700/50">
            <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-300 font-medium text-lg mb-2">No families yet</p>
            <p className="text-slate-500">Go to Dashboard to create your first family</p>
          </div>
        ) : (
          families.map((fm: any) => {
            const fam = fm.family ?? fm;
            const familyId = fam.id ?? fm.familyId;
            const familyMembers = members[familyId] || [];
            const inviteCode = inviteCodes[familyId] || "";
            const showQRCode = showQR[familyId] || false;

            return (
              <div key={familyId} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                {/* Family Header */}
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-5 border-b border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{fam.title ?? "Family"}</h3>
                        <p className="text-slate-400 text-sm">{familyMembers.length} members</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditDialog({ open: true, familyId, title: fam.title ?? "" })}
                        className="w-9 h-9 rounded-lg bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center transition-colors"
                      >
                        <Pencil className="h-4 w-4 text-slate-300" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ open: true, familyId, title: fam.title ?? "" })}
                        className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Invite Code Section */}
                  {inviteCode && (
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-400 text-xs font-medium">INVITE CODE</p>
                        <button
                          onClick={() => toggleQR(familyId)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <QrCode className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xl font-mono font-bold text-white tracking-wider">{inviteCode}</code>
                        <button
                          onClick={() => copyCode(inviteCode)}
                          className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
                        >
                          <Copy className="h-5 w-5 text-white" />
                        </button>
                      </div>
                      {showQRCode && (
                        <div className="mt-4 flex justify-center">
                          <QRCodeDisplay value={inviteCode} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Members List */}
                <div className="p-5">
                  <h4 className="text-slate-300 font-semibold text-sm mb-3">MEMBERS ({familyMembers.length})</h4>
                  <div className="space-y-2">
                    {familyMembers.map((mem: any) => (
                      <div key={mem.user?.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/30 hover:bg-slate-900/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                            {mem.user?.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{mem.user?.username}</p>
                            <p className="text-slate-400 text-xs uppercase">{mem.memberRole || mem.role}</p>
                          </div>
                        </div>
                        {mem.memberRole !== "PARENT" && mem.role !== "PARENT" && (
                          <button
                            onClick={() => setRemoveMemberDialog({ open: true, familyId, userId: mem.user?.id, username: mem.user?.username })}
                            className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                          >
                            <UserMinus className="h-4 w-4 text-red-400" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ ...editDialog, open })}>
        <DialogContent className="sm:max-w-sm bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Family</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              value={editDialog.title}
              onChange={(e) => setEditDialog({ ...editDialog, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Family name"
            />
          </div>
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <button
              onClick={() => setEditDialog({ open: false, familyId: 0, title: "" })}
              className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleEditFamily}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Family?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete "{deleteDialog.title}" and remove all members. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <button
              onClick={() => setDeleteDialog({ open: false, familyId: 0, title: "" })}
              className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteFamily}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
            >
              Delete Family
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Member Dialog */}
      <AlertDialog open={removeMemberDialog.open} onOpenChange={(open) => setRemoveMemberDialog({ ...removeMemberDialog, open })}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Remove Member?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Remove "{removeMemberDialog.username}" from this family? They can rejoin with an invite code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <button
              onClick={() => setRemoveMemberDialog({ open: false, familyId: 0, userId: 0, username: "" })}
              className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleRemoveMember}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
            >
              Remove Member
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
