import { BookOpen, Clock, TrendingUp, CheckCircle2 } from "lucide-react";

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

  const isCompleted = module.progress === 100;

  return (
    <div className="bg-gradient-to-r from-orange-500/15 via-[#0a0a0a]/80 to-teal-500/15 border border-orange-500/20 rounded-xl p-5 shadow-2xl shadow-orange-500/5 hover:shadow-orange-500/10 hover:border-orange-500/40 transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100 mb-1">
            {module.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">
            {module.description}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            module.level === "Beginner"
              ? "bg-gradient-to-r from-teal-500/20 to-teal-600/20 text-teal-400 border border-teal-500/30 shadow-lg shadow-teal-500/10"
              : module.level === "Intermediate"
              ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/10"
              : "bg-gradient-to-r from-orange-600/20 to-red-500/20 text-orange-500 border border-orange-600/30 shadow-lg shadow-orange-600/10"
          }`}
        >
          {module.level}
        </span>
      </div>

      {/* Progress bar - FIXED */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-orange-400">Progress</span>
          <span className="text-sm font-medium text-orange-300">
            {module.progress}%
          </span>
        </div>
        <div className="w-full bg-[#0a0a0a] rounded-full h-3 overflow-hidden border border-gray-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? "bg-gradient-to-r from-teal-400 to-teal-500"
                : "bg-gradient-to-r from-orange-400 to-orange-500"
            }`}
            style={{ 
              width: `${Math.max(0, Math.min(100, module.progress))}%`,
              boxShadow: isCompleted 
                ? "0 0 20px rgba(45, 212, 191, 0.4)" 
                : "0 0 20px rgba(251, 146, 60, 0.4)"
            }}
          />
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4 flex-wrap">
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

      {/* Last accessed & Action Button */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Last accessed: {new Date(module.lastAccessed).toLocaleDateString()}
        </span>
        {isCompleted ? (
          <button
            onClick={onResume}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-teal-600 hover:to-teal-700 transition cursor-pointer shadow-lg shadow-teal-500/30"
          >
            <CheckCircle2 size={16} />
            Review Module
          </button>
        ) : (
          <button
            onClick={onResume}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition cursor-pointer shadow-lg shadow-orange-500/30"
          >
            Resume Learning
          </button>
        )}
      </div>
    </div>
  );
};

export default ContinueLearning;