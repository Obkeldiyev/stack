import { useEffect, useState } from "react";
import { tasksApi } from "@/lib/api";
import { toast } from "sonner";
import TaskCard from "@/components/TaskCard";
import PhotoUpload from "@/components/PhotoUpload";
import "../Landing.css";

export default function ChildTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTask, setCompletingTask] = useState<any>(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await tasksApi.getChildTasks();
      setTasks(data);
    } catch (error: any) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!completingTask || !photoUrl) {
      toast.error("Please upload a photo to complete the task");
      return;
    }

    try {
      await tasksApi.completeTask(completingTask.id, photoUrl, completionNotes);
      toast.success("Task completed! Waiting for parent approval.");
      setCompletingTask(null);
      setCompletionNotes("");
      setPhotoUrl("");
      loadTasks();
    } catch (error: any) {
      toast.error(error.message || "Failed to complete task");
    }
  };

  const getTaskStats = () => {
    const pending = tasks.filter(t => t.status === "PENDING").length;
    const completed = tasks.filter(t => t.status === "COMPLETED").length;
    const approved = tasks.filter(t => t.status === "APPROVED").length;
    const rejected = tasks.filter(t => t.status === "REJECTED").length;
    
    return { pending, completed, approved, rejected };
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
                My Tasks
              </div>
              <h2 style={{ 
                fontSize: "2.5rem", 
                lineHeight: "1.1", 
                letterSpacing: "-0.05em", 
                margin: "0 0 12px 0",
                color: "white"
              }}>
                Complete Tasks & Earn Rewards
              </h2>
              <p style={{ color: "#a5b7d0", margin: 0, fontSize: "1.05rem", lineHeight: "1.6" }}>
                Complete tasks assigned by your parents and earn money for your goals. Don't forget to take photos as proof!
              </p>
            </div>

            {/* Stats Cards */}
            <div className="feature-grid" style={{ marginBottom: "32px" }}>
              <div className="feature-card glass reveal left">
                <div className="icon-box">
                  <i className="fa-solid fa-clock"></i>
                </div>
                <h3>{stats.pending}</h3>
                <p>Available Tasks</p>
              </div>

              <div className="feature-card glass reveal up stagger-1">
                <div className="icon-box">
                  <i className="fa-solid fa-hourglass-half"></i>
                </div>
                <h3>{stats.completed}</h3>
                <p>Awaiting Approval</p>
              </div>

              <div className="feature-card glass reveal right">
                <div className="icon-box">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <h3>{stats.approved}</h3>
                <p>Completed & Paid</p>
              </div>
            </div>

            {/* Tasks List */}
            <div>
              {tasks.length === 0 ? (
                <div className="glass" style={{ padding: "48px", borderRadius: "28px", textAlign: "center" }}>
                  <i className="fa-solid fa-tasks" style={{ fontSize: "3rem", color: "#86f0ff", marginBottom: "16px", display: "block" }}></i>
                  <h3 style={{ marginBottom: "12px", color: "white" }}>No Tasks Available</h3>
                  <p style={{ color: "#a5b7d0", margin: 0 }}>
                    Ask your parents to create some tasks for you to complete and earn rewards!
                  </p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} style={{ marginBottom: "16px" }}>
                    <TaskCard
                      task={task}
                      userRole="CHILD"
                      onTaskUpdate={loadTasks}
                    />
                    
                    {/* Complete Task Button for Pending Tasks */}
                    {task.status === "PENDING" && (
                      <div style={{ marginTop: "12px", textAlign: "right" }}>
                        <button
                          onClick={() => setCompletingTask(task)}
                          className="btn btn-primary"
                          style={{ fontSize: "1rem" }}
                        >
                          <i className="fa-solid fa-camera"></i>
                          Complete Task
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Complete Task Modal */}
      {completingTask && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setCompletingTask(null)}>
          <div className="glass" style={{
            padding: "36px",
            borderRadius: "28px",
            maxWidth: "700px",
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: "24px", letterSpacing: "-0.03em", color: "white" }}>
              Complete Task: {completingTask.title}
            </h3>
            
            <div style={{ marginBottom: "24px", padding: "16px", borderRadius: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: "0.9rem", color: "#86f0ff", marginBottom: "8px", fontWeight: "600" }}>
                Task Description:
              </div>
              <div style={{ color: "#dce8ff", fontSize: "1rem", lineHeight: "1.6" }}>
                {completingTask.description || "No description provided"}
              </div>
              <div style={{ marginTop: "12px", fontSize: "1.2rem", fontWeight: "700", color: "#70cf42" }}>
                Reward: ${completingTask.amount.toFixed(2)}
              </div>
            </div>
            
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "12px", color: "#dce8ff", fontSize: "1.1rem", fontWeight: "600" }}>
                Upload Photo Proof *
              </label>
              <PhotoUpload
                onPhotoUploaded={setPhotoUrl}
                currentPhoto={photoUrl}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                Notes (optional)
              </label>
              <textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Tell your parents about how you completed the task..."
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

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button 
                onClick={handleCompleteTask}
                disabled={!photoUrl}
                className="btn btn-primary" 
                style={{ 
                  flex: 1,
                  opacity: !photoUrl ? 0.5 : 1,
                  cursor: !photoUrl ? "not-allowed" : "pointer"
                }}
              >
                <i className="fa-solid fa-check"></i>
                Submit for Approval
              </button>
              <button
                onClick={() => {
                  setCompletingTask(null);
                  setCompletionNotes("");
                  setPhotoUrl("");
                }}
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