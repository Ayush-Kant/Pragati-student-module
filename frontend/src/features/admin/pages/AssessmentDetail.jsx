import { useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { toast } from "react-hot-toast";

import useAssessmentDetail from "../hooks/useAssessmentDetail";

import AssessmentTypeBadge from "../components/AssessmentTypeBadge";
import AssessmentStatusBadge from "../components/AssessmentStatusBadge";
import AssessmentQuestionList from "../components/AssessmentQuestionList";
import AssignAssessmentModal from "../components/AssignAssessmentModal";
import * as adminService from "../services/adminService";

function AssessmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useOutletContext();
  

  const {
    assessment,
    loading,
    refetch,
  } = useAssessmentDetail(id);

  const handleAddMCQQuestion = () => {
    navigate(
      `/admin/assessments/${id}/questions?type=MCQ`
    );
  };

  const handleAddCodingQuestion = () => {
    navigate(
      `/admin/assessments/${id}/questions?type=CODING`
    );
  };

  const handlePublish = async () => {
    try {
      setPublishLoading(true);

      await adminService.publishAssessment(id);

      toast.success(
        "Assessment published successfully"
      );

      await refetch?.();
    } catch (error) {
      toast.error(
        error?.message ||
          "Failed to publish assessment"
      );
    } finally {
      setPublishLoading(false);
    }
  };

  const handleEditQuestion = (question) => {
  navigate(
    `/admin/assessments/${id}/questions?type=${question.type}`,
    {
      state: {
        mode: "edit",
        question,
      },
    }
  );
};

  const handleDeleteQuestion = async (
    questionId
  ) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmDelete) return;

    try {
      await adminService.deleteQuestion(
        id,
        questionId
      );

      toast.success(
        "Question deleted successfully"
      );

      if (refetch) {
        await refetch();
      } else {
        window.location.reload();
      }
    } catch (error) {
      toast.error(
        error?.message ||
          "Failed to delete question"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        Loading assessment...
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="p-4 md:p-6">
        Assessment not found
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800"
            : "bg-white"
        } shadow rounded-lg p-4 md:p-6`}
      >
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              {assessment.title}
            </h1>

            <div className="flex gap-2 mt-3">
              <AssessmentTypeBadge
                type={assessment.type}
              />

              <AssessmentStatusBadge
                status={assessment.status}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button className="px-3 py-2 text-sm md:px-4 md:text-base bg-blue-500 text-white rounded">
              Edit
            </button>

            <button
              onClick={() => navigate(`/admin/assessments/${id}/publish`)}
              className="px-3 py-2 text-sm md:px-4 md:text-base bg-green-600 text-white rounded"
            >
             Publish
            </button>

            <button
              onClick={() =>
                navigate(`/admin/assessments/${id}/assign`)
              }
              className="px-3 py-2 text-sm md:px-4 md:text-base bg-purple-500 text-white rounded"
            >
              Assign To Drive
            </button>

            <button className="px-3 py-2 text-sm md:px-4 md:text-base bg-red-500 text-white rounded">
              Archive
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div>
            <p className="text-sm text-gray-500 md:text-base">
              Difficulty
            </p>
            <p>
              {assessment.difficulty}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 md:text-base">
              Duration
            </p>
            <p>
              {
                assessment.timeLimitMinutes
              }{" "}
              mins
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 md:text-base">
              Total Marks
            </p>
            <p>
              {assessment.totalMarks}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 md:text-base">
              Questions
            </p>
            <p>
              {
                assessment.questions
                  ?.length
              }
            </p>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800"
            : "bg-white"
        } shadow rounded-lg p-4 md:p-6`}
      >
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">
            Questions
          </h2>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={
                handleAddMCQQuestion
              }
              className="px-3 py-2 text-sm md:px-4 md:text-base bg-blue-500 text-white rounded"
            >
              + Add MCQ
            </button>

            <button
              onClick={
                handleAddCodingQuestion
              }
              className="px-3 py-2 text-sm md:px-4 md:text-base bg-purple-500 text-white rounded"
            >
              + Add Coding
            </button>
          </div>
        </div>

        <AssessmentQuestionList
          questions={
            assessment.questions || []
          }
          onEdit={
            handleEditQuestion
          }
          onDelete={
            handleDeleteQuestion
          }
        />
      </div>
    </div>
  );
}

export default AssessmentDetail;