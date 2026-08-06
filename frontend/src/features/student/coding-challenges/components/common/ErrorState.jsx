import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * Reusable error state component.
 *
 * @param {{ error: string, onRetry?: Function, title?: string }} props
 */
const ErrorState = ({ error, onRetry, title = 'Something went wrong' }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="bg-gradient-to-br from-orange-600/20 to-transparent rounded-2xl p-4 mb-4 shadow-inner">
      <AlertTriangle className="w-10 h-10 text-orange-400" aria-hidden="true" />
    </div>
    <h3 className="text-lg font-semibold text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-400 max-w-lg mb-6">{error}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2 bg-orange-500/90 text-white font-semibold rounded-lg shadow hover:brightness-105 transition"
      >
        <RotateCcw size={16} aria-hidden="true" />
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
