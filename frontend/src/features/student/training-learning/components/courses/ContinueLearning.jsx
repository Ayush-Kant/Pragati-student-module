// ContinueLearning.jsx
// Horizontal list of in-progress courses for quick resume

import CourseProgress from "./CourseProgress";
import EmptyState from "../common/EmptyState";

const ContinueLearning = ({ courses = [], onResume }) => {
  if (!courses.length) {
    return <EmptyState title="No courses in progress" message="Start a course to see it here." icon="▶️" />;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {courses.map((course) => (
        <div
          key={course.id}
          className="min-w-[260px] bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex flex-col gap-3"
        >
          <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">{course.title}</h4>
          <CourseProgress
            progress={course.progress}
            completedLessons={course.completedLessons}
            totalLessons={course.totalLessons}
          />
          <button
            onClick={() => onResume?.(course)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 self-start"
          >
            Resume →
          </button>
        </div>
      ))}
    </div>
  );
};

export default ContinueLearning;
