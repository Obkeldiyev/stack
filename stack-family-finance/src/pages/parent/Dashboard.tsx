import { useEffect, useState } from "react";
import { familyApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useToast } from "@/hooks/use-toast";
import { Users, Copy, Plus, Clock, Pencil, Trash2 } from "lucide-react";

export default function ParentDashboard() {
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [familyTitle, setFamilyTitle] = useState("");
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingFamily, setDeletingFamily] = useState<any>(null);
  const { toast } = useToast();
  const user = getUser();

  const fetchFamilies = async () => {
    try {
      const data = await familyApi.getMyFamilies();
      setFamilies(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching families:', err);
      setFamilies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFamilies(); }, []);

  const handleCreate = async () => {
    if (!familyTitle.trim()) return;
    setCreating(true);
    try {
      await familyApi.create(familyTitle);
      toast({ title: "Family created!" });
      setFamilyTitle("");
      fetchFamilies();
    } catch (err: any) {
      console.error('Error creating family:', err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
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
      console.error('Error creating invite:', err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const openEdit = (family: any) => {
    setEditingFamily(family);
    setEditTitle(family.family?.title || family.title || "");
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editTitle.trim() || !editingFamily) return;
    const familyId = editingFamily.family?.id || editingFamily.familyId || editingFamily.id;
    try {
      await familyApi.update(familyId, editTitle);
      toast({ title: "Family updated!" });
      setEditOpen(false);
      fetchFamilies();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const openDelete = (family: any) => {
    setDeletingFamily(family);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingFamily) return;
    const familyId = deletingFamily.family?.id || deletingFamily.familyId || deletingFamily.id;
    try {
      await familyApi.delete(familyId);
      toast({ title: "Family deleted!" });
      setDeleteOpen(false);
      fetchFamilies();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const copyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast({ title: "Copied!" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-slate-400 text-sm">Welcome back</p>
            <h1 className="text-2xl font-bold text-white">{user?.username}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Family Management</h1>
        <p className="text-slate-400">Create families, invite children, and track their progress</p>
      </div>

      <div className="px-4 md:px-6 pb-24 md:pb-8 space-y-4">
        {/* Create Family Card - Mobile Optimized */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Plus className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-white font-semibold text-lg">Create New Family</h2>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter family name"
              value={familyTitle}
              onChange={(e) => setFamilyTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
            />
            <button
              onClick={handleCreate}
              disabled={creating}
              className="w-full py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-white/90 transition-all active:scale-95 disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Family"}
            </button>
          </div>
        </div>

        {/* Families List - Mobile Optimized */}
        {loading ? (
          <div className="space-y-3">
            <div className="h-32 bg-slate-800/50 rounded-2xl animate-pulse" />
            <div className="h-32 bg-slate-800/50 rounded-2xl animate-pulse" />
          </div>
        ) : families.length === 0 ? (
          <div className="bg-slate-800/30 rounded-2xl p-8 text-center border border-slate-700/50">
            <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-medium mb-1">No families yet</p>
            <p className="text-slate-500 text-sm">Create your first family above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {families.map((fm: any) => {
              const fam = fm.family ?? fm;
              const familyId = fam.id ?? fm.familyId;
              return (
                <div key={familyId} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{fam.title ?? "Family"}</h3>
                        <p className="text-slate-400 text-xs">Family Group</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(fm)}
                        className="w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center transition-colors"
                      >
                        <Pencil className="h-4 w-4 text-slate-300" />
                      </button>
                      <button
                        onClick={() => openDelete(fm)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleInvite(familyId)}
                    className="w-full py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-white font-medium transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Generate Invite Code
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-sm bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Invite Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-xs mb-2">Share this code with your child</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-2xl font-mono font-bold text-white tracking-wider">{inviteCode}</code>
                <button
                  onClick={copyCode}
                  className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
                >
                  <Copy className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            <p className="text-slate-400 text-sm text-center">They can use this code to join your family</p>
          </div>
          <DialogFooter>
            <button
              onClick={() => setInviteOpen(false)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
            >
              Done
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Family</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title" className="text-slate-300">Family Name</Label>
              <input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter family name"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <button
              onClick={() => setEditOpen(false)}
              className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Family?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete "{deletingFamily?.family?.title || deletingFamily?.title}" and remove all members. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <button
              onClick={() => setDeleteOpen(false)}
              className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
            >
              Delete Family
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
