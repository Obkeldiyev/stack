import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function About() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/about"); }} style={{ color: "white" }}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/features"); }}>Features</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/developers"); }}>Developers</a>
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
                <i className="fa-solid fa-heart"></i>
                About Stack
              </div>

              <h1 className="hero-title">
                Building the future of
                <span>financial education</span>
                for families
                <span>worldwide.</span>
              </h1>

              <p className="hero-text">
                Stack was created with a simple mission: make financial literacy accessible, 
                engaging, and meaningful for children while giving parents the tools they need 
                to guide their kids toward financial responsibility.
              </p>

              <div className="hero-actions">
                <button onClick={() => navigate("/login")} className="btn btn-primary">
                  <i className="fa-solid fa-arrow-right"></i>
                  Start Your Journey
                </button>
                <button onClick={() => scrollToSection("mission")} className="btn btn-secondary">
                  <i className="fa-solid fa-compass"></i>
                  Our Mission
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="phone-card glass reveal zoom">
                <div className="screen-top">
                  <span></span>
                  <p>Our Vision</p>
                </div>

                <div className="balance-box">
                  <small>Empowering Families</small>
                  <h3>Since 2026</h3>
                  <div className="badge-row">
                    <span>Trusted</span>
                    <span>Secure</span>
                    <span>Educational</span>
                  </div>
                </div>

                <div className="icon-pills">
                  <div><i className="fa-solid fa-users"></i><span>Families</span></div>
                  <div><i className="fa-solid fa-graduation-cap"></i><span>Learn</span></div>
                  <div><i className="fa-solid fa-shield-heart"></i><span>Safe</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section" id="mission">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Our Mission</div>
              <h2>Why Stack Exists</h2>
              <p>
                We believe every child deserves to understand money, and every parent 
                deserves tools to teach financial responsibility effectively.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature-card glass reveal left">
                <div className="icon-box"><i className="fa-solid fa-lightbulb"></i></div>
                <h3>Financial Literacy Crisis</h3>
                <p>Most adults lack basic financial skills. We're changing that by starting early with engaging, age-appropriate education.</p>
              </article>

              <article className="feature-card glass reveal up stagger-1">
                <div className="icon-box"><i className="fa-solid fa-family"></i></div>
                <h3>Family-Centered Approach</h3>
                <p>Money management is learned at home. We strengthen family financial conversations and create positive money habits.</p>
              </article>

              <article className="feature-card glass reveal right">
                <div className="icon-box"><i className="fa-solid fa-rocket"></i></div>
                <h3>Technology for Good</h3>
                <p>We use modern technology to make financial education fun, interactive, and accessible to families everywhere.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Our Values</div>
              <h2>What Drives Us</h2>
            </div>

            <div className="journey-grid">
              <div className="journey-card glass reveal left">
                <span><i className="fa-solid fa-shield-halved"></i></span>
                <h3>Security First</h3>
                <p>Every feature is built with security and privacy as the foundation. Your family's data is protected with enterprise-grade security.</p>
              </div>
              <div className="journey-card glass reveal up">
                <span><i className="fa-solid fa-heart"></i></span>
                <h3>Family Values</h3>
                <p>We respect family dynamics and cultural differences. Stack adapts to your family's unique approach to money and values.</p>
              </div>
              <div className="journey-card glass reveal right">
                <span><i className="fa-solid fa-seedling"></i></span>
                <h3>Growth Mindset</h3>
                <p>We believe in continuous learning and improvement. Stack grows with your family and evolves with your needs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">The Team</div>
              <h2>Built by Parents, for Parents</h2>
              <p>
                Stack is developed by a team of parents, educators, and technologists 
                who understand the challenges of teaching kids about money.
              </p>
            </div>

            <div className="cta-box glass reveal up">
              <div className="cta-copy">
                <h3>Developer & Founder</h3>
                <p>
                  Stack is developed and maintained by a dedicated developer who understands 
                  the importance of financial education and family values. Every feature is 
                  carefully crafted with real families in mind.
                </p>
              </div>
              <div className="cta-actions">
                <button onClick={() => navigate("/developers")} className="btn btn-primary">
                  <i className="fa-solid fa-code"></i>
                  Developer Info
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