// ProfileManagementPage.jsx
// Final integrated page — uses useProfileData hook + all services
// src/features/student/profile/pages/ProfileManagementPage.jsx
// Tailwind CSS only

import { useState } from "react";
import useProfileData from "../hooks/useProfileData";
import { SUGGESTED_SKILLS } from "../constants/profileConstants";

// ── Skeleton Loader ───────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

// ── Info Field ────────────────────────────────────────
const InfoField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-semibold text-gray-800">
      {value || <span className="text-gray-300 italic font-normal">Not provided</span>}
    </span>
  </div>
);

// ── Section Card ──────────────────────────────────────
const SectionCard = ({ title, icon, children, action }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </div>
);

// ── Main Page ─────────────────────────────────────────
const ProfileManagementPage = () => {
  const {
    profile, skills, projects, portfolio, socialLinks, resume,
    loading, saving, uploading, error, successMsg,
    saveProfile, saveResume, saveSkills, savePortfolio, saveSocialLinks,
  } = useProfileData();

  const [editSection, setEditSection] = useState(null);
  const [skillInput, setSkillInput]   = useState("");
  const [localSkills, setLocalSkills] = useState([]);

  // Pre-fill local skills when data loads
  if (skills.length > 0 && localSkills.length === 0) {
    setLocalSkills(skills);
  }

  const initials = profile?.name
    ? profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "JD";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your profile, skills, projects and more</p>
          </div>
        </div>

        {/* ── Toast Messages ── */}
        {successMsg && (
          <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl">
            ✅ {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
            ⚠ {error}
          </div>
        )}

        {/* ── Hero Card ── */}
        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-7 mb-5 overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-full pointer-events-none">
            <div className="absolute -right-10 top-4 w-40 h-40 rounded-full bg-orange-100 opacity-40" />
            <div className="absolute right-4 bottom-0 w-32 h-32 rounded-full bg-green-100 opacity-30" />
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-400 border-4 border-white shadow">
                {loading ? <Skeleton className="w-20 h-20 rounded-full" /> : initials}
              </div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
            </div>

            <div className="flex-1">
              {loading ? (
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{profile?.headline || "Student"}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">{profile?.rollNo}</span>
                    <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">{profile?.department}</span>
                    <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">Batch {profile?.batch}</span>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-lg">● Eligible</span>
                    <span className="text-sm font-bold text-gray-800">★ {profile?.cgpa} <span className="text-xs text-gray-400 font-normal">CGPA</span></span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Personal Info ── */}
          <div className="lg:col-span-2">
            <SectionCard
              title="Personal Information"
              icon="👤"
              action={
                <button
                  onClick={() => setEditSection(editSection === "info" ? null : "info")}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  {editSection === "info" ? "Cancel" : "Edit"}
                </button>
              }
            >
              {loading ? (
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
                </div>
              ) : editSection === "info" ? (
                <PersonalInfoForm profile={profile} saving={saving} onSave={async (data) => { const ok = await saveProfile(data); if (ok) setEditSection(null); }} />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <InfoField label="Email"      value={profile?.email} />
                  <InfoField label="Phone"      value={profile?.phone} />
                  <InfoField label="City"       value={profile?.city} />
                  <InfoField label="Department" value={profile?.department} />
                  <InfoField label="Batch"      value={profile?.batch} />
                  <InfoField label="CGPA"       value={profile?.cgpa} />
                </div>
              )}
            </SectionCard>
          </div>

          {/* ── Skills ── */}
          <div>
            <SectionCard
              title="Skills"
              icon="⚡"
              action={
                <button
                  onClick={() => {
                    if (editSection === "skills") { saveSocialLinks; setEditSection(null); }
                    else setEditSection("skills");
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  {editSection === "skills" ? "Save" : "Edit"}
                </button>
              }
            >
              {loading ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-7 w-20" />)}
                </div>
              ) : editSection === "skills" ? (
                <SkillsEditor
                  skills={localSkills}
                  onChange={setLocalSkills}
                  onSave={async () => { await saveSkills(localSkills); setEditSection(null); }}
                  saving={saving}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {localSkills.map((s) => (
                    <span key={s} className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium px-3 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* ── Resume ── */}
          <div className="lg:col-span-3">
            <SectionCard title="Resume" icon="📄">
              {loading ? <Skeleton className="h-16" /> : (
                <ResumeSection resume={resume} uploading={uploading} onUpload={saveResume} />
              )}
            </SectionCard>
          </div>

          {/* ── Portfolio ── */}
          <div className="lg:col-span-2">
            <SectionCard
              title="Portfolio & Links"
              icon="🔗"
              action={
                <button onClick={() => setEditSection(editSection === "portfolio" ? null : "portfolio")} className="text-xs font-semibold text-blue-600 hover:underline">
                  {editSection === "portfolio" ? "Cancel" : "Edit"}
                </button>
              }
            >
              {loading ? <Skeleton className="h-20" /> : editSection === "portfolio" ? (
                <PortfolioForm data={portfolio} saving={saving} onSave={async (d) => { await savePortfolio(d); setEditSection(null); }} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InfoField label="GitHub"   value={portfolio?.github   || "Not added"} />
                  <InfoField label="LinkedIn" value={portfolio?.linkedin || "Not added"} />
                  <InfoField label="Website"  value={portfolio?.website  || "Not added"} />
                </div>
              )}
            </SectionCard>
          </div>

          {/* ── Social Links ── */}
          <div>
            <SectionCard
              title="Social Links"
              icon="🌐"
              action={
                <button onClick={() => setEditSection(editSection === "social" ? null : "social")} className="text-xs font-semibold text-blue-600 hover:underline">
                  {editSection === "social" ? "Cancel" : "Edit"}
                </button>
              }
            >
              {loading ? <Skeleton className="h-20" /> : editSection === "social" ? (
                <SocialForm data={socialLinks} saving={saving} onSave={async (d) => { await saveSocialLinks(d); setEditSection(null); }} />
              ) : (
                <div className="flex flex-col gap-3">
                  {socialLinks && Object.entries(socialLinks).map(([key, val]) => (
                    <InfoField key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={val || "Not added"} />
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* ── Projects ── */}
          <div className="lg:col-span-3">
            <SectionCard title="Projects" icon="💻">
              {loading ? <Skeleton className="h-20" /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((p, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-800 text-sm">{p.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{p.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

        </div>
      </div>
    </div>
  );
};

// ── Sub-components ────────────────────────────────────

const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const PersonalInfoForm = ({ profile, saving, onSave }) => {
  const [form, setForm] = useState({ name: profile?.name || "", email: profile?.email || "", phone: profile?.phone || "", city: profile?.city || "", cgpa: profile?.cgpa || "" });
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(form).map(([key, val]) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600 capitalize">{key}</label>
            <input value={val} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))} className={inputCls} />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button onClick={() => onSave(form)} disabled={saving} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg disabled:opacity-60">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

const SkillsEditor = ({ skills, onChange, onSave, saving }) => {
  const [input, setInput] = useState("");
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span key={s} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
            {s}
            <button onClick={() => onChange(skills.filter(x => x !== s))} className="text-blue-400 hover:text-red-500 font-bold">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { onChange([...skills, input.trim()]); setInput(""); }}} placeholder="Type skill + Enter" className={inputCls} />
        <button onClick={onSave} disabled={saving} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg disabled:opacity-60 whitespace-nowrap">
          {saving ? "..." : "Save"}
        </button>
      </div>
    </div>
  );
};

const ResumeSection = ({ resume, uploading, onUpload }) => {
  const ref = React.useRef();
  return (
    <div className="flex items-center gap-4">
      {resume ? (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <span className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-600 text-xs font-bold">PDF</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">{resume.filename}</p>
            <p className="text-xs text-gray-400">Uploaded {resume.uploadedAt}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">No resume uploaded yet.</p>
      )}
      <input ref={ref} type="file" accept="application/pdf" className="hidden" onChange={(e) => onUpload(e.target.files[0])} />
      <button onClick={() => ref.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 disabled:opacity-60">
        {uploading ? "Uploading..." : resume ? "Replace" : "Upload PDF"}
      </button>
    </div>
  );
};

const PortfolioForm = ({ data, saving, onSave }) => {
  const [form, setForm] = useState({ github: data?.github || "", linkedin: data?.linkedin || "", website: data?.website || "" });
  return (
    <div className="flex flex-col gap-3">
      {Object.entries(form).map(([key, val]) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 capitalize">{key}</label>
          <input value={val} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={`https://${key}.com/...`} className={inputCls} />
        </div>
      ))}
      <div className="flex justify-end">
        <button onClick={() => onSave(form)} disabled={saving} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
      </div>
    </div>
  );
};

const SocialForm = ({ data, saving, onSave }) => {
  const [form, setForm] = useState({ github: data?.github || "", linkedin: data?.linkedin || "", leetcode: data?.leetcode || "", codeforces: data?.codeforces || "" });
  return (
    <div className="flex flex-col gap-3">
      {Object.entries(form).map(([key, val]) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 capitalize">{key}</label>
          <input value={val} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={`${key} profile URL`} className={inputCls} />
        </div>
      ))}
      <div className="flex justify-end">
        <button onClick={() => onSave(form)} disabled={saving} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
      </div>
    </div>
  );
};

import React from "react";
export default ProfileManagementPage;
