import { ClipboardList } from "lucide-react";

const EmptyState = ({
  icon,
  title = "Nothing here yet",
  description = "",
  action,
}) => {
  const Icon = icon ?? <ClipboardList className="w-8 h-8 text-gray-400" />;

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
        {Icon}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        {description && (
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};

export default EmptyState;
