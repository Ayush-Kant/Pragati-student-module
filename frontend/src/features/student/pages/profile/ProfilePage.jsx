// ProfilePage.jsx
// Main Student Profile Page — UI matches design reference exactly

import { useState } from "react";
import ProfileEditForm from "../../components/profile/ProfileEditForm";

const DUMMY_PROFILE = {
  name: "Vaishnavi Chaudhari",
  phone: "9876543210",
  city: "Pune",
  department: "Computer Engineering",
  cgpa: 8.7,
  skills: ["React", "Node.js", "Python", "SQL", "Git"],
  email: "vaishnavi@college.edu",
  rollNo: "2021CE047",
  batch: "2021–2025",
  status: "eligible",
  resumeUrl: null,
};

// Skill icons using simple emoji/svg per skill
const SKILL_ICONS = {
  "React":    { bg: "bg-blue-50",   icon: "⚛️" },
  "Node.js":  { bg: "bg-green-50",  icon: "🟢" },
  "Python":   { bg: "bg-yellow-50", icon: "🐍" },
  "SQL":      { bg: "bg-gray-100",  icon: "🗄️" },
  "Git":      { bg: "bg-red-50",    icon: "🔀" },
  "Java":     { bg: "bg-orange-50", icon: "☕" },
  "Docker":   { bg: "bg-blue-50",   icon: "🐳" },
  "AWS":      { bg: "bg-yellow-50", icon: "☁️" },
  "default":  { bg: "bg-gray-50",   icon: "💡" },
};

const InfoField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-800">
      {value || <span className="text-gray-300 italic font-normal">Not provided</span>}
    </span>
  </div>
);

const ProfilePage = () => {
  const [profile, setProfile] = useState(DUMMY_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (updatedData) => {
    setProfile((prev) => ({ ...prev, ...updatedData }));
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8">

        {/* ── Page Title ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-400 mt-1">
              {isEditing ? "Update your details below" : "View and manage your profile"}
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all"
            >
              {/* Edit icon */}
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-green-600">Edit Profile</span>
            </button>
          )}
        </div>

        {/* ── Success Toast ── */}
        {showSuccess && (
          <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Profile updated successfully!
          </div>
        )}

        {/* ── Hero Header Card ── */}
        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-8 py-5 sm:py-7 mb-5 overflow-hidden">
          
          {/* Decorative blob right */}
          <div className="absolute right-0 top-0 w-48 h-full overflow-hidden pointer-events-none">
            <div className="absolute -right-10 top-4 w-40 h-40 rounded-full bg-orange-100 opacity-40" />
            <div className="absolute right-4 bottom-0 w-32 h-32 rounded-full bg-green-100 opacity-30" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-400 border-4 border-white shadow">
                {initials}
              </div>
              {/* Online dot */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
            </div>

            {/* Name + chips */}
            <div className="text-center sm:text-left w-full">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">{profile.name}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                {/* Roll No */}
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                  </svg>
                  {profile.rollNo}
                </span>
                {/* Department */}
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {profile.department}
                </span>
                {/* Batch */}
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Batch {profile.batch}
                </span>
              </div>

              {/* Status + CGPA */}
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Eligible
                </span>
                <div className="w-px h-5 bg-gray-200" />
                <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <span className="text-yellow-400 text-base">★</span>
                  <span className="text-lg font-bold text-gray-800">{profile.cgpa}</span>
                  <span className="text-xs text-gray-400 font-normal">CGPA</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── View Mode ── */}
        {!isEditing && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Personal Info Card — spans 2 cols */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-gray-800">Personal Information</h3>
              </div>
              {/* Orange underline */}
              <div className="w-8 h-0.5 bg-orange-400 mb-5 ml-10" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <InfoField label="Email" value={profile.email} />
                <InfoField label="Phone" value={profile.phone} />
                <InfoField label="City" value={profile.city} />
                <InfoField label="Department" value={profile.department} />
                <InfoField label="Batch" value={profile.batch} />
                <InfoField label="CGPA" value={profile.cgpa} />
              </div>
            </div>

            {/* Skills Card — 1 col */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-gray-800">Skills</h3>
              </div>
              <div className="w-8 h-0.5 bg-orange-400 mb-5 ml-10" />

              {profile.skills && profile.skills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.skills.map((skill) => {
                    const s = SKILL_ICONS[skill] || SKILL_ICONS["default"];
                    return (
                      <div
                        key={skill}
                        className={`flex items-center gap-2 ${s.bg} rounded-xl px-3 py-2.5 border border-gray-100`}
                      >
                        <span className="text-base">{s.icon}</span>
                        <span className="text-xs font-semibold text-gray-700">{skill}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No skills added yet.</p>
              )}
            </div>

            {/* Resume Card — full width */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
              
              {/* Illustration blob */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 w-36 h-36 pointer-events-none">
                <div className="w-full h-full bg-indigo-100 rounded-full opacity-40 absolute" />
                <div className="absolute inset-0 flex items-center justify-center text-5xl">📁</div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm">⬆</div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-800">Resume</h3>
                </div>
                <div className="w-8 h-0.5 bg-orange-400 mb-5 ml-10" />

                {profile.resumeUrl ? (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:underline"
                  >
                    <span className="w-7 h-7 bg-red-100 rounded flex items-center justify-center text-red-600 text-[10px] font-bold">PDF</span>
                    View Resume ↗
                  </a>
                ) : (
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-400">No resume uploaded.</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Mode ── */}
        {isEditing && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <ProfileEditForm
              profile={profile}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;
