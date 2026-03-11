import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { useMarketingMotion } from "@/hooks/useMarketingMotion";
import "./Landing.css";

const partnerStacks = [
  {
    title: "School systems",
    text: "Map attendance, homework, achievements, and classroom progression into visible rewards and parent-supervised finance outcomes.",
  },
  {
    title: "Parenting products",
    text: "Let another app handle routines, scheduling, and communication while Stack provides the money, goals, and reward engine.",
  },
  {
    title: "Learning platforms",
    text: "Convert study milestones, quiz performance, and challenge streaks into meaningful progress that parents can validate.",
  },
  {
    title: "Commerce or retail",
    text: "Use Stack as the supervised balance and approval layer inside kid-safe purchasing experiences.",
  },
];

const packages = [
  "JWT authentication and refresh",
  "Role-aware parent / child / admin routing",
  "Family membership and invites",
  "Goals, balances, and transaction visibility",
  "Task proof uploads and approvals",
  "Games and rewards",
  "Electron distribution",
  "Capacitor Android support",
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
                Stack as a
                <span>partner-ready platform layer</span>
              </h1>
              <p className="hero-text">
                Integration should not mean bolting on a few routes. Stack already contains identity, role separation, family structure,
                rewards, goals, task approvals, admin oversight, and distribution channels. That makes it useful as a systems layer.
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
                  <p>integration-packages</p>
                </div>
                <div className="package-list">
                  {packages.map((item) => (
                    <div key={item} className="package-pill">
                      <i className="fa-solid fa-cube"></i>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container editorial-grid">
            <div className="editorial-copy reveal left">
              <div className="eyebrow">Partner fit</div>
              <h2>Integrate whole value loops, not isolated APIs.</h2>
              <p>
                The strongest partner integrations are the ones that map real activity in another product back into Stack’s supervised finance loop:
                act, validate, reward, save, and review.
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
          <div className="container sticky-showcase">
            <div className="sticky-copy reveal up">
              <div className="pin-box">
                <div className="eyebrow">System mapping</div>
                <h2>Think in sources, packages, and delivery points.</h2>
                <p>
                  Integration work is easier when you know what the source of truth is, what surface consumes it,
                  and what package or runtime will deliver it to the end user.
                </p>
              </div>
            </div>
            <div className="sticky-cards">
              <div className="story-panel glass reveal right premium-panel">
                <span>Source</span>
                <h3>Spring Boot backend</h3>
                <p>Owns auth, roles, families, tasks, transactions, goals, games, and admin operations.</p>
              </div>
              <div className="story-panel glass reveal left premium-panel">
                <span>Client</span>
                <h3>React product shell</h3>
                <p>Consumes those routes across landing pages, parent and child dashboards, settings, and admin control screens.</p>
              </div>
              <div className="story-panel glass reveal right premium-panel">
                <span>Packages</span>
                <h3>Electron and Capacitor</h3>
                <p>Wrap the same frontend into desktop and Android delivery with permission handling for camera-driven flows.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container code-grid">
            <div className="code-panel glass reveal left">
              <div className="code-panel-head">
                <strong>Partner auth flow</strong>
                <button className="pill">copy-ready</button>
              </div>
              <pre>{`POST /api/auth/login
-> read data.accessToken
-> store token securely
-> request /api/family/me
-> request role dashboard
-> refresh on expiry once`}</pre>
            </div>
            <div className="code-panel glass reveal right">
              <div className="code-panel-head">
                <strong>Value mapping</strong>
                <button className="pill">integration map</button>
              </div>
              <pre>{`partner event
-> task assignment or reward trigger
-> child action
-> proof / validation
-> parent approval
-> balance / goal update
-> admin audit visibility`}</pre>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container media-band">
            <div className="media-card glass reveal left">
              <div className="eyebrow">Approval</div>
              <h3>Developer-controlled integration access.</h3>
              <p>
                External partners should still be approved manually. That lets you filter for security, traffic expectations,
                child-safety concerns, and whether the partner product fits the parent-supervised model.
              </p>
            </div>
            <div className="media-card glass reveal right">
              <div className="eyebrow">Deployment</div>
              <h3>Public pages separate from internal admin routes.</h3>
              <p>
                Partner-facing integration content should stay on public pages, while admin login and control routes remain unlinked from the microsite.
              </p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
