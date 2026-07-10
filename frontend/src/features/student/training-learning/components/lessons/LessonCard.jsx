// LessonCard.jsx
// Single lesson row shown inside a module's lesson list

const TYPE_ICONS = { video: "▶️", reading: "📖", quiz: "📝" };

const LessonCard = ({ lesson, active, onSelect }) => {
  return (
    <button
      onClick={() => onSelect?.(lesson)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
        active ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50 border border-transparent"
      }`}
    >
      <span className="text-lg shrink-0">{lesson.completed ? "✅" : TYPE_ICONS[lesson.type] || "📄"}</span>
      <span className="flex-1 min-w-0">
        <span className={`block text-sm truncate ${active ? "text-blue-700 font-medium" : "text-gray-700"}`}>
          {lesson.title}
        </span>
        <span className="block text-xs text-gray-400">{lesson.duration}</span>
      </span>
    </button>
  );
};

export default LessonCard;
