import { Loader2 } from "lucide-react";

/**
 * Loading spinner component with size and color variants.
 *
 * @param {object} props
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Spinner size.
 * @param {string} [props.color] - Tailwind text color class.
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({ size = "md", color = "text-blue-600" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center py-8">
      <Loader2
        className={`${sizeClasses[size]} ${color} animate-spin`}
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;
