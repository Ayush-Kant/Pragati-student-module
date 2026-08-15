// src/features/student/placement/components/common/EmptyState.jsx
import React from 'react';
import { Inbox, FileQuestion, SearchX, Award, AlertCircle } from 'lucide-react';

const ICON_MAP = {
  inbox: Inbox,
  search: SearchX,
  file: FileQuestion,
  award: Award,
  alert: AlertCircle,
};

/**
 * Reusable Empty State component
 * @param {string} [title='No data available'] - Main title
 * @param {string} [description] - Subtext or instructions
 * @param {string} [icon='inbox'] - 'inbox' | 'search' | 'file' | 'award' | 'alert'
 * @param {string} [actionLabel] - CTA button label
 * @param {Function} [onAction] - CTA button handler
 * @param {React.ReactNode} [children] - Optional custom content
 * @param {string} [className] - Additional classes
 */
export default function EmptyState({
  title = 'No data available',
  description = 'There is nothing to display at this moment.',
  icon = 'inbox',
  actionLabel,
  onAction,
  children,
  className = '',
}) {
  const IconComponent = ICON_MAP[icon] || Inbox;

  return (
    <div
      className={`card flex flex-col items-center justify-center p-8 lg:p-12 text-center border-dashed border-surface-200 bg-surface-50/50 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white border border-surface-200 shadow-sm flex items-center justify-center text-surface-400 mb-4">
        <IconComponent className="w-7 h-7" />
      </div>

      <h3 className="text-base lg:text-lg font-semibold text-surface-800 mb-1">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-surface-500 max-w-md mx-auto mb-6 text-balance">
          {description}
        </p>
      )}

      {children}

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary inline-flex items-center gap-2 shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
