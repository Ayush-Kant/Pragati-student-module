// CourseProgress.jsx
// Compact progress bar + stats used inside CourseDetails / dashboards

const CourseProgress = ({ progress = 0, completedLessons = 0, totalLessons = 0 }) => {
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
        <span className="font-medium">Course Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">
        {completedLessons} of {totalLessons} lessons completed
      </p>
    </div>
  );
};

export default CourseProgress;
