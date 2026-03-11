import { useState } from "react";
import { tasksApi } from "@/lib/api";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/view-models";

interface TaskCardProps {
  task: any;
  userRole: "PARENT" | "CHILD";
  onTaskUpdate: () => void;
}

function getStatusCopy(status: string) {
  switch (status) {
    case "PENDING":
      return "Ready to start";
    case "COMPLETED":
      return "Awaiting approval";
    case "APPROVED":
      return "Approved and paid";
    case "REJECTED":
      return "Needs another try";
    default:
      return status;
  }
}

function getStatusTone(status: string) {
  switch (status) {
    case "PENDING":
      return { background: "rgba(255,193,7,0.12)", color: "#facc15" };
    case "COMPLETED":
      return { background: "rgba(25,199,216,0.12)", color: "#86f0ff" };
    case "APPROVED":
      return { background: "rgba(112,207,66,0.14)", color: "#70cf42" };
    case "REJECTED":
      return { background: "rgba(255,100,100,0.12)", color: "#ff7d7d" };
    default:
      return { background: "rgba(255,255,255,0.08)", color: "#dce8ff" };
  }
}

export default function TaskCard({ task, userRole, onTaskUpdate }: TaskCardProps) {
  const [loading, setLoading] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");

  const handleApprove = async () => {
    setLoading(true);
    try {
      await tasksApi.approveTask(task.id, approvalNotes);
      toast.success("Task approved and payment sent.");
      setApproveOpen(false);
      setApprovalNotes("");
      onTaskUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to approve task");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionNotes.trim()) {
      toast.error("Add feedback before rejecting the task.");
      return;
    }

    setLoading(true);
    try {
      await tasksApi.rejectTask(task.id, rejectionNotes);
      toast.success("Task rejected with feedback.");
      setRejectOpen(false);
      setRejectionNotes("");
      onTaskUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject task");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const statusTone = getStatusTone(task.status);

  return (
    <>
      <div className="panel-card">
        <div className="dashboard-grid two-up" style={{ alignItems: "start", gap: "20px" }}>
          <div>
            <div className="button-row" style={{ justifyContent: "space-between", alignItems: "start", gap: "14px" }}>
              <div>
                <h3 className="section-heading" style={{ fontSize: "1.2rem" }}>{task.title}</h3>
                <p className="section-subtitle">
                  {task.description || "No extra details were added for this task."}
                </p>
              </div>
              <span
                className="pill"
                style={{
                  background: statusTone.background,
                  color: statusTone.color,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {getStatusCopy(task.status)}
              </span>
            </div>

            <div className="button-row" style={{ marginTop: "16px" }}>
              <span className="pill">
                <i className="fa-solid fa-coins"></i>
                {formatCurrency(task.amount)}
              </span>
              {formatDate(task.createdAt) && (
                <span className="pill">
                  <i className="fa-regular fa-calendar"></i>
                  Created {formatDate(task.createdAt)}
                </span>
              )}
              {formatDate(task.completedAt) && (
                <span className="pill">
                  <i className="fa-solid fa-camera"></i>
                  Completed {formatDate(task.completedAt)}
                </span>
              )}
            </div>
          </div>

          <div className="dashboard-grid" style={{ gap: "12px" }}>
            {task.photoUrl && (
              <img
                src={task.photoUrl}
                alt="Task proof"
                style={{
                  width: "100%",
                  minHeight: "180px",
                  objectFit: "cover",
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            )}

            {task.childNotes && (
              <div className="info-row">
                <div>
                  <div className="muted-heading" style={{ marginBottom: "6px" }}>Child notes</div>
                  <span>{task.childNotes}</span>
                </div>
              </div>
            )}

            {task.parentNotes && (
              <div className="info-row">
                <div>
                  <div className="muted-heading" style={{ marginBottom: "6px" }}>Parent feedback</div>
                  <span>{task.parentNotes}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {userRole === "PARENT" && task.status === "COMPLETED" && (
          <div className="button-row" style={{ marginTop: "18px" }}>
            <button className="btn btn-primary" disabled={loading} onClick={() => setApproveOpen(true)}>
              <i className="fa-solid fa-check"></i>
              Approve and pay
            </button>
            <button className="btn btn-outline" disabled={loading} onClick={() => setRejectOpen(true)}>
              <i className="fa-solid fa-xmark"></i>
              Reject with feedback
            </button>
          </div>
        )}
      </div>

      {approveOpen && (
        <div className="modal-overlay" onClick={() => setApproveOpen(false)}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">Approve task</h3>
            <p className="section-subtitle">
              This sends {formatCurrency(task.amount)} to the child account after approval.
            </p>
            <textarea
              className="dashboard-textarea"
              style={{ marginTop: "18px" }}
              value={approvalNotes}
              onChange={(event) => setApprovalNotes(event.target.value)}
              placeholder="Optional praise or feedback"
            />
            <div className="button-row" style={{ marginTop: "18px" }}>
              <button className="btn btn-primary" disabled={loading} onClick={handleApprove}>
                {loading ? "Processing..." : "Approve task"}
              </button>
              <button className="btn btn-outline" disabled={loading} onClick={() => setApproveOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectOpen && (
        <div className="modal-overlay" onClick={() => setRejectOpen(false)}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">Reject task</h3>
            <p className="section-subtitle">
              Add a clear reason so the child knows what to fix before resubmitting.
            </p>
            <textarea
              className="dashboard-textarea"
              style={{ marginTop: "18px" }}
              value={rejectionNotes}
              onChange={(event) => setRejectionNotes(event.target.value)}
              placeholder="Explain what still needs to be done"
            />
            <div className="button-row" style={{ marginTop: "18px" }}>
              <button className="btn btn-primary" disabled={loading} onClick={handleReject}>
                {loading ? "Processing..." : "Reject task"}
              </button>
              <button className="btn btn-outline" disabled={loading} onClick={() => setRejectOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
