import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Developers() {
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
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/features"); }}>Features</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/developers"); }} style={{ color: "white" }}>Developers</a>
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

          <div className="container hero-grid">
            <div className="hero-copy reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-code"></i>
                Developer Portal
              </div>

              <h1 className="hero-title">
                Build amazing
                <span>financial experiences</span>
                with Stack API
              </h1>

              <p className="hero-text">
                Integrate Stack's powerful family banking features into your applications. 
                Our comprehensive API makes it easy to add financial education and 
                management tools to any platform.
              </p>

              <div className="hero-actions">
                <button onClick={() => navigate("/documentation")} className="btn btn-primary">
                  <i className="fa-solid fa-book"></i>
                  API Documentation
                </button>
                <button onClick={() => navigate("/integration")} className="btn btn-secondary">
                  <i className="fa-solid fa-puzzle-piece"></i>
                  Integration Guide
                </button>
              </div>

              <div className="hero-stats">
                <div className="stat glass reveal left stagger-1">
                  <strong>REST</strong>
                  <span>API Architecture</span>
                </div>
                <div className="stat glass reveal left stagger-2">
                  <strong>JWT</strong>
                  <span>Authentication</span>
                </div>
                <div className="stat glass reveal left stagger-3">
                  <strong>24/7</strong>
                  <span>API Availability</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="phone-card glass reveal zoom">
                <div className="screen-top">
                  <span></span>
                  <p>API Response</p>
                </div>

                <div style={{ padding: "16px", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: "1.4" }}>
                  <div style={{ color: "#70cf42" }}>GET /api/accounts/me</div>
                  <div style={{ color: "#a5b7d0", marginTop: "8px" }}>{"{"}</div>
                  <div style={{ color: "#a5b7d0", paddingLeft: "16px" }}>"message": "Success",</div>
                  <div style={{ color: "#a5b7d0", paddingLeft: "16px" }}>"data": [</div>
                  <div style={{ color: "#a5b7d0", paddingLeft: "32px" }}>{"{"}</div>
                  <div style={{ color: "#86f0ff", paddingLeft: "48px" }}>"id": 1,</div>
                  <div style={{ color: "#86f0ff", paddingLeft: "48px" }}>"balance": 125.50,</div>
                  <div style={{ color: "#86f0ff", paddingLeft: "48px" }}>"type": "CHECKING"</div>
                  <div style={{ color: "#a5b7d0", paddingLeft: "32px" }}>{"}"}</div>
                  <div style={{ color: "#a5b7d0", paddingLeft: "16px" }}>]</div>
                  <div style={{ color: "#a5b7d0" }}>{"}"}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Features */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">API Capabilities</div>
              <h2>Everything You Need to Build</h2>
              <p>Comprehensive endpoints for all Stack features with full documentation and examples.</p>
            </div>

            <div className="feature-grid">
              <article className="feature-card glass reveal left">
                <div className="icon-box"><i className="fa-solid fa-users"></i></div>
                <h3>Family Management</h3>
                <p>Create families, manage members, generate invite codes, and handle family relationships.</p>
              </article>

              <article className="feature-card glass reveal up stagger-1">
                <div className="icon-box"><i className="fa-solid fa-wallet"></i></div>
                <h3>Account Operations</h3>
                <p>Access account balances, transfer money, view transaction history, and manage allowances.</p>
              </article>

              <article className="feature-card glass reveal right">
                <div className="icon-box"><i className="fa-solid fa-gamepad"></i></div>
                <h3>Game Integration</h3>
                <p>Start game sessions, track scores, award coins, and integrate educational content.</p>
              </article>

              <article className="feature-card glass reveal left stagger-2">
                <div className="icon-box"><i className="fa-solid fa-bullseye"></i></div>
                <h3>Goals & Savings</h3>
                <p>Create savings goals, track progress, manage contributions, and celebrate achievements.</p>
              </article>

              <article className="feature-card glass reveal up stagger-2">
                <div className="icon-box"><i className="fa-solid fa-chart-bar"></i></div>
                <h3>Analytics & Insights</h3>
                <p>Access spending patterns, savings trends, goal progress, and family financial insights.</p>
              </article>

              <article className="feature-card glass reveal right stagger-2">
                <div className="icon-box"><i className="fa-solid fa-shield-halved"></i></div>
                <h3>Secure Authentication</h3>
                <p>JWT-based authentication, role-based access control, and enterprise-grade security.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Integration Examples */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Integration Examples</div>
              <h2>Perfect for Your Use Case</h2>
            </div>

            <div className="journey-grid">
              <div className="journey-card glass reveal left">
                <span><i className="fa-solid fa-graduation-cap"></i></span>
                <h3>Educational Apps</h3>
                <p>Add financial rewards to learning platforms. Students earn real money for completing lessons and achieving milestones.</p>
              </div>
              <div className="journey-card glass reveal up">
                <span><i className="fa-solid fa-mobile-alt"></i></span>
                <h3>Parental Control Apps</h3>
                <p>Integrate allowance management and spending controls into existing parental control and family management applications.</p>
              </div>
              <div className="journey-card glass reveal right">
                <span><i className="fa-solid fa-store"></i></span>
                <h3>Kid-Friendly Stores</h3>
                <p>Enable children to make purchases using their Stack accounts with parental approval and spending limits.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Resources */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Developer Resources</div>
              <h2>Everything You Need to Get Started</h2>
            </div>

            <div className="download-grid">
              <div className="download-card glass reveal left">
                <div className="download-icon">
                  <i className="fa-solid fa-book"></i>
                </div>
                <h3>API Documentation</h3>
                <p>Complete reference for all endpoints, parameters, responses, and authentication methods.</p>
                <div className="download-info">
                  <span><i className="fa-solid fa-code"></i> REST API</span>
                  <span><i className="fa-solid fa-shield"></i> Secure</span>
                </div>
                <button onClick={() => navigate("/documentation")} className="btn btn-primary download-btn">
                  <i className="fa-solid fa-arrow-right"></i>
                  View Documentation
                </button>
              </div>

              <div className="download-card glass reveal right">
                <div className="download-icon">
                  <i className="fa-solid fa-puzzle-piece"></i>
                </div>
                <h3>Integration Guide</h3>
                <p>Step-by-step guide for integrating Stack API into your applications with code examples.</p>
                <div className="download-info">
                  <span><i className="fa-solid fa-lightbulb"></i> Examples</span>
                  <span><i className="fa-solid fa-rocket"></i> Quick Start</span>
                </div>
                <button onClick={() => navigate("/integration")} className="btn btn-primary download-btn">
                  <i className="fa-solid fa-arrow-right"></i>
                  Integration Guide
                </button>
              </div>

              <div className="download-card glass reveal up stagger-1">
                <div className="download-icon web-icon">
                  <i className="fa-solid fa-project-diagram"></i>
                </div>
                <h3>Project Overview</h3>
                <p>Technical architecture, security features, and platform capabilities overview.</p>
                <div className="download-info">
                  <span><i className="fa-solid fa-info-circle"></i> Architecture</span>
                  <span><i className="fa-solid fa-cogs"></i> Technical</span>
                </div>
                <button onClick={() => navigate("/presentation")} className="btn btn-primary download-btn">
                  <i className="fa-solid fa-arrow-right"></i>
                  View Overview
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Approval */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-box glass reveal up">
              <div className="cta-copy">
                <div className="eyebrow">Get Started</div>
                <h2>Ready to Integrate Stack?</h2>
                <p>
                  Contact our developer for API access approval. We review all integration 
                  requests to ensure security and compliance with our platform standards.
                </p>
                <div style={{ marginTop: "20px", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#86f0ff" }}>Developer Contact</h4>
                  <p style={{ margin: 0, color: "#a5b7d0" }}>
                    Email: developer@stackkidsbank.com<br/>
                    Response time: 24-48 hours<br/>
                    Approval process: 3-5 business days
                  </p>
                </div>
              </div>

              <div className="cta-actions">
                <button onClick={() => window.location.href = 'mailto:developer@stackkidsbank.com?subject=API Integration Request'} className="btn btn-primary">
                  <i className="fa-solid fa-envelope"></i>
                  Request API Access
                </button>
                <button onClick={() => navigate("/documentation")} className="btn btn-secondary">
                  <i className="fa-solid fa-book"></i>
                  Read Documentation
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
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/developers"); }}>Developers</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
