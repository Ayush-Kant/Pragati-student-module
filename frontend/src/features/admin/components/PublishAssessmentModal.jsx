const PublishAssessmentModal = ({
  isOpen,
  onClose,
  assessment,
  onPublish,
}) => {
  if (!isOpen || !assessment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-4 md:p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg md:text-xl font-bold mb-4">
          Publish Assessment
        </h2>

        <p className="mb-6 text-sm text-gray-600 md:text-base break-words">
          Are you sure you want to publish
          <span className="font-semibold">
            {" "}
            {assessment.title}
          </span>
          ?
        </p>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm md:px-4 md:text-base border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onPublish(assessment.id);
              onClose();
            }}
            className="px-3 py-2 text-sm md:px-4 md:text-base bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishAssessmentModal;