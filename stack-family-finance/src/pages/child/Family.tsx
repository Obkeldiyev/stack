import { useEffect, useState } from "react";
import { familyApi } from "@/lib/api";
import { QRScanner } from "@/components/QRScanner";
import { toast } from "sonner";
import "../Landing.css";

export default function ChildFamily() {
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [manualMode, setManualMode] = useState(false);

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
      toast.success("Joined family!");
      setCode("");
      setShowScanner(false);
      setManualMode(false);
      fetchFamilies();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setJoining(false);
    }
  };

  const handleManualJoin = () => {
    handleJoin(code);
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
        <section className="section" style={{ paddingTop: "0px", paddingBottom: "40px" }}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <div className="section-head reveal up" style={{ marginBottom: "16px" }}>
              <div className="eyebrow">
                <i className="fa-solid fa-users"></i>
                Family
              </div>
              <h2>Join Your Family</h2>
              <p>Connect with your family to start managing your money together. Ask your parents for an invite code or QR code.</p>
            </div>

            {families.length === 0 ? (
              <>
                {showScanner ? (
                  <div className="glass" style={{ padding: "32px", borderRadius: "28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                      <h3 style={{ margin: 0, color: "white", letterSpacing: "-0.03em" }}>
                        Scan QR Code
                      </h3>
                      <button
                        onClick={() => setShowScanner(false)}
                        className="btn btn-outline"
                        style={{ fontSize: "0.9rem", minWidth: "44px" }}
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </div>
                    <QRScanner
                      onScan={handleJoin}
                      onClose={() => setShowScanner(false)}
                    />
                  </div>
                ) : manualMode ? (
                  <div className="glass" style={{ padding: "32px", borderRadius: "28px" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "24px", color: "white", letterSpacing: "-0.03em" }}>
                      Enter Invite Code
                    </h3>
                    
                    <div style={{ marginBottom: "24px" }}>
                      <label style={{ display: "block", marginBottom: "8px", color: "#dce8ff" }}>
                        Invite Code
                      </label>
                      <input 
                        placeholder="ABC123" 
                        value={code} 
                        onChange={(e) => setCode(e.target.value.toUpperCase())} 
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: "14px",
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.05)",
                          color: "white",
                          fontSize: "1.2rem",
                          fontFamily: "monospace",
                          textAlign: "center",
                          letterSpacing: "0.1em"
                        }}
                      />
                      <p style={{ margin: "8px 0 0 0", color: "#a5b7d0", fontSize: "0.9rem", textAlign: "center" }}>
                        Enter the invite code from your parent
                      </p>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <button 
                        onClick={() => setManualMode(false)} 
                        className="btn btn-outline"
                      >
                        <i className="fa-solid fa-qrcode"></i>
                        Scan QR
                      </button>
                      <button 
                        onClick={handleManualJoin} 
                        disabled={joining || code.length < 4} 
                        className="btn btn-primary"
                        style={{ opacity: (joining || code.length < 4) ? 0.5 : 1 }}
                      >
                        {joining ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin"></i>
                            Joining...
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-user-plus"></i>
                            Join Family
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="glass" style={{ padding: "48px", borderRadius: "28px", textAlign: "center" }}>
                    <i className="fa-solid fa-users" style={{ fontSize: "3rem", color: "#86f0ff", marginBottom: "24px", display: "block" }}></i>
                    <h3 style={{ marginBottom: "16px", color: "white" }}>Join a Family</h3>
                    <p style={{ color: "#a5b7d0", marginBottom: "32px", lineHeight: "1.6" }}>
                      Ask your parent for a QR code or invite code to join your family and start managing your money together.
                    </p>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "400px", margin: "0 auto" }}>
                      <button 
                        onClick={() => setShowScanner(true)} 
                        className="btn btn-primary"
                        style={{ padding: "16px", flexDirection: "column", gap: "8px", height: "auto" }}
                      >
                        <i className="fa-solid fa-qrcode" style={{ fontSize: "1.5rem" }}></i>
                        <span>Scan QR Code</span>
                      </button>
                      <button 
                        onClick={() => setManualMode(true)} 
                        className="btn btn-outline"
                        style={{ padding: "16px", flexDirection: "column", gap: "8px", height: "auto" }}
                      >
                        <i className="fa-solid fa-keyboard" style={{ fontSize: "1.5rem" }}></i>
                        <span>Enter Code</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {families.map((fm: any) => {
                  const fam = fm.family ?? fm;
                  return (
                    <div key={fam.id ?? fm.familyId} className="glass" style={{ 
                      padding: "24px", 
                      borderRadius: "24px",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px"
                    }}>
                      <div style={{ 
                        width: "48px", 
                        height: "48px", 
                        borderRadius: "50%", 
                        background: "linear-gradient(135deg, rgba(112,207,66,0.2), rgba(25,199,216,0.2))",
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        border: "1px solid rgba(112,207,66,0.3)"
                      }}>
                        <i className="fa-solid fa-check-circle" style={{ color: "#70cf42", fontSize: "1.2rem" }}></i>
                      </div>
                      <div>
                        <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "white", fontSize: "1.1rem" }}>
                          {fam.title ?? "My Family"}
                        </p>
                        <p style={{ margin: 0, color: "#a5b7d0", fontSize: "0.9rem" }}>
                          You're a member! 🎉
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}