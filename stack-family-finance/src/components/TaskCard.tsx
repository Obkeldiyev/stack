import { useState } from "react";
import { tasksApi } from "@/lib/api";
import { toast } from "sonner";

interface TaskCardProps {
  task: any;
  userRole: "PARENT" | "CHILD";
  onTaskUpdate: () => void;
}

export default function TaskCard({ task, userRole, onTaskUpdate }: TaskCardProps) {
  const [loading, setLoading] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "rgba(255,193,7,0.2)";
      case "COMPLETED": return "rgba(25,199,216,0.2)";
      case "APPROVED": return "rgba(112,207,66,0.2)";
      case "REJECTED": return "rgba(255,100,100,0.2)";
      default: return "rgba(255,255,255,0.1)";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING": return "Waiting to Start";
      case "COMPLETED": return "Awaiting Approval";
      case "APPROVED": return "Completed & Paid";
      case "REJECTED": return "Needs Revision";
      default: return status;
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await tasksApi.approveTask(task.id, approvalNotes);
      toast.success("Task approved and payment sent!");
      setShowApprovalModal(false);
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
      toast.error("Please provide feedback for rejection");
      return;
    }
    
    setLoading(true);
    try {
      await tasksApi.rejectTask(task.id, rejectionNotes);
      toast.success("Task rejected with feedback");
      setRejectionNotes("");
      onTaskUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject task");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <>
      <div className="glass" style={{ 
        padding: "24px", 
        borderRadius: "24px", 
        marginBottom: "16px",
        transition: "transform 0.25s ease, border-color 0.25s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(134, 240, 255, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <h3 style={{ margin: "0 0 8px 0", color: "white", fontSize: "1.25rem", letterSpacing: "-0.03em" }}>
              {task.title}
            </h3>
            <p style={{ margin: "0 0 12px 0", color: "#a5b7d0", lineHeight: "1.6" }}>
              {task.description}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ 
              fontSize: "1.5rem", 
              fontWeight: "700", 
              color: "#70cf42", 
              marginBottom: "4px",
              letterSpacing: "-0.04em"
            }}>
              {formatAmount(task.amount)}
            </div>
            <span style={{
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: "600",
              background: getStatusColor(task.status),
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white"
            }}>
              {getStatusText(task.status)}
            </span>
          </div>
        </div>

        {task.photoUrl && (
          <div style={{ marginBottom: "16px" }}>
            <img 
              src={task.photoUrl} 
              alt="Task completion proof"
              style={{ 
                width: "100%", 
                maxHeight: "200px", 
                objectFit: "cover", 
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            />
          </div>
        )}

        {task.childNotes && (
          <div style={{ 
            marginBottom: "16px", 
            padding: "12px", 
            borderRadius: "12px", 
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <div style={{ fontSize: "0.9rem", color: "#86f0ff", marginBottom: "4px", fontWeight: "600" }}>
              Child Notes:
            </div>
            <div style={{ color: "#dce8ff", fontSize: "0.95rem" }}>
              {task.childNotes}
            </div>
          </div>
        )}

        {task.parentNotes && (
          <div style={{ 
            marginBottom: "16px", 
            padding: "12px", 
            borderRadius: "12px", 
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <div style={{ fontSize: "0.9rem", color: "#86f0ff", marginBottom: "4px", fontWeight: "600" }}>
              Parent Feedback:
            </div>
            <div style={{ color: "#dce8ff", fontSize: "0.95rem" }}>
              {task.parentNotes}
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
          <div style={{ fontSize: "0.9rem", color: "#a5b7d0" }}>
            Created: {formatDate(task.createdAt)}
            {task.completedAt && (
              <span> • Completed: {formatDate(task.completedAt)}</span>
            )}
          </div>

          {userRole === "PARENT" && task.status === "COMPLETED" && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setShowApprovalModal(true)}
                disabled={loading}
                style={{
                  padding: "8px 16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(112,207,66,0.3)",
                  background: "rgba(112,207,66,0.1)",
                  color: "#70cf42",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(112,207,66,0.2)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(112,207,66,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <i className="fa-solid fa-check" style={{ marginRight: "6px" }}></i>
                Approve
              </button>
              <button
                onClick={() => handleReject()}
                disabled={loading}
                style={{
                  padding: "8px 16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,100,100,0.3)",
                  background: "rgba(255,100,100,0.1)",
                  color: "#ff6b6b",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,100,100,0.2)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,100,100,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <i className="fa-solid fa-times" style={{ marginRight: "6px" }}></i>
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setShowApprovalModal(false)}>
          <div className="glass" style={{
            padding: "32px",
            borderRadius: "24px",
            maxWidth: "500px",
            width: "90%"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "white" }}>
              Approve Task & Send Payment
            </h3>
            <p style={{ color: "#a5b7d0", marginBottom: "20px" }}>
              This will send <strong style={{ color: "#70cf42" }}>{formatAmount(task.amount)}</strong> to the child's account.
            </p>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                Optional feedback (optional):
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Great job! Keep up the good work..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: "1rem",
                  resize: "vertical"
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleApprove}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #1d64d6 0%, #19c7d8 60%, #70cf42 100%)",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "transform 0.25s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check" style={{ marginRight: "8px" }}></i>
                    Approve & Pay
                  </>
                )}
              </button>
              <button
                onClick={() => setShowApprovalModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}