import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"PARENT" | "CHILD">("CHILD");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res: any = await authApi.register({ username, password, role });
      if (res.token) {
        setAuth(res.token, res.user ?? { id: 0, username, role });
        navigate(role === "PARENT" ? "/parent/dashboard" : "/child/dashboard", { replace: true });
      } else {
        toast({ title: "Registered!", description: "Please log in now." });
        navigate("/login");
      }
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-2">
            <span className="text-primary-foreground font-bold text-xl">S</span>
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join STACK today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="min-h-[44px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="min-h-[44px]" />
            </div>
            <div className="space-y-2">
              <Label>I am a...</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant={role === "PARENT" ? "default" : "outline"} onClick={() => setRole("PARENT")} className="min-h-[44px]">
                  Parent
                </Button>
                <Button type="button" variant={role === "CHILD" ? "default" : "outline"} onClick={() => setRole("CHILD")} className="min-h-[44px]">
                  Child
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full min-h-[44px]" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
