import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll reveal animation
    const reveals = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.18 }
    );
    reveals.forEach((item) => revealObserver.observe(item));

    // Counter animation
    const counters = document.querySelectorAll(".counter");
    const animateCounter = (el: Element) => {
      const target = Number((el as HTMLElement).dataset.target || 0);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const update = () => {
        current += step;
        if (current >= target) {
          el.textContent = String(target);
          return;
        }
        el.textContent = String(current);
        requestAnimationFrame(update);
      };
      update();
    };

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.8 }
    );
    counters.forEach((counter) => counterObserver.observe(counter));

    // Parallax effect
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxItems = document.querySelectorAll(".parallax");
      parallaxItems.forEach((item) => {
        const speed = Number((item as HTMLElement).dataset.speed || 0.15);
        (item as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      revealObserver.disconnect();
      counterObserver.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="landing-page">
      <div className="cursor-glow"></div>
      <div className="bg-noise"></div>

      {/* Header */}
      <header className="header" id="top">
        <div className="container nav">
          <a href="#top" className="brand" onClick={(e) => { e.preventDefault(); scrollToSection("top"); }}>
            <img src="/logo.png" alt="Stack logo" />
            <span>Stack</span>
          </a>

          <nav className="desktop-nav">
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}>Features</a>
            <a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection("experience"); }}>Experience</a>
            <a href="#security" onClick={(e) => { e.preventDefault(); scrollToSection("security"); }}>Security</a>
            <a href="#journey" onClick={(e) => { e.preventDefault(); scrollToSection("journey"); }}>Journey</a>
            <a href="#download" onClick={(e) => { e.preventDefault(); scrollToSection("download"); }}>Download</a>
          </nav>

          <div className="nav-actions">
            <button onClick={() => navigate("/login")} className="btn btn-outline">Get Started</button>
            <button className="menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav open">
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}>Features</a>
            <a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection("experience"); }}>Experience</a>
            <a href="#security" onClick={(e) => { e.preventDefault(); scrollToSection("security"); }}>Security</a>
            <a href="#journey" onClick={(e) => { e.preventDefault(); scrollToSection("journey"); }}>Journey</a>
            <a href="#download" onClick={(e) => { e.preventDefault(); scrollToSection("download"); }}>Download</a>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-bg-shape hero-shape-1 parallax" data-speed="0.18"></div>
          <div className="hero-bg-shape hero-shape-2 parallax" data-speed="0.1"></div>

          <div className="container hero-grid">
            <div className="hero-copy reveal up">
              <div className="eyebrow">
                <i className="fa-solid fa-sparkles"></i>
                Smart banking for kids and parents
              </div>

              <h1 className="hero-title">
                The first money app
                <span>children will love</span>
                and parents will
                <span>fully trust.</span>
              </h1>

              <p className="hero-text">
                Stack is a complete kids banking experience made for modern families.
                It combines pocket money, savings goals, spending controls, chores,
                rewards, and financial education in one premium product.
              </p>

              <div className="hero-actions">
                <button onClick={() => navigate("/login")} className="btn btn-primary">
                  <i className="fa-solid fa-arrow-right"></i>
                  Start with Stack
                </button>
                <button onClick={() => scrollToSection("features")} className="btn btn-secondary">
                  <i className="fa-regular fa-circle-play"></i>
                  Explore product
                </button>
              </div>

              <div className="hero-stats">
                <div className="stat glass reveal left stagger-1">
                  <strong className="counter" data-target="24">0</strong>
                  <span>hour visibility</span>
                </div>
                <div className="stat glass reveal left stagger-2">
                  <strong className="counter" data-target="100">0</strong>
                  <span>parent control</span>
                </div>
                <div className="stat glass reveal left stagger-3">
                  <strong className="counter" data-target="7">0</strong>
                  <span>learning zones</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="floating-card card-back reveal right">
                <div className="screen-top">
                  <span></span>
                  <p>Parent dashboard</p>
                </div>

                <div className="mini-block">
                  <div>
                    <small>Card Controls</small>
                    <h4>Online spend paused</h4>
                  </div>
                  <i className="fa-solid fa-shield-halved"></i>
                </div>

                <div className="mini-block">
                  <div>
                    <small>Allowance</small>
                    <h4>Auto every Friday</h4>
                  </div>
                  <i className="fa-solid fa-calendar-check"></i>
                </div>

                <div className="mini-block">
                  <div>
                    <small>Task reward</small>
                    <h4>Homework + $5</h4>
                  </div>
                  <i className="fa-solid fa-circle-check"></i>
                </div>
              </div>

              <div className="phone-card glass reveal zoom">
                <div className="screen-top">
                  <span></span>
                  <p>Child app</p>
                </div>

                <div className="balance-box">
                  <small>Available balance</small>
                  <h3>$128.40</h3>
                  <div className="badge-row">
                    <span>Stack Card</span>
                    <span>Goal Active</span>
                  </div>
                </div>

                <div className="goal-box">
                  <div className="goal-head">
                    <p>New Bike</p>
                    <span>78%</span>
                  </div>
                  <div className="progress">
                    <div className="progress-fill"></div>
                  </div>
                </div>

                <div className="icon-pills">
                  <div><i className="fa-solid fa-piggy-bank"></i><span>Save</span></div>
                  <div><i className="fa-solid fa-gamepad"></i><span>Play</span></div>
                  <div><i className="fa-solid fa-trophy"></i><span>Win</span></div>
                </div>
              </div>

              <div className="floating-badge reveal down stagger-2">
                <i className="fa-solid fa-lock"></i>
                Safe by design
              </div>
            </div>
          </div>
        </section>

        {/* Logo Strip */}
        <section className="logo-strip section-mini">
          <div className="container reveal up">
            <p>Made for the platforms families already use</p>
            <div className="strip-icons">
              <i className="fa-brands fa-apple"></i>
              <i className="fa-brands fa-google-play"></i>
              <i className="fa-brands fa-android"></i>
              <i className="fa-solid fa-credit-card"></i>
              <i className="fa-solid fa-school"></i>
              <i className="fa-solid fa-shield-heart"></i>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section" id="features">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Main features</div>
              <h2>Everything a kids bank should have, and more.</h2>
              <p>
                This landing page is built to sell the whole ecosystem: a product for
                parents, a fun app for children, and a premium digital brand.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature-card glass reveal left">
                <div className="icon-box"><i className="fa-solid fa-wallet"></i></div>
                <h3>Smart allowances</h3>
                <p>Set automatic daily, weekly, or monthly pocket money without manual sending every time.</p>
              </article>

              <article className="feature-card glass reveal up stagger-1">
                <div className="icon-box"><i className="fa-solid fa-bullseye"></i></div>
                <h3>Savings goals</h3>
                <p>Kids create goals for toys, books, gifts, bikes, gadgets, and watch progress visually.</p>
              </article>

              <article className="feature-card glass reveal right">
                <div className="icon-box"><i className="fa-solid fa-list-check"></i></div>
                <h3>Chores & rewards</h3>
                <p>Turn tasks into positive habits with simple approvals and rewards from parents.</p>
              </article>

              <article className="feature-card glass reveal left stagger-2">
                <div className="icon-box"><i className="fa-solid fa-book-open-reader"></i></div>
                <h3>Financial learning</h3>
                <p>Mini lessons, quizzes, and friendly learning flows teach real money skills early.</p>
              </article>

              <article className="feature-card glass reveal up stagger-2">
                <div className="icon-box"><i className="fa-solid fa-credit-card"></i></div>
                <h3>Real-time card controls</h3>
                <p>Parents can pause spending, limit categories, and monitor transactions instantly.</p>
              </article>

              <article className="feature-card glass reveal right stagger-2">
                <div className="icon-box"><i className="fa-solid fa-chart-line"></i></div>
                <h3>Growth insights</h3>
                <p>Track saving streaks, completed chores, lesson progress, and habit improvements.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="section section-dark sticky-section" id="experience">
          <div className="container sticky-grid">
            <div className="sticky-copy">
              <div className="pin-box">
                <div className="eyebrow">Scroll storytelling</div>
                <h2>As you scroll, the story unfolds like a premium product launch.</h2>
                <p>
                  This section is made to feel like big modern websites. Cards move
                  in from left and right, content fades in, and the product message
                  becomes stronger while the user continues scrolling.
                </p>
              </div>
            </div>

            <div className="sticky-cards">
              <div className="story-panel glass panel-1 reveal right">
                <span>01 · FOR KIDS</span>
                <h3>Money feels exciting.</h3>
                <p>Gamified goals, rewards, progress bars, and visual feedback make the experience memorable.</p>
              </div>

              <div className="story-panel glass panel-2 reveal left">
                <span>02 · FOR PARENTS</span>
                <h3>Control stays easy.</h3>
                <p>Parents get calm visibility, less chaos, better money conversations, and stronger habits at home.</p>
              </div>

              <div className="story-panel glass panel-3 reveal right">
                <span>03 · FOR FAMILY</span>
                <h3>Every action teaches.</h3>
                <p>Chores, savings, approvals, and challenges become small lessons that build discipline.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="section" id="security">
          <div className="container security-grid">
            <div className="security-copy reveal left">
              <div className="eyebrow">Security first</div>
              <h2>Parents should feel safe from the very first second.</h2>
              <p>
                Stack is designed around trust. The landing page communicates safety
                visually with clean spacing, shield motifs, glass surfaces, and
                structured information.
              </p>

              <div className="security-list">
                <div className="security-item reveal up stagger-1">
                  <i className="fa-solid fa-fingerprint"></i>
                  <div>
                    <h4>Secure authentication</h4>
                    <p>Protected account access for family roles and permissions.</p>
                  </div>
                </div>

                <div className="security-item reveal up stagger-2">
                  <i className="fa-solid fa-bell"></i>
                  <div>
                    <h4>Instant alerts</h4>
                    <p>Get real-time updates for payments, rewards, or unusual activity.</p>
                  </div>
                </div>

                <div className="security-item reveal up stagger-3">
                  <i className="fa-solid fa-sliders"></i>
                  <div>
                    <h4>Flexible controls</h4>
                    <p>Pause cards, set limits, define rules, and approve actions in seconds.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="security-visual reveal zoom">
              <div className="security-orbit orbit-1"></div>
              <div className="security-orbit orbit-2"></div>
              <div className="security-core glass">
                <i className="fa-solid fa-shield-halved"></i>
                <h3>Protected family finance</h3>
                <p>Controls, visibility, safety, and peace of mind.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="section" id="journey">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">User journey</div>
              <h2>Simple onboarding. Strong long-term engagement.</h2>
            </div>

            <div className="journey-grid">
              <div className="journey-card glass reveal left">
                <span>01</span>
                <h3>Create family account</h3>
                <p>Parent registers, adds child profiles, and activates the first financial workspace.</p>
              </div>
              <div className="journey-card glass reveal up">
                <span>02</span>
                <h3>Set goals and rules</h3>
                <p>Configure allowance, chores, spending permissions, savings, and learning steps.</p>
              </div>
              <div className="journey-card glass reveal right">
                <span>03</span>
                <h3>Track growth weekly</h3>
                <p>Review habits, celebrate achievements, and help kids become confident with money.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="section download-section" id="download">
          <div className="container">
            <div className="section-head reveal up">
              <div className="eyebrow">Download Apps</div>
              <h2>Get Stack on your device</h2>
              <p>
                Download Stack for Android or Windows and start your family's financial journey today.
                Available for free on all platforms.
              </p>
            </div>

            <div className="download-grid">
              <div className="download-card glass reveal left">
                <div className="download-icon">
                  <i className="fa-brands fa-android"></i>
                </div>
                <h3>Android App</h3>
                <p>Install Stack on your Android phone or tablet. Compatible with Android 7.0 and above.</p>
                <div className="download-info">
                  <span><i className="fa-solid fa-mobile-screen"></i> Mobile & Tablet</span>
                  <span><i className="fa-solid fa-download"></i> 6.1 MB</span>
                </div>
                <a href="/STACK-Kids-Bank.apk" download className="btn btn-primary download-btn">
                  <i className="fa-brands fa-android"></i>
                  Download APK
                </a>
              </div>

              <div className="download-card glass reveal right">
                <div className="download-icon">
                  <i className="fa-brands fa-windows"></i>
                </div>
                <h3>Windows App</h3>
                <p>Install Stack on your Windows PC or laptop. Compatible with Windows 10 and above.</p>
                <div className="download-info">
                  <span><i className="fa-solid fa-desktop"></i> Desktop</span>
                  <span><i className="fa-solid fa-download"></i> 228 MB</span>
                </div>
                <a href="/STACK-Kids-Bank-Windows.zip" download className="btn btn-primary download-btn">
                  <i className="fa-brands fa-windows"></i>
                  Download for Windows
                </a>
              </div>

              <div className="download-card glass reveal up stagger-1">
                <div className="download-icon web-icon">
                  <i className="fa-solid fa-globe"></i>
                </div>
                <h3>Web App</h3>
                <p>Use Stack directly in your browser. No installation required, works on any device.</p>
                <div className="download-info">
                  <span><i className="fa-solid fa-browser"></i> All Browsers</span>
                  <span><i className="fa-solid fa-bolt"></i> Instant Access</span>
                </div>
                <button onClick={() => navigate("/login")} className="btn btn-primary download-btn">
                  <i className="fa-solid fa-arrow-right"></i>
                  Launch Web App
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-box glass reveal up">
              <div className="cta-copy">
                <div className="eyebrow">Ready to launch</div>
                <h2>Build the future of kids banking with Stack.</h2>
                <p>
                  Join thousands of families teaching their children financial responsibility
                  through fun, engaging, and secure banking experiences.
                </p>
              </div>

              <div className="cta-actions">
                <button onClick={() => navigate("/login")} className="btn btn-primary">
                  <i className="fa-solid fa-rocket"></i>
                  Get Started Free
                </button>
                <button onClick={() => scrollToSection("features")} className="btn btn-secondary">
                  <i className="fa-solid fa-layer-group"></i>
                  See Features
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
            <a href="#top" className="brand footer-brand" onClick={(e) => { e.preventDefault(); scrollToSection("top"); }}>
              <img src="/logo.png" alt="Stack logo" />
              <span>Stack</span>
            </a>
            <p>Kids banking made beautiful, safe, and meaningful.</p>
          </div>

          <div className="footer-links">
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}>Features</a>
            <a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection("experience"); }}>Experience</a>
            <a href="#security" onClick={(e) => { e.preventDefault(); scrollToSection("security"); }}>Security</a>
            <a href="#journey" onClick={(e) => { e.preventDefault(); scrollToSection("journey"); }}>Journey</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
