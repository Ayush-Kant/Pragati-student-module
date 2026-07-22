const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  darkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className={`rounded-xl shadow-lg w-full max-w-md p-6 ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white'}`}>

        <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : ''}`}>
          {title}
        </h2>

        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
          {message}
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onCancel}
            className={`px-4 py-2 border rounded-lg ${darkMode ? 'border-[#3D3D3D] text-gray-300' : 'border-gray-300 text-slate-700'}`}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Confirm
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmationModal;