import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardApi, goalsApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { toast } from "sonner";
import { format } from "date-fns";
import "../Landing.css";

export default function ChildBankingDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [goalOpen, setGoalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const navigate = useNavigate();
  const user = getUser();

  const fetchDashboard = async () => {
    try {
      const data = await dashboardApi.getChildDashboard();
      setDashboard(data);
    } catch (err: any) {
      console.error('Error fetching dashboard:', err);
      toast.error(err.message);
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
      toast.success("Goal created!");
      setGoalTitle("");
      setGoalAmount("");
      setGoalOpen(false);
      fetchDashboard();
    } catch (err: any) {
      toast.error(err.message);
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
        return "fa-solid fa-arrow-down";
      case "WITHDRAWAL":
      case "GOAL_SAVE":
        return "fa-solid fa-arrow-up";
      default:
        return "fa-solid fa-coins";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "DEPOSIT":
      case "PARENT_TRANSFER":
      case "TASK_REWARD":
      case "GAME_REWARD":
      case "ALLOWANCE":
        return "#70cf42";
      case "WITHDRAWAL":
      case "GOAL_SAVE":
        return "#ff6b6b";
      default:
        return "#86f0ff";
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

  if (!dashboard) {
    return (
      <div className="landing-page">
        <div className="bg-noise"></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <p style={{ color: "#a5b7d0" }}>Unable to load dashboard</p>
        </div>
      </div>
    );
  }

  const { currentAccount, allAccounts, recentTransactions, activeGoals, stats } = dashboard;

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>

      <main>
        <section style={{ padding: "16px 16px 80px 16px" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ marginBottom: "24px" }}>
              <div className="eyebrow" style={{ marginBottom: "12px" }}>
                <i className="fa-solid fa-hand-wave"></i>
                Hey, {user?.username}!
              </div>
              <h2 style={{ 
                fontSize: "2.5rem", 
                lineHeight: "1.1", 
                letterSpacing: "-0.05em", 
                margin: "0 0 12px 0",
                color: "white"
              }}>
                Your Money Dashboard
              </h2>
              <p style={{ color: "#a5b7d0", margin: 0, fontSize: "1.05rem", lineHeight: "1.6" }}>
                Manage your money, track your goals, and earn rewards by completing tasks and playing games.
              </p>
            </div>

            {/* Main Balance Card - Prominent */}
            <div className="glass" style={{ 
              padding: "48px", 
              borderRadius: "32px", 
              marginBottom: "32px",
              background: "linear-gradient(135deg, rgba(29,100,214,0.15), rgba(25,199,216,0.1), rgba(112,207,66,0.05))",
              border: "2px solid rgba(25,199,216,0.2)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
                <div>
                  <p style={{ margin: "0 0 12px 0", color: "#a5b7d0", fontSize: "1rem" }}>Your Balance</p>
                  <p style={{ margin: "0 0 12px 0", fontSize: "4rem", fontWeight: "800", color: "white", letterSpacing: "-0.05em" }}>
                    {formatMoney(stats.totalBalance)}
                  </p>
                  <p style={{ margin: 0, color: "#a5b7d0", fontSize: "1rem" }}>Across all accounts</p>
                </div>
                <div style={{ 
                  width: "120px", 
                  height: "120px", 
                  borderRadius: "50%", 
                  background: "linear-gradient(135deg, rgba(25,199,216,0.3), rgba(112,207,66,0.2))",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  border: "2px solid rgba(255,255,255,0.1)"
                }}>
                  <i className="fa-solid fa-wallet" style={{ fontSize: "3rem", color: "#86f0ff" }}></i>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              <button 
                onClick={() => navigate("/child/games")} 
                className="glass"
                style={{
                  padding: "32px 24px",
                  borderRadius: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "rgba(134, 240, 255, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                }}
              >
                <i className="fa-solid fa-gamepad" style={{ fontSize: "2.5rem", color: "#86f0ff" }}></i>
                <span style={{ fontSize: "1.2rem", fontWeight: "600", color: "white" }}>Play Games</span>
                <span style={{ fontSize: "0.9rem", color: "#a5b7d0" }}>Earn coins & have fun!</span>
              </button>
              
              <button 
                onClick={() => setGoalOpen(true)} 
                className="glass"
                style={{
                  padding: "32px 24px",
                  borderRadius: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "rgba(134, 240, 255, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                }}
              >
                <i className="fa-solid fa-bullseye" style={{ fontSize: "2.5rem", color: "#86f0ff" }}></i>
                <span style={{ fontSize: "1.2rem", fontWeight: "600", color: "white" }}>New Goal</span>
                <span style={{ fontSize: "0.9rem", color: "#a5b7d0" }}>Start saving for something special</span>
              </button>
            </div>

            {/* Stats Overview */}
            <div className="feature-grid" style={{ marginBottom: "32px" }}>
              <div className="feature-card glass reveal left">
                <div className="icon-box">
                  <i className="fa-solid fa-bullseye"></i>
                </div>
                <h3>{stats.activeGoals}</h3>
                <p>Active Goals ({stats.completedGoals} completed)</p>
              </div>

              <div className="feature-card glass reveal up stagger-1">
                <div className="icon-box">
                  <i className="fa-solid fa-receipt"></i>
                </div>
                <h3>{stats.totalTransactions}</h3>
                <p>Total Transactions</p>
              </div>

              <div className="feature-card glass reveal right">
                <div className="icon-box">
                  <i className="fa-solid fa-piggy-bank"></i>
                </div>
                <h3>{allAccounts?.length || 0}</h3>
                <p>Savings Accounts</p>
              </div>
            </div>

            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <div className="glass" style={{ padding: "32px", borderRadius: "28px", marginBottom: "24px" }}>
                <h3 style={{ marginTop: 0, marginBottom: "24px", color: "white", letterSpacing: "-0.03em", display: "flex", alignItems: "center", gap: "12px" }}>
                  <i className="fa-solid fa-bullseye" style={{ color: "#86f0ff" }}></i>
                  Savings Goals
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {activeGoals.map((goal: any) => (
                    <div key={goal.id} style={{ 
                      padding: "20px", 
                      borderRadius: "16px", 
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "1.1rem", fontWeight: "600", color: "white" }}>{goal.title}</span>
                        <span style={{ color: "#a5b7d0" }}>
                          {formatMoney(goal.savedAmount)} / {formatMoney(goal.targetAmount)}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div style={{ 
                        width: "100%", 
                        height: "12px", 
                        borderRadius: "999px", 
                        background: "rgba(255,255,255,0.1)",
                        overflow: "hidden",
                        marginBottom: "12px"
                      }}>
                        <div style={{ 
                          width: `${goal.progressPercent}%`, 
                          height: "100%", 
                          borderRadius: "inherit", 
                          background: "linear-gradient(90deg, #70cf42, #19c7d8, #1d64d6)"
                        }}></div>
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem", color: "#a5b7d0" }}>
                        <span>{goal.progressPercent}% complete</span>
                        <span>{formatMoney(goal.targetAmount - goal.savedAmount)} to go</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            {recentTransactions.length > 0 && (
              <div className="glass" style={{ padding: "32px", borderRadius: "28px" }}>
                <h3 style={{ marginTop: 0, marginBottom: "24px", color: "white", letterSpacing: "-0.03em" }}>
                  Recent Transactions
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {recentTransactions.slice(0, 5).map((tx: any) => (
                    <div key={tx.id} style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      padding: "16px 0", 
                      borderBottom: "1px solid rgba(255,255,255,0.08)"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ 
                          width: "48px", 
                          height: "48px", 
                          borderRadius: "50%", 
                          background: "rgba(255,255,255,0.05)",
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          border: "1px solid rgba(255,255,255,0.08)"
                        }}>
                          <i className={getTransactionIcon(tx.type)} style={{ color: getTransactionColor(tx.type) }}></i>
                        </div>
                        <div>
                          <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "white", fontSize: "1rem" }}>
                            {tx.type.replace(/_/g, " ")}
                          </p>
                          <p style={{ margin: 0, color: "#a5b7d0", fontSize: "0.9rem" }}>
                            {tx.note || "No description"}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ 
                          margin: "0 0 4px 0", 
                          fontWeight: "700", 
                          fontSize: "1.1rem",
                          color: getTransactionColor(tx.type)
                        }}>
                          {tx.type.includes("WITHDRAWAL") || tx.type.includes("GOAL") ? "-" : "+"}
                          {formatMoney(tx.amount)}
                        </p>
                        <p style={{ margin: 0, color: "#a5b7d0", fontSize: "0.8rem" }}>
                          {format(new Date(tx.createdAt), "MMM d")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Create Goal Modal */}
      {goalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setGoalOpen(false)}>
          <div className="glass" style={{
            padding: "36px",
            borderRadius: "28px",
            maxWidth: "500px",
            width: "90%"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: "24px", color: "white" }}>
              Create Savings Goal
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                  Goal Name *
                </label>
                <input
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g., New Bike, Video Game, Toy"
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
              
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                  Target Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="0.00"
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
            </div>
            
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button 
                onClick={handleCreateGoal}
                disabled={!goalTitle.trim() || !goalAmount || parseFloat(goalAmount) <= 0}
                className="btn btn-primary" 
                style={{ 
                  flex: 1,
                  opacity: (!goalTitle.trim() || !goalAmount || parseFloat(goalAmount) <= 0) ? 0.5 : 1
                }}
              >
                <i className="fa-solid fa-bullseye"></i>
                Create Goal
              </button>
              <button
                onClick={() => setGoalOpen(false)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}