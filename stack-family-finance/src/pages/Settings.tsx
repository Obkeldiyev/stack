import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileApi } from "@/lib/api";
import { clearAuth, getUser, updateStoredUser } from "@/lib/auth";
import { toast } from "sonner";
import PhotoUpload from "@/components/PhotoUpload";
import "./Landing.css";

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ username: "", photoUrl: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const navigate = useNavigate();

  useEffect(() => {
    void loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = getUser();
      if (!currentUser) {
        navigate("/login", { replace: true });
        return;
      }
      const profileData = await profileApi.getProfile();
      setUser(currentUser);
      setProfile({
        username: profileData.username || currentUser.username || "",
        photoUrl: profileData.photoUrl || "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile.username.trim()) {
      toast.error("Username is required.");
      return;
    }

    setSaving(true);
    try {
      await profileApi.updateProfile(profile);
      const currentUser = getUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, username: profile.username.trim() };
        updateStoredUser(updatedUser);
        setUser(updatedUser);
      }
      toast.success("Profile updated.");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Fill in all password fields.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await profileApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed.");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="empty-panel"><i className="fa-solid fa-spinner fa-spin"></i><p className="section-subtitle">Loading profile...</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container dashboard-stack">
        <section className="dashboard-hero">
          <div className="dashboard-eyebrow">
            <i className="fa-solid fa-user-gear"></i>
            Account settings
          </div>
          <h1 className="dashboard-title">Profile and security in one place.</h1>
          <p className="dashboard-copy">
            Keep your username, profile image, and password current while staying signed in across sessions.
          </p>
        </section>

        <section className="dashboard-grid two-up">
          <div className="panel-card">
            <div className="section-title">
              <div>
                <h2 className="section-heading">Profile</h2>
                <p className="section-subtitle">{user?.role ?? "USER"} account</p>
              </div>
            </div>
            <div className="dashboard-stack" style={{ gap: "14px" }}>
              <div style={{ maxWidth: "220px" }}>
                <PhotoUpload onPhotoUploaded={(url) => setProfile({ ...profile, photoUrl: url })} currentPhoto={profile.photoUrl} />
              </div>
              <input className="dashboard-input" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} placeholder="Username" />
              <div className="button-row">
                <button className="btn btn-primary" disabled={saving} onClick={saveProfile}>{saving ? "Saving..." : "Save profile"}</button>
              </div>
            </div>
          </div>

          <div className="panel-card">
            <div className="section-title">
              <div>
                <h2 className="section-heading">Password</h2>
                <p className="section-subtitle">Change it without leaving the app.</p>
              </div>
            </div>
            <div className="dashboard-stack" style={{ gap: "14px" }}>
              <input className="dashboard-input" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} placeholder="Current password" />
              <input className="dashboard-input" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} placeholder="New password" />
              <input className="dashboard-input" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} placeholder="Confirm new password" />
              <div className="button-row">
                <button className="btn btn-primary" disabled={saving} onClick={changePassword}>{saving ? "Updating..." : "Change password"}</button>
              </div>
            </div>
          </div>
        </section>

        <section className="panel-card">
          <div className="section-title">
            <div>
              <h2 className="section-heading">Session</h2>
              <p className="section-subtitle">You stay logged in until your token expires or you sign out manually.</p>
            </div>
          </div>
          <div className="button-row">
            <button className="btn btn-outline" onClick={logout}>Sign out</button>
          </div>
        </section>
      </div>
    </div>
  );
}
