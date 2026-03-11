import { useEffect, useState } from "react";
import { familyApi } from "@/lib/api";
import { QRScanner } from "@/components/QRScanner";
import { toast } from "sonner";
import { getFamilyTitle } from "@/lib/view-models";

export default function ChildFamily() {
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    void fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    setLoading(true);
    try {
      const data = await familyApi.getMyFamilies();
      setFamilies(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load family");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (inviteCode: string) => {
    if (!inviteCode.trim()) return;
    setJoining(true);
    try {
      await familyApi.join(inviteCode.trim());
      toast.success("Joined family.");
      setCode("");
      setShowScanner(false);
      setManualMode(false);
      await fetchFamilies();
    } catch (error: any) {
      toast.error(error.message || "Failed to join family");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container dashboard-stack">
        <section className="dashboard-hero">
          <div className="dashboard-eyebrow">
            <i className="fa-solid fa-house-user"></i>
            Family access
          </div>
          <h1 className="dashboard-title">Join with a code or scan in one tap.</h1>
          <p className="dashboard-copy">
            Use the invite code from your parent. Once you join, the family stays listed here with a cleaner mobile layout.
          </p>
        </section>

        <section className="dashboard-grid two-up">
          <div className="panel-card action-card" onClick={() => { setShowScanner(true); setManualMode(false); }}>
            <div className="stat-icon"><i className="fa-solid fa-qrcode"></i></div>
            <div className="section-heading">Scan QR code</div>
            <p className="section-subtitle">Use the camera if your parent shows a QR invite.</p>
          </div>
          <div className="panel-card action-card" onClick={() => { setManualMode(true); setShowScanner(false); }}>
            <div className="stat-icon"><i className="fa-solid fa-keyboard"></i></div>
            <div className="section-heading">Enter code</div>
            <p className="section-subtitle">Type the invite code manually if you cannot scan.</p>
          </div>
        </section>

        {manualMode && (
          <section className="panel-card">
            <div className="section-title">
              <div>
                <h2 className="section-heading">Enter invite code</h2>
                <p className="section-subtitle">Codes are usually six characters.</p>
              </div>
            </div>
            <div className="dashboard-form-grid">
              <input
                className="dashboard-input"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="ABC123"
              />
              <button className="btn btn-primary" disabled={joining || code.length < 4} onClick={() => handleJoin(code)}>
                {joining ? "Joining..." : "Join family"}
              </button>
            </div>
          </section>
        )}

        <section className="panel-card">
          <div className="section-title">
            <div>
              <h2 className="section-heading">Connected families</h2>
              <p className="section-subtitle">Any family you joined appears here.</p>
            </div>
          </div>

          {loading ? (
            <div className="empty-panel">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <p className="section-subtitle">Loading family...</p>
            </div>
          ) : families.length === 0 ? (
            <div className="empty-panel">
              <i className="fa-solid fa-users"></i>
              <h3 className="section-heading" style={{ fontSize: "1.2rem" }}>Not connected yet</h3>
              <p className="section-subtitle">Ask your parent for a QR code or invite code.</p>
            </div>
          ) : (
            <div className="family-card">
              {families.map((familyRecord: any, index) => (
                <div key={index} className="info-row">
                  <div>
                    <strong>{getFamilyTitle(familyRecord)}</strong>
                    <div className="muted-copy" style={{ marginTop: "4px" }}>You are already a member.</div>
                  </div>
                  <span className="pill">
                    <i className="fa-solid fa-check"></i>
                    Joined
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showScanner && (
        <div className="modal-overlay" onClick={() => setShowScanner(false)}>
          <div className="panel-card modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="section-title">
              <div>
                <h3 className="section-heading">Scan invite QR code</h3>
                <p className="section-subtitle">Point your camera at the code from your parent.</p>
              </div>
            </div>
            <QRScanner onScan={handleJoin} onClose={() => setShowScanner(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
