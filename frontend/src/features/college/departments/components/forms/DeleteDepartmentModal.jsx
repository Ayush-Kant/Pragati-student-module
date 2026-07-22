const DeleteDepartmentModal = ({
  isOpen,
  department,
  onConfirm,
  onCancel,
  darkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className={`rounded-xl p-6 w-[90%] max-w-md ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white'}`}>
        <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : ''}`}>
          Delete Department
        </h2>

        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Are you sure you want to delete{" "}
          <strong>{department?.name}</strong>?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className={`border px-4 py-2 rounded-lg ${darkMode ? 'border-[#3D3D3D] text-gray-300 hover:bg-[#3D3D3D]' : ''}`}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDepartmentModal;