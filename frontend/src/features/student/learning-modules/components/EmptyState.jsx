import { BookOpen, GraduationCap, Layers } from "lucide-react";

/**
 * Empty state component displaying a friendly message with optional action.
 *
 * @param {object} props
 * @param {string} props.title - Empty state title.
 * @param {string} props.description - Empty state description.
 * @param {string} [props.icon] - Emoji or icon text.
 * @param {JSX.Element} [props.actionButton] - Optional CTA button.
 * @returns {JSX.Element}
 */
const EmptyState = ({ title, description, icon, actionButton }) => {
  const IconComponent = icon === "GraduationCap" ? GraduationCap : icon === "Layers" ? Layers : BookOpen;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="mb-4 text-5xl animate-pulse">
          {typeof icon === "string" && (icon === "GraduationCap" || icon === "Layers" || icon === "BookOpen") ? (
            <IconComponent className="w-16 h-16 text-orange-500/50 drop-shadow-lg mx-auto" />
          ) : (
            <span role="img" aria-label={title} className="text-6xl text-orange-500/50 drop-shadow-lg animate-pulse">
              {icon}
            </span>
          )}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md mb-6">{description}</p>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
