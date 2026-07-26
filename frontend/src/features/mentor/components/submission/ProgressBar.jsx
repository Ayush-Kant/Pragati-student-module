export default function ProgressBar({
  value,
  color = "bg-blue-500",
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`${color} h-full rounded-full`}
          style={{
            width: `${value}%`,
          }}
        />
      </div>

      <span className="text-xs font-medium text-gray-600">
        {value}%
      </span>
    </div>
  );
}