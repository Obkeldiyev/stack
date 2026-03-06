import { useEffect, useState } from "react";
import { dashboardApi, accountsApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Users, TrendingUp, Target, Send, Coins } from "lucide-react";

export default function ParentBankingDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferNote, setTransferNote] = useState("");
  const [transferring, setTransferring] = useState(false);
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

  const openTransfer = (child: any) => {
    setSelectedChild(child);
    setTransferAmount("");
    setTransferNote("");
    setTransferOpen(true);
  };

  const handleTransfer = async () => {
    if (!selectedChild || !transferAmount) return;
    const amount = Math.round(parseFloat(transferAmount) * 100);
    if (amount <= 0) return;

    setTransferring(true);
    try {
      await accountsApi.transfer(selectedChild.childId, amount, transferNote || undefined);
      toast({ title: "Transfer successful!" });
      setTransferOpen(false);
      fetchDashboard();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
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
                <div className="text-2xl font-bold">{formatMoney(family.totalBalance)}</div>
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
    </div>
  );
}
