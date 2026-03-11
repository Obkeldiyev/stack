import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import "./Landing.css";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>
      <MarketingHeader activePath="/about" />

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-heart"></i>
                About Stack
              </div>
              <h1 className="hero-title">
                Built to make family finance
                <span>clear, modern, and teachable</span>
              </h1>
              <p className="hero-text">
                Stack exists to turn money into a guided family experience. Parents need visibility and control,
                children need motivation and clarity, and the product needs enough structure to scale beyond a single demo.
              </p>
              <div className="hero-actions">
                <button onClick={() => navigate("/login")} className="btn btn-primary">
                  <i className="fa-solid fa-arrow-right"></i>
                  Open Stack
                </button>
                <button onClick={() => navigate("/presentation")} className="btn btn-secondary">
                  <i className="fa-solid fa-display"></i>
                  Product presentation
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="phone-card glass reveal zoom">
                <div className="screen-top"><span></span><p>Mission signal</p></div>
                <div className="balance-box">
                  <small>Platform intent</small>
                  <h3>Teach through action</h3>
                  <div className="badge-row">
                    <span>Trust</span>
                    <span>Learning</span>
                    <span>Control</span>
                  </div>
                </div>
                <div className="icon-pills">
                  <div><i className="fa-solid fa-users"></i><span>Family</span></div>
                  <div><i className="fa-solid fa-shield-heart"></i><span>Safe</span></div>
                  <div><i className="fa-solid fa-seedling"></i><span>Growth</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Why this project exists</div>
              <h2>Money habits are easier to build inside the family loop.</h2>
              <p>Stack is designed around the moments families actually repeat: tasks, rewards, goals, transfers, approvals, and conversations.</p>
            </div>
            <div className="feature-grid">
              <article className="feature-card glass">
                <div className="icon-box"><i className="fa-solid fa-lightbulb"></i></div>
                <h3>Early financial literacy</h3>
                <p>Children should not meet money as an abstract adult system. They should learn it through clear, repeated, visible actions.</p>
              </article>
              <article className="feature-card glass">
                <div className="icon-box"><i className="fa-solid fa-house"></i></div>
                <h3>Home-first supervision</h3>
                <p>Parents need a calm place to guide behavior, approve outcomes, and see how rewards connect to habits.</p>
              </article>
              <article className="feature-card glass">
                <div className="icon-box"><i className="fa-solid fa-layer-group"></i></div>
                <h3>System-level thinking</h3>
                <p>The project is built as a real platform: public product pages, private dashboards, admin tooling, and deployable clients.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container timeline-grid">
            <div className="story-panel glass">
              <span>Value 01</span>
              <h3>Security first</h3>
              <p>Auth, role separation, and supervised money movement matter more than decorative features in a family finance product.</p>
            </div>
            <div className="story-panel glass">
              <span>Value 02</span>
              <h3>Clean product language</h3>
              <p>The app should feel precise and trustworthy, closer to a payment app than to a noisy child-only interface.</p>
            </div>
            <div className="story-panel glass">
              <span>Value 03</span>
              <h3>Real operational depth</h3>
              <p>The project includes admin oversight, documentation, integrations, and multiple client builds because that is how real products survive.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container spec-table glass">
            <div>
              <small>Parents get</small>
              <strong>Visibility and approvals</strong>
              <p>They can create families, review tasks, track balances, and keep children inside supervised flows.</p>
            </div>
            <div>
              <small>Children get</small>
              <strong>Progress and motivation</strong>
              <p>They see why they are saving, how they earn, and what their actions produce inside the product.</p>
            </div>
            <div>
              <small>Admins get</small>
              <strong>Platform control</strong>
              <p>They can inspect users, families, transactions, and game content without leaking those controls publicly.</p>
            </div>
            <div>
              <small>Partners get</small>
              <strong>An integration base</strong>
              <p>External apps can use Stack as the controlled finance and reward layer instead of rebuilding it from zero.</p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
