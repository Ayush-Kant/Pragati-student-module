// CourseCard.jsx
// Card summary for a single course in the course grid

import { COURSE_STATUS_COLORS } from "../../constants/trainingLearningConstants";

const CourseCard = ({ course, onView }) => {
  const statusColor = COURSE_STATUS_COLORS[course.status] || COURSE_STATUS_COLORS["Not Started"];

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className="h-36 w-full overflow-hidden bg-gray-100">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {course.category}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor.bg} ${statusColor.text}`}>
            {course.status}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{course.title}</h3>
        <p className="text-xs text-gray-500">
          {course.instructor} · {course.level} · {course.duration}
        </p>

        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>{course.progress}% complete</span>
            <span>
              {course.completedLessons}/{course.totalLessons} lessons
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${course.progress}%` }} />
          </div>
        </div>

        <button
          onClick={() => onView?.(course)}
          className="mt-3 w-full text-sm font-medium py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {course.progress > 0 ? "Continue Learning" : "Start Course"}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
