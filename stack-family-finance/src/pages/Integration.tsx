import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { DbDiagram } from "@/components/diagrams/DbDiagram";
import { UmlDiagram } from "@/components/diagrams/UmlDiagram";
import { useMarketingMotion } from "@/hooks/useMarketingMotion";
import "./Landing.css";

const integrationStages = [
  { step: "01", icon: "fa-solid fa-key", title: "Session bootstrap", body: "Partner authenticates with login + refresh strategy before any value event is accepted." },
  { step: "02", icon: "fa-solid fa-people-group", title: "Family context binding", body: "Invite/join or existing membership lookup links event to parent-governed graph." },
  { step: "03", icon: "fa-solid fa-route", title: "Domain routing", body: "Event maps to task, transfer, goal, or game session based on product meaning." },
  { step: "04", icon: "fa-solid fa-shield-halved", title: "Trust gate", body: "Proof upload and parent review are enforced for effort-based reward events." },
  { step: "05", icon: "fa-solid fa-chart-line", title: "Projection layer", body: "Parent and child dashboards reflect value movement and progress immediately." },
  { step: "06", icon: "fa-solid fa-magnifying-glass-chart", title: "Ops verification", body: "Admin stats and transaction streams validate behavior before scaling traffic." },
];

const adapterKits = [
  { icon: "fa-solid fa-school", title: "School progress adapter", body: "Converts attendance/homework events into task creation and parent-approved rewards." },
  { icon: "fa-solid fa-graduation-cap", title: "Learning milestone adapter", body: "Maps lesson completion to goal saves and motivation loops." },
  { icon: "fa-solid fa-calendar-check", title: "Routine app adapter", body: "Lets external habit apps outsource payout governance to Stack." },
  { icon: "fa-solid fa-money-bill-transfer", title: "Allowance sync adapter", body: "Synchronizes recurring transfers into supervised child wallets." },
  { icon: "fa-solid fa-cart-shopping", title: "Commerce trigger adapter", body: "Connects purchase moments to balance history with parent visibility." },
  { icon: "fa-solid fa-trophy", title: "Program reward adapter", body: "Turns youth program completion into trusted, family-visible value outcomes." },
];

const payloadSamples = [
  {
    title: "Partner login",
    code: `POST /api/auth/login
{
  "username": "partner_parent",
  "password": "secure-pass"
}

// use response.data.accessToken`,
  },
  {
    title: "Task event mapping",
    code: `POST /api/tasks
{
  "childId": 7,
  "title": "Science lesson completed",
  "description": "Event imported from partner LMS",
  "amount": 500
}`,
  },
  {
    title: "Transfer sync",
    code: `POST /api/accounts/transfer
{
  "childId": 7,
  "amount": 1500,
  "note": "weekly sync allowance"
}`,
  },
  {
    title: "Goal progression",
    code: `POST /api/goals
{
  "title": "New bike",
  "targetAmount": 45000
}

POST /api/goals/{goalId}/save`,
  },
];

const rolloutPhases = [
  { icon: "fa-solid fa-handshake", title: "Phase A: Contract handshake", body: "Agree payloads, fields, and route ownership between partner and Stack modules." },
  { icon: "fa-solid fa-flask", title: "Phase B: Sandbox families", body: "Run invite/join, transfer, and task approval in isolated partner cohort." },
  { icon: "fa-solid fa-rocket", title: "Phase C: Controlled production", body: "Enable small live traffic with alerting around auth, transfer, and task flows." },
  { icon: "fa-solid fa-expand", title: "Phase D: Expansion & hardening", body: "Scale partner traffic while validating admin observability and rollback readiness." },
];

const governanceGates = [
  "Do not run payout routes until role and family context are validated.",
  "Keep amount handling deterministic and consistent with backend expectations.",
  "Preserve proof/approval semantics for effort-based partner events.",
  "Stage rollout by cohort and monitor admin stats before broad traffic.",
  "Verify parent and child dashboard parity after integration activation.",
  "Sync web build artifacts before desktop/mobile distribution pushes.",
];

const rateLimits = [
  "100 requests per minute per API key",
  "1000 requests per hour per API key",
  "Burst limit of 10 requests per second",
  "Integration approval required before production use",
  "Technical/security review before launch",
  "Ongoing usage monitoring after approval",
];

