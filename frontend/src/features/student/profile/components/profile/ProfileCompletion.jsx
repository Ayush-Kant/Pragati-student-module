import { Check, Circle } from 'lucide-react';

const CircularProgress = ({ value = 0, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          {Math.round(value)}%
        </span>
      </div>
    </div>
  );
};

/**
 * A profile completion component that displays overall completion percentage
 * with a circular progress indicator and a list of completion steps.
 * @param {Object} props - The component props
 * @param {number} [props.completion=0] - The completion percentage (0-100)
 * @param {Array<{id: string, label: string, completed: boolean, required: boolean}>} [props.steps=[]] - Array of completion steps
 * @param {boolean} [props.loading=false] - Whether the completion data is loading
 * @returns {JSX.Element} The profile completion component
 */
const ProfileCompletion = ({ completion = 0, steps = [], loading = false }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Profile Completion
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <CircularProgress value={completion} size={140} strokeWidth={10} />

        <div className="flex-1 w-full space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-700/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    step.completed
                      ? 'border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500'
                  }`}
                >
                  {step.completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {step.label}
                  </p>
                  {step.required && (
                    <p className="text-xs text-orange-500 dark:text-orange-400">
                      Required
                    </p>
                  )}
                </div>
              </div>

              <div className="linear-progress hidden sm:block w-24">
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      step.completed
                        ? 'bg-gradient-to-r from-orange-400 to-orange-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    style={{ width: step.completed ? '100%' : '0%' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
