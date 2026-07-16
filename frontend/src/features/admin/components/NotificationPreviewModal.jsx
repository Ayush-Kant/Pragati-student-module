const NotificationPreviewModal = ({
  open,
  onClose,
  onConfirm,
  notification,
  submitting,
}) => {
  if (!open) return null;

  const { recipients, channels, subject, message, schedule } = notification;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-semibold">Notification Preview</h2>

        <div className="space-y-5">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Recipients
            </h3>

            <p className="text-gray-600">
              {recipients.groups.length > 0
                ? recipients.groups.join(", ")
                : "None"}
            </p>

            {recipients.specificUser && (
              <p className="mt-1 text-sm text-gray-500">
                Specific User: {recipients.specificUser}
              </p>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Channels
            </h3>

            <p className="text-gray-600">
              {channels.length > 0 ? channels.join(", ") : "None"}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Subject
            </h3>

            <p>{subject}</p>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Message
            </h3>

            <div className="rounded border bg-gray-50 p-4 whitespace-pre-wrap">
              {message}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Schedule
            </h3>

            <p>
              {schedule.type === "now"
                ? "Send Now"
                : new Date(schedule.date).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="rounded border px-4 py-2 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={onConfirm}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreviewModal;
