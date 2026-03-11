import { useEffect, useState } from "react";
import { tasksApi } from "@/lib/api";
import { toast } from "sonner";
import TaskCard from "@/components/TaskCard";
import PhotoUpload from "@/components/PhotoUpload";
import { formatCurrency } from "@/lib/view-models";

export default function ChildTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTask, setCompletingTask] = useState<any>(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    void loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksApi.getChildTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!completingTask || !photoUrl) {
      toast.error("Upload a photo before submitting the task.");
      return;
    }

    try {
      await tasksApi.completeTask(completingTask.id, photoUrl, completionNotes);
      toast.success("Task submitted for approval.");
      setCompletingTask(null);
      setCompletionNotes("");
      setPhotoUrl("");
      await loadTasks();
    } catch (error: any) {
      toast.error(error.message || "Failed to complete task");
    }
  };

  const pending = tasks.filter((task) => task.status === "PENDING").length;
  const review = tasks.filter((task) => task.status === "COMPLETED").length;
  const approved = tasks.filter((task) => task.status === "APPROVED").length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container dashboard-stack">
        <section className="dashboard-hero">
          <div className="dashboard-eyebrow">
            <i className="fa-solid fa-camera-retro"></i>
            Task rewards
          </div>
          <h1 className="dashboard-title">Finish tasks, upload proof, earn money.</h1>
          <p className="dashboard-copy">
            Every approved task moves money into your account, so submit clean photos and short notes when you finish.
          </p>
        </section>

        <section className="dashboard-grid stats">
          <div className="panel-card stat-card">
            <div className="stat-icon"><i className="fa-regular fa-square-check"></i></div>
            <div className="stat-value">{pending}</div>
            <div className="stat-label">Tasks you can start right now.</div>
          </div>
          <div className="panel-card stat-card">
            <div className="stat-icon"><i className="fa-solid fa-hourglass-half"></i></div>
            <div className="stat-value">{review}</div>
            <div className="stat-label">Tasks waiting for parent approval.</div>
          </div>
          <div className="panel-card stat-card">
            <div className="stat-icon"><i className="fa-solid fa-medal"></i></div>
            <div className="stat-value">{approved}</div>
            <div className="stat-label">Tasks already paid into your balance.</div>
          </div>
        </section>

        <section className="panel-card">
          <div className="section-title">
            <div>
              <h2 className="section-heading">Your tasks</h2>
              <p className="section-subtitle">Pending tasks can be submitted with a photo from this page.</p>
            </div>
          </div>

          {loading ? (
            <div className="empty-panel">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <p className="section-subtitle">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-panel">
              <i className="fa-solid fa-list-check"></i>
              <h3 className="section-heading" style={{ fontSize: "1.2rem" }}>No tasks yet</h3>
              <p className="section-subtitle">Ask your parent to assign one from their dashboard.</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div key={task.id} className="dashboard-stack" style={{ gap: "10px" }}>
                  <TaskCard task={task} userRole="CHILD" onTaskUpdate={loadTasks} />
                  {task.status === "PENDING" && (
                    <div className="button-row" style={{ justifyContent: "flex-end" }}>
                      <button className="btn btn-primary" onClick={() => setCompletingTask(task)}>
                        <i className="fa-solid fa-camera"></i>
                        Submit proof
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {completingTask && (
        <div className="modal-overlay" onClick={() => setCompletingTask(null)}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">Submit task proof</h3>
            <p className="section-subtitle">
              {completingTask.title} for {formatCurrency(completingTask.amount)}
            </p>

            <div className="info-row" style={{ marginTop: "18px" }}>
              <div>
                <div className="muted-heading" style={{ marginBottom: "6px" }}>Task details</div>
                <span>{completingTask.description || "No extra description was added."}</span>
              </div>
            </div>

            <div style={{ marginTop: "18px" }}>
              <div className="muted-heading" style={{ marginBottom: "10px" }}>Photo proof</div>
              <PhotoUpload onPhotoUploaded={setPhotoUrl} currentPhoto={photoUrl} />
            </div>

            <textarea
              className="dashboard-textarea"
              style={{ marginTop: "18px" }}
              value={completionNotes}
              onChange={(event) => setCompletionNotes(event.target.value)}
              placeholder="Optional note about how you completed it"
            />

            <div className="button-row" style={{ marginTop: "18px" }}>
              <button className="btn btn-primary" disabled={!photoUrl} onClick={handleCompleteTask}>
                Send for approval
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setCompletingTask(null);
                  setCompletionNotes("");
                  setPhotoUrl("");
                }}
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
