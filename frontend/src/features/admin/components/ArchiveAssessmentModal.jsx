const ArchiveAssessmentModal = ({
  isOpen,
  onClose,
  assessment,
  onArchive,
}) => {
  if (!isOpen || !assessment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-2xl transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Archive Assessment
        </h2>

        {/* Message */}
        <p className="mb-6 text-gray-600 dark:text-slate-300">
          Are you sure you want to archive
          <span className="font-semibold text-gray-900 dark:text-white">
            {" "}
            "{assessment.title}"
          </span>
          ?
        </p>

        {/* Warning Box */}
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-300">
            This assessment will be moved to the <strong>Archived</strong> section.
            You can restore it later if your application supports restoration.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onArchive(assessment.id);
              onClose();
            }}
            className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveAssessmentModal;