import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import "./Landing.css";

export default function Integration() {
  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>
      <MarketingHeader activePath="/integration" />

      <main>
        <section className="hero" style={{ paddingBottom: "40px" }}>
          <div className="container">
            <div className="section-head reveal up" style={{ maxWidth: "860px" }}>
              <div className="eyebrow" style={{ display: "inline-flex" }}>
                <i className="fa-solid fa-plug-circle-check"></i>
                Integration
              </div>
              <h1 className="hero-title">
                Use Stack with
                <span>clean integration steps</span>
              </h1>
              <p className="hero-text">
                This page replaces raw markdown files with mobile-friendly guidance for auth, requests, and common integration patterns.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container journey-grid">
            <div className="journey-card glass">
              <span>1</span>
              <h3>Authenticate</h3>
              <p>Login with `POST /api/auth/login`, then store `accessToken` and send it as a bearer token on every protected request.</p>
            </div>
            <div className="journey-card glass">
              <span>2</span>
              <h3>Load role-specific data</h3>
              <p>Parents use `/api/dashboard/parent`, `/api/family/me`, `/api/tasks/parent`. Children use `/api/dashboard/child`, `/api/tasks/child`, `/api/goals/me`.</p>
            </div>
            <div className="journey-card glass">
              <span>3</span>
              <h3>Handle auth failures</h3>
              <p>Treat `401` as expired/missing auth and redirect to login. Treat `403` as role mismatch or token not accepted by the backend.</p>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="glass" style={{ padding: "32px", borderRadius: "28px" }}>
              <h2 style={{ marginTop: 0 }}>Example fetch</h2>
              <pre style={{ whiteSpace: "pre-wrap", color: "#dce8ff", fontSize: "0.95rem", lineHeight: "1.7", overflowX: "auto" }}>{`const login = await fetch("https://stack.polito.uz/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password })
});

const { data } = await login.json();
const token = data.accessToken;

const dashboard = await fetch("https://stack.polito.uz/api/dashboard/parent", {
  headers: { Authorization: \`Bearer \${token}\` }
});`}</pre>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

