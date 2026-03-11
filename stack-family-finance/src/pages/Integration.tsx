import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import "./Landing.css";

const partnerUseCases = [
  {
    title: "Schools and academies",
    text: "Reward attendance, homework completion, quiz performance, and classroom milestones with parent-visible financial incentives.",
  },
  {
    title: "Family and parenting apps",
    text: "Reuse Stack as the supervised money layer while the partner product owns routines, chat, scheduling, or wellness workflows.",
  },
  {
    title: "Kid-safe commerce",
    text: "Support controlled purchases, balance awareness, and parent oversight inside marketplaces or activity platforms.",
  },
  {
    title: "Gamified learning platforms",
    text: "Turn points, streaks, and challenge completion into savings contributions, rewards, and real-world motivation.",
  },
];

const integrationAdvantages = [
  "Role-aware access model already implemented",
  "Parent approval flows for tasks and money actions",
  "Savings goals and transaction visibility already present",
  "Admin controls for users, games, and financial activity",
  "Web, Electron, and Android delivery paths from one codebase",
  "QR and camera flows ready for supervised identity or payment interactions",
];

export default function Integration() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>
      <MarketingHeader activePath="/integration" />

      <main>
        <section className="hero" style={{ paddingBottom: "40px" }}>
          <div className="container hero-grid">
            <div className="hero-copy reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-plug-circle-check"></i>
                Integration Architecture
              </div>
              <h1 className="hero-title">
                Connect Stack into
                <span>bigger product ecosystems</span>
              </h1>
              <p className="hero-text">
                Stack is not just a standalone family finance app. It can act as the supervised wallet, reward,
                family-role, and child-engagement layer inside a broader education, parenting, or commerce platform.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => navigate("/documentation")}>
                  <i className="fa-solid fa-book-open"></i>
                  Read technical docs
                </button>
                <button className="btn btn-secondary" onClick={() => navigate("/presentation")}>
                  <i className="fa-solid fa-images"></i>
                  Stakeholder presentation
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="phone-card glass reveal zoom">
                <div className="screen-top"><span></span><p>Partner value map</p></div>
                <div className="balance-box">
                  <small>Integration stack</small>
                  <h3>Identity + rewards + finance</h3>
                  <div className="badge-row">
                    <span>Schools</span>
                    <span>Parenting</span>
                    <span>Retail</span>
                  </div>
                </div>
                <div className="icon-pills">
                  <div><i className="fa-solid fa-shield"></i><span>Access</span></div>
                  <div><i className="fa-solid fa-bullseye"></i><span>Goals</span></div>
                  <div><i className="fa-solid fa-trophy"></i><span>Rewards</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container journey-grid">
            <div className="journey-card glass">
              <span>01</span>
              <h3>Authenticate once</h3>
              <p>Call `POST /api/auth/login`, store `accessToken`, and attach it to every protected request as a bearer token.</p>
            </div>
            <div className="journey-card glass">
              <span>02</span>
              <h3>Load role-specific surfaces</h3>
              <p>Parents use `/api/dashboard/parent`, `/api/family/me`, `/api/tasks/parent`; children use child routes and supervised goals.</p>
            </div>
            <div className="journey-card glass">
              <span>03</span>
              <h3>Recover on expiry</h3>
              <p>On `401` or rejected auth, refresh the token once and retry. If refresh fails, end the session cleanly.</p>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Integration advantages</div>
              <h2>Why a partner would choose Stack instead of rebuilding this layer.</h2>
              <p>These are the practical product and engineering reasons Stack is useful as an integration target.</p>
            </div>
            <div className="detail-grid">
              {integrationAdvantages.map((item) => (
                <div className="mini-feature glass" key={item}>
                  <i className="fa-solid fa-check"></i>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Partner models</div>
              <h2>Integration possibilities across adjacent products.</h2>
              <p>Stack fits best where another product needs trusted family identity, visible progress, and supervised value transfer.</p>
            </div>
            <div className="feature-grid">
              {partnerUseCases.map((useCase) => (
                <article className="feature-card glass" key={useCase.title}>
                  <div className="icon-box"><i className="fa-solid fa-layer-group"></i></div>
                  <h3>{useCase.title}</h3>
                  <p>{useCase.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container spec-table glass">
            <div>
              <small>Identity model</small>
              <strong>JWT + refresh</strong>
              <p>Simple enough for web, desktop, and mobile wrappers while keeping protected routes role-aware.</p>
            </div>
            <div>
              <small>Family structure</small>
              <strong>Parent-supervised</strong>
              <p>Families, invites, and child relationships are already part of the backend domain model.</p>
            </div>
            <div>
              <small>Reward engine</small>
              <strong>Tasks + games + goals</strong>
              <p>Partner events can connect to real value flows instead of ending at points with no visible outcome.</p>
            </div>
            <div>
              <small>Operations</small>
              <strong>Admin oversight</strong>
              <p>Admins can review users, transactions, families, and games without exposing those controls publicly.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="glass" style={{ padding: "32px", borderRadius: "28px" }}>
              <h2 style={{ marginTop: 0 }}>Example partner flow</h2>
              <pre style={{ whiteSpace: "pre-wrap", color: "#dce8ff", fontSize: "0.95rem", lineHeight: "1.7", overflowX: "auto" }}>{`1. Partner logs parent into Stack
2. Parent links family account to the partner product
3. Partner sends children into role-specific experiences
4. Completed activities map to Stack tasks, game rewards, or savings progress
5. Parent sees the outcome in dashboard, family, tasks, and transaction views
6. Admin can still audit users, transactions, and gameplay centrally`}</pre>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container timeline-grid">
            <div className="story-panel glass">
              <span>Approval 01</span>
              <h3>Developer review</h3>
              <p>Production integrations should be approved by you as the project owner so data handling and product fit stay controlled.</p>
            </div>
            <div className="story-panel glass">
              <span>Approval 02</span>
              <h3>Security validation</h3>
              <p>Review token flow, session storage, camera permissions, and expected API volume before opening access to a partner.</p>
            </div>
            <div className="story-panel glass">
              <span>Approval 03</span>
              <h3>Staged rollout</h3>
              <p>Start with a limited partner flow, verify logs and dashboard outcomes, then widen usage once the domain model proves stable.</p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
