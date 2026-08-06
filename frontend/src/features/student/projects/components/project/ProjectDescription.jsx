import React from "react";

export const ProjectDescription = ({ description, tags = [] }) => {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 shadow-sm mb-6">
      <h3 className="text-sm font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-3">
        Project Description & Goals
      </h3>
      <p className="text-sm md:text-base text-surface-700 dark:text-surface-300 leading-relaxed mb-5">
        {description}
      </p>

      {tags && tags.length > 0 && (
        <div className="pt-4 border-t border-surface-100 dark:border-surface-700 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-surface-400 dark:text-surface-500 mr-1">Technologies:</span>
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-xs font-semibold bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDescription;
