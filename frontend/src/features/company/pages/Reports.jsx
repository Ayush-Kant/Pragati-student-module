import { useState, useRef, useEffect } from "react";

// DATA

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

// COMPONENTS

function PeriodDropdown({ period, setPeriod }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm border border-gray-200 bg-white rounded-lg px-3 sm:px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors font-medium shadow-sm whitespace-nowrap"
      >
        {period}
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
          {periodOptions.map((opt) => (
            <button key={opt}
              onClick={() => { setPeriod(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                ${period === opt ? "text-blue-600 font-semibold bg-blue-50/60" : "text-gray-700 hover:bg-gray-50 font-medium"}`}
            >
              {opt}
              {period === opt && (
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
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
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">{stage.label}</span>
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
            {stage.count.toLocaleString()} ({stage.pct}%)
          </span>
          {stage.drop && (
            <span className="text-[10px] sm:text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
              ↓ {stage.drop}%
            </span>
          )}
        </div>
      </div>
      <div className="h-4 sm:h-5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${width}%`, backgroundColor: stage.color }}
        />
      </div>
    </div>
  );
}

function KeyInsight() {
  const worst = funnelStages.reduce((a, b) => ((b.drop || 0) > (a.drop || 0) ? b : a));
  const prev = funnelStages[funnelStages.indexOf(worst) - 1];
  return (
    <div className="mt-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
      <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
      </svg>
      <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
        <span className="font-bold">Key insight:</span> The largest drop-off occurs between{" "}
        <span className="font-semibold">{prev?.label}</span> and{" "}
        <span className="font-semibold">{worst.label}</span> stages ({worst.drop}%). Focus on improving
        final selection conversion through enhanced offer competitiveness.
      </p>
    </div>
  );
}

function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 110, cy = 110, r = 85; // slightly reduced radius to guarantee labels don't clip
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
    <svg viewBox="0 0 220 220" className="w-full h-auto max-w-[220px]">
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
  const padL = 36, padR = 12, padT = 16, padB = 30; // Optimized spacing for tight layouts
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const allVals = data.series.flatMap((s) => s.values);
  const maxVal = Math.max(...allVals);
  const yTicks = [0, 250, 500, 750, 1000];
  const xPos = (i) => padL + (i / (data.months.length - 1)) * chartW;
  const yPos = (v) => padT + chartH - (v / maxVal) * chartH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
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

// MAIN PAGE

export default function ReportsAnalyticsFull() {
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
    <span className={`ml-1 text-xs ${sortCol === col ? "text-blue-500" : "text-gray-300"}`}>
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

  return (
    <div className="overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-5 flex items-start justify-between z-20 gap-4 mb-5">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight truncate">Reports & Analytics</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">Comprehensive insights into your recruitment performance</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-shrink-0">
          <PeriodDropdown period={period} setPeriod={setPeriod} />
          <button className="flex items-center gap-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg px-3 sm:px-4 py-2 hover:bg-blue-700 transition-colors font-medium shadow-sm whitespace-nowrap">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span className="hidden xs:inline">Export Report</span>
            <span className="xs:hidden">Export</span>
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-0 max-w-9xl mx-auto space-y-6">

        {/* ΓöÇΓöÇ Core KPIs ΓöÇΓöÇ */}
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Core Recruitment KPIs</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {[
              { label: "TOTAL APPLICANTS", value: "1,348", sub: "↑ 18% vs. prior", mobileSub: "↑ 18%", subColor: "text-green-500" },
              { label: "TOTAL HIRED",      value: "55",    sub: "↑ 12% offer accept", mobileSub: "↑ 12%", subColor: "text-green-500" },
              { label: "SELECTION RATIO",  value: "4.1%",  sub: "from application", mobileSub: "from app",  subColor: "text-gray-400", info: true },
            ].map((kpi, i) => (
              <div key={i} className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:px-6 sm:py-5 min-w-0 shadow-sm">
                <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                  <span className="text-[9px] sm:text-xs font-semibold text-gray-400 tracking-wider sm:tracking-widest uppercase truncate">{kpi.label}</span>
                  {kpi.info && (
                    <svg className="w-3 h-3 text-gray-300 flex-shrink-0 hidden xs:block" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
                    </svg>
                  )}
                </div>
                <p className="text-xl sm:text-4xl font-bold text-gray-900 mb-0.5 sm:mb-1 break-words">{kpi.value}</p>
                <p className={`text-[10px] sm:text-sm font-medium ${kpi.subColor} truncate`}>
                  <span className="hidden sm:inline">{kpi.sub}</span>
                  <span className="sm:hidden">{kpi.mobileSub}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ΓöÇΓöÇ Candidate Conversion Funnel + Key Insight ΓöÇΓöÇ */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
          <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-0.5">Candidate conversion funnel</h2>
          <p className="text-xs sm:text-sm text-gray-400 mb-5">
            Pipeline stages: Applied → Screened → Trained → Shortlisted → Selected
          </p>
          {funnelStages.map((stage) => (
            <FunnelBar key={stage.label} stage={stage} maxCount={1348} />
          ))}
          <KeyInsight />
        </div>

        {/* ΓöÇΓöÇ Hiring Success Rate + Monthly Hiring Trends (Stays exactly 2 columns) ΓöÇΓöÇ */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          {/* Hiring Success Rate (Pie) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-5 flex flex-col justify-between shadow-sm min-w-0">
            <div>
              <h2 className="text-xs sm:text-base font-bold text-gray-800 truncate mb-0.5">Hiring Success Rate</h2>
              <p className="text-[11px] sm:text-sm text-gray-400 truncate mb-3">Overall pipeline distribution</p>
            </div>
            <div className="flex items-center justify-center py-2 min-h-[140px] sm:min-h-[220px]">
              <PieChart data={pieData} />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2">
              {pieData.map((d) => (
                <div key={d.label} className="flex items-center gap-1 min-w-0">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">{d.label}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-700 whitespace-nowrap">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Hiring Trends (Line) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-5 flex flex-col justify-between shadow-sm min-w-0">
            <div>
              <h2 className="text-xs sm:text-base font-bold text-gray-800 truncate mb-0.5">Monthly Hiring Trends</h2>
              <p className="text-[11px] sm:text-sm text-gray-400 truncate mb-3">Jan ΓÇô May 2026</p>
            </div>
            <div className="w-full py-2 flex items-center">
              <LineChart data={lineData} />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 justify-start sm:pl-10">
              {lineData.series.map((s) => (
                <div key={s.label} className="flex items-center gap-1 min-w-0">
                  <span className="w-3 sm:w-5 h-0.5 rounded-full inline-block flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ΓöÇΓöÇ College-wise Hiring Report ΓöÇΓöÇ */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-50 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-gray-800 truncate">College-wise hiring report (Q1)</h2>
              <p className="text-xs sm:text-sm text-gray-400 truncate">Breakdown by institution across pipeline stages</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="relative">
                <svg className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-xs sm:text-sm border border-gray-200 rounded-lg pl-8 pr-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 w-24 sm:w-44"
                />
              </div>
              <button className="flex items-center gap-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg px-2.5 py-2 text-gray-500 hover:bg-gray-50 transition-colors font-medium whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2" />
                </svg>
                <span className="hidden xs:inline">Filter</span>
              </button>
            </div>
          </div>

          {/* Secure Table Handling on Small Screens */}
          <div className="overflow-x-auto block w-full whitespace-nowrap">
            <table className="w-full text-xs sm:text-sm min-w-[700px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-400 uppercase tracking-wide">College</th>
                  {tableCols.map((c) => (
                    <th key={c.key}
                      className="px-4 sm:px-6 py-3 text-right font-semibold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-blue-500 select-none"
                      onClick={() => handleSort(c.key)}>
                      {c.label}<SortIcon col={c.key} />
                    </th>
                  ))}
                  <th className="px-4 sm:px-6 py-3 text-right font-semibold text-gray-400 uppercase tracking-wide">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-4 sm:px-6 py-3.5 font-semibold text-gray-800">{row.college}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-right text-gray-500">{row.applied}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-right text-gray-500">{row.screened}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-right text-gray-500">{row.trained}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-right text-gray-500">{row.shortlisted}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-right font-semibold text-gray-800">{row.selected}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 sm:w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden inline-block">
                          <div className="h-full rounded-full bg-cyan-400"
                            style={{ width: `${(row.rate / 15) * 100}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-cyan-600 w-10 text-right inline-block">{row.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 sm:px-6 py-3.5 border-t border-gray-50 flex items-center justify-between text-xs sm:text-sm text-gray-400 gap-2">
            <span className="truncate">Showing {filtered.length} of {collegeData.length} colleges</span>
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              {["←", "1", "2", "3", "→"].map((p, i) => (
                <button key={i}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs transition-colors ${
                    p === "1" ? "bg-blue-600 text-white font-medium" : "hover:bg-gray-100 text-gray-400"
                  }`}>
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
