import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import "./Landing.css";

const endpointGroups = [
  {
    title: "Authentication",
    icon: "fa-right-to-bracket",
    summary: "Identity, refresh flow, and session lifecycle used by web, Electron, and mobile clients.",
    endpoints: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/auth/refresh",
      "POST /api/auth/logout",
    ],
  },
  {
    title: "Family and roles",
    icon: "fa-users",
    summary: "Family creation, invite flow, role-aware ownership, and child linkage.",
    endpoints: [
      "GET /api/family/me",
      "POST /api/family/create",
      "POST /api/family/{id}/invite",
      "POST /api/family/join",
    ],
  },
  {
    title: "Banking surfaces",
    icon: "fa-wallet",
    summary: "Dashboards, accounts, goals, transfers, and role-based financial visibility.",
    endpoints: [
      "GET /api/dashboard/parent",
      "GET /api/dashboard/child",
      "GET /api/accounts/me",
      "POST /api/goals",
    ],
  },
  {
    title: "Tasks and gameplay",
    icon: "fa-list-check",
    summary: "Task creation, submission proof, approvals, game sessions, and engagement rewards.",
    endpoints: [
      "GET /api/tasks/parent",
      "GET /api/tasks/child",
      "POST /api/tasks",
      "GET /api/games",
    ],
  },
];

const contracts = [
  {
    label: "Access token",
    text: "All protected requests must send Authorization: Bearer <accessToken>. The frontend now persists accessToken instead of the old token field.",
  },
  {
    label: "Refresh model",
    text: "When the backend rejects an expired token, clients should call /api/auth/refresh and retry the original request once before forcing logout.",
  },
  {
    label: "Role ownership",
    text: "Parent, child, and admin surfaces are separate. The backend resolves the current user from the authenticated username, not a hardcoded ID.",
  },
  {
    label: "Admin DTOs",
    text: "Admin APIs return dedicated response models for users, families, transactions, and games so the frontend can render stable control screens.",
  },
];

