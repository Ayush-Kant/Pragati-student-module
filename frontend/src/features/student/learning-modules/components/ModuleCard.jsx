import { Clock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { formatDuration, getLevelBadgeColor, getCategoryBadgeColor } from "../utils/learningHelpers";

/**
 * Module card component displaying learning module summary.
 *
 * @param {object} props
 * @param {object} props.module - Learning module data.
 * @param {function} [props.onClick] - Click handler for the card.
 * @returns {JSX.Element}
 */
const ModuleCard = ({ module, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(module);
    } else if (module.id) {
      navigate(`/student/learning-modules/${module.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-5 shadow-xl hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/60 hover:-translate-y-2 hover:scale-[1.02] hover:ring-1 hover:ring-orange-500/20 transition-all duration-300 cursor-pointer group"
    >
      {/* Header: badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeColor(module.level)}`}
        >
          {module.level}
        </span>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(module.category)}`}
        >
          {module.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-orange-400 transition-colors">
        {module.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {module.description}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <ProgressBar progress={module.progress} showPercentage />
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{formatDuration(module.duration)}</span>
        </div>
        <div className="flex items-center gap-1 text-orange-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <Play size={14} />
          <span>Continue</span>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
