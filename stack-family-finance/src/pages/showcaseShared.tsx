import { useEffect, useState } from "react";

export function useShowcaseReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll(".sc-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("sc-visible");
        });
      },
      { threshold: 0.14 }
    );

    nodes.forEach((node) => observer.observe(node));

    const glow = document.querySelector(".cursor-glow") as HTMLElement | null;
    const onMouse = (event: MouseEvent) => {
      if (!glow) return;
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    };

    window.addEventListener("mousemove", onMouse);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);
}

export function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button className="sc-copy-btn" onClick={onCopy}>
      <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`} />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export interface ShowcaseTab {
  label: string;
  code: string;
}

export function CodeTabs({ tabs }: { tabs: ShowcaseTab[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="sc-code-shell">
      <div className="sc-code-bar">
        <div className="sc-code-tab-list">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              className={`sc-code-tab${index === active ? " active" : ""}`}
              onClick={() => setActive(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <CopyBtn text={tabs[active].code} />
      </div>
      <pre className="sc-code-pre">
        <code>{tabs[active].code}</code>
      </pre>
    </div>
  );
}
