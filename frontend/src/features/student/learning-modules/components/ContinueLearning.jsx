import { BookOpen, Clock, Play, TrendingUp } from "lucide-react";

/**
 * ContinueLearning component showing resume state for a module.
 *
 * @param {object} props
 * @param {object} props.module - Learning module data.
 * @param {function} props.onResume - Callback when resume is clicked.
 * @returns {JSX.Element}
 */
const ContinueLearning = ({ module, onResume }) => {
  if (!module) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            {module.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2">
            {module.description}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            module.level === "Beginner"
              ? "bg-green-100 text-green-800"
              : module.level === "Intermediate"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {module.level}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">Progress</span>
          <span className="text-sm font-medium text-slate-600">
            {module.progress}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, module.progress))}%` }}
          />
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4 flex-wrap">
        <div className="flex items-center gap-1">
          <BookOpen size={14} />
          <span>{module.lessons?.length || 0} lessons</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{module.duration} min</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp size={14} />
          <span>{module.progress}% complete</span>
        </div>
      </div>

      {/* Last accessed */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Last accessed: {new Date(module.lastAccessed).toLocaleDateString()}
        </span>
        <button
          onClick={onResume}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          <Play size={16} />
          Resume Learning
        </button>
      </div>
    </div>
  );
};

export default ContinueLearning;
