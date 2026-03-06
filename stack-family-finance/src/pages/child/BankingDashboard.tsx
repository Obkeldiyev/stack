import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardApi, goalsApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useToast } from "@/hooks/use-toast";
import { Wallet, TrendingUp, TrendingDown, Target, Plus, ArrowUpRight, ArrowDownRight, Coins, Gamepad2, Users } from "lucide-react";
import { format } from "date-fns";

export default function ChildBankingDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [goalOpen, setGoalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getUser();

  const fetchDashboard = async () => {
    try {
      const data = await dashboardApi.getChildDashboard();
      setDashboard(data);
    } catch (err: any) {
      console.error('Error fetching dashboard:', err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const handleCreateGoal = async () => {
    if (!goalTitle.trim() || !goalAmount) return;
    const amount = Math.round(parseFloat(goalAmount) * 100);
    if (amount <= 0) return;

    try {
      await goalsApi.create(goalTitle, amount);
      toast({ title: "Goal created!" });
      setGoalTitle("");
      setGoalAmount("");
      setGoalOpen(false);
      fetchDashboard();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const formatMoney = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "DEPOSIT":
      case "PARENT_TRANSFER":
      case "TASK_REWARD":
      case "GAME_REWARD":
      case "ALLOWANCE":
        return <ArrowDownRight className="h-4 w-4 text-green-600" />;
      case "WITHDRAWAL":
      case "GOAL_SAVE":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      default:
        return <Coins className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "DEPOSIT":
      case "PARENT_TRANSFER":
      case "TASK_REWARD":
      case "GAME_REWARD":
      case "ALLOWANCE":
        return "text-green-600";
      case "WITHDRAWAL":
      case "GOAL_SAVE":
        return "text-red-600";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p>Unable to load dashboard</p>
      </div>
    );
  }

  const { currentAccount, allAccounts, recentTransactions, activeGoals, stats } = dashboard;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Hey, {user?.username}! 👋</h1>
        <p className="text-muted-foreground">Manage your money and reach your goals.</p>
      </div>

      {/* Main Balance Card - Prominent */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your Balance</p>
              <p className="text-5xl font-bold">{formatMoney(stats.totalBalance)}</p>
              <p className="text-sm text-muted-foreground mt-2">Across all accounts</p>
            </div>
            <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          onClick={() => navigate("/child/games")} 
          className="h-24 flex-col gap-2 hover:bg-primary/5 hover:border-primary"
        >
          <Gamepad2 className="h-8 w-8 text-primary" />
          <span className="font-medium">Play Games</span>
          <span className="text-xs text-muted-foreground">Earn coins!</span>
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setGoalOpen(true)} 
          className="h-24 flex-col gap-2 hover:bg-primary/5 hover:border-primary"
        >
          <Target className="h-8 w-8 text-primary" />
          <span className="font-medium">New Goal</span>
          <span className="text-xs text-muted-foreground">Start saving</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.completedGoals} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Savings Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeGoals.map((goal: any) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{goal.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatMoney(goal.savedAmount)} / {formatMoney(goal.targetAmount)}
                  </span>
                </div>
                <Progress value={goal.progressPercent} className="h-2" />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{goal.progressPercent}% complete</span>
                  <span>{formatMoney(goal.targetAmount - goal.savedAmount)} to go</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.slice(0, 5).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.type.replace(/_/g, " ")}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.note || "No description"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getTransactionColor(tx.type)}`}>
                      {tx.type.includes("WITHDRAWAL") || tx.type.includes("GOAL") ? "-" : "+"}
                      {formatMoney(tx.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(tx.createdAt), "MMM d")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Goal Dialog */}
      <Dialog open={goalOpen} onOpenChange={setGoalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Savings Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goal-title">Goal Name</Label>
              <Input
                id="goal-title"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g., New Bike"
                className="min-h-[44px]"
              />
            </div>
            <div>
              <Label htmlFor="goal-amount">Target Amount ($)</Label>
              <Input
                id="goal-amount"
                type="number"
                step="0.01"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="0.00"
                className="min-h-[44px]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setGoalOpen(false)} className="min-h-[44px]">
              Cancel
            </Button>
            <Button onClick={handleCreateGoal} className="min-h-[44px]">
              Create Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
