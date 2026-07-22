const ConfirmationModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  darkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onCancel}
    >
      <div
        className={`w-full max-w-md rounded-xl border p-6 shadow-2xl ${
          darkMode ? 'border-[#3D3D3D] bg-[#2D2D2D]' : 'border-gray-200 bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h2>

        <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
              darkMode
                ? 'border-[#3D3D3D] text-gray-300 hover:bg-[#1A1A1A]'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;