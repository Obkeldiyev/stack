import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { useMarketingMotion } from "@/hooks/useMarketingMotion";
import "./Landing.css";

const productNarrative = [
  {
    title: "Parent command center",
    body: "Parents need a surface that feels calm, premium, and exact. Stack gives them balances, task approvals, family structure, and visible control over money movement without turning the product into an overwhelming admin wall.",
  },
  {
    title: "Child motivation engine",
    body: "Children should not stare at empty finance widgets. Goals, games, streaks, rewards, and visual progress turn abstract money into a system they can understand and act on.",
  },
  {
    title: "Admin operations layer",
    body: "A real product needs internal control. Admins can supervise users, families, transactions, and game content from a hidden internal environment that does not leak into public marketing routes.",
  },
];

const valueFrames = [
  "Task creation with reward amount",
  "Child proof upload and approval flow",
  "Goals that explain why money is being saved",
  "QR and camera capability for supervised interactions",
  "Role-specific dashboards with cleaner mobile layouts",
  "Electron and Android packaging from the same product codebase",
];

const horizontalFrames = [
  {
    label: "01",
    title: "Finance should move sideways through the story",
    text: "This rail is meant to feel like a cinematic deck. As the user scrolls down, the product argument moves across the screen instead of only stacking lower on the page.",
  },
  {
    label: "02",
    title: "Parents need confidence, not noise",
    text: "The visual system leans toward premium payment products: calm spacing, precise cards, controlled color, and fewer chaotic elements competing for attention.",
  },
  {
    label: "03",
    title: "Children need feedback loops",
    text: "Tasks, proof, rewards, games, and goals create motion inside the product. The app should always show what happened and what comes next.",
  },
  {
    label: "04",
    title: "Operators need internal control",
    text: "Admin tools, transaction visibility, and content controls make the product credible beyond the public marketing layer.",
  },
];

