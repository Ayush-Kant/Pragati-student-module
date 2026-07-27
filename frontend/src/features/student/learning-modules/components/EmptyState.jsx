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
        <div className="mb-4 text-5xl">
          {typeof icon === "string" && (icon === "GraduationCap" || icon === "Layers" || icon === "BookOpen") ? (
            <IconComponent className="w-16 h-16 text-slate-300 mx-auto" />
          ) : (
            <span role="img" aria-label={title}>
              {icon}
            </span>
          )}
        </div>
      )}
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-md mb-6">{description}</p>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
