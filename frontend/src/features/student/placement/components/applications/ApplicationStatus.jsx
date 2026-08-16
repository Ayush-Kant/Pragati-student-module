// src/features/student/placement/components/applications/ApplicationStatus.jsx
// Status badge component conforming to the 7-state placement status model.

import React from 'react';
import { getApplicationStatusBadge } from '../../utils/applicationHelpers';

export default function ApplicationStatus({ status, size = 'sm' }) {
  const badge = getApplicationStatusBadge(status);

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-2xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm',
  };

  return (
    <span
      className={`badge inline-flex items-center border ${badge.className} ${
        sizeClasses[size] || sizeClasses.sm
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${badge.dot}`} />
      {badge.label}
    </span>
  );
}
