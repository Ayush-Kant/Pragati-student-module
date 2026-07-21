import React from 'react';

export const SectionHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-space-border mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-100 tracking-tight glow-text">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
};

export default SectionHeader;
