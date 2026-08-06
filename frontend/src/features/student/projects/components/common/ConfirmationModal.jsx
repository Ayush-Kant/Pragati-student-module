import React from "react";
import { AlertCircle, X } from "lucide-react";

export const ConfirmationModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isDanger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-surface-800 w-full max-w-md rounded-2xl border border-surface-200 dark:border-surface-700 shadow-2xl p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start space-x-4 mb-5">
          <div
            className={`p-3 rounded-full ${
              isDanger
                ? "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400"
                : "bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400"
            }`}
          >
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{title}</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-surface-100 dark:border-surface-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl shadow-md transition-all active:scale-95 ${
              isDanger ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20" : "bg-brand-600 hover:bg-brand-700 shadow-brand-500/20"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
