import { getStatusColor } from "../../utils/placementDriveHelpers";

const StatusBadge = ({ status }) => {
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
        ${getStatusColor(status)}
      `}
    >
      {status}
    </span>
  );
};

export default StatusBadge;