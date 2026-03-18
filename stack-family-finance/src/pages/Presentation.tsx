import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { useMarketingMotion } from "@/hooks/useMarketingMotion";
import "./Landing.css";

const roleStories = [
  {
    icon: "fa-solid fa-user-shield",
    label: "01 · PARENT",
    title: "Command lane",
    body: "Create family, invite child, transfer value, approve proof, and monitor the full money timeline from one cockpit.",
    chips: ["family create", "invite", "transfer", "approve"],
  },
  {
    icon: "fa-solid fa-child-reaching",
    label: "02 · CHILD",
    title: "Momentum lane",
    body: "Children see tasks, goals, balances, transactions, and game progress without hidden state jumps.",
    chips: ["tasks", "goals", "balance", "games"],
  },
  {
    icon: "fa-solid fa-gauge-high",
    label: "03 · ADMIN",
    title: "Governance lane",
    body: "Admin controls users, games, transactions, and live stats to keep growth auditable and stable.",
    chips: ["admin users", "admin games", "stats", "audit"],
  },
  {
    icon: "fa-solid fa-shield-check",
    label: "04 · TRUST",
    title: "Proof lane",
    body: "Task completion requires proof and review so reward movement is understandable and fair.",
    chips: ["photo proof", "approve/reject", "reward", "ledger"],
  },
  {
    icon: "fa-solid fa-bullseye-arrow",
    label: "05 · GROWTH",
    title: "Goals lane",
    body: "Goals plus game sessions tie motivation and long-term saving into one consistent flow.",
    chips: ["goals", "save", "session start", "session finish"],
  },
  {
    icon: "fa-solid fa-rocket",
    label: "06 · ROLLOUT",
    title: "Platform lane",
    body: "The same system ships to browser, Electron desktop, and Capacitor Android with one contract.",
    chips: ["vite", "electron", "capacitor", "one API"],
  },
];

const valueLoop = [
  { id: "01", title: "Parent sets expectation", body: "Task amount and objective are explicit before action starts." },
  { id: "02", title: "Child completes & uploads proof", body: "Proof removes ambiguity and keeps effort visible." },
  { id: "03", title: "Parent approves or rejects", body: "Approval is the trust gate for value movement." },
  { id: "04", title: "Ledger & dashboards update", body: "Child and parent both see the same consequence quickly." },
  { id: "05", title: "Goals keep momentum", body: "Progress remains visible across days and weeks." },
];

const platformStack = [
  { icon: "fa-brands fa-java", label: "Spring Boot 3.x", sub: "Java 21 backend" },
  { icon: "fa-solid fa-database", label: "PostgreSQL", sub: "Persistent data layer" },
  { icon: "fa-solid fa-lock", label: "JWT Auth", sub: "Role-based access control" },
  { icon: "fa-brands fa-react", label: "React 18 + Vite", sub: "TypeScript frontend" },
  { icon: "fa-brands fa-android", label: "Capacitor Android", sub: "APK distribution" },
  { icon: "fa-brands fa-windows", label: "Electron Desktop", sub: "Windows .exe" },
];

const metrics = [
  { value: "12", label: "backend controllers" },
  { value: "10", label: "service layers" },
  { value: "11", label: "API modules" },
  { value: "3", label: "delivery channels" },
];

const audienceSets = [
  {
    icon: "fa-solid fa-users",
    title: "For parents",
    points: [
      "Smart allowances and controlled transfers",
      "Real-time visibility over family money activity",
      "Family management with invite and permissions flow",
      "Task creation with reward amounts and approval gates",
    ],
  },
  {
    icon: "fa-solid fa-gamepad",
    title: "For children",
    points: [
      "Savings goals with visible progression",
      "Educational games tied to reward loops",
      "Virtual banking with parental oversight",
      "Family join through QR or invite code",
    ],
  },
  {
    icon: "fa-solid fa-chart-bar",
    title: "For administrators",
    points: [
      "User management and account moderation",
      "Game management and reward configuration",
      "Family oversight and transaction monitoring",
      "Live system statistics across the platform",
    ],
  },
];

