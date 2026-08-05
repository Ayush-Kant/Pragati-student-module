import React, { useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { ArrowLeft, User, GraduationCap, Briefcase, Award } from "lucide-react";
import { toast } from "react-hot-toast";

// Hooks
import useStudentProfile from "../hooks/useStudentProfile";
import useAcademicPerformance from "../hooks/useAcademicPerformance";
import usePlacementTracking from "../hooks/usePlacementTracking";

// Components
import StudentProfileCard from "../components/profile/StudentProfileCard";
import StudentBasicInfo from "../components/profile/StudentBasicInfo";
import StudentContactInfo from "../components/profile/StudentContactInfo";
import StudentOverview from "../components/profile/StudentOverview";
import StudentStatistics from "../components/profile/StudentStatistics";

import AcademicPerformance from "../components/academics/AcademicPerformance";

import PlacementStatus from "../components/placement/PlacementStatus";
import AppliedCompanies from "../components/placement/AppliedCompanies";
import InterviewHistory from "../components/placement/InterviewHistory";
import OfferHistory from "../components/placement/OfferHistory";
import PlacementProgress from "../components/placement/PlacementProgress";

import SkillsCard from "../components/skills/SkillsCard";
import Certifications from "../components/skills/Certifications";
import InternshipCard from "../components/skills/InternshipCard";
import ProjectsCard from "../components/skills/ProjectsCard";
import Achievements from "../components/skills/Achievements";
import SkillsChart from "../components/charts/SkillsChart";
import PlacementChart from "../components/charts/PlacementChart";

import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";

import { PROFILE_TABS } from "../constants/studentProfileConstants";

export const StudentProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useOutletContext();
  const [activeTab, setActiveTab] = useState("overview");

  const studentId = id || "1";

  // Call Hooks
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
    updateProfileLocal
  } = useStudentProfile(studentId);

  const {
    academics,
    loading: academicsLoading,
    error: academicsError,
    refetch: refetchAcademics
  } = useAcademicPerformance(studentId);

  const {
    placements,
    loading: placementsLoading,
    error: placementsError,
    refetch: refetchPlacements
  } = usePlacementTracking(studentId);

  const isLoading = profileLoading || academicsLoading || placementsLoading;
  const isError = profileError || academicsError || placementsError;

  const handleRetry = () => {
    refetchProfile();
    refetchAcademics();
    refetchPlacements();
  };

  const handleAcceptOffer = (offerId, companyName) => {
    // Local state modification mock or real API hook integration
    updateProfileLocal({ placementStatus: "Placed" });
    toast.success(`Congratulations! You have accepted the job offer from ${companyName}.`);
  };

  const handleRejectOffer = (offerId, companyName) => {
    toast.error(`Declined the offer from ${companyName}.`);
  };

  if (isLoading) {
    return (
      <div className={`p-6 min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
        <LoadingSpinner darkMode={darkMode} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`p-6 min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
        <ErrorState
          darkMode={darkMode}
          message={profileError || academicsError || placementsError}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen flex flex-col gap-6 ${darkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
      {/* Back Button & Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className={`p-2 rounded-xl border shadow-sm cursor-pointer transition-colors ${
            darkMode
              ? 'bg-[#2D2D2D] border-[#3D3D3D] text-gray-400 hover:text-white hover:bg-[#3D3D3D]'
              : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-slate-50'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Student Profile Dashboard</h1>
          <p className="text-xs text-gray-400">Detailed overview of student career, grades, and placements</p>
        </div>
      </div>

      {/* Tab pill-capsule switcher */}
      <div className={`flex rounded-xl p-1 gap-1 w-fit border ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-gray-100 border-gray-200/40'}`}>
        {PROFILE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === tab.id
                ? darkMode
                  ? "bg-[#3D3D3D] text-[#ff6d34] shadow-sm font-bold"
                  : "bg-white text-[#ff6d34] shadow-sm font-bold"
                : darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Tab Contents */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Header profile details */}
            <StudentProfileCard student={profile} darkMode={darkMode} />

            {/* Overall numeric stats */}
            <StudentStatistics student={profile} academics={academics} placements={placements} darkMode={darkMode} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile details */}
              <div className="lg:col-span-2 space-y-6">
                <StudentOverview student={profile} academics={academics} placements={placements} darkMode={darkMode} />
              </div>

              {/* Personal Info & Contacts */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <StudentBasicInfo student={profile} darkMode={darkMode} />
                <StudentContactInfo student={profile} darkMode={darkMode} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "academics" && (
          <AcademicPerformance academics={academics} student={profile} darkMode={darkMode} />
        )}

        {activeTab === "placement" && (
          <div className="space-y-6">
            <PlacementProgress studentStatus={profile.placementStatus} darkMode={darkMode} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 flex flex-col gap-6">
                <PlacementStatus student={profile} placements={placements} darkMode={darkMode} />
                <PlacementChart placements={placements} darkMode={darkMode} />
                <OfferHistory
                  placements={placements}
                  onAcceptOffer={handleAcceptOffer}
                  onRejectOffer={handleRejectOffer}
                  darkMode={darkMode}
                />
              </div>
              <div className="lg:col-span-2 flex flex-col gap-6">
                <AppliedCompanies placements={placements} darkMode={darkMode} />
                <InterviewHistory placements={placements} darkMode={darkMode} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SkillsCard skills={profile?.skills} darkMode={darkMode} />
              <SkillsChart technicalSkills={profile?.skills?.technical} darkMode={darkMode} />
              <Certifications certifications={profile?.certifications} darkMode={darkMode} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProjectsCard projects={profile.projects} darkMode={darkMode} />
              </div>
              <div className="lg:col-span-1">
                <Achievements achievements={profile.achievements} darkMode={darkMode} />
              </div>
            </div>

            <InternshipCard internships={profile.internships} darkMode={darkMode} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfilePage;
