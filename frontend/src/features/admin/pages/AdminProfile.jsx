 // AdminProfile.jsx  –  THE MAIN PAGE
// Place at: src/features/admin/pages/AdminProfile.jsx
// This file owns the 4-step onboarding wizard state.

import { useState } from "react";
import AdminEditForm from "../components/AdminEditForm";
import AdminProfileCard from "../components/AdminProfileCard";

/* ─── Step indicator styles ─────────────────────────────── */
const STEPS = [
  { n: 1, label: "Basic Information" },
  { n: 2, label: "Professional Profile" },
  { n: 3, label: "Experience & Links" },
  { n: 4, label: "Availability" },
];

/* Step 1 stepper: pill-shaped active button */
function StepperA({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {STEPS.map((s, i) => {
        const active = s.n === step;
        const done = s.n < step;
        return (
          <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex", alignItems: "center", gap: active ? 8 : 6,
                background: active ? "#2563eb" : "transparent",
                border: active ? "none" : "1.5px solid #e2e8f0",
                borderRadius: 99, padding: active ? "8px 20px" : "7px 14px",
                color: active ? "#fff" : done ? "#22c55e" : "#94a3b8",
                fontWeight: 700, fontSize: 13, whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: done ? "#22c55e" : active ? "rgba(255,255,255,.2)" : "transparent",
                  border: done || active ? "none" : "1.5px solid #cbd5e1",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: done || active ? "#fff" : "#94a3b8", fontWeight: 800, flexShrink: 0,
                }}
              >
                {done ? "✓" : `0${s.n}`}
              </span>
              <span>{s.label}</span>
            </div>
            {i < 3 && <div style={{ width: 28, height: 1.5, background: "#e2e8f0" }} />}
          </div>
        );
      })}
    </div>
  );
}

