import { Loader2 } from 'lucide-react';

/**
 * A reusable empty state component with optional icon, title, description, and action button.
 * @param {Object} props - The component props
 * @param {string} props.title - The empty state title
 * @param {string} [props.description] - The empty state description
 * @param {React.ReactNode} [props.icon] - Optional icon element (emoji or lucide icon)
 * @param {Object} [props.actionButton] - Optional action button config { label: string, onClick: Function }
 * @returns {JSX.Element} The empty state component
 */
const EmptyState = ({ title, description, icon, actionButton }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {icon && (
        <div className="mb-4 text-4xl text-gray-400 dark:text-gray-500">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </h3>
      {description && (
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 max-w-md">
          {description}
        </p>
      )}
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          {actionButton.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;