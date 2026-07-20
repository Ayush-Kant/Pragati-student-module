// AssignmentDetail.jsx
// Purpose: Full assignment detail page showing the problem statement, rubric, and submission form (SM-06)

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAssignments from "../../assignments/hooks/useAssignments";
import useSubmission from "../../assignments/hooks/useSubmission";
import useFeedback from "../../assignments/hooks/useFeedback";
import useDarkMode from "../../assignments/hooks/useDarkMode";
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
import { ArrowLeft, ClipboardList, FileSearch, Moon, Sun } from "lucide-react";

/* ── Skeleton ── */
const DetailSkeleton = ({ darkMode }) => (
  <div className="flex flex-col gap-6">
    <SkeletonLine className="h-4 w-36" darkMode={darkMode} />
    <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
      <div className={`px-6 py-8 flex flex-col gap-3 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
        <SkeletonLine className="h-3 w-24" darkMode={darkMode} />
        <SkeletonLine className="h-7 w-72" darkMode={darkMode} />
      </div>
      <div className="px-6 py-5 grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <SkeletonLine className="h-2.5 w-14" darkMode={darkMode} />
            <SkeletonLine className="h-5 w-20" darkMode={darkMode} />
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 flex flex-col gap-4">
        <SkeletonLine className="h-52 rounded-2xl" darkMode={darkMode} />
        <SkeletonLine className="h-36 rounded-2xl" darkMode={darkMode} />
      </div>
      <div className="flex flex-col gap-4">
        <SkeletonLine className="h-40 rounded-2xl" darkMode={darkMode} />
        <SkeletonLine className="h-52 rounded-2xl" darkMode={darkMode} />
      </div>
    </div>
  </div>
);

/* ── 404 state ── */
const NotFound = ({ onBack, darkMode }) => (
  <div className="flex flex-col items-center justify-center py-28 gap-4 text-center">
    <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center ${darkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-100"}`}>
      <FileSearch className={`w-8 h-8 ${darkMode ? "text-slate-600" : "text-gray-300"}`} />
    </div>
    <div>
      <p className={`text-base font-semibold tracking-tight ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
        Assignment not found
      </p>
      <p className={`text-sm mt-1 max-w-xs leading-relaxed ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
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
  const { darkMode, toggleDarkMode } = useDarkMode();

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
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-950" : "bg-[#f8f9fb]"}`}>

      {/* ── Page header — matches AssignmentsPage header style ── */}
      <div className={`border-b sticky top-0 z-10 transition-colors duration-300 ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100/80"}`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2">
              <button
                onClick={handleBack}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors group ${darkMode ? "text-slate-400 hover:text-slate-200" : "text-gray-500 hover:text-gray-900"}`}
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
                <span className="hidden sm:inline">Assignments</span>
              </button>

              {assignment && (
                <>
                  <span className={`text-sm ${darkMode ? "text-slate-600" : "text-gray-300"}`}>/</span>
                  <span className={`text-sm font-semibold tracking-tight truncate max-w-xs ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {assignment.title}
                  </span>
                </>
              )}
            </nav>

            {/* Right: icon + theme toggle */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Theme-aware icon container — same as Dashboard */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md shrink-0 ${
                darkMode
                  ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-300/30"
                  : "bg-blue-50 shadow-blue-100/60"
              }`}>
                <ClipboardList
                  className={`w-4 h-4 ${darkMode ? "text-white" : "text-blue-600"}`}
                />
              </div>

              {/* Dark mode toggle button */}
              <button
                onClick={toggleDarkMode}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-200 shadow-sm ${
                  darkMode
                    ? "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col gap-7">

        {isLoading && <DetailSkeleton darkMode={darkMode} />}

        {!isLoading && assignmentsError && (
          <ErrorState
            message={assignmentsError}
            onRetry={() => navigate(0)}
            darkMode={darkMode}
          />
        )}

        {!isLoading && !assignmentsError && !assignment && (
          <NotFound onBack={handleBack} darkMode={darkMode} />
        )}

        {!isLoading && !assignmentsError && assignment && (
          <>
            {/* Assignment hero card */}
            <AssignmentDetails assignment={assignment} darkMode={darkMode} />

            {/* ── Two-column content ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Main column — submission form + history */}
              <div className="xl:col-span-2 flex flex-col gap-6">
                {/* Section label */}
                <div className="flex items-center gap-2 -mb-1">
                  <p className={`text-[11px] font-semibold uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                    Submission
                  </p>
                </div>

                <AssignmentSubmissionForm
                  assignment={assignment}
                  onSubmit={handleSubmit}
                  loading={submissionLoading}
                  submissionError={submissionError}
                  submissionMessage={submissionMessage}
                  darkMode={darkMode}
                />

                <SubmissionHistory history={submissionHistory} darkMode={darkMode} />
              </div>

              {/* Sidebar */}
              <div className="flex flex-col gap-5">
                {/* Section label */}
                <div className="flex items-center gap-2 -mb-1">
                  <p className={`text-[11px] font-semibold uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                    Evaluation
                  </p>
                </div>

                <GradeCard
                  marksObtained={grades?.[0]?.marksObtained ?? null}
                  totalMarks={assignment.marks}
                  title="Your Grade"
                  darkMode={darkMode}
                />

                {feedback && <FeedbackCard feedback={feedback} darkMode={darkMode} />}

                <EvaluationSummary criteria={grades?.[0]?.criteria ?? []} darkMode={darkMode} />

                {grades?.[0]?.remarks?.length > 0 && (
                  <InstructorRemarks remarks={grades[0].remarks} darkMode={darkMode} />
                )}

                <DeadlineTracker assignments={[assignment]} darkMode={darkMode} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentDetail;
