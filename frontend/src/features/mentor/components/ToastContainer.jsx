import Toast from "./Toast";
import useToast from "../hooks/useToast";

export default function ToastContainer() {
  const {
    notifications,
    dismissToast,
  } = useToast();

  if (!notifications.length) {
    return null;
  }

  return (
    <div
      className="
        fixed
        top-4
        right-4
        sm:top-5
        sm:right-5
        z-[9999]
        flex
        flex-col
        gap-4
        w-[90vw]
        max-w-md
      "
    >
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          id={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onDismiss={dismissToast}
        />
      ))}
    </div>
  );
}