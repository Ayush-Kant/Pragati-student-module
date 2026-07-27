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
      className={`relative p-4 rounded-xl border transition-all duration-200 ${
        isCompleted
          ? "bg-emerald-50 border-emerald-200"
          : "bg-white border-slate-200 hover:border-blue-300"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Completion toggle */}
        <button
          onClick={handleToggle}
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition cursor-pointer ${
            isCompleted
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-slate-300 hover:border-blue-400 bg-white"
          }`}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted && <CheckCircle2 size={14} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4
              className={`text-sm font-medium ${
                isCompleted ? "text-emerald-900 line-through" : "text-slate-900"
              }`}
            >
              {lesson.title}
            </h4>
            {isCompleted && (
              <span className="text-xs text-emerald-600 font-medium">Completed</span>
            )}
          </div>
          <p className="text-xs text-slate-500 mb-3 line-clamp-2">
            {lesson.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock size={14} />
              <span>{lesson.duration} min</span>
            </div>

            {lesson.resources && lesson.resources.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
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
