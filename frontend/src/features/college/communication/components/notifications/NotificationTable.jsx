import { useOutletContext } from "react-router-dom";
import LoadingSpinner from "../../../common/LoadingSpinner";
import EmptyState from "../../../common/EmptyState";

const NotificationTable = ({
  notifications = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) => {
  const { darkMode } = useOutletContext();

  if (loading) return <LoadingSpinner />;

  if (!notifications.length) {
    return <EmptyState title="No Notifications Found" />;
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        darkMode ? "border-slate-700" : "border-slate-200"
      }`}
    >
      <table className="w-full">
        <thead
          className={
            darkMode
              ? "bg-slate-800 text-white"
              : "bg-slate-100 text-slate-700"
          }
        >
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Recipient</th>
            <th className="px-4 py-3 text-left">Scheduled</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {notifications.map((notification) => (
            <tr
              key={notification.id}
              className="border-t"
            >
              <td className="px-4 py-3">{notification.title}</td>
              <td className="px-4 py-3">
                {notification.recipientType}
              </td>
              <td className="px-4 py-3">
                {notification.sendAt || "-"}
              </td>

              <td className="space-x-2 px-4 py-3 text-center">
                <button onClick={() => onView?.(notification)}>
                  View
                </button>

                <button onClick={() => onEdit?.(notification)}>
                  Edit
                </button>

                <button onClick={() => onDelete?.(notification)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationTable;