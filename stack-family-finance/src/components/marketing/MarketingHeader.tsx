import { useState } from "react";
import { useNavigate } from "react-router-dom";

type NavItem = { label: string; path: string };

interface MarketingHeaderProps {
  activePath?: string;
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { label: "Home", path: "/landing" },
  { label: "Presentation", path: "/presentation" },
  { label: "Documentation", path: "/documentation" },
  { label: "Integration", path: "/integration" },
  { label: "Developers", path: "/developers" },
];

export function MarketingHeader({ activePath, items = defaultItems }: MarketingHeaderProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <header className="header">
      <div className="container nav">
        <button className="brand" onClick={() => go("/landing")}>
          <img src="/logo.png" alt="Stack logo" />
          <span>Stack</span>
        </button>

        <nav className="desktop-nav">
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => go(item.path)}
              style={{ color: activePath === item.path ? "white" : undefined }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          <button onClick={() => go("/login")} className="btn btn-outline">Get Started</button>
          <button className="menu-btn" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-nav open">
          {items.map((item) => (
            <button key={item.path} onClick={() => go(item.path)}>
              {item.label}
            </button>
          ))}
          <button onClick={() => go("/login")}>Get Started</button>
        </div>
      )}
    </header>
  );
}

