/**
 * A reusable section header component with title, subtitle, icon, and optional action button.
 * @param {Object} props - The component props
 * @param {string} props.title - The section title
 * @param {string} [props.subtitle] - Optional subtitle text
 * @param {React.ReactNode} [props.icon] - Optional icon element
 * @param {React.ReactNode} [props.actionButton] - Optional action button element
 * @returns {JSX.Element} The section header component
 */
const SectionHeader = ({ title, subtitle, icon, actionButton }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="text-orange-500">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actionButton && (
        <div className="shrink-0">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;