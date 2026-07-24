import { getPlacementColor } from "../../utils/studentHelpers"

const StatusBadge = ({ status, darkMode }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${darkMode ? getPlacementColor(status).replace('bg-emerald-100', 'bg-[#00bea3]/20').replace('text-emerald-700', 'text-[#00bea3]').replace('bg-blue-100', 'bg-[#ff6d34]/20').replace('text-blue-700', 'text-[#ff6d34]').replace('bg-red-100', 'bg-red-500/20').replace('text-red-700', 'text-red-400').replace('bg-gray-100', 'bg-[#3D3D3D]').replace('text-gray-600', 'text-gray-400') : getPlacementColor(status)}`}>
    {status}
  </span>
)

export default StatusBadge