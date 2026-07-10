const DeleteJobPostingModal = ({
  isOpen,
  onClose,
  onConfirm,
}) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

      <div className="bg-white rounded-xl p-8 w-[400px]">

        <h2 className="text-2xl font-bold mb-4">
          Delete Job Posting
        </h2>

        <p className="text-slate-600 mb-6">
          Are you sure you want to delete this job posting?
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg"
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