import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, ResponsiveContainer } from "recharts";

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

const trendData = [
  { v: 55 }, { v: 60 }, { v: 58 }, { v: 65 }, { v: 63 }, { v: 70 }, { v: 72 },
];

const progressData = [
  { name: "Excellent", value: 12, percent: 25 },
  { name: "Good", value: 18, percent: 37 },
  { name: "Average", value: 12, percent: 25 },
  { name: "Needs Improvement", value: 6, percent: 13 },
];

const upcomingSessions = [
  { id: 1, topic: "UI/UX Design Session", mentor: "Riya Sharma", date: "24 May, 2025", time: "11:00 AM", color: "#ec4899" },
  { id: 2, topic: "Mock Interview", mentor: "Arjun Verma", date: "24 May, 2025", time: "02:00 PM", color: "#3b82f6" },
  { id: 3, topic: "Career Guidance", mentor: "Neha Patel", date: "25 May, 2025", time: "10:00 AM", color: "#10b981" },
];

const notifications = [
  { id: 1, text: "Riya Sharma completed assessment UI/UX Fundamentals", time: "2h ago", color: "#3b82f6", icon: "📋" },
  { id: 2, text: "Arjun Verma submitted project Portfolio Website", time: "4h ago", color: "#f97316", icon: "📁" },
  { id: 3, text: "Neha Patel joined session Career Guidance", time: "6h ago", color: "#10b981", icon: "👤" },
  { id: 4, text: "Karan Singh completed task Resume Optimization", time: "1d ago", color: "#a855f7", icon: "✅" },
];

const domains = [
  { name: "Web Development", count: 16, color: "#3b82f6" },
  { name: "UI/UX Design", count: 12, color: "#10b981" },
  { name: "Data Science", count: 8, color: "#f59e0b" },
  { name: "Digital Marketing", count: 7, color: "#ef4444" },
  { name: "Others", count: 5, color: "#a855f7" },
];

const leaderboard = [
  { id: 1, name: "Riya Sharma", domain: "UI/UX Design", score: 92, color: "#ec4899", medal: "#fbbf24" },
  { id: 2, name: "Arjun Verma", domain: "Web Development", score: 89, color: "#3b82f6", medal: "#94a3b8" },
  { id: 3, name: "Neha Patel", domain: "Data Science", score: 87, color: "#10b981", medal: "#cd7c32" },
];

const statCards = [
  { label: "Total Mentees", value: 48, trend: "+12 this month", icon: "👥", iconBg: "#dbeafe", numColor: "#1d4ed8" },
  { label: "Active Sessions", value: 16, trend: "+4 this week", icon: "📅", iconBg: "#dcfce7", numColor: "#15803d" },
  { label: "Assessments", value: 24, trend: "+6 this month", icon: "📋", iconBg: "#ffedd5", numColor: "#c2410c" },
  { label: "Tasks Assigned", value: 36, trend: "+8 this week", icon: "🟣", iconBg: "#f3e8ff", numColor: "#7e22ce" },
  { label: "Placement Progress", value: "72%", trend: "+9% this month", icon: "🎯", iconBg: "#fce7f3", numColor: "#be185d" },
];

const sidebarItems = [
  { name: "Dashboard", bg: "#3b82f6", icon: "⊞" },
  { name: "My Mentees", bg: "#10b981", icon: "👥" },
  { name: "Sessions", bg: "#f97316", icon: "📅" },
  { name: "Assessments", bg: "#a855f7", icon: "📋" },
  { name: "Tasks & Assignments", bg: "#14b8a6", icon: "✅" },
  { name: "Reports & Analytics", bg: "#ec4899", icon: "📊" },
  { name: "Resources", bg: "#eab308", icon: "📚" },
  { name: "Calendar", bg: "#6366f1", icon: "🗓" },
  { name: "Messages", bg: "#06b6d4", icon: "💬" },
  { name: "Notifications", bg: "#ef4444", icon: "🔔" },
  { name: "Settings", bg: "#6b7280", icon: "⚙️" },
];

