import { DEPARTMENTS } from "../../constants/studentConstants"

const DepartmentFilter = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm outline-none text-gray-600 cursor-pointer focus:border-blue-400"
  >
    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>)}
  </select>
)

export default DepartmentFilter