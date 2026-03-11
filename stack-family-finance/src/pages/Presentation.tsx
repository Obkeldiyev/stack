import { useNavigate } from "react-router-dom";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { ShowcaseConsole } from "@/components/marketing/ShowcaseConsole";
import { useMarketingMotion } from "@/hooks/useMarketingMotion";
import "./Landing.css";

const horizontalFrames = [
  {
    label: "01",
    title: "Family finance should move sideways through the story",
    text: "This rail exists to break the normal landing-page rhythm. As the user scrolls down, the business argument travels horizontally so the page feels like a guided product deck rather than a stack of sections.",
  },
  {
    label: "02",
    title: "Parents need payment-app confidence",
    text: "If the surface feels noisy, parents read the product as unsafe. Stack needs calm structure, visible control, high legibility, and predictable movement more than decorative energy.",
  },
  {
    label: "03",
    title: "Children need visible feedback loops",
    text: "Goals, rewards, tasks, game wins, and proof uploads turn abstract finance into understandable cause and effect. The child side has to feel active, not passive.",
  },
  {
    label: "04",
    title: "Admin makes the platform credible",
    text: "Investors, operators, and partners care whether the product can be supervised. User access, transactions, families, and game content all need internal control surfaces.",
  },
];

const storyBlocks = [
  {
    title: "Parent system",
    body: "Parents create the family environment, control how value enters the system, review proofs, approve rewards, and decide how children progress. The product gives them precision without turning the dashboard into back-office software.",
  },
  {
    title: "Child system",
    body: "Children interact with the product through goals, tasks, family visibility, games, QR flows, and progress surfaces. Their side should explain what happened, what they earned, and what they can do next.",
  },
  {
    title: "Platform system",
    body: "Behind both roles, the backend controls auth, routes, DTOs, families, accounts, goals, tasks, transactions, and games. That hidden structure is what turns the UI into a real product instead of a concept.",
  },
  {
    title: "Operational system",
    body: "Admins can inspect users, change access, manage game content, supervise families, and track transaction movement. This is necessary for live operation, support, and rollout trust.",
  },
];

const detailSignals = [
  "Parents create paid tasks with an amount before the child starts work",
  "Children can upload photo proof and wait for approval instead of receiving auto-credit",
  "Goals explain why money is being saved and how progress changes over time",
  "Games create engagement loops that tie back into rewards and habit retention",
  "QR and camera flows let the product support supervised scan-based experiences",
  "Settings and auth persistence keep users logged in rather than forcing repeated setup",
  "Electron and Android packaging expand the same product into real device channels",
  "Admin lives outside the public microsite so the control plane stays private",
];

const valueMap = [
  {
    kicker: "Family trust",
    title: "Every money action is supervised",
    text: "The product does not assume children should have isolated control over value. Parents remain the operating authority for approvals, transfers, task rewards, and access decisions.",
  },
  {
    kicker: "Learning value",
    title: "The product teaches through repetition",
    text: "Children understand money more easily when actions lead to visible results. Finish task, upload proof, get approved, watch balance change, move toward a goal. That pattern is clearer than lectures.",
  },
  {
    kicker: "Retention value",
    title: "Motivation is built into the system",
    text: "Goals, games, streaks, and family-visible rewards make the product feel alive. Without those loops, the app becomes a static control surface for adults only.",
  },
  {
    kicker: "Platform value",
    title: "The stack extends beyond the demo",
    text: "The same structure can serve parents, children, admins, school-linked experiences, and partner integrations because the product is modeled as a system rather than one app screen.",
  },
];

