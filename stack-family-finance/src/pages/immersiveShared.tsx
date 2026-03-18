import { useEffect, useState } from "react";

export interface ImmersiveTab {
  label: string;
  code: string;
  note?: string;
}

export function useImmersiveReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll(".ix-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("ix-visible");
        });
      },
      { threshold: 0.16 }
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button className="ix-copy" onClick={handleCopy}>
      <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`} />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function ImmersiveTabs({ tabs }: { tabs: ImmersiveTab[] }) {
  const [active, setActive] = useState(0);
  const current = tabs[active];

  return (
    <div className="ix-tabs ix-reveal">
      <div className="ix-tabs-head">
        <div className="ix-tab-list">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              className={`ix-tab${index === active ? " active" : ""}`}
              onClick={() => setActive(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <CopyButton text={current.code} />
      </div>
      <pre className="ix-code"><code>{current.code}</code></pre>
      {current.note ? <div className="ix-tab-note">{current.note}</div> : null}
    </div>
  );
}
