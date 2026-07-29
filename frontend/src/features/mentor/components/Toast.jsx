import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from "lucide-react";

export default function Toast({
  id,
  type,
  title,
  message,
  onDismiss,
}) {

  const icons = {
    success: (
      <CheckCircle className="text-green-500" size={28} />
    ),
    error: (
      <AlertCircle className="text-red-500" size={28} />
    ),
    warning: (
      <AlertTriangle className="text-yellow-500" size={28} />
    ),
    info: (
      <Info className="text-blue-500" size={28} />
    ),
  };

  return (
    <div
      className="
        bg-white
        rounded-xl
        shadow-lg
        p-4
        flex
        items-start
        gap-3
        animate-slide-in
        border
        border-gray-100
      "
    >

      <div>
        {icons[type] || icons.info}
      </div>


      <div className="flex-1">

        <h3 className="font-bold text-gray-800 text-sm">
          {title || "Notification"}
        </h3>

        <p className="text-gray-600 text-sm mt-1">
          {message || ""}
        </p>

      </div>


      <button
        onClick={() => onDismiss(id)}
        className="
          text-gray-400
          hover:text-gray-700
        "
      >
        <X size={18}/>
      </button>


    </div>
  );
}