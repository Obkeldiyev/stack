import { useEffect, useState } from "react";

export interface OrbitTab {
  label: string;
  code: string;
  hint?: string;
}

export function useOrbitMotion() {
  useEffect(() => {
    const nodes = document.querySelectorAll(".ob-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("ob-visible");
        });
      },
      { threshold: 0.16 }
    );

    nodes.forEach((node) => observer.observe(node));

    const glow = document.querySelector(".cursor-glow") as HTMLElement | null;
    const onMove = (event: MouseEvent) => {
      if (!glow) return;
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
}

function Copy({ text }: { text: string }) {
  const [done, setDone] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      window.setTimeout(() => setDone(false), 1400);
    } catch {
      setDone(false);
    }
  };

  return (
    <button className="ob-copy" onClick={onCopy}>
      <i className={`fa-solid ${done ? "fa-check" : "fa-copy"}`} />
      {done ? "Copied" : "Copy"}
    </button>
  );
}

export function OrbitTabs({ tabs }: { tabs: OrbitTab[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="ob-code ob-reveal">
      <div className="ob-code-head">
        <div className="ob-tab-list">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              className={`ob-tab${index === active ? " active" : ""}`}
              onClick={() => setActive(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Copy text={tabs[active].code} />
      </div>
      <pre className="ob-code-pre"><code>{tabs[active].code}</code></pre>
      {tabs[active].hint ? <p className="ob-code-hint">{tabs[active].hint}</p> : null}
    </div>
  );
}
