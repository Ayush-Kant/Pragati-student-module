import React from "react";

export const SectionHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-surface-900 dark:text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center">{action}</div>}
    </div>
  );
};

export default SectionHeader;
