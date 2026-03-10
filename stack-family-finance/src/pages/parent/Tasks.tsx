import { useEffect, useState } from "react";
import { tasksApi, familyApi } from "@/lib/api";
import { toast } from "sonner";
import TaskCard from "@/components/TaskCard";
import "../Landing.css";

export default function ParentTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    childId: "",
    title: "",
    description: "",
    amount: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, familiesData] = await Promise.all([
        tasksApi.getParentTasks(),
        familyApi.getMyFamilies()
      ]);
      
      setTasks(tasksData);
      
      // Get all family members who are children
      const allMembers: any[] = [];
      for (const family of familiesData) {
        const members = await familyApi.getMembers(family.id);
        const children = members.filter((member: any) => member.role === "CHILD");
        allMembers.push(...children);
      }
      setFamilyMembers(allMembers);
    } catch (error: any) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.childId || !newTask.title || !newTask.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await tasksApi.createTask({
        childId: parseInt(newTask.childId),
        title: newTask.title,
        description: newTask.description,
        amount: parseFloat(newTask.amount)
      });
      
      toast.success("Task created successfully!");
      setShowCreateModal(false);
      setNewTask({ childId: "", title: "", description: "", amount: "" });
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to create task");
    }
  };

  const getTaskStats = () => {
    const pending = tasks.filter(t => t.status === "PENDING").length;
    const completed = tasks.filter(t => t.status === "COMPLETED").length;
    const approved = tasks.filter(t => t.status === "APPROVED").length;
    
    return { pending, completed, approved };
  };

  const stats = getTaskStats();

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

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>

      <main>
        <section style={{ padding: "16px 16px 80px 16px" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ marginBottom: "24px" }}>
              <div className="eyebrow" style={{ marginBottom: "12px" }}>
                <i className="fa-solid fa-tasks"></i>
                Task Management
              </div>
              <h2 style={{ 
                fontSize: "2.5rem", 
                lineHeight: "1.1", 
                letterSpacing: "-0.05em", 
                margin: "0 0 12px 0",
                color: "white"
              }}>
                Family Tasks
              </h2>
              <p style={{ color: "#a5b7d0", margin: 0, fontSize: "1.05rem", lineHeight: "1.6" }}>
                Create tasks for your children and track their progress. Reward completion with automatic payments.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="feature-grid" style={{ marginBottom: "32px" }}>
              <div className="feature-card glass reveal left">
                <div className="icon-box">
                  <i className="fa-solid fa-clock"></i>
                </div>
                <h3>{stats.pending}</h3>
                <p>Pending Tasks</p>
              </div>

              <div className="feature-card glass reveal up stagger-1">
                <div className="icon-box">
                  <i className="fa-solid fa-check-circle"></i>
                </div>
                <h3>{stats.completed}</h3>
                <p>Awaiting Review</p>
              </div>

              <div className="feature-card glass reveal right">
                <div className="icon-box">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <h3>{stats.approved}</h3>
                <p>Completed & Paid</p>
              </div>
            </div>

            {/* Create Task Button */}
            <div style={{ marginBottom: "32px" }}>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
                style={{ fontSize: "1.1rem" }}
              >
                <i className="fa-solid fa-plus"></i>
                Create New Task
              </button>
            </div>

            {/* Tasks List */}
            <div>
              {tasks.length === 0 ? (
                <div className="glass" style={{ padding: "48px", borderRadius: "28px", textAlign: "center" }}>
                  <i className="fa-solid fa-tasks" style={{ fontSize: "3rem", color: "#86f0ff", marginBottom: "16px", display: "block" }}></i>
                  <h3 style={{ marginBottom: "12px", color: "white" }}>No Tasks Yet</h3>
                  <p style={{ color: "#a5b7d0", margin: 0 }}>
                    Create your first task to start teaching responsibility and rewarding good behavior.
                  </p>
                </div>
              ) : (
                tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    userRole="PARENT"
                    onTaskUpdate={loadData}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setShowCreateModal(false)}>
          <div className="glass" style={{
            padding: "36px",
            borderRadius: "28px",
            maxWidth: "600px",
            width: "90%"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: "24px", letterSpacing: "-0.03em", color: "white" }}>
              Create New Task
            </h3>
            
            <form onSubmit={handleCreateTask} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                  Assign to Child *
                </label>
                <select
                  value={newTask.childId}
                  onChange={(e) => setNewTask({ ...newTask, childId: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    fontSize: "1rem"
                  }}
                >
                  <option value="">Select a child...</option>
                  {familyMembers.map((member) => (
                    <option key={member.id} value={member.id} style={{ background: "#0a1730" }}>
                      {member.username}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  placeholder="e.g., Clean your room"
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
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Provide details about what needs to be done..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    fontSize: "1rem",
                    resize: "vertical"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                  Reward Amount *
                </label>
                <input
                  type="number"
                  value={newTask.amount}
                  onChange={(e) => setNewTask({ ...newTask, amount: e.target.value })}
                  required
                  min="0.01"
                  step="0.01"
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

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                >
                  <i className="fa-solid fa-plus"></i>
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}