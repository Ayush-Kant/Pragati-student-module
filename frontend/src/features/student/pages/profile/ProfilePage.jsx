// ProfilePage.jsx (merged)
import { useState } from "react";

import ProfileEditForm from "../../components/profile/ProfileEditForm";
import ProjectCard from "../../components/profile/ProjectCard";
import ValidationAlert from "../../components/profile/ValidationAlert";

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
    website: "https://mounikaportfolio.com",
  },
};

const SKILL_ICONS = {
  React: { bg: "bg-blue-50", icon: "⚛️" },
  "Node.js": { bg: "bg-green-50", icon: "🟢" },
  Python: { bg: "bg-yellow-50", icon: "🐍" },
  SQL: { bg: "bg-gray-100", icon: "🗄️" },
  Git: { bg: "bg-red-50", icon: "🔀" },
  default: { bg: "bg-gray-50", icon: "💡" },
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
      setValidationError('Please fix the social links before saving.');
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

  const handleDeleteProject = (id) => setProjects((prev) => prev.filter((p) => p.id !== id));

  const initials = profile?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6">
        {validationError && <ValidationAlert message={validationError} />}

        {showSuccess && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">Profile updated successfully!</div>
        )}

        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-400">{isEditing ? "Update your details below" : "View and manage your profile"}</p>
          </div>

          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="px-5 py-2 bg-white border rounded-xl">
              Edit Profile
            </button>
          )}
        </div>

        {!isEditing && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl border p-6">
              <h3 className="font-bold mb-5">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <InfoField label="Email" value={profile.email} />
                <InfoField label="Phone" value={profile.phone} />
                <InfoField label="City" value={profile.city} />
                <InfoField label="Department" value={profile.department} />
                <InfoField label="Batch" value={profile.batch} />
                <InfoField label="CGPA" value={profile.cgpa} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-6">
              <div className="flex items-center gap-5 mb-4">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-xl font-bold">{initials}</div>
                <div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-sm text-gray-500">{profile.department}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Projects</h4>
                <div className="space-y-3">
                  {projects.map((p) => (
                    <ProjectCard key={p.id} project={p} onEdit={() => {}} onDelete={() => handleDeleteProject(p.id)} />
                  ))}
                </div>

                <div className="mt-4">
                  <button onClick={handleAddProject} className="px-3 py-2 bg-blue-600 text-white rounded">Add project</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditing && <ProfileEditForm initialData={profile} onSave={handleSave} onCancel={() => setIsEditing(false)} onLinkChange={handleLinkChange} validationErrors={validationErrors} />}
      </div>
    </div>
  );
};

export default ProfilePage;
