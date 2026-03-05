import { useEffect, useState } from "react";
import { familyApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useToast } from "@/hooks/use-toast";
import { Users, CheckCircle } from "lucide-react";

export default function ChildFamily() {
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const { toast } = useToast();

  const fetchFamilies = async () => {
    try {
      const data = await familyApi.getMyFamilies();
      setFamilies(Array.isArray(data) ? data : []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchFamilies(); }, []);

  const handleJoin = async () => {
    if (!code.trim()) return;
    setJoining(true);
    try {
      await familyApi.join(code.trim());
      toast({ title: "Joined family!" });
      setCode("");
      fetchFamilies();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <div className="max-w-2xl mx-auto"><SkeletonCard /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Family</h1>

      {families.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Join a Family</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Invite Code</Label>
              <Input placeholder="Enter invite code" value={code} onChange={(e) => setCode(e.target.value)} className="font-mono min-h-[44px]" />
            </div>
            <Button onClick={handleJoin} disabled={joining} className="w-full min-h-[44px]">
              {joining ? "Joining..." : "Join Family"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        families.map((fm: any) => {
          const fam = fm.family ?? fm;
          return (
            <Card key={fam.id ?? fm.familyId}>
              <CardContent className="py-6 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">{fam.title ?? "My Family"}</p>
                  <p className="text-sm text-muted-foreground">You're a member!</p>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
