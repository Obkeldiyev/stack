import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { useMarketingMotion } from "@/hooks/useMarketingMotion";
import "./Landing.css";

const endpointSets = [
  {
    name: "Auth",
    code: `curl -X POST https://stack.polito.uz/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"parent","password":"***"}'`,
  },
  {
    name: "Family",
    code: `GET /api/family/me
POST /api/family/create
POST /api/family/{id}/invite
POST /api/family/join`,
  },
  {
    name: "Dashboards",
    code: `GET /api/dashboard/parent
GET /api/dashboard/child
GET /api/tasks/parent
GET /api/tasks/child`,
  },
];

const contracts = [
  "Use Authorization: Bearer <accessToken> on all protected routes.",
  "Persist accessToken from the login payload, not a guessed token field.",
  "Refresh once on auth failure, then log out if refresh also fails.",
  "Treat parent, child, and admin as separate application surfaces.",
  "Consume DTO-shaped admin responses instead of raw entity assumptions.",
  "Deploy backend changes before frontend changes when contracts shift.",
];

export default function Documentation() {
  const navigate = useNavigate();
  useMarketingMotion();

  return (
    <div className="landing-page microsite-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>
      <MarketingHeader activePath="/documentation" />

      <main>
        <section className="hero hero-premium">
          <div className="container hero-grid">
            <div className="hero-copy reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-book-open"></i>
                Platform Documentation
              </div>
              <h1 className="hero-title">
                Documentation that reads
                <span>like a real platform</span>
              </h1>
              <p className="hero-text">
                These docs are structured by system behavior, route ownership, package flow, and product surfaces. The goal is not to dump endpoints.
                The goal is to make the backend and frontend behave predictably together.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => navigate("/integration")}>
                  <i className="fa-solid fa-plug-circle-bolt"></i>
                  Integration architecture
                </button>
                <button className="btn btn-secondary" onClick={() => navigate("/presentation")}>
                  <i className="fa-solid fa-display"></i>
                  Product presentation
                </button>
              </div>
            </div>

            <div className="hero-visual reveal right">
              <div className="workspace-shell glass">
                <div className="workspace-sidebar">
                  <div className="workspace-item active">auth.http</div>
                  <div className="workspace-item">family.routes.ts</div>
                  <div className="workspace-item">dashboard.contracts.json</div>
                  <div className="workspace-item">admin-dtos.java</div>
                </div>
                <div className="workspace-main">
                  <div className="code-topbar">
                    <span></span><span></span><span></span>
                    <p>stack-api.contracts.ts</p>
                  </div>
                  <pre>{`const login = await api.post("/api/auth/login", credentials);
const token = login.data.accessToken;

const parentDashboard = await api.get("/api/dashboard/parent", {
  headers: { Authorization: \`Bearer \${token}\` }
});

if (requestFailsWith401) {
  await api.post("/api/auth/refresh");
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container editorial-grid">
            <div className="editorial-copy reveal left">
              <div className="eyebrow">Structure</div>
              <h2>Document by behavior, not by backend file names.</h2>
              <p>
                The product spans backend security, dashboards, tasks, family flows, settings persistence, admin DTOs, Electron packaging,
                and Android delivery. The docs should show how those pieces depend on each other.
              </p>
            </div>
            <div className="code-grid">
              {endpointSets.map((set, index) => (
                <div key={set.name} className={`code-panel glass reveal ${index % 2 === 0 ? "right" : "left"}`}>
                  <div className="code-panel-head">
                    <strong>{set.name}</strong>
                    <button className="pill">copy-ready</button>
                  </div>
                  <pre>{set.code}</pre>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container route-board glass reveal zoom">
            <div className="route-board-head">
              <div className="eyebrow">Route board</div>
              <h2>Core requests in one technical surface.</h2>
            </div>
            <div className="route-grid">
              <div className="route-item"><span>POST</span><code>/api/auth/login</code><p>Returns `accessToken`, optional `refreshToken`, and `user`.</p></div>
              <div className="route-item"><span>GET</span><code>/api/family/me</code><p>Loads family membership for the authenticated user.</p></div>
              <div className="route-item"><span>GET</span><code>/api/dashboard/parent</code><p>Parent finance dashboard, balances, goals, and activity summary.</p></div>
              <div className="route-item"><span>GET</span><code>/api/tasks/parent</code><p>Task management and approval list for the parent role.</p></div>
              <div className="route-item"><span>GET</span><code>/api/users/profile</code><p>Current profile data for the logged-in user.</p></div>
              <div className="route-item"><span>POST</span><code>/api/auth/refresh</code><p>Refresh path used by the frontend retry flow.</p></div>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container sticky-showcase">
            <div className="sticky-copy reveal up">
              <div className="pin-box">
                <div className="eyebrow">Critical rules</div>
                <h2>If these rules are ignored, the app breaks.</h2>
                <p>
                  Earlier 403 and 500 problems were not random. They came from auth contract drift, incorrect user resolution,
                  and frontend assumptions that no longer matched the backend payload.
                </p>
              </div>
            </div>
            <div className="sticky-cards">
              {contracts.map((item, index) => (
                <div
                  key={item}
                  className={`story-panel glass ${index % 2 === 0 ? "reveal right" : "reveal left"} premium-panel`}
                >
                  <span>{`Rule ${index + 1}`}</span>
                  <h3>{item}</h3>
                  <p>Keep this as a non-negotiable product contract across web, Electron, Android, and any partner integration.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Environment</div>
              <h2>Where the project actually lives.</h2>
            </div>
            <div className="docs-spec-grid">
              <div className="spec-card glass reveal left">
                <small>Production API</small>
                <strong>https://stack.polito.uz</strong>
                <p>Live host for backend routes consumed by web, Electron, and Android clients.</p>
              </div>
              <div className="spec-card glass reveal up">
                <small>Local backend</small>
                <strong>http://localhost:9008</strong>
                <p>Use this when validating Spring Boot changes before pushing to the server.</p>
              </div>
              <div className="spec-card glass reveal up">
                <small>Desktop build</small>
                <strong>Electron</strong>
                <p>Windows packaging uses `electron-vite` and `electron-builder`, with explicit media permission handling.</p>
              </div>
              <div className="spec-card glass reveal right">
                <small>Mobile build</small>
                <strong>Capacitor Android</strong>
                <p>Android delivery syncs the built web app into the native shell and exposes camera-based features.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