export default function Documentation() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>
      <MarketingHeader activePath="/documentation" />

      <main>
        <section className="hero" style={{ paddingBottom: "44px" }}>
          <div className="container hero-grid">
            <div className="hero-copy reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-book-open"></i>
                Platform Documentation
              </div>
              <h1 className="hero-title">
                Product docs for
                <span>the real Stack system</span>
              </h1>
              <p className="hero-text">
                This documentation surface explains how the live Spring Boot API, React web app, admin tools,
                Electron desktop build, and Android package fit together. It is structured like a real product
                documentation portal instead of raw markdown links.
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

            <div className="hero-visual">
              <div className="phone-card glass reveal zoom">
                <div className="screen-top">
                  <span></span>
                  <p>Documentation overview</p>
                </div>
                <div className="balance-box">
                  <small>Production stack</small>
                  <h3>React + Spring Boot</h3>
                  <div className="badge-row">
                    <span>JWT auth</span>
                    <span>Admin DTOs</span>
                    <span>Mobile ready</span>
                  </div>
                </div>
                <div className="goal-box">
                  <div className="goal-head">
                    <p>Release confidence</p>
                    <span>Operational</span>
                  </div>
                  <div className="progress"><div className="progress-fill" style={{ width: "88%" }}></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container metrics-row">
            <div className="stat glass">
              <strong>1</strong>
              <span>production API host</span>
            </div>
            <div className="stat glass">
              <strong>3</strong>
              <span>core roles</span>
            </div>
            <div className="stat glass">
              <strong>4</strong>
              <span>delivery surfaces</span>
            </div>
            <div className="stat glass">
              <strong>JWT</strong>
              <span>session model</span>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">System shape</div>
              <h2>Separate docs, same operating model.</h2>
              <p>
                Stack is a multi-surface product. Parents and children use role-specific dashboards, admins operate
                internal controls, and public visitors see a polished product site. The documentation reflects that split.
              </p>
            </div>
            <div className="detail-grid">
              <div className="feature-card glass">
                <div className="icon-box"><i className="fa-solid fa-server"></i></div>
                <h3>Backend system</h3>
                <p>Spring Boot controllers, JWT filter, method security, DTO contracts, and role-aware service logic.</p>
              </div>
              <div className="feature-card glass">
                <div className="icon-box"><i className="fa-solid fa-globe"></i></div>
                <h3>Frontend product</h3>
                <p>Landing, dashboards, tasks, family, settings, admin control area, and token refresh behavior.</p>
              </div>
              <div className="feature-card glass">
                <div className="icon-box"><i className="fa-solid fa-desktop"></i></div>
                <h3>Desktop delivery</h3>
                <p>Electron packaging with explicit media permission handling for QR scanning and internal device features.</p>
              </div>
              <div className="feature-card glass">
                <div className="icon-box"><i className="fa-solid fa-mobile-screen"></i></div>
                <h3>Android delivery</h3>
                <p>Capacitor packaging for APK output, browser-based camera flow, and mobile-first dashboard layouts.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Endpoint map</div>
              <h2>Documented by product area, not by random file.</h2>
              <p>Each group below represents a real workflow in the app so future changes stay aligned across frontend, backend, and admin tools.</p>
            </div>
            <div className="feature-grid">
              {endpointGroups.map((group) => (
                <article className="feature-card glass" key={group.title}>
                  <div className="icon-box"><i className={`fa-solid ${group.icon}`}></i></div>
                  <h3>{group.title}</h3>
                  <p>{group.summary}</p>
                  <div className="spec-list">
                    {group.endpoints.map((endpoint) => (
                      <span className="pill" key={endpoint}>{endpoint}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Critical contracts</div>
              <h2>The parts that actually break the product if ignored.</h2>
              <p>
                These are the system rules the frontend and any external integration must respect. They are the parts
                that were directly responsible for the earlier 403 and 500 failures.
              </p>
            </div>
            <div className="journey-grid">
              {contracts.map((contract, index) => (
                <div className="journey-card glass" key={contract.label}>
                  <span>{`0${index + 1}`}</span>
                  <h3>{contract.label}</h3>
                  <p>{contract.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container spec-table glass">
            <div>
              <small>Base URL</small>
              <strong>https://stack.polito.uz</strong>
              <p>Production API host used by the React app, Electron build, and mobile webview builds.</p>
            </div>
            <div>
              <small>Local backend</small>
              <strong>http://localhost:9008</strong>
              <p>Use this while developing the Spring Boot service locally before pushing to the server.</p>
            </div>
            <div>
              <small>Auth header</small>
              <strong>Bearer accessToken</strong>
              <p>Do not send the deprecated token field. The login and register flows must persist accessToken.</p>
            </div>
            <div>
              <small>Admin seed</small>
              <strong>Rotate immediately</strong>
              <p>The seeded admin account exists only as a bootstrap credential and should be changed after deployment.</p>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="glass" style={{ padding: "32px", borderRadius: "28px" }}>
              <h2 style={{ marginTop: 0 }}>Current login response contract</h2>
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

        <section className="section">
          <div className="container timeline-grid">
            <div className="story-panel glass">
              <span>Docs 01</span>
              <h3>Build against the contract</h3>
              <p>Use documented DTO shapes and route ownership instead of inferring fields from raw entity responses.</p>
            </div>
            <div className="story-panel glass">
              <span>Docs 02</span>
              <h3>Deploy backend before frontend</h3>
              <p>Authentication, DTO shape, and controller fixes must hit production first or the frontend will still receive stale errors.</p>
            </div>
            <div className="story-panel glass">
              <span>Docs 03</span>
              <h3>Clear stale sessions</h3>
              <p>After deployment, log out or clear storage so old auth data does not keep producing false failures.</p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
