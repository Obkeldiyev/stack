import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "@/lib/auth";
import { getTheme, setTheme } from "@/lib/theme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LogOut, Moon, User } from "lucide-react";

export default function Settings() {
  const [dark, setDark] = useState(getTheme() === "dark");
  const navigate = useNavigate();
  const user = getUser();

  const toggleDark = (checked: boolean) => {
    setDark(checked);
    setTheme(checked ? "dark" : "light");
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm"><span className="text-muted-foreground">Username:</span> {user?.username}</p>
          <p className="text-sm"><span className="text-muted-foreground">Role:</span> {user?.role}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="h-4 w-4" />
            <Label htmlFor="dark-mode">Dark Mode</Label>
          </div>
          <Switch id="dark-mode" checked={dark} onCheckedChange={toggleDark} />
        </CardContent>
      </Card>

      <Button variant="destructive" onClick={handleLogout} className="w-full min-h-[44px]">
        <LogOut className="h-4 w-4 mr-2" /> Logout
      </Button>
    </div>
  );
}
