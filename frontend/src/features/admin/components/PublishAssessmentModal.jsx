const PublishAssessmentModal = ({
  isOpen,
  onClose,
  assessment,
  onPublish,
}) => {
  if (!isOpen || !assessment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Publish Assessment
        </h2>

        <p className="mb-6 text-gray-600">
          Are you sure you want to publish
          <span className="font-semibold">
            {" "}
            {assessment.title}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onPublish(assessment.id);
              onClose();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishAssessmentModal;