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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Hiring Pipeline
        </h1>

        <p className="text-gray-500">
          Configure and manage hiring pipeline.
        </p>
      </div>

      <PipelineTabsNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "drive-settings" && (
        <DriveSettingsTab data={pipeline.settings} />
      )}

      {activeTab === "hiring-content" && (
        <HiringContentTab data={pipeline.content} />
      )}

      {activeTab === "student-readiness" && (
        <StudentReadinessTab
          data={pipeline.readinessStudents}
        />
      )}

      {activeTab === "shortlisted" && (
        <ShortlistedTab
          data={pipeline.shortlistedCandidates}
        />
      )}
    </div>
  );
}