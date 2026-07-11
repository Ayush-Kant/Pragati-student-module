import { DRIVE_STATUS } from "../../constants/placementDriveConstants";

const StatusFilter = ({
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <div className="w-full md:w-52">
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/20"
      >
        <option value="">All Status</option>

        {DRIVE_STATUS.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatusFilter;