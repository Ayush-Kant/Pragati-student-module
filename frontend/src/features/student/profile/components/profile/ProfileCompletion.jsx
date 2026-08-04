import { Check } from 'lucide-react';

/**
 * Profile completion component for the sidebar.
 * Shows a linear progress bar with orange gradient and green success text.
 * @param {Object} props - The component props
 * @param {number} [props.completion=0] - The completion percentage (0-100)
 * @param {Array<{id: string, label: string, completed: boolean, required: boolean}>} [props.steps=[]] - Array of completion steps
 * @param {boolean} [props.loading=false] - Whether the completion data is loading
 * @returns {JSX.Element} The profile completion component
 */
const ProfileCompletion = ({ completion = 0, steps = [], loading = false }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
        <div className="flex items-center justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  const safeCompletion = Math.min(100, Math.max(0, Number.isNaN(completion) ? 0 : completion));

  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm hover:shadow-orange-500/10 transition-all duration-300">
      <h3 className="text-lg font-semibold text-white mb-3">Profile Completion</h3>

      <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden mb-3">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 transition-all duration-700 ease-out"
          style={{ width: `${safeCompletion}%` }}
          role="progressbar"
          aria-valuenow={safeCompletion}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-white">{Math.round(safeCompletion)}%</span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-green-500">
          <Check className="h-4 w-4" />
          Profile looks great!
        </span>
      </div>

      {steps.length > 0 && (
        <div className="mt-4 space-y-2">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  step.completed ? 'bg-green-500' : 'bg-gray-600'
                }`}
              />
              <span className={`text-xs transition-colors duration-300 ${step.completed ? 'text-gray-300' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileCompletion;
