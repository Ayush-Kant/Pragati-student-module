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
      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group"
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
      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
        {module.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 mb-4 line-clamp-2">
        {module.description}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <ProgressBar progress={module.progress} showPercentage />
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{formatDuration(module.duration)}</span>
        </div>
        <div className="flex items-center gap-1 text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <Play size={14} />
          <span>Continue</span>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
