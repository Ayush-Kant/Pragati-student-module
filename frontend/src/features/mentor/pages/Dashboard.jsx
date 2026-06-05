// MentorDashboard.jsx
import React from "react";
import useMentorDashboard from "../hooks/useMentorDashboard";
import StatsRow from "../components/StatsRow";
import UpcomingSessionsList from "../components/UpcomingSessionsList";
import TopStudentsLeaderboard from "../components/TopStudentsLeaderboard";
import NotificationsFeed from "../components/NotificationsFeed";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from "recharts";

const PIE_COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];
const BAR_COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const Dashboard = () => {
  const { data, loading, error } = useMentorDashboard();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8f9fc" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "4px solid #4F46E5", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }}></div>
        <p style={{ color: "#6B7280", fontSize: "14px" }}>Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ background: "#FEF2F2", color: "#DC2626", padding: "16px", margin: "24px", borderRadius: "12px", border: "1px solid #FCA5A5" }}>
      ❌ {error}
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f8f9fc", fontFamily: "'Segoe UI', sans-serif", position: "relative" }}>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        width: "200px", minWidth: "200px", background: "#fff",
        boxShadow: "2px 0 8px rgba(0,0,0,0.06)", display: "flex",
        flexDirection: "column", padding: "16px 12px", gap: "2px",
        overflowY: "auto", zIndex: 50,
        position: windowWidth < 768 ? "fixed" : "relative",
        left: windowWidth < 768 ? (sidebarOpen ? "0" : "-200px") : "0",
        top: 0, height: "100vh",
        transition: "left 0.3s ease"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ fontSize: "18px", fontWeight: "800", color: "#FF6B35", paddingLeft: "8px" }}>
            UptoSkills
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ display: windowWidth < 768 ? "block" : "none", background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}
          >✕</button>
        </div>

        {[
          { label: "Dashboard", icon: "🏠" },
          { label: "My Mentees", icon: "👥" },
          { label: "Sessions", icon: "📅" },
          { label: "Assessments", icon: "📋" },
          { label: "Tasks & Assignments", icon: "✅" },
          { label: "Reports & Analytics", icon: "📊" },
          { label: "Resources", icon: "📚" },
          { label: "Calendar", icon: "🗓️" },
          { label: "Messages", icon: "💬" },
          { label: "Notifications", icon: "🔔" },
          { label: "Settings", icon: "⚙️" },
        ].map((item, i) => (
          <div key={i} style={{
            padding: "8px 10px", borderRadius: "8px", cursor: "pointer", fontSize: "12px",
            display: "flex", alignItems: "center", gap: "8px",
            background: item.label === "Dashboard" ? "#EEF2FF" : "transparent",
            color: item.label === "Dashboard" ? "#4F46E5" : "#6B7280",
            fontWeight: item.label === "Dashboard" ? "600" : "400",
          }}>
            <span>{item.icon}</span>
            {item.label}
          </div>
        ))}

        <div style={{ marginTop: "auto", background: "#EEF2FF", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
          <div style={{ fontSize: "24px" }}>🦉</div>
          <p style={{ fontSize: "10px", color: "#4F46E5", fontWeight: "600", margin: "4px 0 2px" }}>Need Help?</p>
          <p style={{ fontSize: "9px", color: "#6B7280" }}>Our Support Team is here to help you!</p>
          <button style={{
            marginTop: "6px", background: "#4F46E5", color: "#fff",
            border: "none", borderRadius: "6px", padding: "4px 10px",
            fontSize: "10px", cursor: "pointer"
          }}>Get Support →</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Top Nav */}
        <div style={{
          background: "#fff", padding: "10px 16px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)", flexShrink: 0,
          gap: "10px", flexWrap: "wrap"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                display: windowWidth < 768 ? "block" : "none",
                background: "none", border: "none", fontSize: "20px", cursor: "pointer"
              }}
            >☰</button>
            <input
              type="text"
              placeholder="Search..."
              style={{
                border: "1px solid #E5E7EB", borderRadius: "20px",
                padding: "6px 16px", fontSize: "12px",
                width: windowWidth < 640 ? "130px" : "260px",
                outline: "none"
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: "30px", height: "30px", background: "#FEE2E2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>🔔</div>
              <div style={{ position: "absolute", top: 0, right: 0, width: "7px", height: "7px", background: "#EF4444", borderRadius: "50%" }}></div>
            </div>
            <div style={{ width: "30px", height: "30px", background: "#4F46E5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: "700" }}>A</div>
            <button style={{
              background: "#FF6B35", color: "#fff", border: "none",
              borderRadius: "16px", padding: "5px 10px", fontSize: "10px",
              fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"
            }}>For Enterprise</button>
          </div>
        </div>

        {/* Dashboard Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>

          {/* Welcome Banner */}
          <div style={{
            background: "linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 50%, #FFF7ED 100%)",
            borderRadius: "16px", padding: "14px 18px", marginBottom: "12px",
            position: "relative", overflow: "hidden"
          }}>
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 2px" }}>Welcome back, Arjun Sharma! 👋</p>
            <h1 style={{
              fontSize: "clamp(18px, 3vw, 28px)", fontWeight: "800", margin: "0 0 4px",
              background: "linear-gradient(90deg, #FF6B35, #8B5CF6, #3B82F6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>Mentor Dashboard</h1>
            <p style={{ fontSize: "10px", color: "#6B7280", margin: 0 }}>Empower. Guide. Transform Careers.</p>
            <p style={{ fontSize: "10px", color: "#6B7280", margin: 0 }}>Track progress, engage mentees, and drive success.</p>
            <div style={{ fontSize: "60px", opacity: 0.1, position: "absolute", right: "10px", top: "-5px" }}>🦉</div>
          </div>

          {/* Stats Row */}
          <StatsRow
            totalMentees={data?.totalMentees}
            activeSessions={data?.activeSessions}
            assessments={data?.assessments}
            tasksAssigned={data?.tasksAssigned}
            placementProgress={data?.placementProgress}
          />

          {/* Middle Row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "12px", marginBottom: "12px"
          }}>
            {/* Pie Chart */}
            <div style={{ background: "#fff", borderRadius: "12px", padding: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <p style={{ fontSize: "12px", fontWeight: "600", color: "#1F2937", margin: 0 }}>Mentees Progress Overview</p>
                <span style={{ fontSize: "10px", color: "#4F46E5", cursor: "pointer" }}>View All</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <div style={{ position: "relative" }}>
                  <PieChart width={110} height={110}>
                    <Pie data={data?.menteesProgress} cx={50} cy={50} innerRadius={30} outerRadius={48} dataKey="value">
                      {data?.menteesProgress?.map((entry, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                    <p style={{ fontSize: "14px", fontWeight: "800", color: "#1F2937", margin: 0 }}>48</p>
                    <p style={{ fontSize: "8px", color: "#6B7280", margin: 0 }}>Mentees</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {data?.menteesProgress?.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }}></div>
                      <span style={{ color: "#374151" }}>{item.name}</span>
                      <span style={{ color: "#9CA3AF" }}>{item.value} ({item.percent}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <UpcomingSessionsList sessions={data?.upcomingSessions} />
            <NotificationsFeed notifications={data?.recentNotifications} />
          </div>

          {/* Bottom Row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "12px"
          }}>
            {/* Mentees by Domain */}
            <div style={{ background: "#fff", borderRadius: "12px", padding: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <p style={{ fontSize: "12px", fontWeight: "600", color: "#1F2937", margin: 0 }}>Mentees by Domain</p>
                <span style={{ fontSize: "10px", color: "#4F46E5", cursor: "pointer" }}>View Report</span>
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={data?.menteesByDomain} layout="vertical" margin={{ left: 0, right: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="domain" tick={{ fontSize: 9 }} width={100} />
                  <Bar dataKey="count" radius={4}>
                    {data?.menteesByDomain?.map((entry, index) => (
                      <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Job Readiness Score */}
            <div style={{
              background: "#fff", borderRadius: "12px", padding: "12px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex",
              flexDirection: "column", alignItems: "center"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "4px" }}>
                <p style={{ fontSize: "12px", fontWeight: "600", color: "#1F2937", margin: 0 }}>Job Readiness Score</p>
                <span style={{ fontSize: "10px", color: "#4F46E5", cursor: "pointer" }}>View Analytics</span>
              </div>
              <PieChart width={140} height={80}>
                <Pie
                  data={[{ value: data?.jobReadinessScore }, { value: 100 - (data?.jobReadinessScore ?? 0) }]}
                  cx={65} cy={70} innerRadius={45} outerRadius={60}
                  startAngle={180} endAngle={0} dataKey="value"
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#E5E7EB" />
                </Pie>
              </PieChart>
              <p style={{ fontSize: "28px", fontWeight: "800", color: "#1F2937", margin: "4px 0 0" }}>{data?.jobReadinessScore}%</p>
              <p style={{ fontSize: "11px", color: "#10B981", margin: 0, fontWeight: "600" }}>Good</p>
              <p style={{ fontSize: "10px", color: "#6B7280", margin: "4px 0 0", textAlign: "center" }}>Your mentees' average job readiness score.</p>
              <p style={{ fontSize: "10px", color: "#10B981", margin: "2px 0 0" }}>↑ +8% improvement from last month</p>
            </div>

            <TopStudentsLeaderboard students={data?.topStudents} />
          </div>

          {/* Bottom padding for mobile */}
          <div style={{ height: "20px" }} />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .sidebar { position: fixed !important; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
