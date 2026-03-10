import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>

      {/* Header */}
      <header className="header">
        <div className="container nav">
          <a href="/" className="brand" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            <img src="/logo.png" alt="Stack logo" />
            <span>Stack</span>
          </a>

          <nav className="desktop-nav">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/features"); }}>Features</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/developers"); }}>Developers</a>
          </nav>

          <div className="nav-actions">
            <button onClick={() => navigate("/login")} className="btn btn-outline">Get Started</button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="section-head reveal up" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
              <div className="eyebrow" style={{ display: "inline-flex" }}>
                <i className="fa-solid fa-shield-halved"></i>
                Privacy Policy
              </div>
              <h1 className="hero-title">
                Your family's privacy is
                <span>our top priority</span>
              </h1>
              <p className="hero-text">
                We are committed to protecting your personal information and being transparent 
                about how we collect, use, and safeguard your data.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="section">
          <div className="container">
            <div className="glass" style={{ padding: "48px", borderRadius: "32px", maxWidth: "900px", margin: "0 auto" }}>
              <div style={{ color: "#f4f8ff", lineHeight: "1.8" }}>
                <h2 style={{ color: "#86f0ff", marginTop: 0 }}>Information We Collect</h2>
                <p style={{ color: "#a5b7d0" }}>
                  We collect information you provide directly to us, such as when you create an account, 
                  use our services, or contact us for support.
                </p>

                <h3 style={{ color: "#dce8ff", marginTop: "32px" }}>Account Information</h3>
                <ul style={{ color: "#a5b7d0", paddingLeft: "20px" }}>
                  <li>Username and password</li>
                  <li>Family relationships and member roles</li>
                  <li>Account balances and transaction history</li>
                  <li>Savings goals and progress</li>
                </ul>

                <h3 style={{ color: "#dce8ff", marginTop: "32px" }}>Usage Information</h3>
                <ul style={{ color: "#a5b7d0", paddingLeft: "20px" }}>
                  <li>Game scores and educational progress</li>
                  <li>App usage patterns and preferences</li>
                  <li>Device information and IP addresses</li>
                  <li>Log data and error reports</li>
                </ul>

                <h2 style={{ color: "#86f0ff", marginTop: "40px" }}>How We Use Your Information</h2>
                <p style={{ color: "#a5b7d0" }}>
                  We use the information we collect to provide, maintain, and improve our services:
                </p>

                <ul style={{ color: "#a5b7d0", paddingLeft: "20px" }}>
                  <li>Process transactions and manage accounts</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send important updates about your account</li>
                  <li>Improve our services and develop new features</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>

                <h2 style={{ color: "#86f0ff", marginTop: "40px" }}>Information Sharing</h2>
                <p style={{ color: "#a5b7d0" }}>
                  We do not sell, trade, or otherwise transfer your personal information to third parties. 
                  We may share information only in these limited circumstances:
                </p>

                <ul style={{ color: "#a5b7d0", paddingLeft: "20px" }}>
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>With service providers who assist in our operations</li>
                </ul>

                <h2 style={{ color: "#86f0ff", marginTop: "40px" }}>Data Security</h2>
                <p style={{ color: "#a5b7d0" }}>
                  We implement industry-standard security measures to protect your information:
                </p>

                <ul style={{ color: "#a5b7d0", paddingLeft: "20px" }}>
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure authentication with JWT tokens</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information</li>
                </ul>

                <h2 style={{ color: "#86f0ff", marginTop: "40px" }}>Children's Privacy</h2>
                <p style={{ color: "#a5b7d0" }}>
                  Stack is designed for families with children. We take special care to protect 
                  children's privacy and comply with applicable laws:
                </p>

                <ul style={{ color: "#a5b7d0", paddingLeft: "20px" }}>
                  <li>Parental consent required for child accounts</li>
                  <li>Parents have full control over child data</li>
                  <li>Limited data collection from children</li>
                  <li>No advertising or marketing to children</li>
                </ul>

                <h2 style={{ color: "#86f0ff", marginTop: "40px" }}>Your Rights</h2>
                <p style={{ color: "#a5b7d0" }}>You have the right to:</p>

                <ul style={{ color: "#a5b7d0", paddingLeft: "20px" }}>
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Export your data</li>
                  <li>Opt out of communications</li>
                </ul>

                <h2 style={{ color: "#86f0ff", marginTop: "40px" }}>Contact Us</h2>
                <p style={{ color: "#a5b7d0" }}>
                  If you have questions about this Privacy Policy or our data practices, 
                  please contact us at privacy@stackkidsbank.com
                </p>

                <div style={{ marginTop: "32px", padding: "20px", borderRadius: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#a5b7d0" }}>
                    <strong style={{ color: "#dce8ff" }}>Last Updated:</strong> March 10, 2026<br/>
                    This Privacy Policy may be updated from time to time. We will notify you of any material changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-wrap">
          <div>
            <a href="/" className="brand footer-brand" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
              <img src="/logo.png" alt="Stack logo" />
              <span>Stack</span>
            </a>
            <p>Kids banking made beautiful, safe, and meaningful.</p>
          </div>

          <div className="footer-links">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/terms"); }}>Terms</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/privacy"); }}>Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}