import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import "./Landing.css";

export default function Developers() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>
      <MarketingHeader activePath="/developers" />

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-code"></i>
                Developer Portal
              </div>
              <h1 className="hero-title">
                Build on top of
                <span>Stack’s family finance engine</span>
              </h1>
              <p className="hero-text">
                This page is the developer-facing summary for architecture, integration fit, environment expectations,
                and rollout discipline. It points into the deeper documentation and presentation surfaces without exposing admin tooling.
              </p>
              <div className="hero-actions">
                <button onClick={() => navigate("/documentation")} className="btn btn-primary">
                  <i className="fa-solid fa-book"></i>
                  API documentation
                </button>
                <button onClick={() => navigate("/integration")} className="btn btn-secondary">
                  <i className="fa-solid fa-puzzle-piece"></i>
                  Integration guide
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="phone-card glass reveal zoom">
                <div className="screen-top"><span></span><p>Developer summary</p></div>
                <div className="balance-box">
                  <small>Core stack</small>
                  <h3>REST + JWT + role logic</h3>
                  <div className="badge-row">
                    <span>Spring Boot</span>
                    <span>React</span>
                    <span>Electron</span>
                  </div>
                </div>
                <div className="goal-box">
                  <div className="goal-head">
                    <p>Integration maturity</p>
                    <span>Ready</span>
                  </div>
                  <div className="progress"><div className="progress-fill" style={{ width: "86%" }}></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container detail-grid">
            <div className="feature-card glass">
              <div className="icon-box"><i className="fa-solid fa-users"></i></div>
              <h3>Family domain</h3>
              <p>Families, invites, members, role ownership, and parent-child access boundaries are already modeled in the backend.</p>
            </div>
            <div className="feature-card glass">
              <div className="icon-box"><i className="fa-solid fa-wallet"></i></div>
              <h3>Banking domain</h3>
              <p>Dashboards, accounts, transactions, goals, and supervised financial flows are available through REST endpoints.</p>
            </div>
            <div className="feature-card glass">
              <div className="icon-box"><i className="fa-solid fa-list-check"></i></div>
              <h3>Task domain</h3>
              <p>Parents can create paid tasks, children can submit proof, and approvals create a clean habit-to-reward loop.</p>
            </div>
            <div className="feature-card glass">
              <div className="icon-box"><i className="fa-solid fa-screwdriver-wrench"></i></div>
              <h3>Admin domain</h3>
              <p>Admins can control users, families, games, and transactions through dedicated DTO-backed internal screens.</p>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container journey-grid">
            <div className="journey-card glass">
              <span>01</span>
              <h3>Respect the auth contract</h3>
              <p>Persist `accessToken`, not a guessed field name. Retry once through refresh on auth expiry, then fail cleanly.</p>
            </div>
            <div className="journey-card glass">
              <span>02</span>
              <h3>Build around roles</h3>
              <p>The platform is not one generic dashboard. Parent, child, and admin routes are intentionally separate.</p>
            </div>
            <div className="journey-card glass">
              <span>03</span>
              <h3>Integrate to outcomes</h3>
              <p>The strongest integrations use Stack for real rewards, visible goals, and auditable value movement.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container spec-table glass">
            <div>
              <small>Runtime target</small>
              <strong>Web, desktop, mobile</strong>
              <p>The app is intended to run in browsers, Electron, and Capacitor-wrapped Android builds.</p>
            </div>
            <div>
              <small>Auth behavior</small>
              <strong>JWT with refresh</strong>
              <p>Clients must expect access token expiry and keep the retry path stable.</p>
            </div>
            <div>
              <small>Camera flows</small>
              <strong>QR-capable</strong>
              <p>Browser and Electron permission handling is part of the delivery model for scanning scenarios.</p>
            </div>
            <div>
              <small>Approval model</small>
              <strong>Developer-controlled</strong>
              <p>External integrations should remain manually approved so platform trust and security stay intact.</p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
