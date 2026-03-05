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
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.username}!</h1>
        <p className="text-muted-foreground">Manage your family and track your kids' progress.</p>
      </div>

      {/* Create family */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Plus className="h-4 w-4" /> Create Family</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input placeholder="Family name" value={familyTitle} onChange={(e) => setFamilyTitle(e.target.value)} className="min-h-[44px]" />
          <Button onClick={handleCreate} disabled={creating} className="min-h-[44px] shrink-0">
            {creating ? "..." : "Create"}
          </Button>
        </CardContent>
      </Card>

      {/* Families list */}
      {loading ? (
        <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>
      ) : families.length === 0 ? (
        <EmptyState icon={Users} title="No family yet" description="Create a family above and invite your kids!" />
      ) : (
        families.map((fm: any) => {
          const fam = fm.family ?? fm;
          const familyId = fam.id ?? fm.familyId;
          return (
            <Card key={familyId}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> {fam.title ?? "Family"}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(fm)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDelete(fm)} className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" onClick={() => handleInvite(familyId)} className="min-h-[44px]">
                  Generate Invite Code
                </Button>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Coming soon */}
      <Card className="border-dashed">
        <CardContent className="py-8 flex flex-col items-center gap-2 text-center">
          <Clock className="h-8 w-8 text-muted-foreground" />
          <p className="font-medium">Kids Progress</p>
          <p className="text-sm text-muted-foreground">Tasks, goals, and transaction summaries coming soon.</p>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Invite Code</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input value={inviteCode ?? ""} readOnly className="font-mono text-lg min-h-[44px]" />
            <Button size="icon" variant="outline" onClick={copyCode} className="min-h-[44px] min-w-[44px]">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Share this code with your child so they can join.</p>
          <DialogFooter>
            <Button onClick={() => setInviteOpen(false)} className="w-full min-h-[44px]">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Family</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Family Name</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="min-h-[44px]"
                placeholder="Enter family name"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="min-h-[44px]">Cancel</Button>
            <Button onClick={handleEdit} className="min-h-[44px]">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Family?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingFamily?.family?.title || deletingFamily?.title}" and remove all members. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="min-h-[44px] bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
