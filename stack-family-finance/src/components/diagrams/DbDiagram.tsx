import "./diagrams.css";

// Visual DB diagram with tables, columns, and relationship lines drawn via SVG overlay
export function DbDiagram() {
  // Table definitions with position (col, row in a grid)
  const tables = [
    {
      id: "users", x: 0, y: 0, color: "#1d64d6",
      name: "users",
      fields: [
        { name: "id", type: "BIGINT", pk: true },
        { name: "username", type: "VARCHAR", unique: true },
        { name: "password_hash", type: "VARCHAR" },
        { name: "role", type: "ENUM" },
        { name: "created_at", type: "TIMESTAMP" },
      ],
    },
    {
      id: "families", x: 1, y: 0, color: "#19c7d8",
      name: "families",
      fields: [
        { name: "id", type: "BIGINT", pk: true },
        { name: "title", type: "VARCHAR" },
        { name: "owner_id", type: "BIGINT", fk: "users" },
        { name: "created_at", type: "TIMESTAMP" },
      ],
    },
    {
      id: "family_members", x: 2, y: 0, color: "#19c7d8",
      name: "family_members",
      fields: [
        { name: "id", type: "BIGINT", pk: true },
        { name: "family_id", type: "BIGINT", fk: "families" },
        { name: "user_id", type: "BIGINT", fk: "users" },
        { name: "role", type: "ENUM" },
      ],
    },
    {
      id: "accounts", x: 0, y: 1, color: "#70cf42",
      name: "accounts",
      fields: [
        { name: "id", type: "BIGINT", pk: true },
        { name: "owner_id", type: "BIGINT", fk: "users" },
        { name: "type", type: "ENUM" },
        { name: "balance", type: "BIGINT" },
        { name: "created_at", type: "TIMESTAMP" },
      ],
    },
    {
      id: "transactions", x: 1, y: 1, color: "#70cf42",
      name: "transactions",
      fields: [
        { name: "id", type: "BIGINT", pk: true },
        { name: "account_id", type: "BIGINT", fk: "accounts" },
        { name: "type", type: "ENUM" },
        { name: "amount", type: "BIGINT" },
        { name: "note", type: "VARCHAR" },
        { name: "created_at", type: "TIMESTAMP" },
      ],
    },
    {
      id: "goals", x: 2, y: 1, color: "#f59e0b",
      name: "goals",
      fields: [
        { name: "id", type: "BIGINT", pk: true },
        { name: "owner_id", type: "BIGINT", fk: "users" },
        { name: "title", type: "VARCHAR" },
        { name: "target_amount", type: "BIGINT" },
        { name: "saved_amount", type: "BIGINT" },
        { name: "status", type: "ENUM" },
      ],
    },
    {
      id: "tasks", x: 0, y: 2, color: "#a855f7",
      name: "tasks",
      fields: [
        { name: "id", type: "BIGINT", pk: true },
        { name: "family_id", type: "BIGINT", fk: "families" },
        { name: "title", type: "VARCHAR" },
        { name: "reward", type: "BIGINT" },
        { name: "status", type: "ENUM" },
        { name: "assigned_to", type: "BIGINT", fk: "users" },
      ],
    },
    {
      id: "invite_codes", x: 1, y: 2, color: "#ec4899",
      name: "invite_codes",
      fields: [
        { name: "id", type: "BIGINT", pk: true },
        { name: "family_id", type: "BIGINT", fk: "families" },
        { name: "code", type: "VARCHAR", unique: true },
        { name: "used_by", type: "BIGINT", fk: "users" },
        { name: "expires_at", type: "TIMESTAMP" },
      ],
    },
  ];

  const COL_W = 220;
  const ROW_H = 240;
  const GAP_X = 60;
  const GAP_Y = 50;
  const HEADER_H = 36;
  const FIELD_H = 26;
  const PAD_X = 20;
  const PAD_Y = 20;

  // Compute pixel positions
  const positioned = tables.map((t) => ({
    ...t,
    px: PAD_X + t.x * (COL_W + GAP_X),
    py: PAD_Y + t.y * (ROW_H + GAP_Y),
    height: HEADER_H + t.fields.length * FIELD_H + 10,
  }));

  const totalW = PAD_X * 2 + 3 * COL_W + 2 * GAP_X;
  const totalH = PAD_Y * 2 + 3 * (ROW_H + GAP_Y);

  // Build FK relationship lines
  const relations: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
  positioned.forEach((t) => {
    t.fields.forEach((f, fi) => {
      if (!("fk" in f) || !f.fk) return;
      const target = positioned.find((p) => p.id === f.fk);
      if (!target) return;
      const fieldY = t.py + HEADER_H + fi * FIELD_H + FIELD_H / 2;
      const srcX = t.px + COL_W;
      const tgtX = target.px;
      const tgtY = target.py + HEADER_H / 2;
      relations.push({ x1: srcX, y1: fieldY, x2: tgtX, y2: tgtY, color: t.color });
    });
  });

  return (
    <div className="db-diagram-wrap">
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="db-diagram-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {["#1d64d6", "#19c7d8", "#70cf42", "#f59e0b", "#a855f7", "#ec4899"].map((c) => (
            <marker key={c} id={`arrow-${c.replace("#", "")}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={c} opacity="0.7" />
            </marker>
          ))}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Relationship lines */}
        {relations.map((r, i) => {
          const mid = (r.x1 + r.x2) / 2;
          const arrowId = `arrow-${r.color.replace("#", "")}`;
          return (
            <path
              key={i}
              d={`M${r.x1},${r.y1} C${mid},${r.y1} ${mid},${r.y2} ${r.x2},${r.y2}`}
              fill="none"
              stroke={r.color}
              strokeWidth="1.5"
              strokeOpacity="0.5"
              strokeDasharray="5,3"
              markerEnd={`url(#${arrowId})`}
            />
          );
        })}

        {/* Tables */}
        {positioned.map((t) => (
          <g key={t.id}>
            {/* Table shadow */}
            <rect x={t.px + 3} y={t.py + 3} width={COL_W} height={t.height} rx="12" fill="rgba(0,0,0,0.3)" />
            {/* Table body */}
            <rect x={t.px} y={t.py} width={COL_W} height={t.height} rx="12" fill="rgba(8,17,31,0.92)" stroke={t.color} strokeWidth="1.5" strokeOpacity="0.6" />
            {/* Header */}
            <rect x={t.px} y={t.py} width={COL_W} height={HEADER_H} rx="12" fill={t.color} fillOpacity="0.25" />
            <rect x={t.px} y={t.py + HEADER_H - 6} width={COL_W} height={6} fill={t.color} fillOpacity="0.25" />
            {/* Color accent bar */}
            <rect x={t.px} y={t.py} width={4} height={t.height} rx="2" fill={t.color} fillOpacity="0.8" />
            {/* Table name */}
            <text x={t.px + 16} y={t.py + 23} fill={t.color} fontSize="13" fontWeight="700" fontFamily="IBM Plex Mono, monospace">{t.name}</text>

            {/* Fields */}
            {t.fields.map((f, fi) => {
              const fy = t.py + HEADER_H + fi * FIELD_H;
              const isPk = "pk" in f && f.pk;
              const isFk = "fk" in f && f.fk;
              const isUnique = "unique" in f && f.unique;
              const fieldColor = isPk ? "#fbbf24" : isFk ? "#86f0ff" : "#9eb5cf";
              return (
                <g key={f.name}>
                  {fi % 2 === 0 && (
                    <rect x={t.px + 4} y={fy} width={COL_W - 8} height={FIELD_H} fill="rgba(255,255,255,0.02)" />
                  )}
                  {/* Icon */}
                  <text x={t.px + 14} y={fy + 17} fill={fieldColor} fontSize="9" fontFamily="sans-serif">
                    {isPk ? "🔑" : isFk ? "🔗" : "·"}
                  </text>
                  {/* Field name */}
                  <text x={t.px + 30} y={fy + 17} fill={fieldColor} fontSize="11" fontFamily="IBM Plex Mono, monospace">{f.name}</text>
                  {/* Type */}
                  <text x={t.px + COL_W - 8} y={fy + 17} fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="IBM Plex Mono, monospace" textAnchor="end">{f.type}{isUnique ? " UQ" : ""}</text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>

      <div className="db-diagram-legend">
        <span><span className="db-legend-dot" style={{ background: "#fbbf24" }} /> Primary Key</span>
        <span><span className="db-legend-dot" style={{ background: "#86f0ff" }} /> Foreign Key</span>
        <span><span className="db-legend-line" /> Relationship</span>
      </div>
    </div>
  );
}