const rolloutTimeline = [
  "Web launch with landing, login, parent, child, and admin role surfaces",
  "Desktop rollout through Electron for Windows distribution",
  "Android rollout through Capacitor packaging and device permissions",
  "Partner rollout via integration review, route contracts, and staged traffic",
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
                Stack is a
                <span>family operating system</span>
              </h1>
              <p className="hero-text">
                Stack is not a toy wallet, and it is not a plain parent dashboard. It is a structured parent-child-admin product system
                with money visibility, task rewards, proof uploads, goals, transactions, family control, games, QR support, and device delivery across web, desktop, and Android.
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
                  <div className="screen-top"><span></span><p>Parent command center</p></div>
                  <div className="balance-box">
                    <small>Supervised family value</small>
                    <h3>$1,284.00 moving with context</h3>
                    <div className="badge-row">
                      <span>Tasks</span>
                      <span>Goals</span>
                      <span>Family</span>
                    </div>
                  </div>
                  <div className="stage-grid">
                    <div className="mini-block">
                      <div>
                        <small>Proof upload</small>
                        <h4>Photo waiting for approval</h4>
                      </div>
                      <i className="fa-solid fa-camera"></i>
                    </div>
                    <div className="mini-block">
                      <div>
                        <small>Admin oversight</small>
                        <h4>Transaction visibility on</h4>
                      </div>
                      <i className="fa-solid fa-shield-halved"></i>
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
              <div className="eyebrow">Directional storytelling</div>
              <h2>The page scrolls down, but the argument moves across.</h2>
              <p>This is deliberate. The presentation needs a stronger motion language than ordinary vertical marketing sections.</p>
            </div>
          </div>
          <div className="horizontal-pin reveal zoom">
            <div className="horizontal-stage">
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
          </div>
        </section>

        <section className="section">
          <div className="container showcase-split">
            <div className="showcase-copy reveal left">
              <div className="eyebrow">Run Stack everywhere</div>
              <h2>One product logic, many delivery surfaces.</h2>
              <p>
                Presentation should feel like a launch page for a serious platform. The same product logic stretches across web,
                Electron, Android, parent, child, admin, and partner-facing surfaces without becoming fragmented.
              </p>
              <div className="showcase-action-stack">
                <button className="btn btn-primary" onClick={() => navigate("/login")}>Get Stack</button>
                <button className="btn btn-secondary" onClick={() => navigate("/integration")}>View integrations</button>
              </div>
            </div>
            <div className="reveal right">
              <ShowcaseConsole
                title="Launch sequence"
                language="Stack system"
                tabs={[
                  { label: "Parent dashboard", accent: "green" },
                  { label: "Child experience" },
                  { label: "Admin control" },
                  { label: "Device rollout" },
                ]}
                code={`1  create family
2  assign paid task
3  child uploads proof
4  parent approves reward
5  goal progress updates
6  admin still supervises system state

// deploy to:
web -> electron -> android`}
                footer="The pitch should show a coherent system, not separate disconnected screens."
              />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container blueprint-grid">
            <div className="blueprint-card glass reveal left">
              <div className="eyebrow">Who it serves</div>
              <h3>Parents</h3>
              <p>Parents need clean visibility, calm financial control, approval flows, and enough trust in the interface to use it repeatedly.</p>
            </div>
            <div className="blueprint-card glass reveal up">
              <div className="eyebrow">Who it teaches</div>
              <h3>Children</h3>
              <p>Children need visible progress, a reason to act, and feedback loops that connect effort to outcome without hiding the logic.</p>
            </div>
            <div className="blueprint-card glass reveal right">
              <div className="eyebrow">Who operates it</div>
              <h3>Admins</h3>
              <p>Admins need the authority to supervise users, block access, inspect transactions, manage families, and update games as the system evolves.</p>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container cinematic-band">
            <div className="cinematic-copy reveal left">
              <div className="eyebrow">Presentation logic</div>
              <h2>One scroll should tell the business case, the workflow, and the rollout.</h2>
              <p>
                The page should feel like a guided launch story. It starts with product value, moves into how the system behaves,
                then lands on why the platform is operationally believable.
              </p>
            </div>
            <div className="cinematic-stack">
              {storyBlocks.map((item, index) => (
                <article className={`cinematic-card glass reveal ${index % 2 === 0 ? "up" : "right"}`} key={item.title}>
                  <small>{`Layer 0${index + 1}`}</small>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container deep-grid">
            {valueMap.map((item, index) => (
              <article key={item.title} className={`deep-card glass reveal ${index % 2 === 0 ? "left" : "right"}`}>
                <div className="eyebrow">{item.kicker}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-dark">
          <div className="container sticky-showcase">
            <div className="sticky-copy reveal up">
              <div className="pin-box">
                <div className="eyebrow">Workflow</div>
                <h2>Stack works because the loop is visible.</h2>
                <p>
                  Parent creates value. Child acts. Proof arrives. Approval happens. Balance changes. Goal progresses. Admin can still inspect the system.
                  Every strong family product needs that kind of clarity.
                </p>
              </div>
            </div>
            <div className="sticky-cards">
              <div className="story-panel glass panel-1 reveal right premium-panel">
                <span>Parent setup</span>
                <h3>Create paid tasks and define expectations</h3>
                <p>The parent enters the amount before the task begins, which makes the reward explicit and financially legible.</p>
              </div>
              <div className="story-panel glass panel-2 reveal left premium-panel">
                <span>Child action</span>
                <h3>Complete work and submit proof</h3>
                <p>The child uploads photo proof or another signal of completion so the parent can review the claim instead of trusting blind status changes.</p>
              </div>
              <div className="story-panel glass panel-3 reveal right premium-panel">
                <span>Financial result</span>
                <h3>Approve, reward, and move toward goals</h3>
                <p>Approval changes balances, affects goals, and teaches the child how effort maps to money over time.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Signals</div>
              <h2>Important product details, not filler details.</h2>
            </div>
            <div className="ticker-wall glass reveal zoom">
              {detailSignals.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container grid-mosaic">
            <div className="mosaic-panel glass reveal left">
              <div className="eyebrow">Rollout</div>
              <h3>The product can expand in phases.</h3>
              <ul className="micro-list">
                {rolloutTimeline.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="mosaic-panel glass reveal up">
              <div className="eyebrow">Operator trust</div>
              <h3>Why admins matter in the pitch.</h3>
              <p>Support, moderation, visibility, access control, game content edits, and transaction review are operational requirements, not optional polish.</p>
            </div>
            <div className="mosaic-panel glass reveal right">
              <div className="eyebrow">Design position</div>
              <h3>Why the visual language must stay premium.</h3>
              <p>Parents do not trust products that look chaotic. The design direction should stay closer to banking, productivity, and platform confidence than to noisy educational toy apps.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="cta-box glass reveal up">
              <div className="cta-copy">
                <div className="eyebrow">Presentation ending</div>
                <h2>A family fintech product with public clarity and private control.</h2>
                <p>
                  Use this page to explain the product story, then move into documentation for contracts and integration for partner architecture.
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
