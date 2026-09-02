import { useCallback, useEffect, useMemo, useState } from "react";
import ProfileEditForm from "../../components/profile/ProfileEditForm";
import studentProfileService from "../../services/studentProfile.service";

const EMPTY_PROFILE = {
  studentId: null,
  userId: null,
  collegeId: null,
  personal: {
    name: "",
    email: "",
    phone: null,
    profileImage: null,
    avatarUrl: null,
    bio: null,
    gender: null,
    dateOfBirth: null,
  },
  contact: {
    address: null,
    addressLine1: null,
    addressLine2: null,
    city: null,
    state: null,
    country: null,
    pincode: null,
    alternatePhone: null,
    alternateEmail: null,
  },
  academic: {
    enrollmentNo: null,
    enrollmentNumber: null,
    institutionName: null,
    department: null,
    course: null,
    degree: null,
    semester: null,
    batch: null,
    graduationYear: null,
    admissionYear: null,
    cgpa: null,
    academicEmail: null,
    tenthPercentage: null,
    twelfthPercentage: null,
    backlogs: null,
    activeBacklogs: null,
  },
  skills: [],
  resume: null,
  certifications: [],
  social: {
    linkedin: null,
    github: null,
    portfolio: null,
    twitter: null,
    website: null,
  },
  documents: [],
  profileCompleteness: 0,
  placement: {
    resumeStatus: null,
  },
};

const getApiErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const InfoField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-800 break-words">
      {value !== null && value !== undefined && value !== "" ? (
        value
      ) : (
        <span className="text-gray-300 italic font-normal">Not provided</span>
      )}
    </span>
  </div>
);

