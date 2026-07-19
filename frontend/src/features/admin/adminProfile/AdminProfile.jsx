import { useState, useRef } from "react";
import {
  FiEdit2, FiCamera, FiMail, FiLink, FiGithub, FiTrash2,
  FiPlus, FiChevronDown, FiArrowLeft, FiArrowRight,
  FiCheckCircle, FiInfo, FiCalendar, FiCheck, FiUser,
} from "react-icons/fi";

const EXPERTISE_OPTIONS = [
  "Frontend Architecture", "UI/UX Systems", "Backend Scaling",
  "Product Strategy", "DevOps", "Machine Learning",
];
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const TIME_SLOTS = ["09:00 AM", "02:00 PM", "07:00 PM"];

// ── Stepper ───────────────────────────────────────────────────────────────────
function Stepper({ current }) {
  const steps = [
    { num: 1, label: "Basic Information" },
    { num: 2, label: "Professional Profile" },
    { num: 3, label: "Experience & Links" },
    { num: 4, label: "Availability" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "20px 32px", borderBottom: "1px solid #f0f0f0" }}>
      {steps.map((st, i) => {
        const done = st.num < current;
        const active = st.num === current;
        return (
          <div key={st.num} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: done ? "#22c55e" : active ? "#7c3aed" : "#fff",
                border: done ? "2px solid #22c55e" : active ? "2px solid #7c3aed" : "2px solid #e5e7eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
                color: done || active ? "#fff" : "#9ca3af",
                boxShadow: active ? "0 0 0 4px #ede9fe" : "none",
              }}>
                {done ? <FiCheck size={15} /> : st.num}
              </div>
              <span style={{
                fontSize: 11, fontWeight: active ? 700 : 500,
                color: active ? "#7c3aed" : done ? "#22c55e" : "#9ca3af",
                whiteSpace: "nowrap",
              }}>{st.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 80, height: 2, background: done ? "#22c55e" : "#e5e7eb", margin: "0 8px", marginBottom: 20 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1 ────────────────────────────────────────────────────────────────────
function Step1({ data, onChange }) {
  const fileRef = useRef();
  const checklist = [
    { label: "Basic Identity", done: true },
    { label: "Expertise & Socials", done: false },
    { label: "Experience Links", done: false },
    { label: "Office Hours", done: false },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
      {/* Left */}
      <div>
        <div style={{ width: 56, height: 4, background: "linear-gradient(90deg,#7c3aed,#f97316)", borderRadius: 4, marginBottom: 20 }} />
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>Basic Information</h2>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>Help us build your professional profile. These details will be visible to potential mentees.</p>

        {/* Photo */}
        <div style={{ border: "2px dashed #e5e7eb", borderRadius: 14, padding: 20, marginBottom: 24, display: "flex", gap: 20, alignItems: "center" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            {data.photoUrl
              ? <img src={data.photoUrl} alt="avatar" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
              : <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}><FiUser size={32} color="#7c3aed" /></div>}
            <button onClick={() => fileRef.current.click()} style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: "#7c3aed", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <FiCamera size={13} color="#fff" />
            </button>
            <input type="file" ref={fileRef} style={{ display: "none" }} accept="image/*"
              onChange={e => { const f = e.target.files[0]; if (f) onChange("photoUrl", URL.createObjectURL(f)); }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Profile Photo</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>JPG, GIF or PNG. Max size 2MB.</div>
            <button onClick={() => fileRef.current.click()} style={{ background: "none", border: "none", color: "#7c3aed", fontWeight: 600, fontSize: 14, cursor: "pointer", padding: 0 }}>Upload New Picture</button>
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Full Name</label>
            <input style={iStyle} placeholder="e.g. Alex Rivera" value={data.fullName} onChange={e => onChange("fullName", e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Display Title</label>
            <input style={iStyle} placeholder="e.g. Senior Software Arch" value={data.displayTitle} onChange={e => onChange("displayTitle", e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Email Address</label>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", gap: 8 }}>
            <FiMail size={16} color="#9ca3af" />
            <input style={{ border: "none", outline: "none", flex: 1, fontSize: 14 }} placeholder="alex@company.com" value={data.email} onChange={e => onChange("email", e.target.value)} />
          </div>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Professional Bio</label>
          <textarea style={{ ...iStyle, minHeight: 90, resize: "vertical" }} placeholder="Briefly describe your mentorship style and professional background..." value={data.bio} onChange={e => onChange("bio", e.target.value)} />
        </div>
      </div>

      {/* Right sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "#faf5ff", borderRadius: 14, padding: 20, border: "1px solid #ede9fe" }}>
          <div style={{ fontSize: 22, marginBottom: 8 }}>💡</div>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px" }}>Join the Bridge</h3>
          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, margin: 0 }}>"Sharing your journey isn't just about technical advice; it's about building the confidence of the next generation of talent."</p>
          <div style={{ textAlign: "right", fontSize: 40, marginTop: 8 }}>🦉</div>
        </div>

        <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #f0f0f0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Application Checklist</h3>
          {checklist.map(c => (
            <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: c.done ? "#7c3aed" : "transparent", border: c.done ? "none" : "2px solid #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {c.done && <FiCheck size={11} color="#fff" />}
              </div>
              <span style={{ fontSize: 13, color: c.done ? "#111" : "#6b7280", fontWeight: c.done ? 600 : 400 }}>{c.label}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, color: "#9ca3af" }}>
          Need help? <a href="#" style={{ color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>Contact Support</a>
        </div>
      </div>
    </div>
  );
}

// ── Step 2 ────────────────────────────────────────────────────────────────────
function Step2({ data, onChange }) {
  const fileRef = useRef();
  const charCount = (data.proBio || "").length;
  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", letterSpacing: 2, margin: "0 0 6px" }}>STEP 02</p>
        <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 10px" }}>Complete your professional profile</h2>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Your profile is the first thing mentees see. Let's make it stand out with your achievements and expertise.</p>
      </div>

      {/* Bio */}
      <div style={{ borderRadius: 14, border: "1px solid #e5e7eb", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ display: "flex" }}>
          <div style={{ width: 4, background: "#7c3aed", flexShrink: 0 }} />
          <div style={{ flex: 1, padding: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 700, color: "#374151", display: "block", marginBottom: 12 }}>Professional Bio</label>
            <textarea style={{ ...iStyle, minHeight: 130, resize: "vertical" }} maxLength={500}
              placeholder="Share your professional journey, key achievements, and what motivates you to mentor others..."
              value={data.proBio} onChange={e => onChange("proBio", e.target.value)} />
            <div style={{ textAlign: "right", fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{charCount} / 500 characters</div>
          </div>
        </div>
      </div>

      {/* LinkedIn + GitHub */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ borderRadius: 14, border: "1px solid #e5e7eb", borderTop: "3px solid #22c55e", padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <FiLink size={16} color="#22c55e" />
            <span style={{ fontSize: 14, fontWeight: 700 }}>LinkedIn URL</span>
          </div>
          <input style={iStyle} placeholder="https://linkedin.com/in/username" value={data.linkedin} onChange={e => onChange("linkedin", e.target.value)} />
        </div>
        <div style={{ borderRadius: 14, border: "1px solid #e5e7eb", borderTop: "3px solid #f97316", padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <FiGithub size={16} color="#f97316" />
            <span style={{ fontSize: 14, fontWeight: 700 }}>GitHub / Portfolio</span>
          </div>
          <input style={iStyle} placeholder="https://github.com/username" value={data.github} onChange={e => onChange("github", e.target.value)} />
        </div>
      </div>

      {/* Certifications */}
      <div style={{ borderRadius: 14, border: "1px solid #e5e7eb", borderTop: "3px solid #7c3aed", padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Industry Certifications</div>
            <div style={{ fontSize: 13, color: "#9ca3af" }}>Upload relevant AWS, PMP, or professional credentials.</div>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 4, background: "#ede9fe", color: "#7c3aed", border: "none", borderRadius: 20, padding: "6px 14px", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
            <FiPlus size={13} /> Add New
          </button>
        </div>
        <div onClick={() => fileRef.current.click()} style={{ border: "2px dashed #c4b5fd", borderRadius: 12, padding: "40px 20px", textAlign: "center", cursor: "pointer", background: "#faf5ff" }}>
          <div style={{ width: 48, height: 48, background: "#ede9fe", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <FiPlus size={22} color="#7c3aed" />
          </div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Click or drag to upload files</div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>PDF, PNG, JPG (Max 5MB)</div>
          <input type="file" ref={fileRef} style={{ display: "none" }} multiple accept=".pdf,.png,.jpg,.jpeg"
            onChange={e => { const files = Array.from(e.target.files).map(f => f.name); onChange("certFiles", [...(data.certFiles || []), ...files]); }} />
        </div>
        {(data.certFiles || []).length > 0 && (
          <div style={{ marginTop: 10 }}>
            {data.certFiles.map((f, i) => <div key={i} style={{ fontSize: 13, color: "#7c3aed", padding: "4px 0" }}>📄 {f}</div>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Step 3 ────────────────────────────────────────────────────────────────────
function Step3({ data, onChange }) {
  const [newSkill, setNewSkill] = useState("");
  const [newLevel, setNewLevel] = useState("INTERMEDIATE");

  const toggleTag = tag => {
    const list = data.expertiseTags || [];
    onChange("expertiseTags", list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag]);
  };
  const addSkill = () => {
    if (!newSkill.trim()) return;
    onChange("coreSkills", [...(data.coreSkills || []), { name: newSkill, level: newLevel }]);
    setNewSkill("");
  };
  const removeSkill = i => {
    const s = [...(data.coreSkills || [])];
    s.splice(i, 1);
    onChange("coreSkills", s);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ borderLeft: "4px solid #22c55e", paddingLeft: 20, marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>Experience & Expertise</h2>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Tell us about your professional background and areas of specialization.</p>
      </div>

      {/* Designation + Years */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, display: "block", marginBottom: 8 }}>CURRENT DESIGNATION</label>
          <input style={iStyle} placeholder="e.g. Senior Staff Engineer" value={data.designation} onChange={e => onChange("designation", e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, display: "block", marginBottom: 8 }}>YEARS OF PROFESSIONAL EXPERIENCE</label>
          <div style={{ position: "relative" }}>
            <select style={{ ...iStyle, appearance: "none", paddingRight: 36 }} value={data.yearsExp} onChange={e => onChange("yearsExp", e.target.value)}>
              <option value="">Select experience</option>
              {["0-1 year","1-3 years","3-5 years","5-8 years","8-12 years","12+ years"].map(o => <option key={o}>{o}</option>)}
            </select>
            <FiChevronDown style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }} size={16} />
          </div>
        </div>
      </div>

      {/* Expertise tags */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, display: "block", marginBottom: 12 }}>EXPERTISE AREAS</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {EXPERTISE_OPTIONS.map(tag => {
            const sel = (data.expertiseTags || []).includes(tag);
            return (
              <button key={tag} onClick={() => toggleTag(tag)} style={{
                border: sel ? "1.5px solid #7c3aed" : "1.5px solid #e5e7eb",
                borderRadius: 20, padding: "8px 16px", fontSize: 13, fontWeight: sel ? 600 : 500,
                cursor: "pointer", background: sel ? "#ede9fe" : "#fff", color: sel ? "#7c3aed" : "#374151",
              }}>
                {tag}{sel && " ×"}
              </button>
            );
          })}
          <button style={{ border: "1.5px dashed #e5e7eb", borderRadius: 20, padding: "8px 16px", fontSize: 13, cursor: "pointer", background: "#fff", color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
            <FiPlus size={12} /> Add Other
          </button>
        </div>
      </div>

      {/* Core skills */}
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, display: "block", marginBottom: 12 }}>TOP CORE SKILLS</label>
        <div style={{ border: "1px dashed #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          {(data.coreSkills || []).map((sk, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ width: 36, height: 36, background: "#1e1e2e", color: "#22c55e", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {sk.name.toLowerCase().includes("react") || sk.name.toLowerCase().includes("js") ? "</>" : "✦"}
              </div>
              <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{sk.name}</span>
              <span style={{ borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, background: sk.level === "EXPERT" ? "#dcfce7" : "#ede9fe", color: sk.level === "EXPERT" ? "#16a34a" : "#7c3aed" }}>{sk.level}</span>
              <button onClick={() => removeSkill(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><FiTrash2 size={14} color="#ef4444" /></button>
            </div>
          ))}
          {/* Add row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px" }}>
            <input style={{ ...iStyle, flex: 1, marginBottom: 0 }} placeholder="Add a skill name" value={newSkill}
              onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} />
            <select style={{ ...iStyle, width: 150 }} value={newLevel} onChange={e => setNewLevel(e.target.value)}>
              <option>BEGINNER</option><option>INTERMEDIATE</option><option>EXPERT</option>
            </select>
            <button onClick={addSkill} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", color: "#16a34a", border: "1px dashed #86efac", borderRadius: 8, padding: "10px 16px", fontWeight: 600, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}>
              <FiPlus size={13} /> Add Core Skill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 4 ────────────────────────────────────────────────────────────────────
function Step4({ data, onChange, userName }) {
  const slots = data.availability || {};
  const toggle = (day, time) => onChange("availability", { ...slots, [`${day}_${time}`]: !slots[`${day}_${time}`] });

  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px" }}>{userName || "Pragati"}</h1>
        <div style={{ fontSize: 12, letterSpacing: 2, color: "#9ca3af", fontWeight: 600 }}>MENTOR ONBOARDING</div>
        <div style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600, marginTop: 4 }}>Almost Finished! 🎉</div>
      </div>

      <div style={{ borderLeft: "4px solid #22c55e", borderRadius: 14, border: "1px solid #e5e7eb", borderLeftWidth: 4, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>Weekly Availability</h2>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 4px" }}>Select the slots when you are available for 1:1 mentorship sessions.</p>
            <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>These can be adjusted later.</p>
          </div>
          <div style={{ width: 46, height: 46, background: "#f0fdf4", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #86efac", flexShrink: 0 }}>
            <FiCalendar size={20} color="#22c55e" />
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "110px repeat(7, 1fr)", gap: 8 }}>
          <div />
          {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: "#374151", paddingBottom: 8 }}>{d}</div>)}
          {TIME_SLOTS.map(time => (
            <>
              <div key={time + "l"} style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{time}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>(45 mins)</div>
              </div>
              {DAYS.map(day => {
                const key = `${day}_${time}`;
                const sel = slots[key];
                return (
                  <div key={key} onClick={() => toggle(day, time)} style={{
                    border: sel ? "1.5px solid #86efac" : "1.5px solid #e5e7eb",
                    borderRadius: 8, minHeight: 66, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", cursor: "pointer",
                    background: sel ? "#f0fdf4" : "#fff", transition: "all .15s",
                  }}>
                    {sel
                      ? <><div style={{ fontWeight: 700, color: "#16a34a", fontSize: 12 }}>{time}</div><div style={{ fontSize: 11, color: "#22c55e" }}>Selected</div></>
                      : <FiPlus size={15} color="#d1d5db" />}
                  </div>
                );
              })}
            </>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "#f5f3ff", borderRadius: 10, padding: "14px 18px", marginTop: 24 }}>
          <FiInfo size={18} color="#7c3aed" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 14, color: "#4b5563" }}>Standard sessions are 45 minutes long. You can configure your timezone and buffer times in settings after registration.</span>
        </div>
      </div>
    </div>
  );
}

// ── Profile Summary (view mode) ───────────────────────────────────────────────
function ProfileSummary({ profile, onEdit }) {
  return (
    <div>
      {/* Hero card */}
      <div style={{ background: "linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%)", borderRadius: 16, padding: 32, marginBottom: 20, color: "#fff", display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ flexShrink: 0 }}>
          {profile.photoUrl
            ? <img src={profile.photoUrl} alt="avatar" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,.4)" }} />
            : <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><FiUser size={38} color="#fff" /></div>}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>{profile.fullName || "—"}</h2>
          <p style={{ margin: "0 0 4px", opacity: 0.85, fontSize: 15 }}>{profile.displayTitle || "—"}</p>
          <p style={{ margin: 0, opacity: 0.65, fontSize: 13 }}>{profile.email || "—"}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Bio */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #f0f0f0", gridColumn: "1 / -1" }}>
          <div style={labelStyle}>Professional Bio</div>
          <p style={{ fontSize: 14, color: "#374151", margin: 0, lineHeight: 1.7 }}>{profile.proBio || profile.bio || "—"}</p>
        </div>

        {/* Expertise */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #f0f0f0" }}>
          <div style={labelStyle}>Expertise Areas</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(profile.expertiseTags || []).length
              ? profile.expertiseTags.map(t => <span key={t} style={{ background: "#ede9fe", color: "#7c3aed", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{t}</span>)
              : <span style={{ color: "#9ca3af", fontSize: 14 }}>—</span>}
          </div>
        </div>

        {/* Core Skills */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #f0f0f0" }}>
          <div style={labelStyle}>Core Skills</div>
          {(profile.coreSkills || []).length
            ? profile.coreSkills.map((sk, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{sk.name}</span>
                  <span style={{ borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, background: sk.level === "EXPERT" ? "#dcfce7" : "#ede9fe", color: sk.level === "EXPERT" ? "#16a34a" : "#7c3aed" }}>{sk.level}</span>
                </div>
              ))
            : <span style={{ color: "#9ca3af", fontSize: 14 }}>—</span>}
        </div>

        {/* Links */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #f0f0f0" }}>
          <div style={labelStyle}>Links</div>
          {profile.linkedin && <div style={{ fontSize: 13, marginBottom: 6 }}><FiLink size={12} style={{ marginRight: 6, color: "#22c55e" }} /><a href={profile.linkedin} style={{ color: "#7c3aed", textDecoration: "none" }}>{profile.linkedin}</a></div>}
          {profile.github && <div style={{ fontSize: 13 }}><FiGithub size={12} style={{ marginRight: 6, color: "#f97316" }} /><a href={profile.github} style={{ color: "#7c3aed", textDecoration: "none" }}>{profile.github}</a></div>}
          {!profile.linkedin && !profile.github && <span style={{ color: "#9ca3af", fontSize: 14 }}>—</span>}
        </div>

        {/* Availability */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #f0f0f0" }}>
          <div style={labelStyle}>Weekly Availability</div>
          {Object.keys(profile.availability || {}).filter(k => profile.availability[k]).length
            ? Object.keys(profile.availability).filter(k => profile.availability[k]).map(k => {
                const [day, ...rest] = k.split("_");
                return <div key={k} style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>📅 <b>{day}</b>: {rest.join(" ")}</div>;
              })
            : <span style={{ color: "#9ca3af", fontSize: 14 }}>—</span>}
        </div>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 };
const iStyle = { border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit" };

// ── Main ──────────────────────────────────────────────────────────────────────
const AdminProfile = () => {
  const [step, setStep] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profile, setProfile] = useState({
    photoUrl: "", fullName: "", displayTitle: "", email: "", bio: "",
    proBio: "", linkedin: "", github: "", certFiles: [],
    designation: "", yearsExp: "", expertiseTags: [], coreSkills: [],
    availability: {},
  });

  const update = (key, val) => setProfile(p => ({ ...p, [key]: val }));

  const handleComplete = () => {
    setShowSuccess(true);
    setEditMode(false);
    setStep(1);
    setTimeout(() => setShowSuccess(false), 3500);
  };

  return (
    <div style={{ padding: "28px 32px", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: "#111827" }}>Admin Profile</h1>
        {!editMode && (
          <button onClick={() => { setEditMode(true); setStep(1); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
            <FiEdit2 size={14} /> Edit Profile
          </button>
        )}
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: "#16a34a", color: "#fff", borderRadius: 10, padding: "14px 22px", display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: 15, boxShadow: "0 4px 24px rgba(0,0,0,.2)" }}>
          <FiCheckCircle size={20} /> Profile Updated Successfully
        </div>
      )}

      {!editMode ? (
        <ProfileSummary profile={profile} />
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 20px rgba(0,0,0,.07)" }}>
          <Stepper current={step} />

          <div style={{ padding: "32px 40px" }}>
            {step === 1 && <Step1 data={profile} onChange={update} />}
            {step === 2 && <Step2 data={profile} onChange={update} />}
            {step === 3 && <Step3 data={profile} onChange={update} />}
            {step === 4 && <Step4 data={profile} onChange={update} userName={profile.fullName} />}
          </div>

          {/* Nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderTop: "1px solid #f0f0f0" }}>
            {step === 1
              ? <button onClick={() => setEditMode(false)} style={{ background: "none", border: "none", color: "#7c3aed", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Cancel</button>
              : <button onClick={() => setStep(s => s - 1)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "2px solid #e5e7eb", borderRadius: 8, padding: "10px 20px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}><FiArrowLeft size={14} /> Previous Step</button>}

            {step < 4
              ? <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {step === 1 && <button onClick={() => setEditMode(false)} style={{ background: "none", border: "none", color: "#7c3aed", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Save Draft</button>}
                  <button onClick={() => setStep(s => s + 1)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#7c3aed", color: "#fff", border: "none", borderRadius: 30, padding: "11px 24px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                    {step === 1 ? "Continue to Profile" : step === 2 ? "Continue to Experience" : "Continue to Availability"} <FiArrowRight size={14} />
                  </button>
                </div>
              : <button onClick={handleComplete} style={{ display: "flex", alignItems: "center", gap: 8, background: "#7c3aed", color: "#fff", border: "none", borderRadius: 30, padding: "12px 28px", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
                  Complete Registration <FiCheckCircle size={16} />
                </button>}
          </div>

          {step > 1 && (
            <div style={{ textAlign: "center", paddingBottom: 20, fontSize: 13, color: "#9ca3af" }}>
              Need help? <a href="#" style={{ color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>Contact Support</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
