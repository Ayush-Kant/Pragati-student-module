import { CheckCircle2, Circle, Clock, FileText, Link2, Video } from "lucide-react";

const RESOURCE_TYPE_ICONS = {
  link: Link2,
  video: Video,
  document: FileText,
  pdf: FileText,
};

const RESOURCE_TYPE_COLORS = {
  link: "text-blue-500",
  video: "text-red-500",
  document: "text-emerald-500",
  pdf: "text-emerald-600",
};

/**
 * Lesson card component displaying a lesson with completion toggle.
 *
 * @param {object} props
 * @param {object} props.lesson - Lesson data.
 * @param {function} props.onToggleComplete - Callback when completion is toggled.
 * @param {string} props.moduleId - Parent module id.
 * @returns {JSX.Element}
 */
const LessonCard = ({ lesson, onToggleComplete, moduleId }) => {
  const isCompleted = lesson.isCompleted;

  const handleToggle = () => {
    if (onToggleComplete) {
      onToggleComplete(moduleId, lesson.id, !isCompleted);
    }
  };

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all duration-300 ${
        isCompleted
          ? "border-teal-500/30 bg-gradient-to-r from-teal-500/10 to-teal-600/5 shadow-lg shadow-teal-500/10"
          : "bg-[#0a0a0a] border-gray-800 hover:border-orange-500/40 shadow-inner shadow-black/50 hover:shadow-lg hover:shadow-orange-500/10"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Completion toggle */}
        <button
          onClick={handleToggle}
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition cursor-pointer accent-orange-500 ${
            isCompleted
              ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30"
              : "border-gray-600 hover:border-orange-400 bg-[#0a0a0a]"
          }`}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted && <CheckCircle2 size={14} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4
              className={`text-sm font-medium transition-all duration-300 ${
                isCompleted ? "text-teal-300 line-through" : "text-gray-100"
              }`}
            >
              {lesson.title}
            </h4>
            {isCompleted && (
              <span className="text-xs text-teal-400 font-medium">Completed</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">
            {lesson.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={14} />
              <span>{lesson.duration} min</span>
            </div>

            {lesson.resources && lesson.resources.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <FileText size={14} />
                <span>{lesson.resources.length} resource{lesson.resources.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
