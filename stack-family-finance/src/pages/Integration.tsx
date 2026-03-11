import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { useMarketingMotion } from "@/hooks/useMarketingMotion";
import "./Landing.css";

const partnerStacks = [
  {
    title: "School systems",
    text: "Map attendance, homework, achievement, and classroom progression into parent-visible value without forcing schools to build a finance stack from zero.",
  },
  {
    title: "Parenting products",
    text: "Let another app own routines, communication, and scheduling while Stack provides the supervised money, reward, and goal engine.",
  },
  {
    title: "Learning products",
    text: "Convert lesson completion, quiz performance, and challenge streaks into meaningful child progress that parents can validate.",
  },
  {
    title: "Kid-safe commerce",
    text: "Use Stack as the supervised balance and approval layer inside controlled purchase experiences and retail-linked products.",
  },
];

const packageSurfaces = [
  {
    name: "Identity package",
    text: "JWT login, refresh flow, session persistence, and role-aware route entry for parent, child, and admin.",
  },
  {
    name: "Family package",
    text: "Family creation, member lookup, invite flow, role linkage, and parent-supervised relationship structure.",
  },
  {
    name: "Reward package",
    text: "Tasks, proof uploads, approval decisions, game outcomes, balance updates, and goal movement.",
  },
  {
    name: "Distribution package",
    text: "Shared React frontend delivered on the web, in Electron, and through Capacitor Android packaging.",
  },
  {
    name: "Admin package",
    text: "Users, transactions, families, games, and internal system visibility through dedicated DTO-backed operations.",
  },
  {
    name: "Camera package",
    text: "QR and media permission handling for device-based flows in browser, Electron, and Android contexts.",
  },
];

const flowExamples = [
  {
    title: "Partner auth flow",
    code: `POST /api/auth/login
-> read data.accessToken
-> store token securely
-> request /api/family/me
-> load role-specific dashboard
-> refresh on expiry once`,
  },
  {
    title: "Value mapping flow",
    code: `partner event
-> task assignment or reward trigger
-> child action
-> proof / validation
-> parent approval
-> balance / goal update
-> admin audit visibility`,
  },
  {
    title: "Deployment path",
    code: `Spring Boot API
-> React web product
-> Electron desktop package
-> Capacitor Android package
-> partner-facing public microsite`,
  },
];

const approvalChecklist = [
  "Developer reviews partner fit and intended use.",
  "Route contract and token handling are validated.",
  "Child-safety and parent-supervision expectations are checked.",
  "Expected traffic and operational visibility are reviewed.",
  "Integration launches with staged exposure instead of full access.",
  "Admin audit visibility is confirmed before expansion.",
];

