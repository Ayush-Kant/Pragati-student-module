import { BATCHES } from "../../constants/studentConstants"

const BatchFilter = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm outline-none text-gray-600 cursor-pointer focus:border-blue-400"
  >
    {BATCHES.map((b) => <option key={b} value={b}>{b === "All" ? "All Batches" : b}</option>)}
  </select>
)

export default BatchFilter