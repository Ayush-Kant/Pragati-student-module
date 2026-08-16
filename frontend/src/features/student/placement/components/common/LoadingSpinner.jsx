// src/features/student/placement/components/common/LoadingSpinner.jsx
import React from 'react';

/**
 * Reusable Loading Spinner
 * @param {string} [size='md'] - 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} [text] - Optional loading message below spinner
 * @param {string} [className] - Additional wrapper classes
 */
export default function LoadingSpinner({
  size = 'md',
  text,
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center ${className}`}
      role="status"
      aria-label={text || 'Loading'}
    >
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-primary-200 border-t-primary-600 animate-spin`}
      />
      {text && (
        <p className="mt-3 text-sm font-medium text-surface-500 animate-pulse">
          {text}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
