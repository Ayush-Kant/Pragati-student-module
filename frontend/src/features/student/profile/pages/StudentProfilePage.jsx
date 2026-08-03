import { useState, useCallback } from 'react';
import { Save, X, ChevronDown, ChevronUp, Eye, Download } from 'lucide-react';

import { useStudentProfile } from '../hooks/useStudentProfile';
import { useProfileCompletion } from '../hooks/useProfileCompletion';
import { useDocumentUpload } from '../hooks/useDocumentUpload';
import { useSkills } from '../hooks/useSkills';
import { getCompletionStepStatus, fileToDataUrl } from '../utils/studentProfileHelpers';

import ProfileCard from '../components/profile/ProfileCard';
import ProfileCompletion from '../components/profile/ProfileCompletion';

import PersonalInformation from '../components/personal/PersonalInformation';
import ContactInformation from '../components/personal/ContactInformation';
import AddressInformation from '../components/personal/AddressInformation';
import EmergencyContact from '../components/personal/EmergencyContact';

import AcademicInformation from '../components/academic/AcademicInformation';
import CollegeInformation from '../components/academic/CollegeInformation';
import EducationHistory from '../components/academic/EducationHistory';
import CGPASection from '../components/academic/CGPASection';

import SkillsSection from '../components/skills/SkillsSection';
import Certifications from '../components/skills/Certifications';
import LanguagesKnown from '../components/skills/LanguagesKnown';

import ResumeUpload from '../components/documents/ResumeUpload';

import SocialLinks from '../components/social/SocialLinks';

import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

const SECTIONS = [
  { id: 'personal', label: 'Personal Information', component: PersonalInformation },
  { id: 'contact', label: 'Contact Information', component: ContactInformation },
  { id: 'address', label: 'Address Information', component: AddressInformation },
  { id: 'emergency', label: 'Emergency Contact', component: EmergencyContact },
  { id: 'academic', label: 'Academic Information', component: AcademicInformation },
  { id: 'college', label: 'College Information', component: CollegeInformation },
  { id: 'education', label: 'Education History', component: EducationHistory },
  { id: 'cgpa', label: 'CGPA', component: CGPASection },
  { id: 'skills', label: 'Skills', component: SkillsSection },
  { id: 'certifications', label: 'Certifications', component: Certifications },
  { id: 'languages', label: 'Languages Known', component: LanguagesKnown },
  { id: 'documents', label: 'Documents', component: null },
  { id: 'social', label: 'Social Profiles', component: SocialLinks }
];

/**
 * Main student profile page with Uptoskills two-column theme.
 * Left sidebar: profile card with avatar, stats, and completion.
 * Right content: collapsible profile sections.
 * @returns {JSX.Element} The student profile page
 */
const StudentProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSections, setActiveSections] = useState(
    SECTIONS.reduce((acc, section) => ({ ...acc, [section.id]: true }), {})
  );
  const [savedProfile, setSavedProfile] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const {
    profile,
    loading: profileLoading,
    error: profileError,
    updateProfile,
    refetch: refetchProfile
  } = useStudentProfile();

  const {
    loading: completionLoading,
    error: completionError,
    calculateCompletion,
    refetch: refetchCompletion
  } = useProfileCompletion(profile);

  const {
    documents,
    uploading,
    uploadProgress,
    uploadResume,
    refetch: refetchDocuments
  } = useDocumentUpload();

  const {
    skills,
    languages,
    certifications,
    loading: skillsLoading,
    addSkill,
    removeSkill,
    addLanguage,
    removeLanguage,
    addCertification,
    removeCertification,
    refetch: refetchSkills
  } = useSkills();

  const currentProfile = savedProfile || profile;

  const handleEdit = () => {
    setIsEditing(true);
    setSaveError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSavedProfile(null);
  };

  const handleProfilePhotoUpload = useCallback(async (file) => {
    try {
      const photoUrl = await fileToDataUrl(file);
      const updated = await updateProfile({ ...currentProfile, profilePhoto: photoUrl });
      if (updated.success) {
        setSavedProfile(updated.data);
      } else {
        setSaveError(updated.error || 'Failed to upload profile photo');
      }
    } catch (err) {
      setSaveError(err.message || 'Failed to upload profile photo');
    }
  }, [currentProfile, updateProfile]);

  const handleSave = useCallback(async () => {
    setSaveError(null);
    const profileWithUpdates = {
      ...currentProfile,
      skills: skills || currentProfile.skills || [],
      languages: languages || currentProfile.languages || [],
      certifications: certifications || currentProfile.certifications || []
    };
    const updated = await updateProfile(profileWithUpdates);
    if (updated.success) {
      setSavedProfile(updated.data);
      setIsEditing(false);
      refetchProfile();
      refetchCompletion();
      refetchSkills();
      refetchDocuments();
    } else {
      setSaveError(updated.error || 'Failed to save profile changes');
    }
  }, [currentProfile, updateProfile, refetchProfile, refetchCompletion, refetchSkills, refetchDocuments, skills, languages, certifications]);

  const toggleSection = (sectionId) => {
    setActiveSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  if (profileLoading || completionLoading || skillsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (profileError || completionError) {
    return (
      <div className="min-h-screen bg-[#050505] p-6">
        <ErrorState error={profileError || completionError} onRetry={() => { refetchProfile(); refetchCompletion(); }} />
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-[#050505] p-6">
        <EmptyState
          title="No Profile Found"
          description="Your profile information is not available. Please contact support."
        />
      </div>
    );
  }

  const resumeFromDocuments = documents.find((doc) => doc.type === 'resume');
  const resumeForPreview = resumeFromDocuments || currentProfile.resume;
  const profileForCompletion = {
    ...currentProfile,
    skills: skills || currentProfile.skills || [],
    languages: languages || currentProfile.languages || [],
    certifications: certifications || currentProfile.certifications || [],
    resume: resumeForPreview,
    documents: documents.length > 0 ? documents : currentProfile.documents
  };

  const completionPercentage = calculateCompletion(profileForCompletion);

  const completionSteps = [
    { id: 'personal', label: 'Personal Information', completed: getCompletionStepStatus('personal', profileForCompletion) },
    { id: 'contact', label: 'Contact Details', completed: getCompletionStepStatus('contact', profileForCompletion) },
    { id: 'address', label: 'Address', completed: getCompletionStepStatus('address', profileForCompletion) },
    { id: 'academic', label: 'Academic Information', completed: getCompletionStepStatus('academic', profileForCompletion) },
    { id: 'skills', label: 'Skills & Languages', completed: getCompletionStepStatus('skills', profileForCompletion) },
    { id: 'documents', label: 'Resume & Documents', completed: getCompletionStepStatus('documents', profileForCompletion) },
    { id: 'social', label: 'Social Profiles', completed: getCompletionStepStatus('social', profileForCompletion) }
  ];

  return (
    <div className="min-h-screen bg-[#050505] font-sans scroll-smooth">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-80 shrink-0">
            <ProfileCard
              profile={currentProfile}
              onUploadPhoto={handleProfilePhotoUpload}
            />
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            {!isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#050505] shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                >
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            )}

            <ProfileCompletion
              completion={completionPercentage}
              steps={completionSteps}
              loading={completionLoading}
            />

            {isEditing && (
              <div className="flex flex-col items-end gap-2">
                {saveError && (
                  <p className="text-xs text-red-400">{saveError}</p>
                )}
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-300 bg-white/5 border border-gray-700 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#050505]"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {SECTIONS.map((section) => {
                const isActive = activeSections[section.id];
                const SectionComponent = section.component;

                if (!isActive) return null;

                if (section.id === 'documents') {
                  return (
                    <div key={`${section.id}-${isEditing ? 'edit' : 'view'}`} className="space-y-4">
                      <ResumeUpload
                        resumeFile={resumeForPreview}
                        onUpload={uploadResume}
                        uploading={uploading}
                        uploadProgress={uploadProgress}
                      />
                      {resumeForPreview && (resumeForPreview.fileUrl || resumeForPreview.url) && (
                        <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
                          <h3 className="text-lg font-semibold text-white mb-3">Resume Preview</h3>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                              <Eye className="h-5 w-5" />
                            </div>
                            <a
                              href={resumeForPreview.fileUrl || resumeForPreview.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
                            >
                              View Resume
                            </a>
                            <a
                              href={resumeForPreview.fileUrl || resumeForPreview.url}
                              download
                              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                if (!SectionComponent) return null;

                return (
                  <div key={`${section.id}-${isEditing ? 'edit' : 'view'}`} className="rounded-2xl border border-gray-700/50 bg-gray-800/40 shadow-2xl shadow-orange-500/5 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <h3 className="text-lg font-semibold text-white">{section.label}</h3>
                      {isActive ? (
                        <ChevronUp className="h-5 w-5 text-orange-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    {isActive && (
                      <div className="px-6 pb-6">
                        <SectionComponent
                          key={`${section.id}-${isEditing ? 'edit' : 'view'}`}
                          profile={currentProfile}
                          isEditing={isEditing}
                          onUpdate={(data) => {
                            if (data === null) return;
                            setSavedProfile((prev) => ({ ...prev, ...data }));
                          }}
                          validationErrors={{}}
                          {...(section.id === 'skills' ? { skills, onAdd: addSkill, onRemove: removeSkill } : {})}
                          {...(section.id === 'languages' ? { languages, onAdd: addLanguage, onRemove: removeLanguage } : {})}
                          {...(section.id === 'certifications' ? { certifications, onAdd: addCertification, onRemove: removeCertification } : {})}
                          {...(section.id === 'social' ? { socialLinks: currentProfile.socialLinks } : {})}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
