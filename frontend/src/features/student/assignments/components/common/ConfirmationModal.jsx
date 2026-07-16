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
}) => {
  if (!isOpen) return null;

  return (
    <div className="responsive-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="responsive-modal-panel bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-100">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {danger && (
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
            )}
            <div>
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
              {description && (
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onCancel}
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="responsive-modal-footer flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="text-sm font-semibold text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
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
