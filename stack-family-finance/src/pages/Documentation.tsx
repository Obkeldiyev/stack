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
    name: "Dashboard and tasks",
    code: `GET /api/dashboard/parent
GET /api/dashboard/child
GET /api/tasks/parent
GET /api/tasks/child
POST /api/tasks`,
  },
  {
    name: "Banking and goals",
    code: `GET /api/accounts/me
GET /api/transactions/me
GET /api/goals/me
POST /api/goals`,
  },
];

const rules = [
  "Send Authorization: Bearer <accessToken> for protected routes.",
  "Persist accessToken from login, not a guessed token property.",
  "Retry once through refresh for expired sessions, then log out cleanly.",
  "Resolve current user from authenticated identity, never from hardcoded IDs.",
  "Treat parent, child, and admin as separate route surfaces and data contracts.",
  "Deploy backend auth or DTO changes before shipping the frontend that depends on them.",
];

const codeExamples = [
  {
    title: "Login response",
    code: `{
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
}`,
  },
  {
    title: "Refresh retry logic",
    code: `try {
  return await apiFetch(endpoint, options);
} catch (error) {
  if (isAuthError(error)) {
    await refreshSession();
    return await apiFetch(endpoint, retryOptions);
  }
  throw error;
}`,
  },
  {
    title: "Parent dashboard call",
    code: `GET /api/dashboard/parent
Authorization: Bearer <accessToken>

200 OK
{
  "message": "Success",
  "data": {
    "accounts": [],
    "goals": [],
    "recentTransactions": []
  }
}`,
  },
  {
    title: "Profile update behavior",
    code: `PATCH /api/users/profile
Authorization: Bearer <accessToken>

-> backend updates current user
-> frontend updates stored user snapshot
-> session persists without forced relogin`,
  },
];

const architectureRows = [
  ["Spring Boot backend", "Owns auth, roles, families, tasks, transactions, goals, games, and admin services."],
  ["JWT filter and method security", "Protects the backend while keeping role logic explicit at controller and service level."],
  ["React web product", "Renders landing pages, parent and child dashboards, settings, admin surfaces, and auth flow."],
  ["Electron desktop package", "Delivers the same frontend inside a Windows desktop shell with media permission handling."],
  ["Capacitor Android package", "Builds the mobile experience from the shared frontend and syncs it into native Android."],
  ["Admin DTO layer", "Stabilizes admin responses so the frontend is not guessing at backend entity shape."],
];

const deploymentNotes = [
  "Update backend auth or DTO contracts first.",
  "Deploy Spring Boot to the server before frontend release.",
  "Deploy frontend build after backend is live.",
  "Clear stale browser or app auth data and log in again.",
  "Verify dashboard, family, tasks, and profile endpoints with a fresh session.",
  "Only then rebuild or redistribute Electron and Android artifacts if needed.",
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
                The full contract
                <span>behind the product</span>
              </h1>
              <p className="hero-text">
                This documentation explains the real system: backend identity handling, frontend session behavior, route ownership, admin DTOs,
                Windows and Android delivery, deployment order, and the failure patterns that previously produced 403 and 500 errors.
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
                  <div className="workspace-item">dashboard.contracts.ts</div>
                  <div className="workspace-item">admin-dtos.java</div>
                  <div className="workspace-item">deployment-order.md</div>
                </div>
                <div className="workspace-main">
                  <div className="code-topbar">
                    <span></span><span></span><span></span>
                    <p>live-auth-contract.ts</p>
                  </div>
                  <pre>{`const login = await api.post("/api/auth/login", credentials);
const token = login.data.accessToken;

const profile = await api.get("/api/users/profile", {
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
              <div className="eyebrow">System map</div>
              <h2>Document by behavior, ownership, and deployment.</h2>
              <p>
                The project is bigger than a route list. It includes live auth, parent and child dashboards, tasks with proof uploads,
                settings persistence, admin supervision, Windows packaging, Android packaging, and a public microsite.
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
              <h2>Primary API routes grouped by actual app usage.</h2>
            </div>
            <div className="route-grid">
              <div className="route-item"><span>POST</span><code>/api/auth/login</code><p>Returns `accessToken`, optional `refreshToken`, and `user`.</p></div>
              <div className="route-item"><span>POST</span><code>/api/auth/refresh</code><p>Used by the frontend retry flow when auth expires.</p></div>
              <div className="route-item"><span>GET</span><code>/api/family/me</code><p>Loads the authenticated user’s family membership and role context.</p></div>
              <div className="route-item"><span>GET</span><code>/api/dashboard/parent</code><p>Parent dashboard data surface for accounts, goals, and recent activity.</p></div>
              <div className="route-item"><span>GET</span><code>/api/tasks/parent</code><p>Parent task management and approval queue.</p></div>
              <div className="route-item"><span>GET</span><code>/api/users/profile</code><p>Current user profile data for settings and session persistence.</p></div>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container sticky-showcase">
            <div className="sticky-copy reveal up">
              <div className="pin-box">
                <div className="eyebrow">Critical rules</div>
                <h2>These are not suggestions. These are the system rules.</h2>
                <p>
                  Most production failures in this project came from contract mismatch, wrong identity handling, and deployment order mistakes.
                  These rules exist to stop that from happening again.
                </p>
              </div>
            </div>
            <div className="sticky-cards">
              {rules.map((item, index) => (
                <div key={item} className={`story-panel glass ${index % 2 === 0 ? "reveal right" : "reveal left"} premium-panel`}>
                  <span>{`Rule ${index + 1}`}</span>
                  <h3>{item}</h3>
                  <p>Apply it consistently across the backend, web app, Electron wrapper, Android wrapper, and any external integration.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container matrix-board glass reveal zoom">
            <div className="section-head" style={{ marginBottom: 24 }}>
              <div className="eyebrow">Architecture matrix</div>
              <h2>Major layers and what each layer owns.</h2>
            </div>
            <div className="matrix-grid">
              {architectureRows.map(([title, text]) => (
                <div key={title} className="matrix-cell">
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Executable examples</div>
              <h2>Docs should feel runnable, not decorative.</h2>
              <p>These blocks are written as reference surfaces a developer can actually follow during implementation.</p>
            </div>
            <div className="code-grid">
              {codeExamples.map((item, index) => (
                <div key={item.title} className={`code-panel glass reveal ${index % 2 === 0 ? "left" : "right"}`}>
                  <div className="code-panel-head">
                    <strong>{item.title}</strong>
                    <button className="pill">copy block</button>
                  </div>
                  <pre>{item.code}</pre>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container terminal-rack">
            <div className="terminal-panel glass reveal left">
              <div className="code-topbar">
                <span></span><span></span><span></span>
                <p>deployment-order</p>
              </div>
              <pre>{deploymentNotes.map((item, index) => `${index + 1}. ${item}`).join("\n")}</pre>
            </div>
            <div className="terminal-panel glass reveal right">
              <div className="code-topbar">
                <span></span><span></span><span></span>
                <p>failure-patterns</p>
              </div>
              <pre>{`403 before controller:
  invalid or missing bearer token

500 before fixes:
  controller parsed principal incorrectly

stale auth UI:
  frontend stored token instead of accessToken

admin mismatch:
  frontend assumed raw entity fields instead of DTO contract`}</pre>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
