import "./diagrams.css";

// Full UML architecture diagram as an SVG visual map
export function UmlDiagram() {
  const W = 900;
  const H = 620;

  // Layer definitions
  const layers = [
    {
      label: "CLIENT LAYER",
      y: 20,
      color: "#1d64d6",
      boxes: [
        { id: "web", x: 60, label: "React Web App", sub: "Vite + TypeScript", w: 160 },
        { id: "electron", x: 260, label: "Electron Desktop", sub: "Windows .exe", w: 160 },
        { id: "android", x: 460, label: "Android APK", sub: "Capacitor", w: 160 },
        { id: "admin_ui", x: 660, label: "Admin Panel", sub: "React (standalone)", w: 160 },
      ],
    },
    {
      label: "GATEWAY LAYER",
      y: 180,
      color: "#19c7d8",
      boxes: [
        { id: "nginx", x: 200, label: "Nginx Proxy", sub: "TLS · Port 443", w: 160 },
        { id: "static", x: 400, label: "Static Files", sub: "/var/www/stack", w: 160 },
        { id: "ssl", x: 600, label: "SSL/TLS", sub: "Certificate", w: 120 },
      ],
    },
    {
      label: "API LAYER",
      y: 340,
      color: "#70cf42",
      boxes: [
        { id: "spring", x: 60, label: "Spring Boot 3", sub: "Port 9008", w: 150 },
        { id: "jwt", x: 240, label: "JWT Filter", sub: "HS256 · 1h expiry", w: 160 },
        { id: "auth_ctrl", x: 420, label: "Auth Controller", sub: "POST /api/auth/*", w: 160 },
        { id: "domain_ctrl", x: 600, label: "Domain Controllers", sub: "Family·Bank·Task·Goal", w: 180 },
      ],
    },
    {
      label: "DATA LAYER",
      y: 500,
      color: "#a855f7",
      boxes: [
        { id: "jpa", x: 120, label: "Spring Data JPA", sub: "Hibernate ORM", w: 160 },
        { id: "pg", x: 360, label: "PostgreSQL", sub: "Primary database", w: 160 },
        { id: "pm2", x: 600, label: "PM2 Process", sub: "mvn spring-boot:run", w: 160 },
      ],
    },
  ];

  // Connections between boxes (from_id → to_id)
  const connections = [
    { from: "web", to: "nginx", label: "HTTPS" },
    { from: "electron", to: "nginx", label: "HTTPS" },
    { from: "android", to: "nginx", label: "HTTPS" },
    { from: "admin_ui", to: "nginx", label: "HTTPS" },
    { from: "nginx", to: "spring", label: "proxy /api/*" },
    { from: "nginx", to: "static", label: "serve" },
    { from: "spring", to: "jwt", label: "filter" },
    { from: "jwt", to: "auth_ctrl", label: "validate" },
    { from: "jwt", to: "domain_ctrl", label: "authorize" },
    { from: "auth_ctrl", to: "jpa", label: "query" },
    { from: "domain_ctrl", to: "jpa", label: "query" },
    { from: "jpa", to: "pg", label: "SQL" },
    { from: "spring", to: "pm2", label: "managed by" },
  ];

  // Build a flat map of box positions
  const boxMap: Record<string, { cx: number; cy: number; w: number; color: string }> = {};
  const BOX_H = 56;
  layers.forEach((layer) => {
    layer.boxes.forEach((box) => {
      boxMap[box.id] = {
        cx: box.x + box.w / 2,
        cy: layer.y + BOX_H / 2,
        w: box.w,
        color: layer.color,
      };
    });
  });

  return (
    <div className="uml-diagram-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="uml-diagram-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {["#1d64d6", "#19c7d8", "#70cf42", "#a855f7"].map((c) => (
            <marker key={c} id={`uml-arrow-${c.replace("#", "")}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={c} opacity="0.8" />
            </marker>
          ))}
        </defs>

        {/* Layer backgrounds */}
        {layers.map((layer) => (
          <g key={layer.label}>
            <rect x={20} y={layer.y - 14} width={W - 40} height={BOX_H + 28} rx="16"
              fill={layer.color} fillOpacity="0.05" stroke={layer.color} strokeOpacity="0.15" strokeWidth="1" />
            <text x={36} y={layer.y - 2} fill={layer.color} fontSize="9" fontWeight="800"
              fontFamily="IBM Plex Mono, monospace" letterSpacing="2" opacity="0.7">{layer.label}</text>
          </g>
        ))}

        {/* Connection lines */}
        {connections.map((conn, i) => {
          const src = boxMap[conn.from];
          const tgt = boxMap[conn.to];
          if (!src || !tgt) return null;
          const x1 = src.cx;
          const y1 = src.cy + BOX_H / 2;
          const x2 = tgt.cx;
          const y2 = tgt.cy - BOX_H / 2;
          const midY = (y1 + y2) / 2;
          const arrowId = `uml-arrow-${src.color.replace("#", "")}`;
          return (
            <g key={i}>
              <path d={`M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`}
                fill="none" stroke={src.color} strokeWidth="1.5" strokeOpacity="0.4"
                strokeDasharray="4,3" markerEnd={`url(#${arrowId})`} />
              {conn.label && (
                <text x={(x1 + x2) / 2} y={midY - 3} fill={src.color} fontSize="9"
                  fontFamily="IBM Plex Mono, monospace" textAnchor="middle" opacity="0.6">{conn.label}</text>
              )}
            </g>
          );
        })}

        {/* Boxes */}
        {layers.map((layer) =>
          layer.boxes.map((box) => (
            <g key={box.id}>
              {/* Shadow */}
              <rect x={box.x + 3} y={layer.y + 3} width={box.w} height={BOX_H} rx="10" fill="rgba(0,0,0,0.35)" />
              {/* Box */}
              <rect x={box.x} y={layer.y} width={box.w} height={BOX_H} rx="10"
                fill="rgba(8,17,31,0.95)" stroke={layer.color} strokeWidth="1.5" strokeOpacity="0.7" />
              {/* Top accent */}
              <rect x={box.x} y={layer.y} width={box.w} height={3} rx="2" fill={layer.color} fillOpacity="0.8" />
              {/* Label */}
              <text x={box.x + box.w / 2} y={layer.y + 22} fill="#f4f8ff" fontSize="12" fontWeight="700"
                fontFamily="Inter, sans-serif" textAnchor="middle">{box.label}</text>
              {/* Sub */}
              <text x={box.x + box.w / 2} y={layer.y + 38} fill={layer.color} fontSize="10"
                fontFamily="IBM Plex Mono, monospace" textAnchor="middle" opacity="0.8">{box.sub}</text>
            </g>
          ))
        )}
      </svg>

      <div className="uml-legend">
        <span><span className="uml-legend-box" style={{ background: "rgba(29,100,214,0.3)", borderColor: "#1d64d6" }} /> Client</span>
        <span><span className="uml-legend-box" style={{ background: "rgba(25,199,216,0.3)", borderColor: "#19c7d8" }} /> Gateway</span>
        <span><span className="uml-legend-box" style={{ background: "rgba(112,207,66,0.3)", borderColor: "#70cf42" }} /> API</span>
        <span><span className="uml-legend-box" style={{ background: "rgba(168,85,247,0.3)", borderColor: "#a855f7" }} /> Data</span>
        <span><span className="uml-legend-line" /> Dependency</span>
      </div>
    </div>
  );
}