export default function Presentation() {
  const navigate = useNavigate();
  useMarketingMotion();

  return (
    <div className="landing-page">
      <div className="cursor-glow" />
      <div className="bg-noise" />
      <MarketingHeader activePath="/presentation" />

      <main>
        {/* Hero */}
        <section className="hero" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="container">
            <div className="reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-display" />
                Product Presentation
              </div>
              <h1 className="hero-title">
                Family finance turned into a
                <span>guided operating system.</span>
              </h1>
              <p className="hero-text">
                Stack is a complete kids banking experience — supervision, motivation, rewards, goals, and operations
                connected in one production-ready platform. Built for parents, loved by children, trusted by families.
              </p>
              <div className="hero-actions">
                <button onClick={() => navigate("/documentation")} className="btn btn-primary">
                  <i className="fa-solid fa-book-open" /> Read Documentation
                </button>
                <button onClick={() => navigate("/integration")} className="btn btn-secondary">
                  <i className="fa-solid fa-link" /> Integration Guide
                </button>
                <button onClick={() => navigate("/developers")} className="btn btn-outline">
                  <i className="fa-solid fa-terminal" /> Developer Portal
                </button>
              </div>
            </div>

            {/* Metrics */}
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

        {/* Role lanes — grid */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Product lanes</div>
              <h2>Six lanes that make the product believable.</h2>
              <p>Each lane maps to real backend controllers, frontend routes, and user flows in production.</p>
            </div>
            <div className="feature-grid">
              {roleStories.map((story, i) => (
                <article key={story.title} className={`feature-card glass reveal ${["left","up","right","left","up","right"][i]}`}>
                  <div className="icon-box"><i className={story.icon} /></div>
                  <small style={{ color: "#8fdfff", letterSpacing: "0.14em", fontSize: "0.78rem" }}>{story.label}</small>
                  <h3>{story.title}</h3>
                  <p>{story.body}</p>
                  <div className="spec-list" style={{ marginTop: 18 }}>
                    {story.chips.map((c) => (
                      <span key={c} className="pill">{c}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Audience breakdown */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Who it serves</div>
              <h2>Three roles. One unified platform.</h2>
            </div>
            <div className="feature-grid">
              {audienceSets.map((set, i) => (
                <article key={set.title} className={`feature-card glass reveal ${i === 0 ? "left" : i === 1 ? "up" : "right"}`}>
                  <div className="icon-box"><i className={set.icon} /></div>
                  <h3>{set.title}</h3>
                  <ul className="micro-list">
                    {set.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Value loop */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Core value loop</div>
              <h2>The loop that makes the product trustworthy.</h2>
              <p>This mirrors the live task and dashboard flow in production — not placeholder copy.</p>
            </div>
            <div className="sticky-grid">
              <div className="sticky-copy">
                <div className="pin-box reveal left">
                  <div className="eyebrow">Proof-based rewards</div>
                  <h2>Every reward is earned, verified, and visible.</h2>
                  <p>
                    The task lifecycle enforces proof upload and parent approval before any value moves.
                    This keeps the system honest and the family relationship strong.
                  </p>
                  <div className="hero-actions" style={{ marginTop: 24 }}>
                    <button onClick={() => navigate("/documentation")} className="btn btn-primary">
                      <i className="fa-solid fa-book-open" /> Full Docs
                    </button>
                  </div>
                </div>
              </div>
              <div className="sticky-cards">
                {valueLoop.map((step, i) => (
                  <div key={step.id} className={`story-panel glass reveal right stagger-${(i % 3) + 1}`}>
                    <span>{step.id}</span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Platform stack */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Technology stack</div>
              <h2>Built on a production-grade foundation.</h2>
              <p>The product promise works because the delivery stack already exists across backend, frontend, desktop, and Android.</p>
            </div>
            <div className="feature-grid">
              {platformStack.map((tech, i) => (
                <article key={tech.label} className={`feature-card glass reveal ${["left", "up", "right", "left", "up", "right"][i]}`}>
                  <div className="icon-box"><i className={tech.icon} /></div>
                  <h3>{tech.label}</h3>
                  <p>{tech.sub}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-box glass reveal up">
              <div className="cta-copy">
                <div className="eyebrow">Ready to explore</div>
                <h2>Dive deeper into the technical details.</h2>
                <p>Read the full documentation, explore the integration guide, or open the developer portal.</p>
              </div>
              <div className="cta-actions">
                <button onClick={() => navigate("/documentation")} className="btn btn-primary">
                  <i className="fa-solid fa-book-open" /> Documentation
                </button>
                <button onClick={() => navigate("/developers")} className="btn btn-secondary">
                  <i className="fa-solid fa-terminal" /> Developers
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
