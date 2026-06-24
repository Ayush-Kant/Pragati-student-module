const ArchiveAssessmentModal = ({
  isOpen,
  onClose,
  assessment,
  onArchive,
}) => {
  if (!isOpen || !assessment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Archive Assessment
        </h2>

        <p className="mb-6 text-gray-600">
          Are you sure you want to archive
          <span className="font-semibold">
            {" "}
            {assessment.title}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onArchive(assessment.id);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveAssessmentModal;