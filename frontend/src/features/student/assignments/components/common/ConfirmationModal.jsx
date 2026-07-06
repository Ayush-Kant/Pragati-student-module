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
    <div className="responsive-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="responsive-modal-panel bg-white rounded-2xl shadow-lg w-full max-w-sm p-6">
        <h3 className="text-base font-bold text-gray-800 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mb-5">{description}</p>
        )}
        <div className="responsive-modal-footer flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`text-sm font-semibold text-white px-4 py-2 rounded-xl transition-colors ${
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
