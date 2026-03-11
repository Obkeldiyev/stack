import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Features() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>

      {/* Header */}
      <header className="header">
        <div className="container nav">
          <a href="/" className="brand" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            <img src="/logo.png" alt="Stack logo" />
            <span>Stack</span>
          </a>

          <nav className="desktop-nav">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/features"); }} style={{ color: "white" }}>Features</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/developers"); }}>Developers</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/documentation"); }}>Documentation</a>
          </nav>

          <div className="nav-actions">
            <button onClick={() => navigate("/login")} className="btn btn-outline">Get Started</button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-bg-shape hero-shape-1 parallax" data-speed="0.18"></div>
          <div className="hero-bg-shape hero-shape-2 parallax" data-speed="0.1"></div>

          <div className="container">
            <div className="section-head reveal up" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
              <div className="eyebrow" style={{ display: "inline-flex" }}>
                <i className="fa-solid fa-stars"></i>
                Complete Feature Set
              </div>
              <h1 className="hero-title">
                Everything your family needs for
                <span>financial success</span>
              </h1>
              <p className="hero-text">
                From basic allowances to advanced goal tracking, Stack provides 
                comprehensive tools for every aspect of family financial management.
              </p>
            </div>
          </div>
        </section>

        {/* Parent Features */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">For Parents</div>
              <h2>Complete Control & Visibility</h2>
              <p>Powerful tools to manage your family's finances and teach responsibility.</p>
            </div>

            <div className="feature-grid">
              <article className="feature-card glass reveal left">
                <div className="icon-box"><i className="fa-solid fa-calendar-check"></i></div>
                <h3>Smart Allowances</h3>
                <p>Set up automatic allowances on any schedule. Daily, weekly, monthly, or custom intervals with full control.</p>
              </article>

              <article className="feature-card glass reveal up stagger-1">
                <div className="icon-box"><i className="fa-solid fa-exchange-alt"></i></div>
                <h3>Instant Transfers</h3>
                <p>Send money to your children instantly with notes and categories. Perfect for rewards and emergency funds.</p>
              </article>

              <article className="feature-card glass reveal right">
                <div className="icon-box"><i className="fa-solid fa-chart-line"></i></div>
                <h3>Transaction Monitoring</h3>
                <p>See every transaction in real-time. Complete history with categories, notes, and spending patterns.</p>
              </article>

              <article className="feature-card glass reveal left stagger-2">
                <div className="icon-box"><i className="fa-solid fa-users"></i></div>
                <h3>Family Management</h3>
                <p>Create families, invite members with QR codes, and manage permissions for each family member.</p>
              </article>

              <article className="feature-card glass reveal up stagger-2">
                <div className="icon-box"><i className="fa-solid fa-tasks"></i></div>
                <h3>Task & Chore System</h3>
                <p>Create tasks with rewards, require photo proof, and approve completed work with instant payments.</p>
              </article>

              <article className="feature-card glass reveal right stagger-2">
                <div className="icon-box"><i className="fa-solid fa-shield-halved"></i></div>
                <h3>Safety Controls</h3>
                <p>Complete oversight with the ability to pause accounts, review transactions, and maintain security.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Child Features */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">For Children</div>
              <h2>Fun & Educational Experience</h2>
              <p>Engaging tools that make learning about money exciting and rewarding.</p>
            </div>

            <div className="feature-grid">
              <article className="feature-card glass reveal left">
                <div className="icon-box"><i className="fa-solid fa-piggy-bank"></i></div>
                <h3>Savings Goals</h3>
                <p>Set goals for toys, games, or anything they want. Visual progress tracking makes saving exciting.</p>
              </article>

              <article className="feature-card glass reveal up stagger-1">
                <div className="icon-box"><i className="fa-solid fa-gamepad"></i></div>
                <h3>Educational Games</h3>
                <p>Learn money skills through fun games. Earn coins, compete with friends, and unlock achievements.</p>
              </article>

              <article className="feature-card glass reveal right">
                <div className="icon-box"><i className="fa-solid fa-camera"></i></div>
                <h3>Task Completion</h3>
                <p>Complete chores and tasks, upload photo proof, and earn rewards when parents approve.</p>
              </article>

              <article className="feature-card glass reveal left stagger-2">
                <div className="icon-box"><i className="fa-solid fa-wallet"></i></div>
                <h3>Personal Banking</h3>
                <p>Their own account with balance tracking, transaction history, and spending insights.</p>
              </article>

              <article className="feature-card glass reveal up stagger-2">
                <div className="icon-box"><i className="fa-solid fa-qrcode"></i></div>
                <h3>Easy Family Joining</h3>
                <p>Join families instantly by scanning QR codes or entering invite codes from parents.</p>
              </article>

              <article className="feature-card glass reveal right stagger-2">
                <div className="icon-box"><i className="fa-solid fa-trophy"></i></div>
                <h3>Achievement System</h3>
                <p>Earn badges and rewards for good financial habits, completed goals, and learning milestones.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Technical Features */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Technical Excellence</div>
              <h2>Built for Reliability & Security</h2>
              <p>Enterprise-grade technology ensuring your family's data is always safe and accessible.</p>
            </div>

            <div className="journey-grid">
              <div className="journey-card glass reveal left">
                <span>01</span>
                <h3>Multi-Platform Access</h3>
                <p>Web browser, Android APK, and Windows desktop app. Access Stack anywhere, anytime.</p>
              </div>
              <div className="journey-card glass reveal up">
                <span>02</span>
                <h3>Real-Time Sync</h3>
                <p>All data syncs instantly across devices. Changes made on one device appear everywhere immediately.</p>
              </div>
              <div className="journey-card glass reveal right">
                <span>03</span>
                <h3>Offline Capability</h3>
                <p>Core features work offline. Data syncs automatically when connection is restored.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-box glass reveal up">
              <div className="cta-copy">
                <div className="eyebrow">Ready to Start</div>
                <h2>Experience All Features Today</h2>
                <p>
                  Join thousands of families already using Stack to teach financial 
                  responsibility and build healthy money habits.
                </p>
              </div>

              <div className="cta-actions">
                <button onClick={() => navigate("/login")} className="btn btn-primary">
                  <i className="fa-solid fa-rocket"></i>
                  Get Started Free
                </button>
                <button onClick={() => navigate("/about")} className="btn btn-secondary">
                  <i className="fa-solid fa-info-circle"></i>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-wrap">
          <div>
            <a href="/" className="brand footer-brand" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
              <img src="/logo.png" alt="Stack logo" />
              <span>Stack</span>
            </a>
            <p>Kids banking made beautiful, safe, and meaningful.</p>
          </div>

          <div className="footer-links">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/features"); }}>Features</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/privacy"); }}>Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
