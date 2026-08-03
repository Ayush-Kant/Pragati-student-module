import {
  CheckCircle,
  X,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";

export default function Toast({
  id,
  type = "info",
  title,
  message,
  onDismiss,
}) {
  const icons = {
    success: (
      <CheckCircle
        className="text-green-500"
        size={28}
      />
    ),

    error: (
      <AlertCircle
        className="text-red-500"
        size={28}
      />
    ),

    warning: (
      <AlertTriangle
        className="text-yellow-500"
        size={28}
      />
    ),

    info: (
      <Info
        className="text-blue-500"
        size={28}
      />
    ),
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(100%);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .toast-animation {
            animation: slideIn 0.35s ease-out;
          }
        `}
      </style>

      <div
        role="alert"
        className="
          toast-animation
          w-full
          bg-white
          rounded-xl
          shadow-lg
          border
          border-gray-100
          p-4
          flex
          items-start
          gap-3
        "
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          {icons[type] || icons.info}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className="
              font-bold
              text-gray-800
              text-sm
              break-words
            "
          >
            {title || "Notification"}
          </h3>

          <p
            className="
              text-gray-600
              text-sm
              mt-1
              break-words
            "
          >
            {message || " "}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => onDismiss?.(id)}
          className="
            text-gray-400
            hover:text-gray-700
            transition
            duration-200
            flex-shrink-0
          "
          aria-label="Dismiss notification"
        >
          <X size={18} />
        </button>
      </div>
    </>
  );
}