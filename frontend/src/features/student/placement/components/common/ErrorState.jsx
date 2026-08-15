// src/features/student/placement/components/common/ErrorState.jsx
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Reusable Error State component with retry functionality
 * @param {string} [title='Failed to load data'] - Main error title
 * @param {string} [message='An unexpected error occurred. Please try again.'] - Error message
 * @param {Function} [onRetry] - Callback to retry operation
 * @param {boolean} [compact=false] - Compact inline layout for dashboard slots
 * @param {string} [className] - Additional classes
 */
export default function ErrorState({
  title = 'Failed to load data',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  compact = false,
  className = '',
}) {
  if (compact) {
    return (
      <div
        className={`p-4 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between gap-3 text-left ${className}`}
        role="alert"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-rose-900 truncate">
              {title}
            </p>
            <p className="text-xs text-rose-700 truncate">
              {message}
            </p>
          </div>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn px-2.5 py-1 text-xs bg-white text-rose-700 border border-rose-300 hover:bg-rose-50 shrink-0 shadow-xs inline-flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`card flex flex-col items-center justify-center p-8 lg:p-10 text-center border-rose-200 bg-rose-50/40 ${className}`}
      role="alert"
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-3.5 shadow-xs">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <h3 className="text-base font-semibold text-rose-950 mb-1">
        {title}
      </h3>

      <p className="text-sm text-rose-800/80 max-w-md mx-auto mb-5 text-balance">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn inline-flex items-center gap-2 bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
