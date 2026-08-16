// src/features/student/placement/components/common/SkeletonLoader.jsx
import React from 'react';

/**
 * Reusable Skeleton Placeholder for various UI layouts
 * @param {string} [variant='card'] - 'card' | 'table' | 'list' | 'chart' | 'stats' | 'text'
 * @param {number} [count=1] - Number of skeleton items
 * @param {string} [className] - Additional wrapper classes
 */
export default function SkeletonLoader({
  variant = 'card',
  count = 1,
  className = '',
}) {
  const renderItem = (index) => {
    switch (variant) {
      case 'stats':
        return (
          <div
            key={index}
            className="card p-5 animate-pulse flex flex-col justify-between h-28"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 bg-surface-200 rounded w-24" />
              <div className="w-8 h-8 bg-surface-200 rounded-lg" />
            </div>
            <div className="h-7 bg-surface-200 rounded w-16 mt-2" />
          </div>
        );

      case 'chart':
        return (
          <div key={index} className="card p-6 animate-pulse space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-surface-200 rounded w-1/3" />
              <div className="h-4 bg-surface-200 rounded w-20" />
            </div>
            <div className="h-64 bg-surface-100 rounded-xl flex items-end p-4 gap-4">
              <div className="h-1/3 bg-surface-200 rounded-t flex-1" />
              <div className="h-1/2 bg-surface-200 rounded-t flex-1" />
              <div className="h-3/4 bg-surface-200 rounded-t flex-1" />
              <div className="h-2/3 bg-surface-200 rounded-t flex-1" />
              <div className="h-5/6 bg-surface-200 rounded-t flex-1" />
            </div>
          </div>
        );

      case 'table':
        return (
          <div key={index} className="card p-4 animate-pulse space-y-3">
            <div className="h-10 bg-surface-100 rounded-lg" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-surface-50 rounded-lg flex items-center px-4 gap-4">
                <div className="h-4 bg-surface-200 rounded w-1/4" />
                <div className="h-4 bg-surface-200 rounded w-1/4" />
                <div className="h-4 bg-surface-200 rounded w-1/6" />
                <div className="h-4 bg-surface-200 rounded w-1/6" />
              </div>
            ))}
          </div>
        );

      case 'list':
        return (
          <div key={index} className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-surface-100 flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-surface-200 rounded w-1/2" />
                  <div className="h-3 bg-surface-100 rounded w-3/4" />
                </div>
                <div className="h-6 bg-surface-200 rounded-full w-16" />
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div key={index} className="space-y-2 animate-pulse">
            <div className="h-4 bg-surface-200 rounded w-3/4" />
            <div className="h-4 bg-surface-200 rounded w-full" />
            <div className="h-4 bg-surface-200 rounded w-5/6" />
          </div>
        );

      case 'card':
      default:
        return (
          <div key={index} className="card p-6 animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-surface-200 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-surface-200 rounded w-1/2" />
                <div className="h-3 bg-surface-100 rounded w-1/3" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3.5 bg-surface-100 rounded w-full" />
              <div className="h-3.5 bg-surface-100 rounded w-4/5" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => renderItem(i))}
    </div>
  );
}
