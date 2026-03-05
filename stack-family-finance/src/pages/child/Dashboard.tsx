import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { familyApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Wallet, Users, Gamepad2 } from "lucide-react";

export default function ChildDashboard() {
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    familyApi.getMyFamilies().then(d => setFamilies(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const inFamily = families.length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Hey, {user?.username}! 👋</h1>
        <p className="text-muted-foreground">Ready to earn some coins?</p>
      </div>

      {/* Wallet */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="py-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className="text-xl font-bold">Play games to earn coins!</p>
          </div>
        </CardContent>
      </Card>

      {/* Family status */}
      {loading ? <SkeletonCard /> : !inFamily ? (
        <Card>
          <CardContent className="py-6 text-center">
            <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="font-medium">Not in a family yet</p>
            <p className="text-sm text-muted-foreground mb-3">Ask your parent for an invite code!</p>
            <Button onClick={() => navigate("/child/family")} className="min-h-[44px]">Join Family</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Family
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{families[0]?.family?.title ?? families[0]?.title ?? "My Family"}</p>
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => navigate("/child/games")} className="h-20 flex-col gap-1">
          <Gamepad2 className="h-6 w-6" />
          <span className="text-sm">Play Games</span>
        </Button>
        <Button variant="outline" onClick={() => navigate("/child/family")} className="h-20 flex-col gap-1">
          <Users className="h-6 w-6" />
          <span className="text-sm">My Family</span>
        </Button>
      </div>
    </div>
  );
}