/* Step 2–3 stepper: circle numbers with connector */
function StepperB({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, padding: "8px 0" }}>
      {STEPS.map((s, i) => {
        const done = s.n < step;
        const active = s.n === step;
        return (
          <div key={s.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              {i > 0 && (
                <div style={{ flex: 1, height: 2, background: done ? "#22c55e" : active ? "#7c3aed" : "#e2e8f0" }} />
              )}
              <div
                style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: done ? "#fff" : active ? "#7c3aed" : "#fff",
                  border: done ? "2px solid #22c55e" : active ? "none" : "2px solid #e2e8f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 14,
                  color: done ? "#22c55e" : active ? "#fff" : "#94a3b8",
                  boxShadow: active ? "0 2px 12px #7c3aed44" : "none",
                }}
              >
                {done ? "✓" : s.n}
              </div>
              {i < 3 && <div style={{ flex: 1, height: 2, background: done ? "#22c55e" : "#e2e8f0" }} />}
            </div>
            <div
              style={{
                fontSize: 11, fontWeight: 600, marginTop: 6, textAlign: "center",
                color: done ? "#22c55e" : active ? "#7c3aed" : "#94a3b8",
              }}
            >
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Step 4 progress bars */
function ProgressBars({ step }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
        {STEPS.map(s => (
          <div key={s.n} style={{ flex: 1, height: 6, borderRadius: 99, background: s.n <= step ? "#7c3aed" : "#e2e8f0", transition: "background .3s" }} />
        ))}
      </div>
      <div style={{ display: "flex" }}>
        {STEPS.map(s => (
          <span
            key={s.n}
            style={{
              fontSize: 10, fontWeight: s.n === step ? 800 : 500, flex: 1, textAlign: "center",
              color: s.n === step ? "#7c3aed" : s.n < step ? "#94a3b8" : "#cbd5e1",
              textTransform: "uppercase", letterSpacing: 0.5,
            }}
          >
            {s.label.split(" ")[0]}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
const AdminProfile = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // step 1
    avatar: null,
    fullName: "Priya Mehta",
    displayTitle: "Senior Software Engineer",
    email: "priya@pragati.dev",
    bio: "Experienced software engineer with expertise in frontend development.",
    // step 2
    bio2: "",
    linkedin: "",
    github: "",
    // step 3
    designation: "",
    yearsExp: "",
    expertise: ["Frontend Architecture", "UI/UX Systems"],
    coreSkills: [
      { name: "React.js & Next.js", level: "EXPERT" },
      { name: "System Design", level: "INTERMEDIATE" },
    ],
    // step 4
    availability: {
      "MON_09:00 AM": true,
      "WED_09:00 AM": true,
      "THU_05:00 PM": true,
      "MON_02:00 PM": true,
      "TUE_02:00 PM": true,
    },
  });

  const next = () => setStep(s => Math.min(s + 1, 4));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  /* nav buttons */
  const navBtnBase = {
    borderRadius: 99, padding: "12px 28px", fontSize: 14, fontWeight: 700,
    cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: 8,
  };

  const NavRow = () => {
    if (step === 1) return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
        <button style={{ background: "transparent", border: "none", color: "#7c3aed", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          Save Draft
        </button>
        <button style={{ ...navBtnBase, background: "#2563eb", color: "#fff" }} onClick={next}>
          Continue to Profile →
        </button>
      </div>
    );
    if (step === 4) return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
        <button style={{ ...navBtnBase, background: "transparent", border: "2px solid #7c3aed", color: "#7c3aed" }} onClick={prev}>
          ← Previous
        </button>
        <button style={{ ...navBtnBase, background: "#7c3aed", color: "#fff" }}>
          Complete Registration ✓
        </button>
      </div>
    );
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
        <button style={{ ...navBtnBase, background: "transparent", border: "1.5px solid #e2e8f0", color: "#475569" }} onClick={prev}>
          ← Previous Step
        </button>
        <button style={{ ...navBtnBase, background: "#7c3aed", color: "#fff" }} onClick={next}>
          {step === 2 ? "Continue to Experience →" : "Continue to Availability →"}
        </button>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── TOP NAVBAR ─────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 32px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexShrink: 0 }}>
            <span style={{ fontSize: 22 }}>🎓</span>
            <span style={{ fontWeight: 800, fontSize: 19 }}>
              <span style={{ color: "#f59e0b" }}>UPTO</span>
              <span style={{ color: "#22c55e" }}>SKILLS</span>
            </span>
            <span style={{ fontSize: 9, color: "#94a3b8", marginLeft: 2, fontWeight: 400 }}>Transform Your Career Path</span>
          </div>

          {/* Stepper inside nav (steps 1–3 only) */}
          {step === 1 && <StepperA step={step} />}
          {(step === 2 || step === 3) && (
            <div style={{ flex: 1, maxWidth: 580 }}>
              <StepperB step={step} />
            </div>
          )}
          {step === 4 && (
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Almost Finished! 🎉</span>
          )}
        </div>
      </div>

      {/* ── STEP 4: name + progress bar below nav ── */}
      {step === 4 && (
        <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 32px 20px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
                {formData.fullName || "Mentor"}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 2 }}>
                MENTOR ONBOARDING
              </div>
            </div>
            <ProgressBars step={step} />
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ───────────────────────────── */}
      <div
        style={{
          maxWidth: step === 1 ? 1100 : step === 4 ? 900 : 860,
          margin: "0 auto",
          padding: "32px 20px",
        }}
      >
        {/* Step 1: form + sidebar */}
        {step === 1 ? (
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div
              style={{
                flex: 1, background: "#fff", borderRadius: 20,
                padding: "32px 36px", boxShadow: "0 2px 16px rgba(0,0,0,.06)",
              }}
            >
              <AdminEditForm step={step} data={formData} setData={setFormData} />
              <NavRow />
            </div>
            <AdminProfileCard step={step} />
          </div>
        ) : (
          /* Steps 2–4: full-width card */
          <div
            style={{
              background: "#fff", borderRadius: 20,
              padding: "36px 40px", boxShadow: "0 2px 16px rgba(0,0,0,.06)",
            }}
          >
            <AdminEditForm step={step} data={formData} setData={setFormData} />
            <NavRow />
            <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#64748b" }}>
              Need help?{" "}
              <a href="#" style={{ color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}>
                Contact Support
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;