export default function Presentation() {
  const navigate = useNavigate();
  useMarketingMotion();

  return (
    <div className="landing-page microsite-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>
      <MarketingHeader activePath="/presentation" />

      <main>
        <section className="hero hero-premium">
          <div className="container hero-grid">
            <div className="hero-copy reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-display"></i>
                Product Presentation
              </div>
              <h1 className="hero-title">
                A family finance product
                <span>with real depth</span>
              </h1>
              <p className="hero-text">
                Stack is not just a children's wallet screen. It is a full parent-child operating model with role-based dashboards,
                tasks, approvals, goals, gameplay, internal admin control, and deployment paths across web, Windows, and Android.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => navigate("/login")}>
                  <i className="fa-solid fa-arrow-right"></i>
                  Open product
                </button>
                <button className="btn btn-secondary" onClick={() => navigate("/documentation")}>
                  <i className="fa-solid fa-book-open"></i>
                  Technical docs
                </button>
              </div>
            </div>

            <div className="hero-visual reveal right">
              <div className="stage-shell glass stage-lift">
                <div className="stage-device glass">
                  <div className="screen-top"><span></span><p>Premium family banking</p></div>
                  <div className="balance-box">
                    <small>Parent view</small>
                    <h3>$1,284.00 under supervision</h3>
                    <div className="badge-row">
                      <span>Tasks approved</span>
                      <span>Goals active</span>
                      <span>Family synced</span>
                    </div>
                  </div>
                  <div className="stage-grid">
                    <div className="mini-block">
                      <div>
                        <small>Task proof</small>
                        <h4>Photo uploaded</h4>
                      </div>
                      <i className="fa-solid fa-camera"></i>
                    </div>
                    <div className="mini-block">
                      <div>
                        <small>Game rewards</small>
                        <h4>Coins distributed</h4>
                      </div>
                      <i className="fa-solid fa-trophy"></i>
                    </div>
                  </div>
                </div>
                <div className="stage-orbit stage-orbit-a"></div>
                <div className="stage-orbit stage-orbit-b"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Scroll performance</div>
              <h2>The presentation moves sideways while the page moves down.</h2>
              <p>This section exists only to change the rhythm of the page and make the product story feel less ordinary.</p>
            </div>
          </div>
          <div className="horizontal-stage reveal zoom">
            <div className="horizontal-track">
              {horizontalFrames.map((frame) => (
                <article className="horizontal-card glass" key={frame.label}>
                  <span>{frame.label}</span>
                  <h3>{frame.title}</h3>
                  <p>{frame.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container editorial-grid">
            <div className="editorial-copy reveal left">
              <div className="eyebrow">Narrative</div>
              <h2>The product story changes as you scroll.</h2>
              <p>
                These sections are built like a presentation deck inside a microsite. Content shifts direction, cards enter from alternating sides,
                and the page moves from the business case into the actual operating model.
              </p>
            </div>
            <div className="editorial-stack">
              {productNarrative.map((item, index) => (
                <article
                  key={item.title}
                  className={`story-panel glass reveal ${index % 2 === 0 ? "right" : "left"} premium-panel`}
                >
                  <span>{`0${index + 1}`}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container sticky-showcase">
            <div className="sticky-copy reveal up">
              <div className="pin-box">
                <div className="eyebrow">Walkthrough</div>
                <h2>Explain the full loop, not isolated screens.</h2>
                <p>
                  Parents assign value. Children act. Proof gets uploaded. Goals progress. Admin keeps the system clean.
                  That loop is what makes Stack feel like a system, not a demo page.
                </p>
              </div>
            </div>
            <div className="sticky-cards">
              <div className="story-panel glass panel-1 reveal right premium-panel">
                <span>Parent</span>
                <h3>Create paid tasks</h3>
                <p>Tasks are not generic reminders. The parent enters the reward amount up front, turning work into a clear economic action.</p>
              </div>
              <div className="story-panel glass panel-2 reveal left premium-panel">
                <span>Child</span>
                <h3>Upload proof</h3>
                <p>Children submit a photo or other proof so parents can verify the work before value moves through the system.</p>
              </div>
              <div className="story-panel glass panel-3 reveal right premium-panel">
                <span>Approval</span>
                <h3>Approve, reward, continue</h3>
                <p>After approval, rewards connect back to balances, goals, and motivation. The product teaches cause and effect instead of hiding it.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">What makes it unusual</div>
              <h2>It behaves like a product system, not a theme.</h2>
            </div>
            <div className="ticker-wall glass reveal zoom">
              {valueFrames.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="showcase-grid">
              <article className="feature-card glass reveal left">
                <div className="icon-box"><i className="fa-solid fa-wallet"></i></div>
                <h3>Payment-app visual discipline</h3>
                <p>Surfaces are cleaner, spacing is calmer, and the dashboard language is closer to modern finance apps than to noisy family portals.</p>
              </article>
              <article className="feature-card glass reveal up">
                <div className="icon-box"><i className="fa-solid fa-mobile-screen"></i></div>
                <h3>Adaptive across devices</h3>
                <p>Parent, child, and marketing experiences now collapse more cleanly on smaller screens instead of breaking into oversized blocks.</p>
              </article>
              <article className="feature-card glass reveal right">
                <div className="icon-box"><i className="fa-solid fa-user-shield"></i></div>
                <h3>Internal and external surfaces separated</h3>
                <p>The public site can pitch the product while the admin control plane remains hidden from marketing navigation.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container media-band">
            <div className="media-card glass reveal left">
              <div className="eyebrow">Operations</div>
              <h3>Admin oversight is part of the pitch.</h3>
              <p>
                Admin can see all users, edit access, review families, inspect transactions, and change game content.
                That matters because investors and operators do not want a family product that cannot be supervised internally.
              </p>
            </div>
            <div className="media-card glass reveal right">
              <div className="eyebrow">Rollout</div>
              <h3>Windows, web, Android.</h3>
              <p>
                The same product strategy covers browser access, desktop packaging through Electron, and Android delivery through Capacitor.
                That creates more believable rollout stories for schools, parents, and partner organizations.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="cta-box glass reveal up">
              <div className="cta-copy">
                <div className="eyebrow">Pitch ending</div>
                <h2>A cleaner experience on the surface, a deeper system underneath.</h2>
                <p>
                  Use this page as the high-level product story, then move into the documentation and integration pages for technical depth.
                </p>
              </div>
              <div className="cta-actions">
                <button className="btn btn-primary" onClick={() => navigate("/documentation")}>Open documentation</button>
                <button className="btn btn-secondary" onClick={() => navigate("/integration")}>Open integration</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
