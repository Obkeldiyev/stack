import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { DbDiagram } from "@/components/diagrams/DbDiagram";
import { UmlDiagram } from "@/components/diagrams/UmlDiagram";
import { useMarketingMotion } from "@/hooks/useMarketingMotion";
import "./Landing.css";

const domainCards = [
  {
    num: "01",
    icon: "fa-solid fa-key",
    title: "Auth + Refresh",
    desc: "AuthController, JwtService, refresh token repository/service, and frontend retry logic in api.ts.",
    routes: ["/api/auth/register", "/api/auth/login", "/api/auth/refresh", "/api/auth/logout"],
    color: "#1d64d6",
  },
  {
    num: "02",
    icon: "fa-solid fa-people-group",
    title: "Family Lifecycle",
    desc: "Create, invite, join, members, update, delete operations with parent ownership boundaries.",
    routes: ["/api/family/create", "/api/family/me", "/api/family/{id}/invite", "/api/family/join"],
    color: "#19c7d8",
  },
  {
    num: "03",
    icon: "fa-solid fa-wallet",
    title: "Account Lifecycle",
    desc: "Current/savings account retrieval and transfer logic for supervised family value movement.",
    routes: ["/api/accounts/me", "/api/accounts/transfer", "/api/accounts/family/{id}"],
    color: "#70cf42",
  },
  {
    num: "04",
    icon: "fa-solid fa-receipt",
    title: "Transaction Lifecycle",
    desc: "Ledger timeline, deposits, and withdrawals attached to specific account surfaces.",
    routes: ["/api/transactions/accounts/{id}", "/api/transactions/.../deposit", "/api/transactions/.../withdraw"],
    color: "#f59e0b",
  },
  {
    num: "05",
    icon: "fa-solid fa-gauge-high",
    title: "Dashboard Projections",
    desc: "Separate child and parent dashboards with role-specific aggregation rules.",
    routes: ["/api/dashboard/child", "/api/dashboard/parent"],
    color: "#a855f7",
  },
  {
    num: "06",
    icon: "fa-solid fa-list-check",
    title: "Task Reward Engine",
    desc: "Create, complete, approve/reject, and delete workflow with proof requirements.",
    routes: ["/api/tasks", "/api/tasks/{id}/complete", "/api/tasks/{id}/approve", "/api/tasks/{id}/reject"],
    color: "#ec4899",
  },
  {
    num: "07",
    icon: "fa-solid fa-bullseye",
    title: "Goal Progression",
    desc: "Goal creation and save flow for long-term child saving experiences.",
    routes: ["/api/goals/me", "/api/goals", "/api/goals/{goalId}/save"],
    color: "#14b8a6",
  },
  {
    num: "08",
    icon: "fa-solid fa-gamepad",
    title: "Game Sessions",
    desc: "Public list + start + finish endpoints connect engagement to reward paths.",
    routes: ["/api/games/public/list", "/api/games/start/{gameId}", "/api/games/finish/{sessionId}"],
    color: "#f97316",
  },
  {
    num: "09",
    icon: "fa-solid fa-upload",
    title: "Upload Surfaces",
    desc: "Photo upload routes for task proof and profile updates across devices.",
    routes: ["/api/upload/photo", "/api/upload/profile-photo"],
    color: "#6366f1",
  },
  {
    num: "10",
    icon: "fa-solid fa-shield-halved",
    title: "Admin Operations",
    desc: "User/game/family/transaction/stats operations for governance and moderation.",
    routes: ["/api/admin/users", "/api/admin/families", "/api/admin/transactions", "/api/admin/stats"],
    color: "#ef4444",
  },
  {
    num: "11",
    icon: "fa-brands fa-react",
    title: "Frontend Channel Map",
    desc: "Parent pages, child pages, admin pages, marketing pages, and shared API client.",
    routes: ["src/pages/parent", "src/pages/child", "src/pages/admin", "src/lib/api.ts"],
    color: "#38bdf8",
  },
  {
    num: "12",
    icon: "fa-solid fa-boxes-stacked",
    title: "Distribution Channels",
    desc: "Vite web, Electron desktop, and Capacitor Android from the same frontend surface.",
    routes: ["npm run build", "electron:build", "mobile:build"],
    color: "#84cc16",
  },
];

