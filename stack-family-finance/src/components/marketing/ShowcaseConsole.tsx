interface ConsoleTab {
  label: string;
  accent?: "green" | "cyan" | "blue";
}

interface ShowcaseConsoleProps {
  title?: string;
  language?: string;
  tabs: ConsoleTab[];
  code: string;
  footer?: string;
}

export function ShowcaseConsole({ title, language, tabs, code, footer }: ShowcaseConsoleProps) {
  return (
    <div className="showcase-console">
      {title ? (
        <div className="showcase-console-header">
          <span>{title}</span>
        </div>
      ) : null}

      <div className="showcase-console-tabs">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            className={`showcase-console-tab ${index === 0 ? "active" : ""} ${tab.accent ?? ""}`.trim()}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <pre className="showcase-console-code">{code}</pre>

      <div className="showcase-console-footer">
        <span>{language ?? "Platform"}</span>
        <button type="button" className="showcase-console-copy">
          Copy to clipboard
        </button>
      </div>

      {footer ? <p className="showcase-console-note">{footer}</p> : null}
    </div>
  );
}
