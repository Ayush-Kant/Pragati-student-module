import { getPlacementColor } from "../../utils/studentHelpers"

const StatusBadge = ({ status }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getPlacementColor(status)}`}>
    {status}
  </span>
)

export default StatusBadge