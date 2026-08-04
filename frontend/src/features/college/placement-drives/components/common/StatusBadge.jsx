import { getStatusColor } from "../../utils/placementDriveHelpers";

const StatusBadge = ({ status, darkMode }) => {
  const color = getStatusColor(status);
  const darkColor = darkMode
    ? color
        .replace('bg-blue-100', 'bg-blue-500/20')
        .replace('text-blue-700', 'text-blue-400')
        .replace('bg-green-100', 'bg-green-500/20')
        .replace('text-green-700', 'text-green-400')
        .replace('bg-gray-100', 'bg-[#3D3D3D]')
        .replace('text-gray-700', 'text-gray-400')
        .replace('text-gray-600', 'text-gray-400')
        .replace('bg-red-100', 'bg-red-500/20')
        .replace('text-red-700', 'text-red-400')
    : color;

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-medium
        ${darkColor}
      `}
    >
      {status}
    </span>
  );
};

export default StatusBadge;