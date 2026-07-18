import { useState } from "react";
import useHiringPipeline from "../hooks/useHiringPipeline";

import PipelineTabsNav from "../components/PipelineTabsNav";
import DriveSettingsTab from "../components/DriveSettingsTab";
import HiringContentTab from "../components/HiringContentTab";
import StudentReadinessTab from "../components/StudentReadinessTab";
import ShortlistedTab from "../components/ShortlistedTab";

export default function HiringPipelinePage() {
  const pipeline = useHiringPipeline();

  const [activeTab, setActiveTab] = useState("drive-settings");

  if (!pipeline) {
    return <div className="p-6">Loading...</div>;
  }

  const pageContent = {
    "drive-settings": {
      title: "Hiring Pipeline",
      description:
        "Configure the hiring drive settings and eligibility criteria.",
    },

    "hiring-content": {
      title: "Hiring Pipeline Config",
      description:
        "Configure the curriculum and project requirements for the upcoming enterprise recruitment drive.",
    },

    "student-readiness": {
      title: "Student Readiness",
      description:
        "Review students based on readiness score and hiring eligibility.",
    },

    shortlisted: {
      title: "Hiring Pipeline",
      description:
        "Review and manage candidates shortlisted for final interviews.",
    },
  };

  return (
    <div className="p-6 space-y-6">

      {/* Tabs at Top */}
      <PipelineTabsNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Dynamic Header */}
      <div className="flex items-start justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            {pageContent[activeTab].title}
          </h1>

          <p className="text-gray-500 mt-1">
            {pageContent[activeTab].description}
          </p>
        </div>

        {activeTab === "hiring-content" && (
          <button
            className="
              px-6
              py-3
              rounded-lg
              bg-blue-600
              text-white
              font-medium
              shadow-sm
              hover:bg-blue-700
              transition
              duration-200
            "
          >
            Save Configuration
          </button>
        )}

      </div>

      {/* Drive Settings */}
      {activeTab === "drive-settings" && (
        <DriveSettingsTab data={pipeline.settings} />
      )}

      {/* Hiring Content */}
      {activeTab === "hiring-content" && (
        <HiringContentTab data={pipeline.content} />
      )}

      {/* Student Readiness */}
      {activeTab === "student-readiness" && (
        <StudentReadinessTab
          data={pipeline.readinessStudents}
        />
      )}

      {/* Shortlisted */}
      {activeTab === "shortlisted" && (
        <ShortlistedTab
          data={pipeline.shortlistedCandidates}
        />
      )}

    </div>
  );
}