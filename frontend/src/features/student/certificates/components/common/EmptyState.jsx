import { Award, ArrowRight } from "lucide-react";

/**
 * Reusable empty-state component.
 *
 * @param {Object} props
 * @param {React.ComponentType} props.icon
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.actionLabel
 * @param {Function} props.onAction
 * @param {string} props.className
 * @returns {JSX.Element}
 */
const EmptyState = ({
  icon: Icon = Award,
  title = "Nothing here yet",
  description = "There is currently no information to display.",
  actionLabel = "",
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`w-full rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm sm:px-8 sm:py-12 md:px-10 md:py-14 ${className}`}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 sm:h-14 sm:w-14">
        <Icon
          className="h-6 w-6 sm:h-7 sm:w-7"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-900 sm:text-lg">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
        {description}
      </p>

      {actionLabel && typeof onAction === "function" ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 sm:px-5 sm:text-sm"
        >
          <span>{actionLabel}</span>

          <ArrowRight
            className="h-4 w-4"
            aria-hidden="true"
          />
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;