export default function Integration() {
  const navigate = useNavigate();
  useMarketingMotion();

  return (
    <div className="landing-page">
      <div className="cursor-glow" />
      <div className="bg-noise" />
      <MarketingHeader activePath="/integration" />

      <main>
        {/* Hero */}
        <section className="hero" style={{ paddingTop: 80, paddingBottom: 60 }}>
          <div className="container">
            <div className="reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-plug-circle-check" />
                Integration Blueprint
              </div>
              <h1 className="hero-title">
                Partner-ready pipelines for
                <span>supervised family finance.</span>
              </h1>
              <p className="hero-text">
                Event pipeline, adapter kits, payload contracts, rollout phases, and governance gates
                rooted in your existing controllers and client modules.
              </p>
              <div className="hero-actions">
                <button onClick={() => navigate("/developers")} className="btn btn-primary">
                  <i className="fa-solid fa-terminal" /> Developer Portal
                </button>
                <button onClick={() => navigate("/documentation")} className="btn btn-secondary">
                  <i className="fa-solid fa-book-open" /> Technical Docs
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Integration pipeline — grid */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Integration pipeline</div>
              <h2>Six-stage flow that keeps partner speed high.</h2>
              <p>Without breaking trust semantics or supervision guarantees.</p>
            </div>
            <div className="feature-grid">
              {integrationStages.map((stage, i) => (
                <article key={stage.step} className={`feature-card glass reveal ${["left","up","right","left","up","right"][i]}`}>
                  <div className="icon-box"><i className={stage.icon} /></div>
                  <small style={{ color: "#8fdfff", letterSpacing: "0.14em", fontSize: "0.78rem" }}>Stage {stage.step}</small>
                  <h3>{stage.title}</h3>
                  <p>{stage.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Adapter kits */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Adapter kits</div>
              <h2>Pre-built patterns for common partner types.</h2>
            </div>
            <div className="feature-grid">
              {adapterKits.map((kit, i) => (
                <article key={kit.title} className={`feature-card glass reveal ${["left","up","right","left","up","right"][i]}`}>
                  <div className="icon-box"><i className={kit.icon} /></div>
                  <h3>{kit.title}</h3>
                  <p>{kit.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Payload samples */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Payload contracts</div>
              <h2>Reference request shapes for partner events.</h2>
            </div>
            <div className="code-grid">
              {payloadSamples.map((sample, i) => (
                <div key={sample.title} className={`code-panel glass reveal ${i % 2 === 0 ? "left" : "right"}`}>
                  <div className="code-panel-head">
                    <strong>{sample.title}</strong>
                    <button
                      className="showcase-console-copy"
                      onClick={() => navigator.clipboard.writeText(sample.code)}
                    >
                      <i className="fa-regular fa-copy" /> Copy
                    </button>
                  </div>
                  <pre>{sample.code}</pre>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rollout phases */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Rollout phases</div>
              <h2>From contract to production in four phases.</h2>
            </div>
            <div className="journey-grid">
              {rolloutPhases.map((phase, i) => (
                <div key={phase.title} className={`journey-card glass reveal ${["left","up","right","left"][i]}`}>
                  <div className="icon-box"><i className={phase.icon} /></div>
                  <h3>{phase.title}</h3>
                  <p>{phase.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Governance + rate limits */}
        <section className="section section-dark">
          <div className="container">
            <div className="detail-grid">
              <div className="glass reveal left" style={{ padding: 32, borderRadius: 28 }}>
                <div className="eyebrow" style={{ marginBottom: 16 }}>Governance gates</div>
                <h3 style={{ fontSize: "1.6rem", letterSpacing: "-0.04em", marginBottom: 16 }}>Integration must not skip these</h3>
                <ul className="micro-list">
                  {governanceGates.map((gate) => <li key={gate}>{gate}</li>)}
                </ul>
              </div>
              <div className="glass reveal right" style={{ padding: 32, borderRadius: 28 }}>
                <div className="eyebrow" style={{ marginBottom: 16 }}>Rate limits & approval</div>
                <h3 style={{ fontSize: "1.6rem", letterSpacing: "-0.04em", marginBottom: 16 }}>Before going live</h3>
                <ul className="micro-list">
                  {rateLimits.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* System topology */}
        <section className="section" id="int-uml">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">System topology</div>
              <h2>Architecture for partner alignment.</h2>
              <p>Use topology view for partner architecture alignment and security boundaries.</p>
            </div>
            <div className="glass reveal up" style={{ padding: 24, borderRadius: 28, overflowX: "auto" }}>
              <UmlDiagram />
            </div>
          </div>
        </section>

        {/* DB schema */}
        <section className="section section-dark" id="int-db">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Schema surface</div>
              <h2>Data model for integration teams.</h2>
              <p>Data model visibility helps integration teams reason about persistence and joins early.</p>
            </div>
            <div className="glass reveal up" style={{ padding: 24, borderRadius: 28, overflowX: "auto" }}>
              <DbDiagram />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-box glass reveal up">
              <div className="cta-copy">
                <div className="eyebrow">Ready to integrate</div>
                <h2>Start building on top of Stack today.</h2>
                <p>Open the developer portal for full implementation details or read the technical documentation.</p>
              </div>
              <div className="cta-actions">
                <button onClick={() => navigate("/developers")} className="btn btn-primary">
                  <i className="fa-solid fa-terminal" /> Developers
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
