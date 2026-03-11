import { useEffect, useState } from "react";
import { familyApi, tasksApi } from "@/lib/api";
import { toast } from "sonner";
import TaskCard from "@/components/TaskCard";
import { getFamilyId, getFamilyTitle, normalizeFamilyMember } from "@/lib/view-models";

export default function ParentTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    childId: "",
    title: "",
    description: "",
    amount: "",
  });

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksData, familiesData] = await Promise.all([
        tasksApi.getParentTasks(),
        familyApi.getMyFamilies(),
      ]);

      setTasks(Array.isArray(tasksData) ? tasksData : []);

      const membershipLists = await Promise.all(
        (Array.isArray(familiesData) ? familiesData : []).map(async (familyRecord: any) => {
          const familyId = getFamilyId(familyRecord);
          const familyTitle = getFamilyTitle(familyRecord);
          if (!familyId) return [];

          try {
            const members = await familyApi.getMembers(familyId);
            return members
              .map(normalizeFamilyMember)
              .filter((member: any) => member.role === "CHILD")
              .map((member: any) => ({
                ...member,
                familyId,
                familyTitle,
              }));
          } catch {
            return [];
          }
        })
      );

      const uniqueChildren = new Map<number, any>();
      membershipLists.flat().forEach((member: any) => {
        if (!member.userId) return;
        uniqueChildren.set(member.userId, member);
      });

      setFamilyMembers(Array.from(uniqueChildren.values()));
    } catch (error: any) {
      toast.error(error.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTask.childId || !newTask.title.trim() || !newTask.amount) {
      toast.error("Fill in the child, title, and reward amount.");
      return;
    }

    try {
      await tasksApi.createTask({
        childId: Number(newTask.childId),
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        amount: Number(newTask.amount),
      });

      toast.success("Task created.");
      setShowCreateModal(false);
      setNewTask({ childId: "", title: "", description: "", amount: "" });
      await loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to create task");
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
            <i className="fa-solid fa-list-check"></i>
            Parent task board
          </div>
          <h1 className="dashboard-title">Assign work, review proof, and pay fast.</h1>
          <p className="dashboard-copy">
            Create chores for each child, check completed work, and keep rewards connected to the rest of the family dashboard.
          </p>
        </section>

        <section className="dashboard-grid stats">
          <div className="panel-card stat-card">
            <div className="stat-icon"><i className="fa-regular fa-clock"></i></div>
            <div className="stat-value">{pending}</div>
            <div className="stat-label">Tasks still waiting to be started.</div>
          </div>
          <div className="panel-card stat-card">
            <div className="stat-icon"><i className="fa-solid fa-camera"></i></div>
            <div className="stat-value">{review}</div>
            <div className="stat-label">Submissions waiting for your review.</div>
          </div>
          <div className="panel-card stat-card">
            <div className="stat-icon"><i className="fa-solid fa-trophy"></i></div>
            <div className="stat-value">{approved}</div>
            <div className="stat-label">Tasks approved and already rewarded.</div>
          </div>
        </section>

        <section className="panel-card">
          <div className="section-title">
            <div>
              <h2 className="section-heading">New task</h2>
              <p className="section-subtitle">Pick a child and set the reward amount in dollars.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              <i className="fa-solid fa-plus"></i>
              Create task
            </button>
          </div>
          <div className="button-row">
            {familyMembers.length === 0 ? (
              <span className="muted-copy">Add a child to a family first. The task form will use those members automatically.</span>
            ) : (
              familyMembers.map((member) => (
                <span key={member.userId} className="pill">
                  <i className="fa-solid fa-child-reaching"></i>
                  {member.username} in {member.familyTitle}
                </span>
              ))
            )}
          </div>
        </section>

        <section className="panel-card">
          <div className="section-title">
            <div>
              <h2 className="section-heading">Task queue</h2>
              <p className="section-subtitle">Everything assigned to your children across all families.</p>
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
              <p className="section-subtitle">Start by creating a simple chore with a reward.</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} userRole="PARENT" onTaskUpdate={loadData} />
              ))}
            </div>
          )}
        </section>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <h3 className="section-heading">Create task</h3>
            <p className="section-subtitle">Use dollars here. The backend stores the task reward correctly as a decimal amount.</p>
            <form onSubmit={handleCreateTask} className="dashboard-stack" style={{ marginTop: "18px", gap: "14px" }}>
              <select
                className="dashboard-select"
                value={newTask.childId}
                onChange={(event) => setNewTask({ ...newTask, childId: event.target.value })}
                required
              >
                <option value="">Choose a child</option>
                {familyMembers.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.username} - {member.familyTitle}
                  </option>
                ))}
              </select>
              <input
                className="dashboard-input"
                value={newTask.title}
                onChange={(event) => setNewTask({ ...newTask, title: event.target.value })}
                placeholder="Task title"
                required
              />
              <textarea
                className="dashboard-textarea"
                value={newTask.description}
                onChange={(event) => setNewTask({ ...newTask, description: event.target.value })}
                placeholder="Explain what needs to be done"
              />
              <input
                className="dashboard-input"
                type="number"
                min="0.01"
                step="0.01"
                value={newTask.amount}
                onChange={(event) => setNewTask({ ...newTask, amount: event.target.value })}
                placeholder="Reward amount"
                required
              />
              <div className="button-row">
                <button className="btn btn-primary" type="submit">Save task</button>
                <button className="btn btn-outline" type="button" onClick={() => setShowCreateModal(false)}>
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
