import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { DbDiagram } from "@/components/diagrams/DbDiagram";
import { UmlDiagram } from "@/components/diagrams/UmlDiagram";
import { useMarketingMotion } from "@/hooks/useMarketingMotion";
import "./Landing.css";

const contractPrinciples = [
  { icon: "fa-solid fa-envelope-open-text", title: "ApiResponse envelope", body: "Every backend response is wrapped. Frontend always reads payload from response.data — never from guessed top-level fields." },
  { icon: "fa-solid fa-rotate", title: "Refresh-aware auth client", body: "A 401 or 403 triggers exactly one silent refresh attempt. On failure auth state is cleared and user is redirected to /login." },
  { icon: "fa-solid fa-user-tag", title: "Role ownership", body: "Parent, child, and admin flows are route-isolated. They never collapse into one ambiguous dashboard contract." },
  { icon: "fa-solid fa-coins", title: "Money discipline", body: "Amount semantics are deterministic across UI conversion, API payloads, service layer, and persistence." },
  { icon: "fa-solid fa-camera", title: "Proof before payout", body: "The task lifecycle enforces completion evidence and parent approval before any value moves." },
  { icon: "fa-solid fa-layer-group", title: "DTO-first operations", body: "Admin contract uses DTO surfaces to decouple internal JPA entities from external operational pages." },
];

const endpointGroups = [
  {
    title: "Auth and Profile",
    code: "POST /api/auth/register\nPOST /api/auth/login\nPOST /api/auth/refresh\nPOST /api/auth/logout\nGET  /api/users/profile\nPUT  /api/users/profile\nPUT  /api/users/profile/password\nPOST /api/users/profile/photo\nGET  /api/users/me",
  },
  {
    title: "Family Graph",
    code: "POST   /api/family/create\nGET    /api/family/me\nPOST   /api/family/{familyId}/invite\nPOST   /api/family/join\nGET    /api/family/{familyId}/members\nPUT    /api/family/{familyId}\nDELETE /api/family/{familyId}\nDELETE /api/family/{familyId}/members/{userId}",
  },
  {
    title: "Wallet and Dashboard",
    code: "GET  /api/dashboard/child\nGET  /api/dashboard/parent\nGET  /api/accounts/me\nPOST /api/accounts/me\nGET  /api/accounts/family/{familyId}\nPOST /api/accounts/transfer\nGET  /api/transactions/accounts/{accountId}\nPOST /api/transactions/accounts/{accountId}/deposit\nPOST /api/transactions/accounts/{accountId}/withdraw",
  },
  {
    title: "Tasks Goals Games",
    code: "POST /api/tasks\nGET  /api/tasks/parent\nGET  /api/tasks/child\nPUT  /api/tasks/{id}/complete\nPUT  /api/tasks/{id}/approve\nPUT  /api/tasks/{id}/reject\nDELETE /api/tasks/{id}\nGET  /api/goals/me\nPOST /api/goals\nPOST /api/goals/{goalId}/save\nGET  /api/games/public/list\nPOST /api/games/start/{gameId}\nPOST /api/games/finish/{sessionId}\nGET  /api/admin/users\nGET  /api/admin/stats",
  },
];

const responseSamples = [
  {
    title: "Login response",
    code: '{\n  "message": "Login successful",\n  "data": {\n    "token": "jwt_token_here",\n    "user": {\n      "id": 1,\n      "username": "john_doe",\n      "role": "PARENT",\n      "enabled": true\n    }\n  }\n}',
  },
  {
    title: "Create family",
    code: '{\n  "message": "Family created",\n  "data": {\n    "id": 1,\n    "title": "Smith Family",\n    "createdBy": 1,\n    "createdAt": "2026-03-10T10:00:00Z"\n  }\n}',
  },
  {
    title: "Auth header usage",
    code: "// All protected requests\nAuthorization: Bearer <accessToken>\n\n// Refresh when 401\nPOST /api/auth/refresh\n{ \"refreshToken\": \"<token>\" }",
  },
];

const commandDeck = [
  { title: "Web runtime", code: "npm run dev\nnpm run build\nnpm run preview\nnpm run test\nnpm run lint" },
  { title: "Desktop runtime", code: "npm run electron:dev\nnpm run electron:build\nnpm run electron:pack\nnpm run electron:dist:win" },
  { title: "Android runtime", code: "npm run mobile:init\nnpm run mobile:add:android\nnpm run mobile:sync\nnpm run mobile:build" },
];

const troubleshooting = [
  "401 after login — wrong token field persisted (must use response.data.accessToken).",
  "403 on protected route — role mismatch, not only authentication failure.",
  "Task payout bug — skipping complete to approve/reject lifecycle.",
  "Ledger mismatch — non-deterministic amount conversion before API call.",
  "Desktop/mobile drift — new web build not synced before packaging.",
  "Admin view gaps — DTO shape drift between backend and frontend.",
];

const releaseChecklist = [
  "Deploy backend contract changes before frontend code depending on new fields.",
  "Re-test both parent and child dashboards after auth or family route updates.",
  "Verify upload flow for task proof and profile photo on web and mobile targets.",
  "Check admin stats and transaction list on release candidate environment.",
  "Run smoke paths: login, invite/join, transfer, task approval, goal save, game session.",
];

