import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useDriveDetail from "../hooks/useDriveDetail";

import DrivePipelineBoard from "../components/DrivePipelineBoard";
import DriveActionBar from "../components/DriveActionBar";
import CandidateTable from "../components/CandidateTable";

import AssignTestModal from "../components/AssignTestModal";
import AssignCourseModal from "../components/AssignCourseModal";
import ShortlistModal from "../components/ShortlistModal";

import DriveStatusBadge from "../components/DriveStatusBadge";
import DriveStageBadge from "../components/DriveStageBadge";

const DriveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { drive, candidates, loading, error, refreshDrive, refreshCandidates } =
    useDriveDetail(id);

  const [showAssignTest, setShowAssignTest] = useState(false);
  const [showAssignCourse, setShowAssignCourse] = useState(false);
  const [showShortlist, setShowShortlist] = useState(false);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading drive details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded border border-red-300 bg-red-50 p-4">
          Failed to load drive details.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 rounded border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
      >
        ← Back to Drives
      </button>
      {/* Header */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{drive?.title}</h1>

          <DriveStatusBadge status={drive?.status} />

          <DriveStageBadge stage={drive?.currentStage} />
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Company: {drive?.company?.name}
        </div>

        {/* Assigned Test */}
        {drive?.assignedTest && (
          <div className="mt-4">
            <span className="mr-2 text-sm font-medium">Assigned Test:</span>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm">
              {drive.assignedTest.title}
            </span>
          </div>
        )}

        {/* Assigned Course */}
        {drive?.assignedCourse && (
          <div className="mt-3">
            <span className="mr-2 text-sm font-medium">Assigned Course:</span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm">
              {drive.assignedCourse.title}
            </span>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => setShowAssignTest(true)}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Assign Test
          </button>

          <button
            onClick={() => setShowAssignCourse(true)}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            Assign Course
          </button>
        </div>
      </div>

      {/* Pipeline Board */}
      <DrivePipelineBoard
        pipeline={drive?.pipeline}
        currentStage={drive?.currentStage}
        status={drive?.status}
      />

      {/* Action Bar */}
      <DriveActionBar
        drive={drive}
        refreshDrive={refreshDrive}
        refreshCandidates={refreshCandidates}
        onOpenShortlist={() => setShowShortlist(true)}
      />

      {/* Candidate Table */}
      <CandidateTable
        driveId={id}
        candidates={candidates}
        refreshCandidates={refreshCandidates}
      />

      {/* Modals */}
      <AssignTestModal
        open={showAssignTest}
        onClose={() => setShowAssignTest(false)}
        driveId={id}
        refreshDrive={refreshDrive}
      />

      <AssignCourseModal
        open={showAssignCourse}
        onClose={() => setShowAssignCourse(false)}
        driveId={id}
        refreshDrive={refreshDrive}
      />

      <ShortlistModal
        open={showShortlist}
        onClose={() => setShowShortlist(false)}
        driveId={id}
        refreshCandidates={refreshCandidates}
      />
    </div>
  );
};

export default DriveDetail;
