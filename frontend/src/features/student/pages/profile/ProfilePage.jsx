// ProfilePage.jsx (merged)
import { useState } from "react";
import ProfileEditForm from "../../components/profile/ProfileEditForm";
import ProjectCard from "../../components/profile/ProjectCard";

// ── VALIDATION LOGIC ──
// Basic URL validation used for social links
const validateSocialLinks = (links = {}) => {
  const errors = {};
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

  if (links.github && !urlRegex.test(links.github)) {
    errors.github = "Please enter a valid GitHub URL (e.g., https://github.com/username)";
  }
  if (links.linkedin && !urlRegex.test(links.linkedin)) {
    errors.linkedin = "Please enter a valid LinkedIn profile link";
  }
  if (links.website && !urlRegex.test(links.website)) {
    errors.website = "Please enter a valid website portfolio domain URL";
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

const ValidationAlert = ({ message }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 text-xs font-semibold px-3 py-2 rounded-xl mt-1.5">
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  );
};

// ── MOCK SYSTEM CONSTANTS ──
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
  portfolioLinks: {
    github: "https://github.com/mounikag",
    linkedin: "https://linkedin.com/in/mounikag",
    website: "https://mounikaportfolio.com"
  }
};

const SKILL_ICONS = {
  "React":    { bg: "bg-blue-50",   text: "text-blue-600",   icon: "⚛️" },
  "Node.js":  { bg: "bg-green-50",  text: "text-green-600",  icon: "🟢" },
  "Python":   { bg: "bg-yellow-50", text: "text-yellow-600", icon: "🐍" },
  "SQL":      { bg: "bg-gray-100",  text: "text-gray-700",   icon: "🗄️" },
  "Git":      { bg: "bg-red-50",    text: "text-red-600",    icon: "🔀" },
  "default":  { bg: "bg-gray-50",   text: "text-gray-600",   icon: "💡" }
};

const InfoField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-semibold text-gray-800">
      {value || <span className="text-gray-300 italic font-normal">Not provided</span>}
    </span>
  </div>
);

const ProfilePage = () => {
  const [profile, setProfile] = useState(DUMMY_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [validationError, setValidationError] = useState(null);

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Student Dashboard Feature",
      description:
        "Designed and built responsive layout forms for handling portfolio inputs, social links validation helpers, and project entries dynamically.",
      liveLink: "#",
      codeLink: "#",
    },
  ]);

  const handleLinkChange = (field, value) => {
    const updatedLinks = { ...profile.portfolioLinks, [field]: value };
    setProfile((prev) => ({ ...prev, portfolioLinks: updatedLinks }));

    const validation = validateSocialLinks(updatedLinks);
    setValidationErrors(validation.errors);
  };

  const handleSave = (updatedData) => {
    const currentLinks = updatedData.portfolioLinks || profile.portfolioLinks;
    const validation = validateSocialLinks(currentLinks);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setValidationError("Please fix the social links before saving.");
      return;
    }

    setProfile((prev) => ({ ...prev, ...updatedData }));
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddProject = () => {
    const newProject = {
      id: Date.now(),
      title: `New Project #${projects.length + 1}`,
      description: "Add a short project description",
      liveLink: "#",
      codeLink: "#",
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const handleDeleteProject = (id) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
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

        {/* Validation Errors Alert */}
        {validationError && <ValidationAlert message={validationError} />}

        {/* Header Block */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-400 mt-1">{isEditing ? "Update your details below" : "View and manage your profile"}</p>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-green-600">Edit Profile</span>
            </button>
          )}
        </div>

        {showSuccess && (
          <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Profile updated successfully!
          </div>
        )}

        {/* Hero Card Layout */}
        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-8 py-5 sm:py-7 mb-5 overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-full overflow-hidden pointer-events-none">
            <div className="absolute -right-10 top-4 w-40 h-40 rounded-full bg-orange-100 opacity-40" />
            <div className="absolute right-4 bottom-0 w-32 h-32 rounded-full bg-green-100 opacity-30" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 relative z-10">
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-400 border-4 border-white shadow">{initials}</div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div className="text-center sm:text-left w-full">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">{profile.name}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">{profile.rollNo}</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">{profile.department}</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">Batch {profile.batch}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Information Views */}
        {!isEditing && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-800">Personal Information</h3>
              <div className="w-8 h-0.5 bg-orange-400 mb-5" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <InfoField label="Email" value={profile.email} />
                <InfoField label="Phone" value={profile.phone} />
                <InfoField label="City" value={profile.city} />
                <InfoField label="Department" value={profile.department} />
                <InfoField label="Batch" value={profile.batch} />
                <InfoField label="CGPA" value={profile.cgpa} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-800">Skills</h3>
              <div className="w-8 h-0.5 bg-orange-400 mb-5" />
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => {
                  const config = SKILL_ICONS[skill] || SKILL_ICONS["default"];
                  return (
                    <div key={skill} className={`flex items-center gap-1.5 rounded-xl px-3 py-2 border border-gray-100 ${config.bg}`}>
                      <span className="text-sm">{config.icon}</span>
                      <span className={`text-xs font-semibold ${config.text || 'text-gray-600'}`}>{skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── PORTFOLIO & PROJECTS PANEL UI ── */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-5 space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-3">🌐 Portfolio Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">GitHub Profile</label>
                <input 
                  type="url" 
                  value={profile.portfolioLinks.github} 
                  onChange={(e) => handleLinkChange("github", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-gray-50/50 font-semibold text-gray-700 ${validationErrors.github ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-green-500'}`}
                />
                <ValidationAlert message={validationErrors.github} />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">LinkedIn Profile</label>
                <input 
                  type="url" 
                  value={profile.portfolioLinks.linkedin} 
                  onChange={(e) => handleLinkChange("linkedin", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-gray-50/50 font-semibold text-gray-700 ${validationErrors.linkedin ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-green-500'}`}
                />
                <ValidationAlert message={validationErrors.linkedin} />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Personal Website</label>
                <input 
                  type="url" 
                  value={profile.portfolioLinks.website} 
                  onChange={(e) => handleLinkChange("website", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-gray-50/50 font-semibold text-gray-700 ${validationErrors.website ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-green-500'}`}
                />
                <ValidationAlert message={validationErrors.website} />
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-800">📁 Projects Management</h3>
              <button onClick={handleAddProject} className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm">
                ➕ Add Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onEdit={() => setIsEditing(true)} 
                  onDelete={() => handleDeleteProject(project.id)} 
                />
              ))}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-5">
            <ProfileEditForm profile={profile} onSave={handleSave} onCancel={() => setIsEditing(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
