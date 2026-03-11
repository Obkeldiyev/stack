import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import "./Landing.css";

export default function Documentation() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>
      <MarketingHeader activePath="/documentation" />

      <main>
        <section className="hero" style={{ paddingBottom: "40px" }}>
          <div className="container">
            <div className="section-head reveal up" style={{ maxWidth: "860px" }}>
              <div className="eyebrow" style={{ display: "inline-flex" }}>
                <i className="fa-solid fa-book-open"></i>
                Documentation
              </div>
              <h1 className="hero-title">
                API docs that match
                <span>the real backend</span>
              </h1>
              <p className="hero-text">
                These pages replace the broken markdown links and document the actual endpoints used by the React app.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => navigate("/integration")}>
                  <i className="fa-solid fa-plug-circle-bolt"></i>
                  Integration guide
                </button>
                <button className="btn btn-secondary" onClick={() => navigate("/presentation")}>
                  <i className="fa-solid fa-images"></i>
                  Presentation page
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="download-grid">
              <div className="download-card glass">
                <div className="download-icon"><i className="fa-solid fa-link"></i></div>
                <h3>Base URL</h3>
                <p>`https://stack.polito.uz` for production and `http://localhost:9008` for local backend work.</p>
              </div>
              <div className="download-card glass">
                <div className="download-icon"><i className="fa-solid fa-key"></i></div>
                <h3>Auth Format</h3>
                <p>Use `Authorization: Bearer &lt;accessToken&gt;`. The backend returns `accessToken`, not `token`.</p>
              </div>
              <div className="download-card glass">
                <div className="download-icon"><i className="fa-solid fa-user-shield"></i></div>
                <h3>Roles</h3>
                <p>`PARENT`, `CHILD`, and `ADMIN` are enforced by security and endpoint logic.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="feature-grid">
              <article className="feature-card glass">
                <div className="icon-box"><i className="fa-solid fa-right-to-bracket"></i></div>
                <h3>Auth endpoints</h3>
                <p>`POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`.</p>
              </article>
              <article className="feature-card glass">
                <div className="icon-box"><i className="fa-solid fa-users"></i></div>
                <h3>Family endpoints</h3>
                <p>`GET /api/family/me`, `POST /api/family/create`, `POST /api/family/{'{id}'}/invite`, `POST /api/family/join`.</p>
              </article>
              <article className="feature-card glass">
                <div className="icon-box"><i className="fa-solid fa-wallet"></i></div>
                <h3>Banking endpoints</h3>
                <p>`GET /api/dashboard/parent`, `GET /api/dashboard/child`, `/api/accounts`, `/api/goals`, `/api/transactions`.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="glass" style={{ padding: "32px", borderRadius: "28px" }}>
              <h2 style={{ marginTop: 0 }}>Current response shape</h2>
              <pre style={{ whiteSpace: "pre-wrap", color: "#dce8ff", fontSize: "0.95rem", lineHeight: "1.7", overflowX: "auto" }}>{`{
  "message": "Login successful",
  "data": {
    "accessToken": "jwt",
    "refreshToken": "optional",
    "user": {
      "id": 1,
      "username": "parent1",
      "role": "PARENT"
    }
  }
}`}</pre>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