export default function Integration() {
  const navigate = useNavigate();
  useMarketingMotion();

  return (
    <div className="landing-page microsite-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>
      <MarketingHeader activePath="/integration" />

      <main>
        <section className="hero hero-premium">
          <div className="container hero-grid">
            <div className="hero-copy reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-plug-circle-check"></i>
                Integration Architecture
              </div>
              <h1 className="hero-title">
                Stack is a
                <span>partner-ready systems layer</span>
              </h1>
              <p className="hero-text">
                Integration is not just about opening API routes. Stack already contains identity, roles, family linkage, tasks, proofs,
                approvals, goals, transaction visibility, admin oversight, QR capability, and multi-platform delivery. That makes it usable as a platform package.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => navigate("/documentation")}>
                  <i className="fa-solid fa-code"></i>
                  Review contracts
                </button>
                <button className="btn btn-secondary" onClick={() => navigate("/presentation")}>
                  <i className="fa-solid fa-images"></i>
                  Product story
                </button>
              </div>
            </div>

            <div className="hero-visual reveal right">
              <div className="package-surface glass">
                <div className="code-topbar">
                  <span></span><span></span><span></span>
                  <p>integration-surface-map</p>
                </div>
                <div className="package-list">
                  {packageSurfaces.slice(0, 4).map((item) => (
                    <div key={item.name} className="package-pill">
                      <i className="fa-solid fa-cube"></i>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container source-map glass reveal zoom">
            <div className="source-column">
              <small>Sources</small>
              <div className="source-node">Spring Boot API</div>
              <div className="source-node">Family finance logic</div>
              <div className="source-node">Admin services</div>
              <div className="source-node">Game and task engines</div>
            </div>
            <div className="source-connector"></div>
            <div className="source-column">
              <small>Surfaces</small>
              <div className="source-node">React web app</div>
              <div className="source-node">Electron desktop</div>
              <div className="source-node">Capacitor Android</div>
              <div className="source-node">Partner products</div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container editorial-grid">
            <div className="editorial-copy reveal left">
              <div className="eyebrow">Partner fit</div>
              <h2>Integrate complete value loops, not isolated endpoints.</h2>
              <p>
                The strongest partner integrations are the ones that map real activity in another product back into Stack's supervised finance cycle:
                act, validate, reward, save, review, and keep parents in control.
              </p>
            </div>
            <div className="feature-grid">
              {partnerStacks.map((item, index) => (
                <article key={item.title} className={`feature-card glass reveal ${index % 2 === 0 ? "right" : "left"}`}>
                  <div className="icon-box"><i className="fa-solid fa-network-wired"></i></div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container matrix-board glass reveal zoom">
            <div className="section-head" style={{ marginBottom: 24 }}>
              <div className="eyebrow">Package architecture</div>
              <h2>Reusable platform packages instead of one giant vague integration.</h2>
            </div>
            <div className="matrix-grid">
              {packageSurfaces.map((item) => (
                <div key={item.name} className="matrix-cell">
                  <strong>{item.name}</strong>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container code-grid">
            {flowExamples.map((item, index) => (
              <div key={item.title} className={`code-panel glass reveal ${index % 2 === 0 ? "left" : "right"}`}>
                <div className="code-panel-head">
                  <strong>{item.title}</strong>
                  <button className="pill">copy-ready</button>
                </div>
                <pre>{item.code}</pre>
              </div>
            ))}
          </div>
        </section>

        <section className="section section-dark">
          <div className="container sticky-showcase">
            <div className="sticky-copy reveal up">
              <div className="pin-box">
                <div className="eyebrow">Integration model</div>
                <h2>Think in package ownership, not just request ownership.</h2>
                <p>
                  One integration may only need identity and family. Another may need rewards and goals. Another may need the full device delivery story.
                  The page should make those layers legible.
                </p>
              </div>
            </div>
            <div className="sticky-cards">
              <div className="story-panel glass reveal right premium-panel">
                <span>Source</span>
                <h3>Backend remains the source of truth</h3>
                <p>Auth, roles, families, tasks, transactions, goals, games, and admin operations all live behind the Spring Boot API.</p>
              </div>
              <div className="story-panel glass reveal left premium-panel">
                <span>Client</span>
                <h3>Frontend remains the unified product shell</h3>
                <p>The React app renders public pages, parent and child dashboards, settings, admin tools, and partner-visible product surfaces.</p>
              </div>
              <div className="story-panel glass reveal right premium-panel">
                <span>Delivery</span>
                <h3>Packages make the product portable</h3>
                <p>Electron and Capacitor extend the same product into Windows and Android without splitting the experience into separate teams or codebases.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container terminal-rack">
            <div className="terminal-panel glass reveal left">
              <div className="code-topbar">
                <span></span><span></span><span></span>
                <p>package-sources</p>
              </div>
              <pre>{`web        -> React + Vite
desktop    -> Electron + electron-builder
android    -> Capacitor + Gradle
api        -> Spring Boot + JWT security
admin      -> DTO-backed internal operations
camera     -> browser / electron / android permission flow`}</pre>
            </div>
            <div className="terminal-panel glass reveal right">
              <div className="code-topbar">
                <span></span><span></span><span></span>
                <p>approval-checklist</p>
              </div>
              <pre>{approvalChecklist.map((item, index) => `${index + 1}. ${item}`).join("\n")}</pre>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
