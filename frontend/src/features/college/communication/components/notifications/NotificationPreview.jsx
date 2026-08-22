import { useOutletContext } from "react-router-dom";

const NotificationPreview = ({ notification }) => {
  const { darkMode } = useOutletContext();

  if (!notification) return null;

  return (
    <div
      className={`rounded-2xl border p-6 ${
        darkMode
          ? "border-slate-700 bg-[#151D30] text-white"
          : "border-slate-200 bg-white text-slate-800"
      }`}
    >
      <h2 className="mb-3 text-xl font-bold">
        {notification.title}
      </h2>

      <p className="mb-4 whitespace-pre-wrap">
        {notification.message}
      </p>

      <hr className="my-4" />

      <p>
        <strong>Recipient:</strong>{" "}
        {notification.recipientType}
      </p>

      <p className="mt-2">
        <strong>Scheduled:</strong>{" "}
        {notification.sendAt || "Send Immediately"}
      </p>
    </div>
  );
};

export default NotificationPreview;