import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import "./Landing.css";

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
                Presentation
              </div>
              <h1 className="hero-title">
                Present Stack as a
                <span>complete family platform</span>
              </h1>
              <p className="hero-text">
                Use this page as the polished product presentation for demos, investor walkthroughs, or stakeholder reviews.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => navigate("/login")}>
                  <i className="fa-solid fa-arrow-right"></i>
                  Open app
                </button>
                <button className="btn btn-secondary" onClick={() => navigate("/documentation")}>
                  <i className="fa-solid fa-book"></i>
                  Read docs
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="phone-card glass reveal zoom">
                <div className="screen-top"><span></span><p>Live product pitch</p></div>
                <div className="balance-box">
                  <small>Family value</small>
                  <h3>Control + learning</h3>
                  <div className="badge-row">
                    <span>Parent dashboard</span>
                    <span>Child app</span>
                    <span>Secure API</span>
                  </div>
                </div>
                <div className="goal-box">
                  <div className="goal-head">
                    <p>Rollout readiness</p>
                    <span>92%</span>
                  </div>
                  <div className="progress"><div className="progress-fill" style={{ width: "92%" }}></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container feature-grid">
            <article className="feature-card glass">
              <div className="icon-box"><i className="fa-solid fa-users"></i></div>
              <h3>Family workflows</h3>
              <p>Parents create families, add children, assign tasks, send money, and monitor goals from one responsive dashboard.</p>
            </article>
            <article className="feature-card glass">
              <div className="icon-box"><i className="fa-solid fa-child-reaching"></i></div>
              <h3>Child motivation</h3>
              <p>Goals, games, and rewards make the product feel active instead of purely administrative.</p>
            </article>
            <article className="feature-card glass">
              <div className="icon-box"><i className="fa-solid fa-code-branch"></i></div>
              <h3>Backend alignment</h3>
              <p>React routes and API integration now follow the Spring Boot backend more closely, including auth token handling.</p>
            </article>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container journey-grid">
            <div className="journey-card glass">
              <span>01</span>
              <h3>Family money workflow</h3>
              <p>Parents create families, fund children, review task submissions, and manage long-term habits from a single system.</p>
            </div>
            <div className="journey-card glass">
              <span>02</span>
              <h3>Education workflow</h3>
              <p>Children play games, complete tasks, and build savings goals, turning rewards into visible progress instead of abstract numbers.</p>
            </div>
            <div className="journey-card glass">
              <span>03</span>
              <h3>Admin workflow</h3>
              <p>Admins supervise users, families, games, and transactions through a dedicated internal control area separate from public marketing pages.</p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
