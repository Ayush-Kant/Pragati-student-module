import React from "react";
import { AlertTriangle, X } from "lucide-react";

export const ConfirmationModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone. Please confirm to proceed.",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${isDestructive ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 p-5 border-t border-gray-100 bg-slate-50/50 rounded-b-2xl">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-semibold text-white rounded-xl transition-all cursor-pointer shadow-sm ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-100"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
