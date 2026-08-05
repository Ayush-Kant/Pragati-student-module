import { useOutletContext } from "react-router-dom";

const NotificationCard = ({
  notification,
  onView,
  onEdit,
  onDelete,
}) => {
  const { darkMode } = useOutletContext();

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        darkMode
          ? "border-slate-700 bg-[#151D30] text-white"
          : "border-slate-200 bg-white text-slate-800"
      }`}
    >
      <h3 className="text-lg font-semibold">
        {notification.title}
      </h3>

      <p className="mt-2 text-sm opacity-80">
        {notification.message}
      </p>

      <div className="mt-4 space-y-1 text-sm">
        <p>
          <strong>Recipient:</strong>{" "}
          {notification.recipientType}
        </p>

        <p>
          <strong>Scheduled:</strong>{" "}
          {notification.sendAt || "-"}
        </p>
      </div>

      <div className="mt-5 flex gap-2">
        <button onClick={() => onView?.(notification)}>
          View
        </button>

        <button onClick={() => onEdit?.(notification)}>
          Edit
        </button>

        <button onClick={() => onDelete?.(notification)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;