const codeExamples = [
  {
    label: "Login",
    lang: "typescript",
    code: `// src/lib/api.ts
const res = await api.post("/auth/login", {
  username, password
});
const { token, user } = res.data.data;
localStorage.setItem("token", token);`,
  },
  {
    label: "Create Family",
    lang: "typescript",
    code: `// Create family as parent
const res = await api.post("/family/create", {
  title: "Smith Family"
});
const family = res.data.data;
// family.id, family.title`,
  },
  {
    label: "Transfer",
    lang: "typescript",
    code: `// Transfer to child account
await api.post("/accounts/transfer", {
  childId: 7,
  amount: 1500,
  note: "Weekly allowance"
});`,
  },
  {
    label: "Task Flow",
    lang: "typescript",
    code: `// 1. Parent creates task
await api.post("/tasks", {
  childId: 7, title: "Clean room",
  reward: 500
});
// 2. Child completes + uploads proof
await api.put(\`/tasks/\${id}/complete\`);
// 3. Parent approves
await api.put(\`/tasks/\${id}/approve\`);`,
  },
];

const buildRunbooks = [
  { title: "Frontend + quality", code: `npm run dev\nnpm run build\nnpm run preview\nnpm run test\nnpm run lint` },
  { title: "Desktop (Electron)", code: `npm run electron:dev\nnpm run electron:build\nnpm run electron:pack\nnpm run electron:dist:win` },
  { title: "Android (Capacitor)", code: `npm run mobile:init\nnpm run mobile:add:android\nnpm run mobile:sync\nnpm run mobile:build` },
];

const guardrails = [
  "Always parse backend envelope and consume response.data from API wrapper.",
  "Keep one refresh retry strategy and clear auth on repeated unauthorized responses.",
  "Do not merge role dashboards into one route; keep parent/child/admin ownership explicit.",
  "Maintain deterministic amount handling through transfer/task/goal operations.",
  "Preserve task proof and approval gates before any reward payout side effect.",
  "Verify admin stats and transactions after release candidate deployment.",
  "Sync web artifacts before Electron or Capacitor packaging to avoid channel drift.",
];

const diagnostics = [
  "Login works but protected routes fail → check accessToken field extraction.",
  "403 on parent action → confirm current role and family membership relation.",
  "Reward not reflected → inspect complete → approve transition and transaction logs.",
  "Goals not moving → verify goal save payload and fromAccount ownership.",
  "Desktop behavior differs → verify electron build against latest web artifact.",
];

const metrics = [
  { value: "12", label: "backend controllers" },
  { value: "10", label: "service classes" },
  { value: "11", label: "repositories" },
  { value: "11", label: "frontend API modules" },
];

