import { useState, useRef, useEffect } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const funnelStages = [
  { label: "Applied",     count: 1348, pct: 100, drop: null, color: "#4F8EF7" },
  { label: "Screened",    count: 512,  pct: 38,  drop: 62,   color: "#F5A623" },
  { label: "Trained",     count: 287,  pct: 56,  drop: 44,   color: "#9B59B6" },
  { label: "Shortlisted", count: 187,  pct: 65,  drop: 35,   color: "#1ABC9C" },
  { label: "Selected",    count: 55,   pct: 29,  drop: 71,   color: "#2ECC71" },
];

const pieData = [
  { label: "In Process", value: 52, color: "#38BDF8" },
  { label: "Hired",      value: 29, color: "#06B6D4" },
  { label: "Rejected",   value: 19, color: "#94A3B8" },
];

const lineData = {
  months: ["Jan", "Feb", "Mar", "Apr", "May"],
  series: [
    { label: "Applications", color: "#3B82F6", values: [450, 520, 610, 700, 950] },
    { label: "Interviewed",  color: "#F59E0B", values: [30,  60,  90,  110, 390] },
    { label: "Hired",        color: "#06B6D4", values: [5,   10,  15,  18,  20]  },
  ],
};

const collegeData = [
  { college: "IIT Bombay",  applied: 245, screened: 198, trained: 112, shortlisted: 87,  selected: 34, rate: 13.9 },
  { college: "IIT Delhi",   applied: 198, screened: 156, trained: 89,  shortlisted: 72,  selected: 28, rate: 14.1 },
  { college: "BITS Pilani", applied: 167, screened: 134, trained: 76,  shortlisted: 58,  selected: 22, rate: 13.2 },
  { college: "NIT Trichy",  applied: 143, screened: 112, trained: 64,  shortlisted: 49,  selected: 18, rate: 12.6 },
  { college: "VIT Vellore", applied: 130, screened: 98,  trained: 55,  shortlisted: 41,  selected: 15, rate: 11.5 },
  { college: "IIIT Hyd",    applied: 118, screened: 89,  trained: 48,  shortlisted: 36,  selected: 12, rate: 10.2 },
];