/* ── Mini dashboard mockup SVG shown in banner ── */
function MockupSVG() {
  return (
    <svg width="160" height="108" viewBox="0 0 160 108" style={{ borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}>
      <rect width="160" height="108" rx="10" fill="#1e293b" />
      {/* top bar */}
      <rect x="0" y="0" width="160" height="18" rx="10" fill="#0f172a" />
      <circle cx="10" cy="9" r="3" fill="#ef4444" />
      <circle cx="20" cy="9" r="3" fill="#f59e0b" />
      <circle cx="30" cy="9" r="3" fill="#10b981" />
      {/* sidebar */}
      <rect x="0" y="18" width="32" height="90" fill="#0f172a" />
      <rect x="4" y="24" width="24" height="5" rx="2" fill="#3b82f6" />
      <rect x="4" y="33" width="24" height="5" rx="2" fill="#1e293b" />
      <rect x="4" y="42" width="24" height="5" rx="2" fill="#1e293b" />
      <rect x="4" y="51" width="24" height="5" rx="2" fill="#1e293b" />
      {/* stat cards */}
      <rect x="36" y="22" width="28" height="18" rx="3" fill="#3b82f6" opacity="0.8" />
      <rect x="68" y="22" width="28" height="18" rx="3" fill="#10b981" opacity="0.8" />
      <rect x="100" y="22" width="28" height="18" rx="3" fill="#f59e0b" opacity="0.8" />
      <rect x="132" y="22" width="24" height="18" rx="3" fill="#a855f7" opacity="0.8" />
      {/* chart area */}
      <rect x="36" y="44" width="56" height="38" rx="3" fill="#1e40af" opacity="0.5" />
      <rect x="96" y="44" width="60" height="38" rx="3" fill="#065f46" opacity="0.5" />
      {/* donut hint */}
      <circle cx="64" cy="63" r="14" fill="none" stroke="#60a5fa" strokeWidth="7" opacity="0.7" />
      {/* bar chart */}
      <rect x="100" y="60" width="8" height="22" rx="2" fill="#34d399" opacity="0.8" />
      <rect x="112" y="52" width="8" height="30" rx="2" fill="#34d399" opacity="0.8" />
      <rect x="124" y="56" width="8" height="26" rx="2" fill="#34d399" opacity="0.8" />
      <rect x="136" y="48" width="8" height="34" rx="2" fill="#34d399" opacity="0.8" />
      {/* bottom row */}
      <rect x="36" y="86" width="56" height="14" rx="3" fill="#7c3aed" opacity="0.5" />
      <rect x="96" y="86" width="60" height="14" rx="3" fill="#be185d" opacity="0.5" />
    </svg>
  );
}

/* ── Decorative blob ── */
function Blob({ color, size, top, right, left, bottom, opacity = 0.55 }) {
  return (
    <div style={{
      position: "absolute", width: size, height: size,
      borderRadius: "50%", background: color,
      top, right, left, bottom,
      opacity, filter: "blur(2px)", pointerEvents: "none",
    }} />
  );
}

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100%",
      fontFamily: "Inter, Arial, sans-serif",
      background: "#f1f5f9", overflow: "hidden",
    }}>

      {/* ══ SIDEBAR ══ */}
      <div style={{
        width: "208px", minWidth: "208px", background: "#fff",
        display: "flex", flexDirection: "column",
        boxShadow: "2px 0 8px rgba(0,0,0,0.07)", overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ fontSize: "26px" }}>🦉</div>
            <div>
              <div>
                <span style={{ fontWeight: 900, color: "#f97316", fontSize: "15px" }}>UPTO</span>
                <span style={{ fontWeight: 900, color: "#2563eb", fontSize: "15px" }}>SKILLS</span>
              </div>
              <div style={{ fontSize: "8px", color: "#94a3b8" }}>Transform Your Career Path</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "5px 12px", fontSize: "15px", color: "#94a3b8", cursor: "pointer", flexShrink: 0 }}>☰</div>

        {/* Menu Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 6px" }}>
          {sidebarItems.map((item, i) => (
            <div key={i} onClick={() => setActive(item.name)} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "6px 8px", borderRadius: "9px", cursor: "pointer", marginBottom: "1px",
              background: active === item.name ? "#eff6ff" : "transparent",
              color: active === item.name ? "#2563eb" : "#64748b",
              fontWeight: active === item.name ? 700 : 500, fontSize: "11.5px",
            }}>
              <div style={{
                width: "26px", height: "26px", borderRadius: "7px",
                background: item.bg, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "12px", flexShrink: 0, color: "#fff",
              }}>{item.icon}</div>
              {item.name}
            </div>
          ))}
        </div>

        {/* Need Help */}
        <div style={{ padding: "8px", flexShrink: 0 }}>
          <div style={{ background: "#eff6ff", borderRadius: "12px", padding: "9px", textAlign: "center" }}>
            <div style={{ fontSize: "24px", marginBottom: "2px" }}>🦉</div>
            <div style={{ fontWeight: 700, fontSize: "11px", color: "#1e293b" }}>Need Help?</div>
            <div style={{ fontSize: "9px", color: "#64748b", margin: "2px 0 6px" }}>Our Support Team is here to help you!</div>
            <button style={{
              background: "#fff", border: "1px solid #bfdbfe", color: "#2563eb",
              fontSize: "9px", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", width: "100%",
            }}>Get Support →</button>
          </div>
        </div>
      </div>

      {/* ══ MAIN ══ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* HEADER */}
        <div style={{
          background: "#fff", padding: "7px 18px", display: "flex",
          justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)", flexShrink: 0,
        }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "10px", top: "7px", color: "#94a3b8", fontSize: "12px" }}>🔍</span>
            <input placeholder="Search for opportunities, profiles, leagues..." style={{
              border: "1px solid #e2e8f0", borderRadius: "18px", padding: "6px 12px 6px 28px",
              fontSize: "11px", width: "290px", outline: "none", background: "#f8fafc",
            }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {[["🔔", 8], ["💬", 3]].map(([icon, count], i) => (
              <div key={i} style={{ position: "relative", cursor: "pointer" }}>
                <div style={{ width: "32px", height: "32px", background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{icon}</div>
                <span style={{ position: "absolute", top: "-3px", right: "-3px", background: "#ef4444", color: "#fff", fontSize: "8px", borderRadius: "50%", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{count}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              {/* Avatar with photo-like gradient */}
              <div style={{ width: "34px", height: "34px", background: "linear-gradient(135deg,#f97316,#a855f7)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "14px", border: "2px solid #e2e8f0" }}>A</div>
              <div>
                <div style={{ fontSize: "9px", color: "#94a3b8" }}>Mentor</div>
                <div style={{ fontSize: "12px", fontWeight: 700 }}>Arjun Sharma</div>
              </div>
              <span style={{ color: "#94a3b8", fontSize: "10px" }}>▾</span>
            </div>
            <button style={{ background: "#f97316", color: "#fff", border: "none", padding: "6px 13px", borderRadius: "18px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
              For Enterprise
            </button>
          </div>
        </div>

        {/* ══ CONTENT ══ */}
        <div style={{ flex: 1, padding: "10px 16px", display: "flex", flexDirection: "column", gap: "8px", overflow: "hidden" }}>

          {/* WELCOME BANNER */}
          <div style={{
            background: "linear-gradient(135deg,#eef2ff 0%,#f5f3ff 40%,#fff7ed 100%)",
            borderRadius: "16px", padding: "14px 20px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexShrink: 0, position: "relative", overflow: "hidden",
          }}>
            {/* Decorative blobs */}
            <Blob color="#f9a8d4" size="70px" top="-20px" right="320px" opacity={0.7} />
            <Blob color="#93c5fd" size="50px" top="10px" right="290px" opacity={0.6} />
            <Blob color="#5eead4" size="45px" bottom="-10px" right="360px" opacity={0.55} />
            <Blob color="#c4b5fd" size="35px" top="5px" right="260px" opacity={0.5} />

            {/* Text */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "1px" }}>Welcome back, Arjun Sharma! 👋</div>
              <div style={{ fontSize: "30px", fontWeight: 900, lineHeight: 1, background: "linear-gradient(90deg,#f97316,#a855f7,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Mentor Dashboard
              </div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Empower. Guide. Transform Careers.</div>
              <div style={{ fontSize: "9px", color: "#94a3b8" }}>Track progress, engage mentees, and drive success.</div>
            </div>

            {/* Right side: Owl + Mockup + JOBS tag */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative", zIndex: 1 }}>
              {/* Student avatars floating */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {["#ec4899", "#3b82f6", "#10b981"].map((c, i) => (
                  <div key={i} style={{ width: "32px", height: "32px", borderRadius: "50%", background: `linear-gradient(135deg, ${c}, ${c}aa)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                    {["R", "A", "N"][i]}
                  </div>
                ))}
              </div>
              {/* Mockup */}
              <MockupSVG />
              {/* Owl + JOBS */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ fontSize: "54px", lineHeight: 1 }}>🦉</div>
                <div style={{ background: "#facc15", color: "#fff", fontWeight: 900, fontSize: "13px", padding: "5px 10px", borderRadius: "8px", transform: "rotate(6deg)", boxShadow: "0 3px 8px rgba(0,0,0,0.15)" }}>
                  JOBS
                </div>
              </div>
            </div>
          </div>

          {/* STATS ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "8px", flexShrink: 0 }}>
            {statCards.map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "10px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "6px" }}>
                  <div style={{ width: "28px", height: "28px", background: s.iconBg, borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{s.icon}</div>
                  <div style={{ fontSize: "9.5px", color: "#64748b", fontWeight: 600, lineHeight: 1.2 }}>{s.label}</div>
                </div>
                <div style={{ fontSize: "22px", fontWeight: 900, color: s.numColor }}>{s.value}</div>
                <div style={{ fontSize: "9px", color: "#10b981", marginTop: "2px", fontWeight: 600 }}>↑ {s.trend}</div>
              </div>
            ))}
          </div>

          {/* MIDDLE ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", flex: 1, minHeight: 0 }}>

            {/* PIE */}
            <div style={{ background: "#fff", borderRadius: "12px", padding: "10px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontWeight: 700, fontSize: "11px" }}>Mentees Progress Overview</span>
                <span style={{ color: "#3b82f6", fontSize: "10px", cursor: "pointer" }}>View All</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <PieChart width={110} height={110}>
                    <Pie data={progressData} cx={50} cy={50} innerRadius={34} outerRadius={50} dataKey="value" strokeWidth={0}>
                      {progressData.map((e, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <div style={{ fontSize: "17px", fontWeight: 900, color: "#1e293b" }}>48</div>
                    <div style={{ fontSize: "8px", color: "#94a3b8" }}>Mentees</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {progressData.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "9.5px" }}>
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: PIE_COLORS[i], flexShrink: 0 }} />
                      <span style={{ color: "#64748b" }}>{item.name}</span>
                      <span style={{ color: "#94a3b8" }}>{item.value} ({item.percent}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* UPCOMING SESSIONS */}
            <div style={{ background: "#fff", borderRadius: "12px", padding: "10px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: 700, fontSize: "11px" }}>Upcoming Sessions</span>
                <span style={{ color: "#3b82f6", fontSize: "10px", cursor: "pointer" }}>View Calendar</span>
              </div>
              {upcomingSessions.map((s) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "12px", flexShrink: 0 }}>
                    {s.mentor.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "10.5px", fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.topic}</div>
                    <div style={{ fontSize: "9px", color: "#94a3b8" }}>{s.mentor}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "9px", color: "#64748b" }}>📅 {s.date}</div>
                    <div style={{ fontSize: "9px", color: "#94a3b8" }}>🕐 {s.time}</div>
                  </div>
                </div>
              ))}
              <div style={{ color: "#3b82f6", fontSize: "10px", cursor: "pointer", fontWeight: 600, marginTop: "auto" }}>View All Sessions →</div>
            </div>

            {/* RECENT ACTIVITY */}
            <div style={{ background: "#fff", borderRadius: "12px", padding: "10px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: 700, fontSize: "11px" }}>Recent Activity</span>
                <span style={{ color: "#3b82f6", fontSize: "10px", cursor: "pointer" }}>View All</span>
              </div>
              {notifications.map((n) => (
                <div key={n.id} style={{ display: "flex", alignItems: "flex-start", gap: "7px", marginBottom: "8px" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: n.color + "22", border: `1.5px solid ${n.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", flexShrink: 0 }}>
                    {n.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "10px", fontWeight: 600, color: "#1e293b", lineHeight: 1.3 }}>{n.text}</div>
                  </div>
                  <div style={{ fontSize: "9px", color: "#94a3b8", flexShrink: 0 }}>{n.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", flex: 1, minHeight: 0 }}>

            {/* MENTEES BY DOMAIN */}
            <div style={{ background: "#fff", borderRadius: "12px", padding: "10px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: 700, fontSize: "11px" }}>Mentees by Domain</span>
                <span style={{ color: "#3b82f6", fontSize: "10px", cursor: "pointer" }}>View Report</span>
              </div>
              {domains.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "7px" }}>
                  <span style={{ fontSize: "9.5px", color: "#64748b", width: "100px", flexShrink: 0 }}>{item.name}</span>
                  <div style={{ flex: 1, background: "#f1f5f9", borderRadius: "10px", height: "7px" }}>
                    <div style={{ height: "7px", borderRadius: "10px", background: item.color, width: `${(item.count / 16) * 100}%` }} />
                  </div>
                  <span style={{ fontSize: "9.5px", fontWeight: 700, color: "#1e293b", width: "14px" }}>{item.count}</span>
                </div>
              ))}
            </div>

            {/* JOB READINESS SCORE */}
            <div style={{ background: "#fff", borderRadius: "12px", padding: "10px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontWeight: 700, fontSize: "11px" }}>Job Readiness Score</span>
                <span style={{ color: "#3b82f6", fontSize: "10px", cursor: "pointer" }}>View Analytics</span>
              </div>
              <div style={{ fontSize: "9px", color: "#94a3b8", marginBottom: "2px" }}>Your mentees average job readiness score.</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                {/* Gauge */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <PieChart width={130} height={75}>
                    <Pie
                      data={[{ value: 72 }, { value: 28 }]}
                      cx={63} cy={72} innerRadius={46} outerRadius={62}
                      startAngle={180} endAngle={0} dataKey="value" strokeWidth={0}>
                      <Cell fill="#10b981" />
                      <Cell fill="#e2e8f0" />
                    </Pie>
                  </PieChart>
                  <div style={{ position: "absolute", bottom: 0, width: "100%", textAlign: "center" }}>
                    <div style={{ fontSize: "20px", fontWeight: 900, color: "#1e293b" }}>72%</div>
                    <div style={{ fontSize: "10px", color: "#10b981", fontWeight: 700 }}>Good</div>
                  </div>
                </div>
                {/* Trend line chart */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                  <ResponsiveContainer width="100%" height={55}>
                    <LineChart data={trendData}>
                      <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ fontSize: "10px", color: "#10b981", fontWeight: 600 }}>↑ +8% from last month</div>
                </div>
              </div>
            </div>

            {/* TOP PERFORMING MENTEES */}
            <div style={{ background: "#fff", borderRadius: "12px", padding: "10px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: 700, fontSize: "11px" }}>Top Performing Mentees</span>
                <span style={{ color: "#3b82f6", fontSize: "10px", cursor: "pointer" }}>View Leaderboard</span>
              </div>
              {leaderboard.map((s, i) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: s.medal, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "9px", fontWeight: 900, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: `linear-gradient(135deg, ${s.color}, ${s.color}aa)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "12px", flexShrink: 0 }}>
                    {s.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#1e293b" }}>{s.name}</div>
                    <div style={{ fontSize: "9px", color: "#3b82f6" }}>{s.domain}</div>
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#3b82f6" }}>{s.score}%</div>
                </div>
              ))}
              <div style={{ color: "#3b82f6", fontSize: "10px", cursor: "pointer", fontWeight: 600, marginTop: "auto" }}>View Full Leaderboard →</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
