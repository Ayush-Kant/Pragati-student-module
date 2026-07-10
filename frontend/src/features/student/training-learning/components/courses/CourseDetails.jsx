// CourseDetails.jsx
// Full course detail view: hero banner, progress, and tabbed lessons/resources content.
// The `children` slot renders whatever the current tab needs (LessonList, LearningResources, ...)

import CourseProgress from "./CourseProgress";
import SectionHeader from "../common/SectionHeader";
import { COURSE_STATUS_COLORS } from "../../constants/trainingLearningConstants";

const CourseDetails = ({ course, activeTab, onTabChange, tabs = ["Lessons", "Resources", "Progress"], children }) => {
  if (!course) return null;

  const statusColor = COURSE_STATUS_COLORS[course.status] || COURSE_STATUS_COLORS["Not Started"];

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-900">
        <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover opacity-40" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 gap-2">
          <span className={`w-fit text-xs font-medium px-2 py-0.5 rounded-full ${statusColor.bg} ${statusColor.text}`}>
            {course.status}
          </span>
          <h1 className="text-white text-xl md:text-2xl font-bold">{course.title}</h1>
          <p className="text-gray-200 text-sm">
            {course.instructor} · {course.level} · {course.duration}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600">{course.description}</p>

      <CourseProgress
        progress={course.progress}
        completedLessons={course.completedLessons}
        totalLessons={course.totalLessons}
      />

      {/* Tabs */}
      <div>
        <SectionHeader
          title="Course Content"
          action={
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange?.(tab)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          }
        />
        {children}
      </div>
    </div>
  );
};

export default CourseDetails;
