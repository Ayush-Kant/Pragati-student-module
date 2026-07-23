import { useState } from "react";
import toast from "react-hot-toast";

import AssessmentTabs from "../components/AssessmentTabs";
import AssessmentTable from "../components/AssessmentTable";
import AssessmentCreateModal from "../components/AssessmentCreateModal";
import AssessmentEditModal from "../components/AssessmentEditModal";
import ArchiveAssessmentModal from "../components/ArchiveAssessmentModal";
import PublishAssessmentModal from "../components/PublishAssessmentModal";

import useAssessments from "../hooks/useAssessments";

const AssessmentManagement = () => {
  const {
    loading,

    assessments,
    setAssessments,

    filteredAssessments,

    activeTab,
    setActiveTab,

    search,
    setSearch,

    type,
    setType,

    difficulty,
    setDifficulty,

    status,
    setStatus,
  } = useAssessments();

  const [openCreateModal, setOpenCreateModal] =
    useState(false);

  const [openEditModal, setOpenEditModal] =
    useState(false);

  const [selectedAssessment, setSelectedAssessment] =
    useState(null);

  const [openArchiveModal, setOpenArchiveModal] =
    useState(false);

  const [
    selectedArchiveAssessment,
    setSelectedArchiveAssessment,
  ] = useState(null);

  const [openPublishModal, setOpenPublishModal] =
    useState(false);

  const [
    selectedPublishAssessment,
    setSelectedPublishAssessment,
  ] = useState(null);

  /* =========================
     CREATE
  ========================= */

  const handleCreateAssessment = (
    newAssessment
  ) => {
    setAssessments((prev) => [
      ...prev,
      newAssessment,
    ]);

    toast.success(
      "Assessment created successfully"
    );
  };

  /* =========================
     EDIT
  ========================= */

  const handleEditClick = (
    assessment
  ) => {
    setSelectedAssessment(
      assessment
    );

    setOpenEditModal(true);
  };

  const handleSaveAssessment = (
    updatedAssessment
  ) => {
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id ===
        updatedAssessment.id
          ? updatedAssessment
          : assessment
      )
    );

    toast.success(
      "Assessment updated successfully"
    );
  };

  /* =========================
     ARCHIVE
  ========================= */

  const handleArchiveClick = (
    assessment
  ) => {
    setSelectedArchiveAssessment(
      assessment
    );

    setOpenArchiveModal(true);
  };

  const handleArchiveAssessment = (
    assessmentId
  ) => {
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === assessmentId
          ? {
              ...assessment,
              status: "Archived",
            }
          : assessment
      )
    );

    toast.success(
      "Assessment archived successfully"
    );
  };

  /* =========================
     PUBLISH
  ========================= */

  const handlePublishClick = (
    assessment
  ) => {
    setSelectedPublishAssessment(
      assessment
    );

    setOpenPublishModal(true);
  };

  const handlePublishAssessment = (
    assessmentId
  ) => {
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === assessmentId
          ? {
              ...assessment,
              status: "Active",
            }
          : assessment
      )
    );

    toast.success(
      "Assessment published successfully"
    );
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>

          <div className="h-12 bg-gray-200 rounded"></div>

          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Assessment Control
        </h1>

        <button
          onClick={() =>
            setOpenCreateModal(true)
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Create Test
        </button>
      </div>

      {/* Tabs */}

      <AssessmentTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Search & Filters */}

      <div className="mt-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search Assessment"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border rounded-lg p-2"
        />

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
          className="border rounded-lg p-2"
        >
          <option>All</option>
          <option>MCQ</option>
          <option>Coding</option>
        </select>

        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value)
          }
          className="border rounded-lg p-2"
        >
          <option>All</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="border rounded-lg p-2"
        >
          <option>All</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
      </div>

      {/* Count */}

      <p className="mb-4 font-medium">
        Showing {filteredAssessments.length} of{" "}
        {assessments.length} assessments
      </p>

      {/* Table */}

      <AssessmentTable
        assessments={filteredAssessments}
        onEdit={handleEditClick}
        onArchive={handleArchiveClick}
        onPublish={handlePublishClick}
      />

      {/* Create Modal */}

      <AssessmentCreateModal
        isOpen={openCreateModal}
        onClose={() =>
          setOpenCreateModal(false)
        }
        onCreate={handleCreateAssessment}
      />

      {/* Edit Modal */}

      <AssessmentEditModal
        isOpen={openEditModal}
        onClose={() =>
          setOpenEditModal(false)
        }
        assessment={selectedAssessment}
        onSave={handleSaveAssessment}
      />

      {/* Archive Modal */}

      <ArchiveAssessmentModal
        isOpen={openArchiveModal}
        onClose={() =>
          setOpenArchiveModal(false)
        }
        assessment={
          selectedArchiveAssessment
        }
        onArchive={
          handleArchiveAssessment
        }
      />

      {/* Publish Modal */}

      <PublishAssessmentModal
        isOpen={openPublishModal}
        onClose={() =>
          setOpenPublishModal(false)
        }
        assessment={
          selectedPublishAssessment
        }
        onPublish={
          handlePublishAssessment
        }
      />
    </div>
  );
};

export default AssessmentManagement;