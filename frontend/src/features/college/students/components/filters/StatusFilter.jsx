import { PLACEMENT_STATUSES } from "../../constants/studentConstants"

const StatusFilter = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm outline-none text-gray-600 cursor-pointer focus:border-blue-400"
  >
    {PLACEMENT_STATUSES.map((s) => <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>)}
  </select>
)

export default StatusFilter