import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardApi, goalsApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { toast } from "sonner";
import { format } from "date-fns";
import { formatCurrencyFromCents } from "@/lib/view-models";

export default function ChildBankingDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [goalOpen, setGoalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    void fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await dashboardApi.getChildDashboard();
      setDashboard(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!goalTitle.trim() || !goalAmount) return;
    const cents = Math.round(Number(goalAmount) * 100);
    if (!cents || cents <= 0) {
      toast.error("Enter a valid goal amount.");
      return;
    }

    try {
      await goalsApi.create(goalTitle.trim(), cents);
      toast.success("Goal created.");
      setGoalTitle("");
      setGoalAmount("");
      setGoalOpen(false);
      await fetchDashboard();
    } catch (error: any) {
      toast.error(error.message || "Failed to create goal");
    }
  };

  const stats = dashboard?.stats ?? { totalBalance: 0, activeGoals: 0, completedGoals: 0, totalTransactions: 0 };
  const currentAccount = dashboard?.currentAccount;
  const accounts = dashboard?.allAccounts ?? [];
  const activeGoals = dashboard?.activeGoals ?? [];
  const recentTransactions = dashboard?.recentTransactions ?? [];

  const getTransactionTone = (type: string) => {
    if (["DEPOSIT", "PARENT_TRANSFER", "TASK_REWARD", "GAME_REWARD", "ALLOWANCE"].includes(type)) {
      return { icon: "fa-solid fa-arrow-down", color: "#70cf42", prefix: "+" };
    }
    if (["WITHDRAWAL", "GOAL_SAVE"].includes(type)) {
      return { icon: "fa-solid fa-arrow-up", color: "#ff7d7d", prefix: "-" };
    }
    return { icon: "fa-solid fa-coins", color: "#86f0ff", prefix: "" };
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container dashboard-stack">
        <section className="dashboard-hero">
          <div className="dashboard-eyebrow">
            <i className="fa-solid fa-sparkles"></i>
            Welcome back{user?.username ? `, ${user.username}` : ""}
          </div>
          <h1 className="dashboard-title">Your money should feel easy to track.</h1>
          <p className="dashboard-copy">
            See your balance, create savings goals, and jump into games or tasks without the dashboard breaking on a phone screen.
          </p>
          <div className="hero-balance">
            <div className="hero-balance-value">{formatCurrencyFromCents(stats.totalBalance)}</div>
            <div className="hero-balance-meta">
              {currentAccount ? `${currentAccount.type} account selected` : "Across all your accounts"}
            </div>
          </div>
        </section>

        <section className="dashboard-grid two-up">
          <button className="panel-card action-card" onClick={() => navigate("/child/games")}>
            <div className="stat-icon"><i className="fa-solid fa-gamepad"></i></div>
            <div className="section-heading">Play games</div>
            <p className="section-subtitle">Earn rewards and keep learning with the mini games.</p>
          </button>
          <button className="panel-card action-card" onClick={() => setGoalOpen(true)}>
            <div className="stat-icon"><i className="fa-solid fa-bullseye"></i></div>
            <div className="section-heading">Create goal</div>
            <p className="section-subtitle">Set a savings target from the dashboard without leaving the page.</p>
          </button>
        </section>

        <section className="dashboard-grid stats">
          <div className="panel-card stat-card">
            <div className="stat-icon"><i className="fa-solid fa-bullseye"></i></div>
            <div className="stat-value">{stats.activeGoals}</div>
            <div className="stat-label">{stats.completedGoals} goals already completed.</div>
          </div>
          <div className="panel-card stat-card">
            <div className="stat-icon"><i className="fa-solid fa-receipt"></i></div>
            <div className="stat-value">{stats.totalTransactions}</div>
            <div className="stat-label">Transactions recorded across your accounts.</div>
          </div>
          <div className="panel-card stat-card">
            <div className="stat-icon"><i className="fa-solid fa-wallet"></i></div>
            <div className="stat-value">{accounts.length}</div>
            <div className="stat-label">Accounts available for spending and saving.</div>
          </div>
        </section>

        <section className="dashboard-grid two-up">
          <div className="panel-card">
            <div className="section-title">
              <div>
                <h2 className="section-heading">Accounts</h2>
                <p className="section-subtitle">Your balances by account type.</p>
              </div>
            </div>
            <div className="goal-list">
              {accounts.map((account: any) => (
                <div key={account.id} className="info-row">
                  <span>{account.type}</span>
                  <strong>{formatCurrencyFromCents(account.balance)}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-card">
            <div className="section-title">
              <div>
                <h2 className="section-heading">Active goals</h2>
                <p className="section-subtitle">Your current savings progress.</p>
              </div>
            </div>
            {activeGoals.length === 0 ? (
              <div className="empty-panel">
                <i className="fa-solid fa-bullseye"></i>
                <p className="section-subtitle">No active goals yet. Create one from the action cards above.</p>
              </div>
            ) : (
              <div className="goal-list">
                {activeGoals.map((goal: any) => (
                  <div key={goal.id} className="info-row" style={{ flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                      <strong>{goal.title}</strong>
                      <span>{formatCurrencyFromCents(goal.savedAmount)} / {formatCurrencyFromCents(goal.targetAmount)}</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-bar" style={{ width: `${goal.progressPercent}%` }}></div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                      <span>{goal.progressPercent}% complete</span>
                      <span>{formatCurrencyFromCents(goal.targetAmount - goal.savedAmount)} left</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="panel-card">
          <div className="section-title">
            <div>
              <h2 className="section-heading">Recent transactions</h2>
              <p className="section-subtitle">Latest movement on your accounts.</p>
            </div>
          </div>
          {loading ? (
            <div className="empty-panel">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <p className="section-subtitle">Loading transactions...</p>
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="empty-panel">
              <i className="fa-solid fa-receipt"></i>
              <p className="section-subtitle">No transactions yet.</p>
            </div>
          ) : (
            <div className="transaction-list">
              {recentTransactions.slice(0, 6).map((transaction: any) => {
                const tone = getTransactionTone(transaction.type);
                return (
                  <div key={transaction.id} className="info-row">
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className="stat-icon" style={{ width: "40px", height: "40px", borderRadius: "14px", color: tone.color }}>
                        <i className={tone.icon}></i>
                      </span>
                      <div>
                        <strong>{transaction.type.replace(/_/g, " ")}</strong>
                        <div className="muted-copy" style={{ marginTop: "4px" }}>{transaction.note || "No note"}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ color: tone.color }}>
                        {tone.prefix}{formatCurrencyFromCents(transaction.amount)}
                      </strong>
                      <div className="muted-copy" style={{ marginTop: "4px" }}>
                        {format(new Date(transaction.createdAt), "MMM d")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {goalOpen && (
        <div className="modal-overlay" onClick={() => setGoalOpen(false)}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">Create a savings goal</h3>
            <div className="dashboard-stack" style={{ marginTop: "18px", gap: "14px" }}>
              <input
                className="dashboard-input"
                value={goalTitle}
                onChange={(event) => setGoalTitle(event.target.value)}
                placeholder="Goal title"
              />
              <input
                className="dashboard-input"
                type="number"
                min="0.01"
                step="0.01"
                value={goalAmount}
                onChange={(event) => setGoalAmount(event.target.value)}
                placeholder="Target amount in dollars"
              />
              <div className="button-row">
                <button className="btn btn-primary" onClick={handleCreateGoal}>Create goal</button>
                <button className="btn btn-outline" onClick={() => setGoalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
