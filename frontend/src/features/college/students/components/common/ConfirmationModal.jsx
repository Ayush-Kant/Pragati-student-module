const ConfirmationModal = ({ title, message, onConfirm, onCancel, confirmLabel = "Confirm", danger = false, darkMode }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
    <div className={`rounded-2xl p-6 w-full max-w-md shadow-xl ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white'}`}>
      <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className={`px-4 py-2 text-sm rounded-xl cursor-pointer ${darkMode ? 'text-gray-300 bg-[#1A1A1A] hover:bg-[#3D3D3D]' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 text-sm text-white rounded-xl cursor-pointer ${
            danger ? "bg-red-500 hover:bg-red-600" : "bg-[#ff6d34] hover:bg-[#e85d2b]"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
)

export default ConfirmationModal