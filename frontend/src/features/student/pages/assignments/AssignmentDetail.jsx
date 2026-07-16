// AssignmentDetail.jsx
// Purpose: Full assignment detail page showing the problem statement, rubric, and submission form (SM-06)

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAssignments from "../../assignments/hooks/useAssignments";
import useSubmission from "../../assignments/hooks/useSubmission";
import useFeedback from "../../assignments/hooks/useFeedback";
import AssignmentDetails from "../../assignments/components/assignments/AssignmentDetails";
import AssignmentSubmissionForm from "../../assignments/components/submission/AssignmentSubmissionForm";
import SubmissionHistory from "../../assignments/components/submission/SubmissionHistory";
import GradeCard from "../../assignments/components/feedback/GradeCard";
import FeedbackCard from "../../assignments/components/feedback/FeedbackCard";
import EvaluationSummary from "../../assignments/components/feedback/EvaluationSummary";
import InstructorRemarks from "../../assignments/components/feedback/InstructorRemarks";
import DeadlineTracker from "../../assignments/components/progress/DeadlineTracker";
import ErrorState from "../../assignments/components/common/ErrorState";
import { SkeletonLine } from "../../assignments/components/common/LoadingSpinner";
import { ArrowLeft, ClipboardList, FileSearch } from "lucide-react";

/* ── Skeleton ── */
const DetailSkeleton = () => (
  <div className="flex flex-col gap-6">
    <SkeletonLine className="h-4 w-36" />
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-slate-100 px-6 py-8 flex flex-col gap-3">
        <SkeletonLine className="h-3 w-24 bg-slate-200" />
        <SkeletonLine className="h-7 w-72 bg-slate-200" />
      </div>
      <div className="px-6 py-5 grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <SkeletonLine className="h-2.5 w-14" />
            <SkeletonLine className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 flex flex-col gap-4">
        <SkeletonLine className="h-52 rounded-2xl" />
        <SkeletonLine className="h-36 rounded-2xl" />
      </div>
      <div className="flex flex-col gap-4">
        <SkeletonLine className="h-40 rounded-2xl" />
        <SkeletonLine className="h-52 rounded-2xl" />
      </div>
    </div>
  </div>
);

/* ── 404 state ── */
const NotFound = ({ onBack }) => (
  <div className="flex flex-col items-center justify-center py-28 gap-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
      <FileSearch className="w-8 h-8 text-gray-300" />
    </div>
    <div>
      <p className="text-base font-semibold text-gray-700 tracking-tight">
        Assignment not found
      </p>
      <p className="text-sm text-gray-400 mt-1 max-w-xs leading-relaxed">
        This assignment doesn&apos;t exist or you don&apos;t have access.
      </p>
    </div>
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-blue-200/50"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Assignments
    </button>
  </div>
);

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    loading: assignmentsLoading,
    error: assignmentsError,
    getAssignmentById,
  } = useAssignments();

  const {
    loading: submissionLoading,
    submissionHistory,
    message: submissionMessage,
    error: submissionError,
    handleSubmitAssignment,
    fetchSubmissionHistory,
  } = useSubmission();

  const {
    feedback,
    grades,
    loading: feedbackLoading,
    fetchFeedback,
    fetchGrades,
  } = useFeedback();

  const assignment = getAssignmentById(id);

  useEffect(() => {
    if (id) {
      fetchSubmissionHistory(id);
      fetchFeedback(id);
      fetchGrades();
    }
  }, [id]);

  const handleSubmit = async (submissionData) => {
    await handleSubmitAssignment(id, submissionData);
    fetchSubmissionHistory(id);
  };

  const handleBack = () => navigate("/student/assignments");

  const isLoading = assignmentsLoading || feedbackLoading;

  return (
    <div className="min-h-screen bg-[#f8f9fb]">

      {/* ── Page header — matches AssignmentsPage header style ── */}
      <div className="bg-white border-b border-gray-100/80 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2">
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
                <span className="hidden sm:inline">Assignments</span>
              </button>

              {assignment && (
                <>
                  <span className="text-gray-300 text-sm">/</span>
                  <span className="text-sm font-semibold text-gray-900 tracking-tight truncate max-w-xs">
                    {assignment.title}
                  </span>
                </>
              )}
            </nav>

            {/* Page icon */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-300/30 shrink-0">
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col gap-7">

        {isLoading && <DetailSkeleton />}

        {!isLoading && assignmentsError && (
          <ErrorState
            message={assignmentsError}
            onRetry={() => navigate(0)}
          />
        )}

        {!isLoading && !assignmentsError && !assignment && (
          <NotFound onBack={handleBack} />
        )}

        {!isLoading && !assignmentsError && assignment && (
          <>
            {/* Assignment hero card */}
            <AssignmentDetails assignment={assignment} />

            {/* ── Two-column content ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Main column — submission form + history */}
              <div className="xl:col-span-2 flex flex-col gap-6">
                {/* Section label */}
                <div className="flex items-center gap-2 -mb-1">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Submission
                  </p>
                </div>

                <AssignmentSubmissionForm
                  assignment={assignment}
                  onSubmit={handleSubmit}
                  loading={submissionLoading}
                  submissionError={submissionError}
                  submissionMessage={submissionMessage}
                />

                <SubmissionHistory history={submissionHistory} />
              </div>

              {/* Sidebar */}
              <div className="flex flex-col gap-5">
                {/* Section label */}
                <div className="flex items-center gap-2 -mb-1">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Evaluation
                  </p>
                </div>

                <GradeCard
                  marksObtained={grades?.[0]?.marksObtained ?? null}
                  totalMarks={assignment.marks}
                  title="Your Grade"
                />

                {feedback && <FeedbackCard feedback={feedback} />}

                <EvaluationSummary criteria={grades?.[0]?.criteria ?? []} />

                {grades?.[0]?.remarks?.length > 0 && (
                  <InstructorRemarks remarks={grades[0].remarks} />
                )}

                <DeadlineTracker assignments={[assignment]} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentDetail;
