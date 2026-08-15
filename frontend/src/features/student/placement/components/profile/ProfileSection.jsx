// src/features/student/placement/components/profile/ProfileSection.jsx
// Reusable wrapper for profile sections with header, icon, status, and edit actions.

import React from 'react';

export default function ProfileSection({
  id,
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className = '',
}) {
  return (
    <section
      id={id}
      className={`card shadow-card hover:shadow-card-md transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-100">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="section-title text-base lg:text-lg">{title}</h3>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
        </div>

        {action && <div>{action}</div>}
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  );
}
