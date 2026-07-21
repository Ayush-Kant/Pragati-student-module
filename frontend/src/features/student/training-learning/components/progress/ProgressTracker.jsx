// ProgressTracker.jsx
// Combines course-level progress + module completion into one panel,
// used inside the "Progress" tab of CourseDetails

import CourseProgress from "../courses/CourseProgress";
import ModuleCompletion from "./ModuleCompletion";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorState from "../common/ErrorState";

const ProgressTracker = ({ course, progress, loading, error, onRetry }) => {
  if (loading) return <LoadingSpinner label="Loading progress..." />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!course || !progress) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col gap-6">
      <CourseProgress
        progress={progress.progress}
        completedLessons={progress.completedLessons}
        totalLessons={progress.totalLessons}
      />
      <ModuleCompletion completedModules={progress.completedModules} totalModules={progress.totalModules} />

      {progress.status === "Completed" && (
        <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg px-3 py-2">
          🎉 You've completed this course!
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
