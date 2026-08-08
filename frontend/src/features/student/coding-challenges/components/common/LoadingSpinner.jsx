import { Loader2 } from 'lucide-react';

/**
 * Reusable loading spinner.
 *
 * @param {{ size?: 'sm'|'md'|'lg', label?: string }} props
 */
const LoadingSpinner = ({ size = 'md', label = 'Loading...' }) => {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3" role="status" aria-label={label}>
      <div className="p-3 rounded-full bg-gradient-to-tr from-orange-500/20 to-transparent">
        <Loader2
          className={`${sizeClasses[size]} text-orange-400 animate-spin drop-shadow-xl`}
          aria-hidden="true"
        />
      </div>
      <span className="text-sm text-gray-300">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
