import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import "./Landing.css";

const slides = [
  {
    title: "Family finance, not a plain wallet",
    text: "Stack combines banking visibility, chores, goal tracking, approvals, child engagement, and admin supervision in one product.",
  },
  {
    title: "Parents stay in control",
    text: "Tasks, rewards, transfers, and family membership all route through parent-aware workflows instead of giving children unsupervised access.",
  },
  {
    title: "Children stay motivated",
    text: "Saving goals, visual progress, games, and rewards make the experience active and understandable for younger users.",
  },
  {
    title: "The product is deployable across devices",
    text: "The same platform serves the web experience, Electron desktop app, and Android package with shared frontend logic.",
  },
];

export default function Presentation() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>
      <MarketingHeader activePath="/presentation" />

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-display"></i>
                Product Presentation
              </div>
              <h1 className="hero-title">
                Present Stack like
                <span>a complete fintech product</span>
              </h1>
              <p className="hero-text">
                This page is designed for demos, approvals, and stakeholder walkthroughs. It tells the story of the product,
                the business value, the role design, and the operational model without exposing internal admin entry points.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => navigate("/login")}>
                  <i className="fa-solid fa-arrow-right"></i>
                  Open product
                </button>
                <button className="btn btn-secondary" onClick={() => navigate("/documentation")}>
                  <i className="fa-solid fa-book"></i>
                  Technical documentation
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="phone-card glass reveal zoom">
                <div className="screen-top"><span></span><p>Launch narrative</p></div>
                <div className="balance-box">
                  <small>Product promise</small>
                  <h3>Clean control for families</h3>
                  <div className="badge-row">
                    <span>Parents</span>
                    <span>Children</span>
                    <span>Admins</span>
                  </div>
                </div>
                <div className="goal-box">
                  <div className="goal-head">
                    <p>Pitch readiness</p>
                    <span>Full</span>
                  </div>
                  <div className="progress"><div className="progress-fill" style={{ width: "94%" }}></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container metrics-row">
            <div className="stat glass"><strong>3</strong><span>role surfaces</span></div>
            <div className="stat glass"><strong>1</strong><span>shared product language</span></div>
            <div className="stat glass"><strong>4</strong><span>deployment channels</span></div>
            <div className="stat glass"><strong>Admin</strong><span>central oversight</span></div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Executive summary</div>
              <h2>What Stack actually is.</h2>
              <p>Use these sections as presentation slides when you need a clear narrative for decision-makers.</p>
            </div>
            <div className="journey-grid">
              {slides.map((slide, index) => (
                <div className="journey-card glass" key={slide.title}>
                  <span>{`0${index + 1}`}</span>
                  <h3>{slide.title}</h3>
                  <p>{slide.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Core value</div>
              <h2>Why the product is stronger than a kids card screen.</h2>
              <p>Stack works because every money action sits inside a family workflow instead of existing as a detached balance widget.</p>
            </div>
            <div className="feature-grid">
              <article className="feature-card glass">
                <div className="icon-box"><i className="fa-solid fa-wallet"></i></div>
                <h3>Money with meaning</h3>
                <p>Balances connect to tasks, goals, achievements, approvals, and family trust, which makes the product more understandable and sticky.</p>
              </article>
              <article className="feature-card glass">
                <div className="icon-box"><i className="fa-solid fa-list-check"></i></div>
                <h3>Proof-based responsibility</h3>
                <p>Parents can create tasks with an amount, children submit completion proof, and approvals become visible reward moments.</p>
              </article>
              <article className="feature-card glass">
                <div className="icon-box"><i className="fa-solid fa-gamepad"></i></div>
                <h3>Engagement loop</h3>
                <p>Games and interactive flows keep the child side alive so the product does not become a passive admin tool for parents only.</p>
              </article>
              <article className="feature-card glass">
                <div className="icon-box"><i className="fa-solid fa-gear"></i></div>
                <h3>Operational control</h3>
                <p>Admin users can supervise users, change game content, inspect financial movement, and keep the system aligned with product policy.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container timeline-grid">
            <div className="story-panel glass">
              <span>Parent workflow</span>
              <h3>Create, supervise, approve</h3>
              <p>Parents create the family, fund the environment, assign tasks, review proof uploads, and keep the financial model trustworthy.</p>
            </div>
            <div className="story-panel glass">
              <span>Child workflow</span>
              <h3>Act, learn, progress</h3>
              <p>Children complete tasks, play games, scan QR flows, watch goal progress, and understand why money moves.</p>
            </div>
            <div className="story-panel glass">
              <span>Admin workflow</span>
              <h3>Control the platform</h3>
              <p>Admins can manage users, change game questions, review transactions, and maintain the internal platform surfaces.</p>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container spec-table glass">
            <div>
              <small>Audience</small>
              <strong>Families + operators</strong>
              <p>The product serves both end users and the internal team running the platform.</p>
            </div>
            <div>
              <small>Positioning</small>
              <strong>Payment-app clean</strong>
              <p>The visual language aims for the calm, precise feel of finance apps rather than playful clutter.</p>
            </div>
            <div>
              <small>Architecture</small>
              <strong>React + Spring Boot</strong>
              <p>Frontend and backend stay aligned through documented contracts, DTOs, and JWT session handling.</p>
            </div>
            <div>
              <small>Expansion path</small>
              <strong>Integration-ready</strong>
              <p>The platform can extend into school systems, parent apps, learning products, and partner ecosystems.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="cta-box glass reveal up">
              <div className="cta-copy">
                <div className="eyebrow">Presentation use</div>
                <h2>A separate showcase for demos, approvals, and stakeholder reviews.</h2>
                <p>
                  Keep this page public-facing and polished. It explains the business case, product flows, and system maturity while the
                  real admin routes remain unlinked and internal.
                </p>
              </div>
              <div className="cta-actions">
                <button className="btn btn-primary" onClick={() => navigate("/integration")}>Integration guide</button>
                <button className="btn btn-secondary" onClick={() => navigate("/documentation")}>Documentation</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
