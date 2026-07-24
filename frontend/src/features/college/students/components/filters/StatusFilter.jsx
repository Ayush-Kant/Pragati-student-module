import { PLACEMENT_STATUSES } from "../../constants/studentConstants"

const StatusFilter = ({ value, onChange, darkMode }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`h-10 px-3 rounded-xl text-sm outline-none cursor-pointer ${
      darkMode
        ? 'bg-[#1A1A1A] border border-[#3D3D3D] text-gray-300 focus:border-[#ff6d34]'
        : 'bg-white border border-gray-200 text-gray-600 focus:border-blue-400'
    }`}
  >
    {PLACEMENT_STATUSES.map((s) => <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>)}
  </select>
)

export default StatusFilter