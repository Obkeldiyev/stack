import { useNavigate } from "react-router-dom";

export function MarketingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="container footer-wrap">
        <div>
          <button className="brand footer-brand" onClick={() => navigate("/landing")}>
            <img src="/logo.png" alt="Stack logo" />
            <span>Stack</span>
          </button>
          <p>Kids banking made beautiful, safe, and meaningful.</p>
        </div>

        <div className="footer-links">
          <button onClick={() => navigate("/presentation")}>Presentation</button>
          <button onClick={() => navigate("/documentation")}>Documentation</button>
          <button onClick={() => navigate("/integration")}>Integration</button>
          <button onClick={() => navigate("/privacy")}>Privacy</button>
        </div>
      </div>
    </footer>
  );
}