export default function Documentation() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  useMarketingMotion();

  return (
    <div className="landing-page">
      <div className="cursor-glow" />
      <div className="bg-noise" />
      <MarketingHeader activePath="/documentation" />
      <main>
        <section className="hero" style={{ paddingTop: 80, paddingBottom: 60 }}>
          <div className="container">
            <div className="reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-book-open" />
                Technical Documentation
              </div>
              <h1 className="hero-title">
                Contract clarity for the
                <span>full family-finance stack.</span>
              </h1>
              <p className="hero-text">
                Response rules, route ownership, module scripts, diagrams, failure patterns, and release discipline in one place.
              </p>
              <div className="hero-actions">
                <button onClick={() => navigate("/developers")} className="btn btn-primary">
                  <i className="fa-solid fa-terminal" /> Developer Portal
                </button>
                <button onClick={() => navigate("/integration")} className="btn btn-secondary">
                  <i className="fa-solid fa-link" /> Integration Guide
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Contract principles</div>
              <h2>Non-negotiable technical behaviors.</h2>
              <p>These keep frontend and backend in sync across all environments.</p>
            </div>
            <div className="feature-grid">
              {contractPrinciples.map((rule, i) => (
                <article key={rule.title} className={`feature-card glass reveal ${["left","up","right","left","up","right"][i]}`}>
                  <div className="icon-box"><i className={rule.icon} /></div>
                  <h3>{rule.title}</h3>
                  <p>{rule.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">API endpoints</div>
              <h2>Route groups by domain ownership.</h2>
              <p>Base URL: https://stack.polito.uz/api</p>
            </div>
            <div className="showcase-console glass reveal up">
              <div className="showcase-console-header">
                <i className="fa-solid fa-server" style={{ marginRight: 8 }} />
                Stack REST API
              </div>
              <div className="showcase-console-tabs">
                {endpointGroups.map((g, i) => (
                  <button
                    key={g.title}
                    className={`showcase-console-tab ${activeTab === i ? "active cyan" : ""}`}
                    onClick={() => setActiveTab(i)}
                  >
                    {g.title}
                  </button>
                ))}
              </div>
              <pre className="showcase-console-code">{endpointGroups[activeTab].code}</pre>
              <div className="showcase-console-footer">
                <span>Protected endpoints require Authorization: Bearer token</span>
                <button className="showcase-console-copy" onClick={() => navigator.clipboard.writeText(endpointGroups[activeTab].code)}>
                  <i className="fa-regular fa-copy" /> Copy
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Response shapes</div>
              <h2>Reference API response envelope.</h2>
            </div>
            <div className="code-grid">
              {responseSamples.map((sample, i) => (
                <div key={sample.title} className={`code-panel glass reveal ${i % 2 === 0 ? "left" : "right"}`}>
                  <div className="code-panel-head">
                    <strong>{sample.title}</strong>
                    <button className="showcase-console-copy" onClick={() => navigator.clipboard.writeText(sample.code)}>
                      <i className="fa-regular fa-copy" /> Copy
                    </button>
                  </div>
                  <pre>{sample.code}</pre>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Runtime commands</div>
              <h2>Script deck for all delivery channels.</h2>
            </div>
            <div className="download-grid">
              {commandDeck.map((deck, i) => (
                <div key={deck.title} className={`terminal-panel glass reveal ${i === 0 ? "left" : i === 1 ? "up" : "right"}`}>
                  <div className="code-topbar">
                    <span /><span /><span />
                    <p>{deck.title}</p>
                    <button className="showcase-console-copy" style={{ marginLeft: "auto" }} onClick={() => navigator.clipboard.writeText(deck.code)}>
                      <i className="fa-regular fa-copy" /> Copy
                    </button>
                  </div>
                  <pre>{deck.code}</pre>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="doc-db">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Database diagram</div>
              <h2>Visual entity-relationship map.</h2>
              <p>Relational view with FK arrows — color-coded by domain.</p>
            </div>
            <div className="glass reveal up" style={{ padding: 24, borderRadius: 28, overflowX: "auto" }}>
              <DbDiagram />
            </div>
          </div>
        </section>

        <section className="section" id="doc-uml">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Architecture diagram</div>
              <h2>System topology — client to database.</h2>
              <p>UML view for frontend, gateway calls, controller boundaries, and persistence flow.</p>
            </div>
            <div className="glass reveal up" style={{ padding: 24, borderRadius: 28, overflowX: "auto" }}>
              <UmlDiagram />
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="detail-grid">
              <div className="glass reveal left" style={{ padding: 32, borderRadius: 28 }}>
                <div className="eyebrow" style={{ marginBottom: 16 }}>Failure playbook</div>
                <h3 style={{ fontSize: "1.6rem", letterSpacing: "-0.04em", marginBottom: 16 }}>Common failure signatures</h3>
                <ul className="micro-list">
                  {troubleshooting.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="glass reveal right" style={{ padding: 32, borderRadius: 28 }}>
                <div className="eyebrow" style={{ marginBottom: 16 }}>Release checklist</div>
                <h3 style={{ fontSize: "1.6rem", letterSpacing: "-0.04em", marginBottom: 16 }}>Before every deployment</h3>
                <ul className="micro-list">
                  {releaseChecklist.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section cta-section">
          <div className="container">
            <div className="cta-box glass reveal up">
              <div className="cta-copy">
                <div className="eyebrow">Next steps</div>
                <h2>Ready to integrate or build on top of Stack?</h2>
                <p>Explore the integration guide or open the developer portal for full implementation details.</p>
              </div>
              <div className="cta-actions">
                <button onClick={() => navigate("/integration")} className="btn btn-primary">
                  <i className="fa-solid fa-link" /> Integration
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