const LinkValue = ({ label, value }) => {
  if (!value) return null;

  return (
    <a
      href={value}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-200 hover:bg-white"
    >
      <span>{label}</span>
      <span className="text-xs text-blue-600 truncate max-w-[65%]">{value}</span>
    </a>
  );
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await studentProfileService.getMyProfile();
      setProfile(response?.data || EMPTY_PROFILE);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load your profile."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async (payload) => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await studentProfileService.updateProfile(payload);
      setProfile(response?.data || EMPTY_PROFILE);
      setIsEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to save your profile."));
      throw requestError;
    } finally {
      setIsSaving(false);
    }
  };

  const initials = useMemo(() => {
    const name = profile.personal?.name?.trim() || "Student";
    return name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile.personal?.name]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="h-7 w-40 rounded bg-gray-100 animate-pulse" />
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 h-52 rounded-2xl bg-gray-50 animate-pulse" />
              <div className="h-52 rounded-2xl bg-gray-50 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-sm text-gray-400 mt-1">
              Update the profile information stored on your student account.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">
            <ProfileEditForm
              profile={profile}
              onSave={handleSave}
              onCancel={() => {
                setError("");
                setIsEditing(false);
              }}
              saving={isSaving}
            />
          </div>
        </div>
      </div>
    );
  }

  const { personal, contact, academic, skills, resume, certifications, social } = profile;
  const completeness = Number(profile.profileCompleteness) || 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-400 mt-1">
              View and manage the information used across your student account.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setError("");
              setSuccess("");
              setIsEditing(true);
            }}
            className="shrink-0 px-5 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>

        {error && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <span>{error}</span>
            <button type="button" onClick={loadProfile} className="underline hover:no-underline">
              Retry
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-8 py-5 sm:py-7 mb-5 overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-full overflow-hidden pointer-events-none">
            <div className="absolute -right-10 top-4 w-40 h-40 rounded-full bg-orange-100 opacity-40" />
            <div className="absolute right-4 bottom-0 w-32 h-32 rounded-full bg-green-100 opacity-30" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 relative z-10">
            <div className="relative shrink-0 mx-auto sm:mx-0">
              {personal.profileImage || personal.avatarUrl ? (
                <img
                  src={personal.profileImage || personal.avatarUrl}
                  alt={personal.name || "Student"}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-500 border-4 border-white shadow">
                  {initials}
                </div>
              )}
            </div>

            <div className="text-center sm:text-left w-full">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {personal.name || "Student"}
              </h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {academic.enrollmentNo || academic.enrollmentNumber ? (
                  <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                    {academic.enrollmentNo || academic.enrollmentNumber}
                  </span>
                ) : null}
                {academic.department ? (
                  <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                    {academic.department}
                  </span>
                ) : null}
                {academic.batch ? (
                  <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                    Batch {academic.batch}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-5">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <h3 className="text-base font-bold text-gray-800">Profile completeness</h3>
              <p className="text-xs text-gray-400 mt-1">
                Complete more of your profile to keep your student information up to date.
              </p>
            </div>
            <span className="text-2xl font-bold text-gray-900">{completeness}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${Math.min(100, Math.max(0, completeness))}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h3 className="text-base font-bold text-gray-800">Personal Information</h3>
            <div className="w-8 h-0.5 bg-orange-400 mb-5 mt-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <InfoField label="Email" value={personal.email} />
              <InfoField label="Phone" value={personal.phone} />
              <InfoField label="Date of Birth" value={personal.dateOfBirth} />
              <InfoField label="Gender" value={personal.gender} />
              <InfoField label="City" value={contact.city} />
              <InfoField label="State" value={contact.state} />
              <InfoField label="Country" value={contact.country} />
              <InfoField label="Pincode" value={contact.pincode} />
              <InfoField label="CGPA" value={academic.cgpa} />
            </div>
            {personal.bio ? (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  Bio
                </span>
                <p className="mt-2 text-sm leading-6 text-gray-600">{personal.bio}</p>
              </div>
            ) : null}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h3 className="text-base font-bold text-gray-800">Skills</h3>
            <div className="w-8 h-0.5 bg-orange-400 mb-5 mt-2" />
            {skills.length ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id || skill.name}
                    className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No skills added yet.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h3 className="text-base font-bold text-gray-800">Academic Information</h3>
            <div className="w-8 h-0.5 bg-orange-400 mb-5 mt-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoField label="Institution" value={academic.institutionName} />
              <InfoField label="Course" value={academic.course} />
              <InfoField label="Degree" value={academic.degree} />
              <InfoField label="Semester" value={academic.semester} />
              <InfoField label="Graduation Year" value={academic.graduationYear} />
              <InfoField label="Admission Year" value={academic.admissionYear} />
              <InfoField label="Academic Email" value={academic.academicEmail} />
              <InfoField label="Active Backlogs" value={academic.activeBacklogs} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h3 className="text-base font-bold text-gray-800">Resume & Social Links</h3>
            <div className="w-8 h-0.5 bg-orange-400 mb-5 mt-2" />
            <div className="space-y-3">
              {resume?.url ? (
                <a
                  href={resume.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-green-100 bg-green-50 px-3 py-2.5 text-sm font-semibold text-green-700"
                >
                  <span>Resume</span>
                  <span className="text-xs truncate max-w-[60%]">{resume.fileName || "Open resume"}</span>
                </a>
              ) : (
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm text-gray-400">
                  Resume not uploaded.
                </div>
              )}
              <LinkValue label="LinkedIn" value={social.linkedin} />
              <LinkValue label="GitHub" value={social.github} />
              <LinkValue label="Portfolio" value={social.portfolio || social.website} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mt-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-800">Certifications</h3>
              <p className="text-xs text-gray-400 mt-1">Credentials saved on your student profile.</p>
            </div>
            <span className="text-xs font-semibold text-gray-500">{certifications.length}</span>
          </div>
          {certifications.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certifications.map((certification) => (
                <div key={certification.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm font-bold text-gray-800">{certification.name}</p>
                  {certification.issuingOrganization ? (
                    <p className="text-xs text-gray-500 mt-1">{certification.issuingOrganization}</p>
                  ) : null}
                  {certification.issueDate ? (
                    <p className="text-xs text-gray-400 mt-2">Issued {certification.issueDate}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No certifications added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
