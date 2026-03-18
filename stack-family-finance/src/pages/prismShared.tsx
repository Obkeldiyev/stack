import { useEffect, useState } from "react";

export interface PrismTab {
  label: string;
  code: string;
  note?: string;
}

export function usePrismReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll(".pr-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("pr-visible");
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button className="pr-copy-btn" onClick={onCopy}>
      <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`} />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function PrismTabs({ tabs }: { tabs: PrismTab[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="pr-code-shell pr-reveal">
      <div className="pr-code-head">
        <div className="pr-tab-list">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              className={`pr-tab-btn${index === active ? " active" : ""}`}
              onClick={() => setActive(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <CopyButton text={tabs[active].code} />
      </div>
      <pre className="pr-code-pre"><code>{tabs[active].code}</code></pre>
      {tabs[active].note ? <p className="pr-code-note">{tabs[active].note}</p> : null}
    </div>
  );
}
