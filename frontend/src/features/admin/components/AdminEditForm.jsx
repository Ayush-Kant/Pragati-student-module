// AdminEditForm.jsx – 4-step onboarding wizard form content
import { useState } from "react";
import AdminAvatarUpload from "./AdminAvatarUpload";

const inputStyle = {
  width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10,
  padding: "11px 14px", fontSize: 14, color: "#1e293b", outline: "none",
  background: "#fff", boxSizing: "border-box", fontFamily: "inherit",
  transition: "border-color .15s",
};
const labelStyle = { display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 };
const fieldWrap = { marginBottom: 18 };

/* ─── STEP 1 ─────────────────────────────────────────────── */
export const Step1 = ({ data, setData }) => (
  <div>
    <div style={{ marginBottom: 28 }}>
      <div style={{ width: 40, height: 4, background: "linear-gradient(90deg,#6366f1,#a855f7)", borderRadius: 99, marginBottom: 16 }} />
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>Basic Information</h2>
      <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Help us build your professional profile. These details will be visible to potential mentees.</p>
    </div>

    <AdminAvatarUpload
      avatarUrl={data.avatar}
      fullName={data.fullName}
      setValue={(_, v) => setData({ ...data, avatar: v })}
    />

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={fieldWrap}>
        <label style={labelStyle}>Full Name</label>
        <input style={inputStyle} placeholder="e.g. Alex Rivera" value={data.fullName || ""} onChange={e => setData({ ...data, fullName: e.target.value })} />
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>Display Title</label>
        <input style={inputStyle} placeholder="e.g. Senior Software Architect" value={data.displayTitle || ""} onChange={e => setData({ ...data, displayTitle: e.target.value })} />
      </div>
    </div>

    <div style={fieldWrap}>
      <label style={labelStyle}>Email Address</label>
      <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: 10, background: "#fff", padding: "0 14px", height: 48, gap: 8 }}>
        <span style={{ color: "#94a3b8" }}>✉</span>
        <input style={{ border: "none", outline: "none", fontSize: 14, color: "#1e293b", flex: 1, background: "transparent", fontFamily: "inherit" }}
          placeholder="alex@company.com" value={data.email || ""} onChange={e => setData({ ...data, email: e.target.value })} />
      </div>
    </div>

    <div style={fieldWrap}>
      <label style={labelStyle}>Professional Bio</label>
      <textarea style={{ ...inputStyle, resize: "vertical" }} rows={4}
        placeholder="Briefly describe your mentorship style and professional background..."
        value={data.bio || ""} onChange={e => setData({ ...data, bio: e.target.value })} />
    </div>
  </div>
);

