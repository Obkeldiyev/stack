import { useEffect, useState } from "react";
import { dashboardApi, accountsApi, familyApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Users, TrendingUp, Target, Send, Coins, Plus, Copy, Pencil, Trash2 } from "lucide-react";

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
  
  const { toast } = useToast();
  const user = getUser();

  const fetchDashboard = async () => {
    try {
      const data = await dashboardApi.getParentDashboard();
      setDashboard(data);
    } catch (err: any) {
      console.error('Error fetching dashboard:', err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
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
      toast({ title: "Family created!" });
      setFamilyTitle("");
      fetchDashboard();
    } catch (err: any) {
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
      toast({ title: "Error", description: err.message, variant: "destructive" });
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
      toast({ title: "Family updated!" });
      setEditOpen(false);
      fetchDashboard();
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
    try {
      await familyApi.delete(deletingFamily.familyId);
      toast({ title: "Family deleted!" });
      setDeleteOpen(false);
      fetchDashboard();
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
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    
    const amountInCents = Math.round(amount * 100);

    setTransferring(true);
    try {
      await accountsApi.transfer(selectedChild.childId, amountInCents, transferNote || undefined);
      toast({ title: "Transfer successful!", description: `Sent $${amount.toFixed(2)} to ${selectedChild.childUsername}` });
      setTransferOpen(false);
      setTransferAmount("");
      setTransferNote("");
      fetchDashboard();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Transfer failed", variant: "destructive" });
    } finally {
      setTransferring(false);
    }
  };

  const formatMoney = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <p>Unable to load dashboard</p>
      </div>
    );
  }

  const { families, totalStats } = dashboard;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Family Banking</h1>
        <p className="text-muted-foreground">Monitor and manage your family's finances.</p>
      </div>

      {/* Create Family Section */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-5 w-5" /> Create New Family
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Input
            placeholder="Enter family name"
            value={familyTitle}
            onChange={(e) => setFamilyTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreateFamily()}
            className="min-h-[48px] text-base"
          />
          <Button
            onClick={handleCreateFamily}
            disabled={creating || !familyTitle.trim()}
            className="min-h-[48px] px-8 text-base font-semibold"
            size="lg"
          >
            {creating ? "Creating..." : "Create Family"}
          </Button>
        </CardContent>
      </Card>

      {/* Total Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Family Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatMoney(totalStats.totalBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all children</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStats.activeGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalStats.completedGoals} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Families</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{families.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Managed by you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Children</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {families.reduce((sum: number, f: any) => sum + f.children.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total members</p>
          </CardContent>
        </Card>
      </div>

      {/* Families */}
      {families.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No families yet</p>
            <p className="text-sm text-muted-foreground">Create a family to get started</p>
          </CardContent>
        </Card>
      ) : (
        families.map((family: any) => (
          <Card key={family.familyId}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {family.familyTitle}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold">{formatMoney(family.totalBalance)}</div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInvite(family.familyId)}
                      className="min-h-[40px]"
                    >
                      <Copy className="h-4 w-4 mr-1" /> Invite Code
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(family)}
                      className="h-10 w-10"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDelete(family)}
                      className="h-10 w-10 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {family.children.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No children in this family yet
                </p>
              ) : (
                <div className="space-y-4">
                  {family.children.map((child: any) => (
                    <div key={child.childId} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{child.childUsername}</h3>
                          <p className="text-sm text-muted-foreground">
                            {child.accounts.length} account{child.accounts.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{formatMoney(child.totalBalance)}</div>
                          <Button
                            size="sm"
                            onClick={() => openTransfer(child)}
                            className="mt-2 min-h-[44px]"
                          >
                            <Send className="h-4 w-4 mr-1" /> Send Money
                          </Button>
                        </div>
                      </div>

                      {/* Child Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Active Goals</p>
                          <p className="text-lg font-semibold flex items-center gap-1">
                            <Target className="h-4 w-4 text-primary" />
                            {child.activeGoals}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Completed Tasks</p>
                          <p className="text-lg font-semibold flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            {child.completedTasks}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Accounts</p>
                          <p className="text-lg font-semibold flex items-center gap-1">
                            <Wallet className="h-4 w-4 text-blue-600" />
                            {child.accounts.length}
                          </p>
                        </div>
                      </div>

                      {/* Accounts List */}
                      {child.accounts.length > 0 && (
                        <div className="space-y-2 pt-3 border-t">
                          <p className="text-sm font-medium">Accounts:</p>
                          {child.accounts.map((account: any) => (
                            <div key={account.id} className="flex justify-between items-center text-sm bg-muted/50 rounded p-2">
                              <span className="flex items-center gap-2">
                                <Coins className="h-4 w-4" />
                                {account.type}
                              </span>
                              <span className="font-semibold">{formatMoney(account.balance)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}

      {/* Transfer Dialog */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Money to {selectedChild?.childUsername}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="transfer-amount">Amount ($)</Label>
              <Input
                id="transfer-amount"
                type="number"
                step="0.01"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0.00"
                className="min-h-[44px]"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="transfer-note">Note (optional)</Label>
              <Input
                id="transfer-note"
                value={transferNote}
                onChange={(e) => setTransferNote(e.target.value)}
                placeholder="e.g., Weekly allowance"
                className="min-h-[44px]"
              />
            </div>
            {transferAmount && parseFloat(transferAmount) > 0 && (
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Transfer Summary:</p>
                <p className="text-lg font-bold mt-1">
                  ${parseFloat(transferAmount).toFixed(2)} → {selectedChild?.childUsername}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setTransferOpen(false)} className="min-h-[44px]">
              Cancel
            </Button>
            <Button onClick={handleTransfer} disabled={transferring} className="min-h-[44px]">
              {transferring ? "Sending..." : "Send Money"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Code Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Family Invite Code</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input value={inviteCode ?? ""} readOnly className="font-mono text-lg min-h-[44px]" />
            <Button size="icon" variant="outline" onClick={copyCode} className="min-h-[44px] min-w-[44px]">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Share this code with your child so they can join the family.</p>
          <DialogFooter>
            <Button onClick={() => setInviteOpen(false)} className="w-full min-h-[44px]">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Family Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Family Name</DialogTitle>
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
            <Button onClick={handleEdit} className="min-h-[44px]">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Family Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Family?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingFamily?.familyTitle}" and remove all members. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="min-h-[44px] bg-destructive hover:bg-destructive/90">
              Delete Family
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
