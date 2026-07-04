import { COURSES } from "../../constants/studentConstants"

const CourseFilter = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm outline-none text-gray-600 cursor-pointer focus:border-blue-400"
  >
    {COURSES.map((c) => <option key={c} value={c}>{c === "All" ? "All Courses" : c}</option>)}
  </select>
)

export default CourseFilter