/* ─── STEP 2 ─────────────────────────────────────────────── */
export const Step2 = ({ data, setData }) => {
  const bioLen = (data.bio2 || "").length;
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", letterSpacing: 2, marginBottom: 8 }}>STEP 02</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Complete your professional profile</h2>
        <p style={{ fontSize: 14, color: "#64748b", maxWidth: 480, margin: "0 auto" }}>Your profile is the first thing mentees see. Make it stand out.</p>
      </div>

      <div style={{ border: "1.5px solid #e2e8f0", borderLeft: "4px solid #6366f1", borderRadius: 12, padding: 20, marginBottom: 18, background: "#fafafe" }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 10 }}>Professional Bio</div>
        <textarea style={{ ...inputStyle, resize: "vertical" }} rows={5}
          placeholder="Share your journey, key achievements, and what motivates you to mentor others..."
          value={data.bio2 || ""} onChange={e => setData({ ...data, bio2: e.target.value.slice(0, 500) })} />
        <div style={{ textAlign: "right", fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{bioLen} / 500</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
        {[
          { key: "linkedin", icon: "🔗", label: "LinkedIn URL", ph: "https://linkedin.com/in/username", accent: "#22c55e" },
          { key: "github", icon: "🌐", label: "GitHub / Portfolio", ph: "https://github.com/username", accent: "#f97316" },
        ].map(({ key, icon, label, ph, accent }) => (
          <div key={key} style={{ border: "1.5px solid #e2e8f0", borderLeft: `4px solid ${accent}`, borderRadius: 12, padding: 16, background: "#fafafe" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span>{icon}</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{label}</span>
            </div>
            <input style={inputStyle} placeholder={ph} value={data[key] || ""} onChange={e => setData({ ...data, [key]: e.target.value })} />
          </div>
        ))}
      </div>

      <div style={{ border: "1.5px solid #e2e8f0", borderLeft: "4px solid #6366f1", borderRadius: 12, padding: 20, background: "#fafafe" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Industry Certifications</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Upload AWS, PMP, or other credentials.</div>
          </div>
          <button style={{ background: "#ede9fe", color: "#6366f1", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Add New</button>
        </div>
        <div style={{ border: "2px dashed #c4b5fd", borderRadius: 10, padding: "30px 20px", textAlign: "center", background: "#f5f3ff", cursor: "pointer" }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>📄</div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a", marginBottom: 2 }}>Click or drag to upload files</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>PDF, PNG, JPG (Max 5MB)</div>
        </div>
      </div>
    </div>
  );
};

/* ─── STEP 3 ─────────────────────────────────────────────── */
const EXP_OPTS = ["Frontend Architecture", "UI/UX Systems", "Backend Scaling", "Product Strategy", "DevOps", "Machine Learning"];
const LEVELS = ["BEGINNER", "INTERMEDIATE", "EXPERT"];
const LV = { EXPERT: { bg: "#d1fae5", color: "#059669" }, INTERMEDIATE: { bg: "#ede9fe", color: "#6d28d9" }, BEGINNER: { bg: "#dbeafe", color: "#2563eb" } };

export const Step3 = ({ data, setData }) => {
  const [newName, setNewName] = useState("");
  const [newLvl, setNewLvl] = useState("BEGINNER");
  const expertise = data.expertise || [];
  const skills = data.coreSkills || [];

  const toggleTag = tag => {
    const u = expertise.includes(tag) ? expertise.filter(t => t !== tag) : [...expertise, tag];
    setData({ ...data, expertise: u });
  };

  return (
    <div style={{ border: "1.5px solid #e2e8f0", borderLeft: "4px solid #22c55e", borderRadius: 14, padding: 28 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Experience & Expertise</h2>
      <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>Tell us about your professional background and specializations.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div>
          <label style={labelStyle}>Current Designation</label>
          <input style={inputStyle} placeholder="e.g. Senior Staff Engineer" value={data.designation || ""} onChange={e => setData({ ...data, designation: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Years of Experience</label>
          <select style={{ ...inputStyle }} value={data.yearsExp || ""} onChange={e => setData({ ...data, yearsExp: e.target.value })}>
            <option value="">Select experience</option>
            {["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Expertise Areas</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {EXP_OPTS.map(tag => {
            const on = expertise.includes(tag);
            return (
              <button key={tag} onClick={() => toggleTag(tag)} style={{
                borderRadius: 99, padding: "7px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer",
                border: `1.5px solid ${on ? "#6366f1" : "#e2e8f0"}`,
                background: on ? "#eef2ff" : "#fff", color: on ? "#4f46e5" : "#475569",
              }}>
                {tag}{on && " ×"}
              </button>
            );
          })}
          <button style={{ borderRadius: 99, padding: "7px 16px", fontSize: 13, border: "1.5px dashed #c7d2fe", background: "transparent", color: "#6366f1", cursor: "pointer", fontWeight: 700 }}>+ Add Other</button>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Top Core Skills</label>
        <div style={{ border: "1.5px dashed #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
          {skills.map((sk, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12, fontSize: 14 }}>
                {sk.name.includes("React") ? "⌨" : "✏"}
              </div>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{sk.name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "3px 8px", marginRight: 12, background: (LV[sk.level] || LV.BEGINNER).bg, color: (LV[sk.level] || LV.BEGINNER).color }}>{sk.level}</span>
              <button onClick={() => setData({ ...data, coreSkills: skills.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 15 }}>🗑</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, padding: 12, background: "#fafafa" }}>
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Skill name" value={newName} onChange={e => setNewName(e.target.value)} />
            <select style={{ ...inputStyle, width: 140 }} value={newLvl} onChange={e => setNewLvl(e.target.value)}>
              {LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
            <button onClick={() => { if (!newName.trim()) return; setData({ ...data, coreSkills: [...skills, { name: newName, level: newLvl }] }); setNewName(""); setNewLvl("BEGINNER"); }}
              style={{ background: "none", border: "1.5px dashed #cbd5e1", borderRadius: 8, padding: "0 16px", cursor: "pointer", fontSize: 13, color: "#475569", fontWeight: 600, whiteSpace: "nowrap" }}>
              + Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── STEP 4 ─────────────────────────────────────────────── */
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const SLOTS = ["09:00 AM", "02:00 PM", "07:00 PM"];

export const Step4 = ({ data, setData }) => {
  const sel = data.availability || {};
  const toggle = (day, slot) => {
    const k = `${day}_${slot}`;
    const u = { ...sel };
    if (u[k]) delete u[k]; else u[k] = true;
    setData({ ...data, availability: u });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>Weekly Availability</h2>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Select slots for 1:1 mentorship sessions. Adjustable later.</p>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📅</div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "5px 5px", minWidth: 560 }}>
          <thead>
            <tr>
              <th style={{ width: 90 }} />
              {DAYS.map(d => <th key={d} style={{ fontSize: 11, fontWeight: 700, color: "#475569", textAlign: "center", paddingBottom: 6 }}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map(slot => (
              <tr key={slot}>
                <td style={{ fontSize: 12, color: "#64748b", fontWeight: 600, verticalAlign: "middle", paddingRight: 8, whiteSpace: "nowrap" }}>
                  <div>{slot}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>(45 mins)</div>
                </td>
                {DAYS.map(day => {
                  const on = !!sel[`${day}_${slot}`];
                  return (
                    <td key={day}>
                      <div onClick={() => toggle(day, slot)} style={{
                        border: `1.5px solid ${on ? "#22c55e" : "#e2e8f0"}`,
                        borderRadius: 10, background: on ? "#f0fdf4" : "#fafafa",
                        color: on ? "#16a34a" : "#cbd5e1", fontSize: on ? 11 : 18,
                        fontWeight: on ? 700 : 400, cursor: "pointer",
                        padding: "11px 4px", textAlign: "center", userSelect: "none",
                        transition: "all .15s",
                      }}>
                        {on ? <><div>{slot}</div><div style={{ fontSize: 10 }}>Selected</div></> : "+"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 12, background: "#eef2ff", borderRadius: 12, padding: "14px 16px", marginTop: 20 }}>
        <span style={{ fontSize: 18, color: "#6366f1", flexShrink: 0 }}>ℹ</span>
        <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
          Standard sessions are 45 minutes long. Configure timezone and buffer times in settings after registration.
        </p>
      </div>
    </div>
  );
};

/* ─── Router ──────────────────────────────────────────────── */
const AdminEditForm = ({ step, data, setData }) => {
  const Map = { 1: Step1, 2: Step2, 3: Step3, 4: Step4 };
  const F = Map[step] || Step1;
  return <F data={data} setData={setData} />;
};

export default AdminEditForm;
