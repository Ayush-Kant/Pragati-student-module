const DeleteJobPostingModal = ({
  isOpen,
  onClose,
  onConfirm,
  darkMode,
}) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className={`rounded-xl p-8 w-[400px] ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white'}`}>

        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>
          Delete Job Posting
        </h2>

        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
          Are you sure you want to delete this job posting?
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className={`px-5 py-2 border rounded-lg ${darkMode ? 'border-[#3D3D3D] text-gray-300' : 'border-gray-300 text-slate-700'}`}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteJobPostingModal;