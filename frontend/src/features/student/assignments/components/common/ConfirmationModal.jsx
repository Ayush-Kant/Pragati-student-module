import { AlertTriangle, X } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  title = "Are you sure?",
  description = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
  darkMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="responsive-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className={`responsive-modal-panel rounded-2xl shadow-xl w-full max-w-sm p-6 border transition-colors ${
        darkMode
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-gray-100"
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {danger && (
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${darkMode ? "bg-red-900/30" : "bg-red-50"}`}>
                <AlertTriangle className={`w-5 h-5 ${darkMode ? "text-red-400" : "text-red-500"}`} />
              </div>
            )}
            <div>
              <h3 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{title}</h3>
              {description && (
                <p className={`text-sm mt-1 leading-relaxed ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onCancel}
            className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              darkMode
                ? "text-slate-500 hover:text-slate-300 hover:bg-slate-700"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="responsive-modal-footer flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className={`text-sm font-semibold px-4 py-2 rounded-xl border transition-colors ${
              darkMode
                ? "text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white"
                : "text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`text-sm font-semibold text-white px-4 py-2 rounded-xl transition-all hover:scale-[1.02] shadow-sm ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
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
