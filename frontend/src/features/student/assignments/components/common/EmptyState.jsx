import { ClipboardList } from "lucide-react";

const EmptyState = ({
  icon,
  title = "Nothing here yet",
  description = "",
  action,
  darkMode = false,
}) => {
  const Icon = icon ?? <ClipboardList className={`w-8 h-8 ${darkMode ? "text-slate-500" : "text-gray-400"}`} />;

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
      <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center ${darkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-100"}`}>
        {Icon}
      </div>
      <div className="flex flex-col gap-1">
        <p className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-gray-700"}`}>{title}</p>
        {description && (
          <p className={`text-xs max-w-xs leading-relaxed ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};

export default EmptyState;
