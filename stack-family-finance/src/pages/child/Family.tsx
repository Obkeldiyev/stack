import { useEffect, useState } from "react";
import { familyApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonCard } from "@/components/SkeletonCard";
import { QRScanner } from "@/components/QRScanner";
import { useToast } from "@/hooks/use-toast";
import { Users, CheckCircle, QrCode, Keyboard } from "lucide-react";

export default function ChildFamily() {
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const { toast } = useToast();

  const fetchFamilies = async () => {
    try {
      const data = await familyApi.getMyFamilies();
      setFamilies(Array.isArray(data) ? data : []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchFamilies(); }, []);

  const handleJoin = async (inviteCode: string) => {
    if (!inviteCode.trim()) return;
    setJoining(true);
    try {
      await familyApi.join(inviteCode.trim());
      toast({ title: "Joined family!" });
      setCode("");
      setShowScanner(false);
      setManualMode(false);
      fetchFamilies();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setJoining(false);
    }
  };

  const handleManualJoin = () => {
    handleJoin(code);
  };

  if (loading) return <div className="max-w-2xl mx-auto"><SkeletonCard /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Family</h1>

      {families.length === 0 ? (
        <>
          {showScanner ? (
            <QRScanner
              onScan={handleJoin}
              onClose={() => setShowScanner(false)}
            />
          ) : manualMode ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Enter Invite Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Invite Code</Label>
                  <Input 
                    placeholder="ABC123" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value.toUpperCase())} 
                    className="font-mono text-center text-lg min-h-[44px]"
                  />
                  <p className="text-xs text-center text-muted-foreground">
                    Enter the invite code from your parent
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setManualMode(false)} 
                    className="min-h-[44px]"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Scan QR
                  </Button>
                  <Button 
                    onClick={handleManualJoin} 
                    disabled={joining || code.length < 4} 
                    className="min-h-[44px]"
                  >
                    {joining ? "Joining..." : "Join"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Join a Family</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ask your parent for a QR code or invite code to join your family
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => setShowScanner(true)} 
                    className="min-h-[44px]"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Scan QR Code
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setManualMode(true)} 
                    className="min-h-[44px]"
                  >
                    <Keyboard className="h-4 w-4 mr-2" />
                    Enter Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
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
