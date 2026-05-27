import React from "react";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const SLOTS = ["09:00 AM", "02:00 PM", "07:00 PM"];

const LEVEL_BADGES = {
  EXPERT: "bg-emerald-50 text-emerald-600 border-emerald-100",
  INTERMEDIATE: "bg-violet-50 text-violet-600 border-violet-100",
  BEGINNER: "bg-blue-50 text-blue-600 border-blue-100",
};

const AdminProfileCard = ({ profile, onEdit }) => {
  const availability = profile?.availability || {};
  const coreSkills = profile?.coreSkills || [];
  const expertise = profile?.expertise || [];
  const certifications = profile?.certifications || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans pb-12">
      {/* ── HERO BANNER HEADER ── */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
        <div className="h-44 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          {/* Wave/overlay decoration */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="px-6 md:px-8 pb-8 relative flex flex-col items-center md:flex-row md:items-end justify-between gap-6">
          {/* Avatar and Name */}
          <div className="-mt-16 flex flex-col items-center md:items-start text-center md:text-left md:flex-row gap-5 z-10">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-900 shadow-xl flex items-center justify-center overflow-hidden">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl font-extrabold text-white">
                  {profile?.fullName?.charAt(0)?.toUpperCase() || "A"}
                </span>
              )}
            </div>

            <div className="md:mb-3">
              <div className="flex flex-col md:flex-row md:items-center gap-2.5">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {profile?.fullName}
                </h1>
                <span className="text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider self-center">
                  {profile?.role?.replace("_", " ")}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium mt-1">{profile?.displayTitle}</p>
            </div>
          </div>

          {/* Edit Profile CTA Button */}
          <button
            onClick={onEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer z-10"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* ── 2-COLUMN MAIN DASHBOARD CONTENT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Basic & Socials */}
        <div className="space-y-6 lg:col-span-1">
          {/* Quick Info Contact */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
              Contact & Basic Info
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
                <p className="text-xs font-bold text-slate-700 mt-0.5 break-all">
                  {profile?.email}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Phone Number</span>
                <p className="text-xs font-bold text-slate-700 mt-0.5">
                  {profile?.contactInfo?.phone || profile?.phone || "Not provided"}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Location / Timezone</span>
                <p className="text-xs font-bold text-slate-700 mt-0.5">
                  {profile?.contactInfo?.timezone || "Not configured"}
                </p>
              </div>
              {profile?.bio && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Introduction</span>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
              Social Links
            </h3>
            <div className="space-y-3">
              <a
                href={profile?.socialLinks?.linkedin || "#"}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-100 text-xs font-bold ${
                  profile?.socialLinks?.linkedin
                    ? "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    : "bg-slate-50/50 text-slate-400 cursor-not-allowed"
                } transition`}
              >
                <span className="text-lg">🔗</span>
                <span className="truncate">
                  {profile?.socialLinks?.linkedin
                    ? profile.socialLinks.linkedin.replace("https://", "")
                    : "LinkedIn Not Added"}
                </span>
              </a>

              <a
                href={profile?.socialLinks?.github || "#"}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-100 text-xs font-bold ${
                  profile?.socialLinks?.github
                    ? "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    : "bg-slate-50/50 text-slate-400 cursor-not-allowed"
                } transition`}
              >
                <span className="text-lg">🌐</span>
                <span className="truncate">
                  {profile?.socialLinks?.github
                    ? profile.socialLinks.github.replace("https://", "")
                    : "GitHub/Portfolio Not Added"}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Onboarding details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Professional Bio Section */}
          {profile?.bio2 && (
            <div className="bg-white rounded-2xl border border-slate-200 border-l-4 border-l-violet-600 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Professional Journey
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {profile.bio2}
              </p>
            </div>
          )}

          {/* Experience, Skills & Credentials */}
          <div className="bg-white rounded-2xl border border-slate-200 border-l-4 border-l-emerald-500 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Expertise & Skills
              </h3>
              <span className="text-xs font-bold text-emerald-600">
                {profile?.designation} ({profile?.yearsExp})
              </span>
            </div>

            {/* Expertise Area tags */}
            {expertise.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  Areas of Specialization
                </span>
                <div className="flex flex-wrap gap-2">
                  {expertise.map((tag) => (
                    <span
                      key={tag}
                      className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Core Skills List */}
            {coreSkills.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  Top Skills
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {coreSkills.map((sk, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 py-2.5 border border-slate-100 rounded-xl bg-slate-50/50"
                    >
                      <span className="text-xs font-bold text-slate-800">{sk.name}</span>
                      <span
                        className={`text-[8px] font-extrabold px-2 py-0.5 rounded border ${
                          LEVEL_BADGES[sk.level] || LEVEL_BADGES.BEGINNER
                        }`}
                      >
                        {sk.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications List */}
            {certifications.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2.5">
                  Industry Credentials
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 border border-slate-100 rounded-xl px-3.5 py-2.5 bg-slate-50/30 text-xs text-slate-700 font-bold"
                    >
                      <span className="text-violet-600 text-lg">📄</span>
                      <span className="truncate">{cert.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Availability Slots Grid ── */}
      <div className="bg-white rounded-2xl border border-slate-200 border-l-4 border-l-emerald-500 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
          Weekly Availability Schedule
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="w-24" />
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="text-xs font-bold text-slate-400 text-center pb-3 uppercase tracking-wider"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((slot) => (
                <tr key={slot}>
                  <td className="py-3 pr-4 text-left whitespace-nowrap">
                    <div className="text-xs font-bold text-slate-700">{slot}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">(45 mins)</div>
                  </td>

                  {DAYS.map((day) => {
                    const key = `${day}_${slot}`;
                    const isSelected = !!availability[key];

                    return (
                      <td key={day} className="p-1 text-center">
                        <div
                          className={`min-h-[45px] flex flex-col items-center justify-center rounded-xl border text-center ${
                            isSelected
                              ? "bg-emerald-50 border-emerald-300 text-emerald-600 font-bold text-[9px] uppercase px-1 py-1"
                              : "border-slate-100 text-slate-300 font-light text-sm"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <span>{slot.split(" ")[0]}</span>
                              <span className="text-[8px] opacity-80 font-extrabold">Active</span>
                            </>
                          ) : (
                            "-"
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileCard;