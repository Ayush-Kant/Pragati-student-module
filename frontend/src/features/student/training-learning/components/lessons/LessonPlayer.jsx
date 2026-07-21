// LessonPlayer.jsx
// Renders the active lesson's content (video/reading/quiz placeholder) plus
// lesson navigation controls (mark complete / next lesson)

import LessonOverview from "./LessonOverview";
import EmptyState from "../common/EmptyState";

const LessonPlayer = ({ lesson, onMarkComplete, onNext, hasNext }) => {
  if (!lesson) {
    return <EmptyState title="Select a lesson" message="Choose a lesson from the list to start learning." icon="🎬" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
        {lesson.type === "video" && lesson.videoUrl ? (
          <video key={lesson.id} controls className="w-full h-full">
            <source src={lesson.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : lesson.type === "quiz" ? (
          <div className="text-center text-white p-6">
            <p className="text-lg font-semibold">📝 {lesson.title}</p>
            <p className="text-sm text-gray-300 mt-1">{lesson.duration}</p>
          </div>
        ) : (
          <div className="text-center text-white p-6">
            <p className="text-lg font-semibold">📖 {lesson.title}</p>
            <p className="text-sm text-gray-300 mt-1">{lesson.duration}</p>
          </div>
        )}
      </div>

      <h3 className="text-base font-semibold text-gray-800">{lesson.title}</h3>
      <LessonOverview lesson={lesson} />

      <div className="flex items-center gap-3">
        <button
          onClick={() => onMarkComplete?.(lesson.id)}
          disabled={lesson.completed}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            lesson.completed
              ? "bg-green-50 text-green-600 cursor-default"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {lesson.completed ? "✓ Completed" : "Mark as Complete"}
        </button>

        {hasNext && (
          <button
            onClick={onNext}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Next Lesson →
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonPlayer;
