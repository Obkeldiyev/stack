import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileApi } from "@/lib/api";
import { getUser, clearAuth } from "@/lib/auth";
import { toast } from "sonner";
import PhotoUpload from "@/components/PhotoUpload";
import "./Landing.css";

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    photoUrl: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = getUser();
      if (!userData) {
        navigate("/login");
        return;
      }
      
      const profileData = await profileApi.getProfile();
      setUser(userData);
      setProfile({
        username: profileData.username || "",
        photoUrl: profileData.photoUrl || ""
      });
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.username.trim()) {
      toast.error("Username is required");
      return;
    }

    setSaving(true);
    try {
      await profileApi.updateProfile({
        username: profile.username,
        photoUrl: profile.photoUrl
      });
      
      toast.success("Profile updated successfully!");
      
      // Update local storage with new username
      const currentUser = getUser();
      if (currentUser) {
        localStorage.setItem("user", JSON.stringify({
          ...currentUser,
          username: profile.username
        }));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setSaving(true);
    try {
      await profileApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="landing-page">
        <div className="bg-noise"></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#86f0ff" }}></i>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>

      <main>
        <section style={{ padding: "16px 16px 80px 16px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: "24px" }}>
              <div className="eyebrow" style={{ marginBottom: "12px" }}>
                <i className="fa-solid fa-user-cog"></i>
                Account Settings
              </div>
              <h2 style={{ 
                fontSize: "2.5rem", 
                lineHeight: "1.1", 
                letterSpacing: "-0.05em", 
                margin: "0 0 12px 0",
                color: "white"
              }}>
                Manage Your Profile
              </h2>
              <p style={{ color: "#a5b7d0", margin: 0, fontSize: "1.05rem", lineHeight: "1.6" }}>
                Update your personal information, change your password, and manage your account preferences.
              </p>
            </div>

            {/* Profile Information */}
            <div className="glass" style={{ padding: "36px", borderRadius: "28px", marginBottom: "24px" }}>
              <h3 style={{ marginTop: 0, marginBottom: "24px", color: "white", letterSpacing: "-0.03em" }}>
                Profile Information
              </h3>
              
              <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Profile Photo */}
                <div>
                  <label style={{ display: "block", marginBottom: "12px", color: "#dce8ff", fontSize: "1rem", fontWeight: "600" }}>
                    Profile Photo
                  </label>
                  <div style={{ maxWidth: "200px" }}>
                    <PhotoUpload
                      onPhotoUploaded={(url) => setProfile({ ...profile, photoUrl: url })}
                      currentPhoto={profile.photoUrl}
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                    Username *
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.05)",
                      color: "white",
                      fontSize: "1rem"
                    }}
                  />
                </div>

                {/* Role Display */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                    Account Type
                  </label>
                  <div style={{
                    padding: "12px 16px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    color: "#a5b7d0",
                    fontSize: "1rem"
                  }}>
                    {user?.role === "PARENT" ? "Parent Account" : user?.role === "CHILD" ? "Child Account" : "Admin Account"}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ alignSelf: "flex-start", fontSize: "1rem" }}
                >
                  {saving ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-save"></i>
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Password Section */}
            <div className="glass" style={{ padding: "36px", borderRadius: "28px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ margin: 0, color: "white", letterSpacing: "-0.03em" }}>
                  Password & Security
                </h3>
                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="btn btn-outline"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <i className="fa-solid fa-key"></i>
                    Change Password
                  </button>
                )}
              </div>

              {showPasswordForm ? (
                <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                      Current Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.05)",
                        color: "white",
                        fontSize: "1rem"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                      New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      minLength={6}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.05)",
                        color: "white",
                        fontSize: "1rem"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.05)",
                        color: "white",
                        fontSize: "1rem"
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn btn-primary"
                      style={{ fontSize: "1rem" }}
                    >
                      {saving ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          Changing...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-key"></i>
                          Change Password
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      }}
                      className="btn btn-outline"
                      style={{ fontSize: "1rem" }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p style={{ color: "#a5b7d0", margin: 0 }}>
                  Keep your account secure by using a strong password and changing it regularly.
                </p>
              )}
            </div>

            {/* Account Actions */}
            <div className="glass" style={{ padding: "36px", borderRadius: "28px" }}>
              <h3 style={{ marginTop: 0, marginBottom: "24px", color: "white", letterSpacing: "-0.03em" }}>
                Account Actions
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline"
                  style={{ 
                    alignSelf: "flex-start", 
                    fontSize: "1rem",
                    borderColor: "rgba(255,100,100,0.3)",
                    color: "#ff6b6b"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,100,100,0.1)";
                    e.currentTarget.style.borderColor = "rgba(255,100,100,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,100,100,0.3)";
                  }}
                >
                  <i className="fa-solid fa-sign-out-alt"></i>
                  Sign Out
                </button>
                
                <p style={{ color: "#a5b7d0", fontSize: "0.9rem", margin: 0 }}>
                  You'll be redirected to the login page and will need to sign in again.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}