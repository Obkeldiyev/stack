import { useEffect, useState } from "react";
import { familyApi, accountsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonCard } from "@/components/SkeletonCard";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { Users, UserCircle, QrCode, Edit, Trash2, Wallet, UserMinus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  
  const { toast } = useToast();

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
      toast({ title: "Error", description: "Family name cannot be empty", variant: "destructive" });
      return;
    }
    
    setEditLoading(true);
    try {
      await familyApi.update(editDialog.familyId, editDialog.title);
      toast({ title: "Success", description: "Family updated successfully" });
      setEditDialog({ open: false, familyId: 0, title: "" });
      loadData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update family", variant: "destructive" });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteFamily = async () => {
    setDeleteLoading(true);
    try {
      await familyApi.delete(deleteDialog.familyId);
      toast({ title: "Success", description: "Family deleted successfully" });
      setDeleteDialog({ open: false, familyId: 0, title: "" });
      loadData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to delete family", variant: "destructive" });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    setRemoveMemberLoading(true);
    try {
      await familyApi.removeMember(removeMemberDialog.familyId, removeMemberDialog.userId);
      toast({ title: "Success", description: "Member removed successfully" });
      setRemoveMemberDialog({ open: false, familyId: 0, userId: 0, username: "" });
      loadData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to remove member", variant: "destructive" });
    } finally {
      setRemoveMemberLoading(false);
    }
  };

  if (loading) return <div className="max-w-2xl mx-auto space-y-4"><SkeletonCard /><SkeletonCard /></div>;

  if (families.length === 0) {
    return <EmptyState icon={Users} title="No family" description="Create a family from the dashboard." />;
  }

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Family Management</h1>
        {families.map((fm) => {
          const fam = fm.family ?? fm;
          const fid = fam.id ?? fm.familyId;
          const mems = members[fid] ?? [];
          const inviteCode = inviteCodes[fid] || "";
          const isQRVisible = showQR[fid] || false;
          const balance = familyBalances[fid] || 0;
          
          return (
            <Card key={fid}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> {fam.title ?? "Family"}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditDialog({ open: true, familyId: fid, title: fam.title ?? "" })}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialog({ open: true, familyId: fid, title: fam.title ?? "" })}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Family Balance */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Family Balance</span>
                    </div>
                    <span className="text-lg font-bold">{balance.toLocaleString()} coins</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total across all family members</p>
                </div>

                {/* Invite Code */}
                {inviteCode && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => toggleQR(fid)}
                      className="w-full min-h-[44px]"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      {isQRVisible ? "Hide" : "Show"} Invite QR Code
                    </Button>
                    
                    {isQRVisible && (
                      <div className="animate-fade-in">
                        <QRCodeDisplay value={inviteCode} title="Family Invite" />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Members List */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Members ({mems.length})</h3>
                  {mems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No members yet. Share the invite code!</p>
                  ) : (
                    <div className="space-y-2">
                      {mems.map((m: any, i: number) => {
                        const userId = m.user?.id ?? m.userId ?? m.id;
                        const username = m.username ?? m.user?.username ?? "User";
                        const role = m.role ?? m.user?.role ?? "MEMBER";
                        
                        return (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                            <UserCircle className="h-8 w-8 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{username}</p>
                            </div>
                            <Badge variant={role === "PARENT" ? "default" : "secondary"}>
                              {role}
                            </Badge>
                            {role !== "PARENT" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setRemoveMemberDialog({ open: true, familyId: fid, userId, username })}
                              >
                                <UserMinus className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Family Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ ...editDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Family</DialogTitle>
            <DialogDescription>Update your family name</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="family-name">Family Name</Label>
              <Input
                id="family-name"
                value={editDialog.title}
                onChange={(e) => setEditDialog({ ...editDialog, title: e.target.value })}
                placeholder="Enter family name"
                className="min-h-[44px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, familyId: 0, title: "" })}>
              Cancel
            </Button>
            <Button onClick={handleEditFamily} disabled={editLoading}>
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Family Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Family?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.title}"? This action cannot be undone and will remove all family members.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFamily} disabled={deleteLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Member Dialog */}
      <AlertDialog open={removeMemberDialog.open} onOpenChange={(open) => setRemoveMemberDialog({ ...removeMemberDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{removeMemberDialog.username}" from the family? They will lose access to family features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember} disabled={removeMemberLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {removeMemberLoading ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
