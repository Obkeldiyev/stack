import { useEffect, useState } from "react";
import { familyApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Users, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ParentFamily() {
  const [families, setFamilies] = useState<any[]>([]);
  const [members, setMembers] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const data = await familyApi.getMyFamilies();
        const fams = Array.isArray(data) ? data : [];
        setFamilies(fams);
        const membersMap: Record<number, any[]> = {};
        for (const fm of fams) {
          const fid = fm.family?.id ?? fm.id ?? fm.familyId;
          try {
            membersMap[fid] = await familyApi.getMembers(fid);
          } catch { membersMap[fid] = []; }
        }
        setMembers(membersMap);
      } catch { }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="max-w-2xl mx-auto space-y-4"><SkeletonCard /><SkeletonCard /></div>;

  if (families.length === 0) {
    return <EmptyState icon={Users} title="No family" description="Create a family from the dashboard." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Family Members</h1>
      {families.map((fm) => {
        const fam = fm.family ?? fm;
        const fid = fam.id ?? fm.familyId;
        const mems = members[fid] ?? [];
        return (
          <Card key={fid}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> {fam.title ?? "Family"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No members yet. Share the invite code!</p>
              ) : (
                <div className="space-y-2">
                  {mems.map((m: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <UserCircle className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{m.username ?? m.user?.username ?? "User"}</p>
                      </div>
                      <Badge variant={m.role === "PARENT" ? "default" : "secondary"}>
                        {m.role ?? m.user?.role ?? "MEMBER"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
