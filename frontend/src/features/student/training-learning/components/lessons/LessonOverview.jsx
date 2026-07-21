// LessonOverview.jsx
// Metadata panel for the currently active lesson (type, duration, completion)

const LessonOverview = ({ lesson }) => {
  if (!lesson) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 border-b border-gray-100 pb-4">
      <span className="capitalize">{lesson.type}</span>
      <span>·</span>
      <span>{lesson.duration}</span>
      <span>·</span>
      <span className={lesson.completed ? "text-green-600 font-medium" : "text-gray-400"}>
        {lesson.completed ? "Completed" : "Not completed"}
      </span>
    </div>
  );
};

export default LessonOverview;
