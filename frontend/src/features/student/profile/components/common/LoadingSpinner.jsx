import { Loader2 } from 'lucide-react';

/**
 * A reusable loading spinner component with size and color variants.
 * @param {Object} props - The component props
 * @param {'sm'|'md'|'lg'} [props.size='md'] - The size variant of the spinner
 * @param {string} [props.color='text-orange-500'] - The Tailwind color class for the spinner
 * @returns {JSX.Element} The loading spinner component
 */
const LoadingSpinner = ({ size = 'md', color = 'text-orange-500' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const spinnerClass = `animate-spin ${sizeMap[size] || sizeMap.md} ${color}`;

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={spinnerClass} />
    </div>
  );
};

export default LoadingSpinner;