const periodOptions = ["Q1 2026", "Q2 2026", "Year to Date", "Custom"];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function PeriodDropdown({ period, setPeriod }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 13, border: "1px solid #e5e7eb", background: "#fff",
          borderRadius: 8, padding: "8px 14px", color: "#374151",
          cursor: "pointer", fontWeight: 500, whiteSpace: "nowrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {period}
        <svg
          style={{ width: 14, height: 14, color: "#9ca3af", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 6px)",
          width: 176, background: "#fff", border: "1px solid #f1f5f9",
          borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          zIndex: 50, overflow: "hidden",
        }}>
          {periodOptions.map((opt) => (
            <button key={opt}
              onClick={() => { setPeriod(opt); setOpen(false); }}
              style={{
                width: "100%", textAlign: "left", padding: "10px 16px",
                fontSize: 13, background: period === opt ? "#eff6ff" : "transparent",
                color: period === opt ? "#2563eb" : "#374151",
                fontWeight: period === opt ? 600 : 500,
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              {opt}
              {period === opt && (
                <svg style={{ width: 14, height: 14, color: "#3b82f6" }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FunnelBar({ stage, maxCount }) {
  const width = (stage.count / maxCount) * 100;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{stage.label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>
            {stage.count.toLocaleString()} ({stage.pct}%)
          </span>
          {stage.drop && (
            <span style={{
              fontSize: 11, fontWeight: 700, color: "#ef4444",
              background: "#fef2f2", border: "1px solid #fecaca",
              padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap",
            }}>
              ↓ {stage.drop}%
            </span>
          )}
        </div>
      </div>
      <div style={{ height: 18, background: "#f1f5f9", borderRadius: 20, overflow: "hidden" }}>
        <div style={{ width: `${width}%`, height: "100%", borderRadius: 20, background: stage.color, transition: "width 0.7s" }} />
      </div>
    </div>
  );
}

function KeyInsight() {
  const worst = funnelStages.reduce((a, b) => ((b.drop || 0) > (a.drop || 0) ? b : a));
  const prev = funnelStages[funnelStages.indexOf(worst) - 1];
  return (
    <div style={{
      marginTop: 20, display: "flex", alignItems: "flex-start", gap: 12,
      background: "#fffbeb", border: "1px solid #fcd34d",
      borderRadius: 12, padding: "14px 16px",
    }}>
      <svg style={{ width: 16, height: 16, color: "#f59e0b", marginTop: 2, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
      </svg>
      <p style={{ fontSize: 13, color: "#92400e", lineHeight: 1.6, margin: 0 }}>
        <strong>Key insight:</strong> The largest drop-off occurs between{" "}
        <strong>{prev?.label}</strong> and <strong>{worst.label}</strong> stages ({worst.drop}%).
        Focus on improving final selection conversion through enhanced offer competitiveness.
      </p>
    </div>
  );
}

function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 110, cy = 110, r = 85;
  let startAngle = -90;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const slices = data.map((d) => {
    const angle = (d.value / total) * 360;
    const start = startAngle;
    const end = startAngle + angle;
    startAngle += angle;
    const x1 = cx + r * Math.cos(toRad(start));
    const y1 = cy + r * Math.sin(toRad(start));
    const x2 = cx + r * Math.cos(toRad(end));
    const y2 = cy + r * Math.sin(toRad(end));
    const large = angle > 180 ? 1 : 0;
    const midAngle = start + angle / 2;
    const lx = cx + (r + 22) * Math.cos(toRad(midAngle));
    const ly = cy + (r + 22) * Math.sin(toRad(midAngle));
    return { ...d, path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, lx, ly };
  });

  return (
    <svg viewBox="0 0 220 220" style={{ width: "100%", height: "auto", maxWidth: 220 }}>
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="2" />
      ))}
      {slices.map((s, i) => (
        <text key={i} x={s.lx} y={s.ly} textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fontWeight="600"
          fill={s.color === "#94A3B8" ? "#64748B" : s.color}>
          {s.label} {s.value}%
        </text>
      ))}
    </svg>
  );
}

function LineChart({ data }) {
  const W = 420, H = 220;
  const padL = 36, padR = 12, padT = 16, padB = 30;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const allVals = data.series.flatMap((s) => s.values);
  const maxVal = Math.max(...allVals);
  const yTicks = [0, 250, 500, 750, 1000];
  const xPos = (i) => padL + (i / (data.months.length - 1)) * chartW;
  const yPos = (v) => padT + chartH - (v / maxVal) * chartH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={yPos(t)} x2={W - padR} y2={yPos(t)} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 3" />
          <text x={padL - 6} y={yPos(t) + 3} textAnchor="end" fontSize="9" fill="#94A3B8">{t}</text>
        </g>
      ))}
      {data.series.map((s) => {
        const pts = s.values.map((v, i) => `${xPos(i)},${yPos(v)}`).join(" ");
        return (
          <g key={s.label}>
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" />
            {s.values.map((v, i) => (
              <circle key={i} cx={xPos(i)} cy={yPos(v)} r="3.5" fill="white" stroke={s.color} strokeWidth="2" />
            ))}
          </g>
        );
      })}
      {data.months.map((m, i) => (
        <text key={m} x={xPos(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#94A3B8">{m}</text>
      ))}
    </svg>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function Reports() {
  const [period, setPeriod] = useState("Custom");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("selected");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = [...collegeData]
    .filter((r) => r.college.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDir === "desc" ? b[sortCol] - a[sortCol] : a[sortCol] - b[sortCol]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const SortIcon = ({ col }) => (
    <span style={{ marginLeft: 4, fontSize: 11, color: sortCol === col ? "#3b82f6" : "#d1d5db" }}>
      {sortCol === col ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
    </span>
  );

  const tableCols = [
    { key: "applied",     label: "Applied" },
    { key: "screened",    label: "Screened" },
    { key: "trained",     label: "Trained" },
    { key: "shortlisted", label: "Shortlisted" },
    { key: "selected",    label: "Selected" },
  ];

  const card = {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  };

  return (
    <div style={{ minHeight: "100%", padding: "0 0 32px" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.2 }}>Reports & Analytics</h1>
          <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>Comprehensive insights into your recruitment performance</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <PeriodDropdown period={period} setPeriod={setPeriod} />
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 13, background: "#2563eb", color: "#fff",
            border: "none", borderRadius: 8, padding: "9px 16px",
            cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap",
          }}>
            <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Core KPIs ── */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
            Core Recruitment KPIs
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { label: "TOTAL APPLICANTS", value: "1,348", sub: "↗ 18% vs. prior period", subColor: "#16a34a" },
              { label: "TOTAL HIRED",      value: "55",    sub: "↗ 12% offer acceptance", subColor: "#16a34a" },
              { label: "SELECTION RATIO",  value: "4.1%",  sub: "from application stage",  subColor: "#9ca3af" },
            ].map((kpi, i) => (
              <div key={i} style={{ ...card, padding: "20px 24px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 8px" }}>
                  {kpi.label}
                </p>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 4px", lineHeight: 1.2 }}>{kpi.value}</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: kpi.subColor, margin: 0 }}>{kpi.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Candidate Conversion Funnel ── */}
        <div style={{ ...card, padding: "24px" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Candidate conversion funnel</h2>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px" }}>
            Pipeline stages: Applied → Screened → Trained → Shortlisted → Selected
          </p>
          {funnelStages.map((stage) => (
            <FunnelBar key={stage.label} stage={stage} maxCount={1348} />
          ))}
          <KeyInsight />
        </div>

        {/* ── Pie + Line charts ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Hiring Success Rate */}
          <div style={{ ...card, padding: "24px", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Hiring Success Rate</h2>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 16px" }}>Overall pipeline distribution</p>
            <div style={{ display: "flex", justifyContent: "center", flex: 1, alignItems: "center", padding: "8px 0" }}>
              <PieChart data={pieData} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", justifyContent: "center", marginTop: 12 }}>
              {pieData.map((d) => (
                <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{d.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Hiring Trends */}
          <div style={{ ...card, padding: "24px", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Monthly Hiring Trends</h2>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 16px" }}>Jan – May 2026</p>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <LineChart data={lineData} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: 12 }}>
              {lineData.series.map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 20, height: 2, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── College-wise Hiring Report ── */}
        <div style={{ ...card, overflow: "hidden" }}>
          {/* Card header */}
          <div style={{
            padding: "16px 24px", borderBottom: "1px solid #f1f5f9",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
          }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>College-wise hiring report (Q1)</h2>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Breakdown by institution across pipeline stages</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <svg style={{ width: 14, height: 14, position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
                  fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search college..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    fontSize: 13, border: "1px solid #e5e7eb", borderRadius: 8,
                    padding: "8px 12px 8px 30px", outline: "none", width: 180,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>
                    College
                  </th>
                  {tableCols.map((c) => (
                    <th key={c.key}
                      onClick={() => handleSort(c.key)}
                      style={{ padding: "12px 20px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap", cursor: "pointer" }}>
                      {c.label}<SortIcon col={c.key} />
                    </th>
                  ))}
                  <th style={{ padding: "12px 20px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>
                    Success Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#111827" }}>{row.college}</td>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: "#6b7280", textAlign: "right" }}>{row.applied}</td>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: "#6b7280", textAlign: "right" }}>{row.screened}</td>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: "#6b7280", textAlign: "right" }}>{row.trained}</td>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: "#6b7280", textAlign: "right" }}>{row.shortlisted}</td>
                    <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#111827", textAlign: "right" }}>{row.selected}</td>
                    <td style={{ padding: "14px 20px", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                        <div style={{ width: 64, height: 6, background: "#f1f5f9", borderRadius: 20, overflow: "hidden" }}>
                          <div style={{ width: `${(row.rate / 15) * 100}%`, height: "100%", background: "#22d3ee", borderRadius: 20 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#0891b2", minWidth: 36, textAlign: "right" }}>{row.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{ padding: "12px 24px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "#9ca3af" }}>
            <span>Showing {filtered.length} of {collegeData.length} colleges</span>
            <div style={{ display: "flex", gap: 4 }}>
              {["←", "1", "2", "3", "→"].map((p, i) => (
                <button key={i} style={{
                  width: 30, height: 30, borderRadius: 8, fontSize: 12, border: "none", cursor: "pointer",
                  background: p === "1" ? "#2563eb" : "transparent",
                  color: p === "1" ? "#fff" : "#9ca3af", fontWeight: p === "1" ? 600 : 400,
                }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
