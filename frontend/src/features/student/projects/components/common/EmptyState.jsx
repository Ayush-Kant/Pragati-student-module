import React from "react";
import { FolderOpen } from "lucide-react";

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No data found",
  description = "There are no items to display at this moment.",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm my-4">
      <div className="p-4 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl mb-4">
        <Icon className="w-10 h-10 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-brand-500/20 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