export default function Developers() {
  const navigate = useNavigate();
  const [activeCode, setActiveCode] = useState(0);
  useMarketingMotion();

  return (
    <div className="landing-page">
      <div className="cursor-glow" />
      <div className="bg-noise" />
      <MarketingHeader activePath="/developers" />

      <main>
        {/* Hero */}
        <section className="hero" style={{ paddingTop: 80, paddingBottom: 60 }}>
          <div className="container">
            <div className="reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-terminal" />
                Developer Portal
              </div>
              <h1 className="hero-title">
                Implementation portal mapped to
                <span>the real repo structure.</span>
              </h1>
              <p className="hero-text">
                Domain map, endpoint rails, runbooks, guardrails, diagnostics, and architecture diagrams
                pulled from your current frontend/backend setup.
              </p>
              <div className="hero-actions">
                <button onClick={() => navigate("/documentation")} className="btn btn-primary">
                  <i className="fa-solid fa-book-open" /> Documentation
                </button>
                <button onClick={() => navigate("/integration")} className="btn btn-secondary">
                  <i className="fa-solid fa-link" /> Integration
                </button>
              </div>
            </div>
            <div className="hero-stats" style={{ marginTop: 40 }}>
              {metrics.map((m, i) => (
                <div key={m.label} className={`stat glass reveal left stagger-${i + 1}`}>
                  <strong>{m.value}</strong>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API Domain Map — grid */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">API domain map</div>
              <h2>12 domains. One unified contract.</h2>
              <p>Every card maps to real backend controllers and frontend modules.</p>
            </div>
            <div className="feature-grid">
              {domainCards.map((domain, i) => (
                <article key={domain.num} className={`feature-card glass reveal ${["left","up","right","left","up","right","left","up","right","left","up","right"][i]}`}>
                  <div className="icon-box" style={{ background: `linear-gradient(135deg, ${domain.color}33, ${domain.color}22)`, color: domain.color }}>
                    <i className={domain.icon} />
                  </div>
                  <small style={{ color: domain.color, letterSpacing: "0.14em", fontSize: "0.78rem" }}>{domain.num}</small>
                  <h3>{domain.title}</h3>
                  <p>{domain.desc}</p>
                  <div className="spec-list" style={{ marginTop: "auto", paddingTop: 18 }}>
                    {domain.routes.map((r) => (
                      <span key={r} className="pill" style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "0.78rem" }}>{r}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Code examples with tabs */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Code examples</div>
              <h2>Common implementation patterns.</h2>
              <p>Real TypeScript examples from the frontend API client.</p>
            </div>
            <div className="showcase-console glass reveal up">
              <div className="showcase-console-header">
                <i className="fa-brands fa-react" style={{ marginRight: 8 }} />
                stack-family-finance/src/lib/api.ts
              </div>
              <div className="showcase-console-tabs">
                {codeExamples.map((ex, i) => (
                  <button
                    key={ex.label}
                    className={`showcase-console-tab ${activeCode === i ? "active green" : ""}`}
                    onClick={() => setActiveCode(i)}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
              <pre className="showcase-console-code">{codeExamples[activeCode].code}</pre>
              <div className="showcase-console-footer">
                <span style={{ color: "#7ee06f" }}>
                  <i className="fa-solid fa-circle-check" style={{ marginRight: 6 }} />
                  All requests go through the axios instance with JWT interceptor
                </span>
                <button
                  className="showcase-console-copy"
                  onClick={() => navigator.clipboard.writeText(codeExamples[activeCode].code)}
                >
                  <i className="fa-regular fa-copy" /> Copy
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Build runbooks */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Build runbooks</div>
              <h2>Operational scripts for all channels.</h2>
            </div>
            <div className="terminal-rack" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {buildRunbooks.map((runbook, i) => (
                <div key={runbook.title} className={`terminal-panel glass reveal ${i === 0 ? "left" : i === 1 ? "up" : "right"}`}>
                  <div className="code-topbar">
                    <span /><span /><span />
                    <p>{runbook.title}</p>
                    <button
                      className="showcase-console-copy"
                      style={{ marginLeft: "auto" }}
                      onClick={() => navigator.clipboard.writeText(runbook.code)}
                    >
                      <i className="fa-regular fa-copy" /> Copy
                    </button>
                  </div>
                  <pre>{runbook.code}</pre>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guardrails + diagnostics */}
        <section className="section">
          <div className="container">
            <div className="detail-grid">
              <div className="glass reveal left" style={{ padding: 32, borderRadius: 28 }}>
                <div className="eyebrow" style={{ marginBottom: 16 }}>Engineering guardrails</div>
                <h3 style={{ fontSize: "1.6rem", letterSpacing: "-0.04em", marginBottom: 16 }}>Rules that prevent production bugs</h3>
                <ul className="micro-list">
                  {guardrails.map((rule) => <li key={rule}>{rule}</li>)}
                </ul>
              </div>
              <div className="glass reveal right" style={{ padding: 32, borderRadius: 28 }}>
                <div className="eyebrow" style={{ marginBottom: 16 }}>Diagnostic signatures</div>
                <h3 style={{ fontSize: "1.6rem", letterSpacing: "-0.04em", marginBottom: 16 }}>Symptom → root cause</h3>
                <ul className="micro-list">
                  {diagnostics.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* DB Diagram */}
        <section className="section section-dark" id="dev-db">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Database model</div>
              <h2>Entity graph — visual FK map.</h2>
              <p>Entity graph for users, family edges, accounts, transactions, tasks, goals, and refresh tokens.</p>
            </div>
            <div className="glass reveal up" style={{ padding: 24, borderRadius: 28, overflowX: "auto" }}>
              <DbDiagram />
            </div>
          </div>
        </section>

        {/* UML Diagram */}
        <section className="section" id="dev-uml">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Service topology</div>
              <h2>Client to API architecture — visual UML map.</h2>
              <p>Client to API architecture for role routing, auth flow, domain modules, and persistence path.</p>
            </div>
            <div className="glass reveal up" style={{ padding: 24, borderRadius: 28, overflowX: "auto" }}>
              <UmlDiagram />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-box glass reveal up">
              <div className="cta-copy">
                <div className="eyebrow">Ready to build</div>
                <h2>Everything you need to implement Stack.</h2>
                <p>Read the full documentation or explore the integration guide for partner patterns.</p>
              </div>
              <div className="cta-actions">
                <button onClick={() => navigate("/documentation")} className="btn btn-primary">
                  <i className="fa-solid fa-book-open" /> Read Docs
                </button>
                <button onClick={() => navigate("/presentation")} className="btn btn-secondary">
                  <i className="fa-solid fa-display" /> Presentation
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
