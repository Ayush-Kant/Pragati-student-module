// AdminProfileCard.jsx
// Sidebar component — has its OWN background colors, no logo

const AdminProfileCard = ({ profile, onEditClick }) => {
  const initial = profile?.fullName?.charAt(0)?.toUpperCase() || "A";

  const StatBox = ({ icon, label, value, bg, color }) => (
    <div style={{
      background: bg, borderRadius: 14, padding: "14px 16px",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: color + "22",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>{label}</div>
        <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 700, marginTop: 2 }}>{value || "—"}</div>
      </div>
    </div>
  );

  return (
    <div style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 14,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>

      {/* ── Avatar card ── */}
      <div style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
        borderRadius: 20, padding: "28px 20px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
        <div style={{ position: "absolute", bottom: -30, left: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />

        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: profile?.avatarUrl ? "transparent" : "linear-gradient(135deg,#818cf8,#a78bfa)",
          margin: "0 auto 12px",
          border: "3px solid rgba(255,255,255,.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 30, fontWeight: 800, color: "#fff", overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,.3)",
        }}>
          {profile?.avatarUrl
            ? <img src={profile.avatarUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
            : initial}
        </div>

        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{profile?.fullName}</div>
        <div style={{ fontSize: 13, color: "#a5b4fc", marginBottom: 10 }}>{profile?.displayTitle}</div>

        <span style={{
          background: "rgba(99,102,241,.35)", color: "#c7d2fe",
          borderRadius: 99, padding: "4px 14px", fontSize: 11, fontWeight: 700,
          letterSpacing: .5, textTransform: "uppercase", border: "1px solid rgba(165,180,252,.3)",
        }}>
          {profile?.role?.replace("_", " ") || "Admin"}
        </span>

        {/* Edit button */}
        <button
          onClick={onEditClick}
          style={{
            marginTop: 16, width: "100%",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            border: "none", borderRadius: 10, padding: "10px",
            color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(99,102,241,.4)",
            transition: "opacity .15s",
          }}
          onMouseEnter={e => e.target.style.opacity = ".85"}
          onMouseLeave={e => e.target.style.opacity = "1"}
        >
          ✏ Edit Profile
        </button>
      </div>

      {/* ── Contact info ── */}
      <div style={{ background: "#f0f9ff", borderRadius: 16, padding: 16, border: "1px solid #bae6fd" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#0369a1", letterSpacing: .5, marginBottom: 12, textTransform: "uppercase" }}>Contact</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <StatBox icon="✉" label="Email" value={profile?.email} bg="#fff" color="#6366f1" />
          <StatBox icon="📞" label="Phone" value={profile?.contactInfo?.phone || profile?.phone} bg="#fff" color="#22c55e" />
          <StatBox icon="🌐" label="Timezone" value={profile?.contactInfo?.timezone} bg="#fff" color="#f59e0b" />
        </div>
      </div>

      {/* ── Role & Permissions ── */}
      <div style={{ background: "#fdf4ff", borderRadius: 16, padding: 16, border: "1px solid #e9d5ff" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#7c3aed", letterSpacing: .5, marginBottom: 12, textTransform: "uppercase" }}>Permissions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {(profile?.permissions || []).map(p => (
            <span key={p} style={{
              background: "#ede9fe", color: "#6d28d9",
              borderRadius: 99, padding: "4px 10px", fontSize: 11, fontWeight: 600,
            }}>
              {p.replace("_", " ")}
            </span>
          ))}
        </div>
      </div>

      {/* ── Social links ── */}
      <div style={{ background: "#f0fdf4", borderRadius: 16, padding: 16, border: "1px solid #bbf7d0" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#15803d", letterSpacing: .5, marginBottom: 12, textTransform: "uppercase" }}>Social Links</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { icon: "🔗", label: "LinkedIn", val: profile?.socialLinks?.linkedin },
            { icon: "💻", label: "GitHub", val: profile?.socialLinks?.github },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 10, padding: "10px 12px" }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: s.val ? "#2563eb" : "#cbd5e1", fontWeight: 600 }}>
                  {s.val || "Not added"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminProfileCard;
