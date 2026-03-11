import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { AdminShell } from "@/components/admin/AdminShell";
import { toast } from "sonner";

export default function AdminFamilies() {
  const [families, setFamilies] = useState<any[]>([]);

  useEffect(() => {
    void loadFamilies();
  }, []);

  const loadFamilies = async () => {
    try {
      setFamilies(await adminApi.getAllFamilies());
    } catch (error: any) {
      toast.error(error.message || "Failed to load families");
    }
  };

  return (
    <AdminShell active="families" title="Family oversight" subtitle="Inspect family structures and member composition from the admin side.">
      <section className="dashboard-grid auto">
        {families.map((family) => (
          <div key={family.id} className="panel-card">
            <div className="section-heading">{family.title}</div>
            <p className="section-subtitle">
              {family.totalMembers} members · {family.totalChildren} children
            </p>
            <div className="goal-list" style={{ marginTop: "14px" }}>
              {family.members.map((member: any) => (
                <div key={`${family.id}-${member.userId}`} className="info-row">
                  <span>{member.username}</span>
                  <strong>{member.role}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </AdminShell>
  );
}
