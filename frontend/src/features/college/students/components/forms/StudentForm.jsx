import { useState } from "react"
import { validateStudent } from "../../validations/studentValidation"
import { DEPARTMENTS, COURSES, BATCHES, SEMESTERS, PLACEMENT_STATUSES, RESUME_STATUSES } from "../../constants/studentConstants"

const EMPTY_FORM = {
  name: "", enrollmentNo: "", email: "", phone: "", department: "",
  course: "", batch: "", semester: "", cgpa: "", placementStatus: "Eligible",
  resumeStatus: "Not Uploaded", skills: "", address: "", linkedin: "",
  github: "", placedAt: "", package: "",
}

const inp = "w-full bg-gray-50 rounded-xl px-4 h-10 outline-none text-gray-600 text-sm border border-gray-200 focus:border-blue-400"
const sel = "w-full bg-gray-50 rounded-xl px-4 h-10 outline-none text-gray-600 text-sm border border-gray-200 cursor-pointer focus:border-blue-400"
const lbl = "text-xs text-gray-400 mb-1 block"

const StudentForm = ({ onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  const handleSubmit = () => {
    const skillsArray = form.skills ? form.skills.split(",").map((s) => s.trim()).filter(Boolean) : []
    const data = { ...form, skills: skillsArray, cgpa: parseFloat(form.cgpa), semester: parseInt(form.semester) }
    const { isValid, errors: err } = validateStudent(data)
    if (!isValid) { setErrors(err); return }
    onSubmit(data)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">Add New Student</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 cursor-pointer text-xl">✕</button>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Full Name *", field: "name", placeholder: "Rahul Sharma" },
            { label: "Enrollment No *", field: "enrollmentNo", placeholder: "2023CS001" },
            { label: "Email *", field: "email", placeholder: "rahul@college.edu", type: "email" },
            { label: "Phone *", field: "phone", placeholder: "9876543210" },
            { label: "Address", field: "address", placeholder: "123 MG Road, Delhi" },
            { label: "CGPA *", field: "cgpa", placeholder: "8.65", type: "number" },
          ].map(({ label, field, placeholder, type = "text" }) => (
            <div key={field}>
              <label className={lbl}>{label}</label>
              <input type={type} className={inp} value={form[field]} onChange={set(field)} placeholder={placeholder} />
              {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
            </div>
          ))}

          <div>
            <label className={lbl}>Department *</label>
            <select className={sel} value={form.department} onChange={set("department")}>
              <option value="">Select Department</option>
              {DEPARTMENTS.filter((d) => d !== "All").map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
          </div>

          <div>
            <label className={lbl}>Course *</label>
            <select className={sel} value={form.course} onChange={set("course")}>
              <option value="">Select Course</option>
              {COURSES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.course && <p className="text-red-400 text-xs mt-1">{errors.course}</p>}
          </div>

          <div>
            <label className={lbl}>Batch *</label>
            <select className={sel} value={form.batch} onChange={set("batch")}>
              <option value="">Select Batch</option>
              {BATCHES.filter((b) => b !== "All").map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            {errors.batch && <p className="text-red-400 text-xs mt-1">{errors.batch}</p>}
          </div>

          <div>
            <label className={lbl}>Semester *</label>
            <select className={sel} value={form.semester} onChange={set("semester")}>
              <option value="">Select Semester</option>
              {SEMESTERS.filter((s) => s !== "All").map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.semester && <p className="text-red-400 text-xs mt-1">{errors.semester}</p>}
          </div>

          <div>
            <label className={lbl}>Placement Status *</label>
            <select className={sel} value={form.placementStatus} onChange={set("placementStatus")}>
              {PLACEMENT_STATUSES.filter((s) => s !== "All").map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className={lbl}>Resume Status</label>
            <select className={sel} value={form.resumeStatus} onChange={set("resumeStatus")}>
              {RESUME_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {form.placementStatus === "Placed" && (
            <>
              <div>
                <label className={lbl}>Placed At</label>
                <input className={inp} value={form.placedAt} onChange={set("placedAt")} placeholder="TCS, Infosys..." />
              </div>
              <div>
                <label className={lbl}>Package</label>
                <input className={inp} value={form.package} onChange={set("package")} placeholder="7.5 LPA" />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <label className={lbl}>Skills (comma separated)</label>
            <input className={inp} value={form.skills} onChange={set("skills")} placeholder="React, Node.js, Python" />
          </div>

          <div>
            <label className={lbl}>LinkedIn</label>
            <input className={inp} value={form.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/..." />
          </div>

          <div>
            <label className={lbl}>GitHub</label>
            <input className={inp} value={form.github} onChange={set("github")} placeholder="github.com/..." />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white rounded-xl h-10 text-sm font-semibold hover:bg-blue-700 cursor-pointer disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Student"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-600 rounded-xl h-10 text-sm font-semibold hover:bg-gray-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentForm