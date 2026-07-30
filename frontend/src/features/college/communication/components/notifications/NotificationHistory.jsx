import { useOutletContext } from "react-router-dom";
import LoadingSpinner from "../../../common/LoadingSpinner";
import EmptyState from "../../../common/EmptyState";

const NotificationHistory = ({
  history = [],
  loading = false,
}) => {
  const { darkMode } = useOutletContext();

  if (loading) return <LoadingSpinner />;

  if (!history.length) {
    return (
      <EmptyState title="No Notification History" />
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div
          key={item.id}
          className={`rounded-2xl border p-4 ${
            darkMode
              ? "border-slate-700 bg-[#151D30]"
              : "border-slate-200 bg-white"
          }`}
        >
          <h3 className="font-semibold">
            {item.title}
          </h3>

          <p className="mt-2 text-sm">
            {item.message}
          </p>

          <div className="mt-3 text-sm opacity-80">
            <p>Recipient: {item.recipientType}</p>
            <p>Sent: {item.sentAt || "-"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationHistory;