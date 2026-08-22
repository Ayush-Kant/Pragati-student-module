import { useState, useEffect } from "react"
import { validateStudent } from "../../validations/studentValidation"
import { DEPARTMENTS, COURSES, BATCHES, SEMESTERS, PLACEMENT_STATUSES, RESUME_STATUSES } from "../../constants/studentConstants"

const inp = (darkMode) => darkMode
  ? "w-full bg-[#1A1A1A] rounded-xl px-4 h-10 outline-none text-gray-300 text-sm border border-[#3D3D3D] focus:border-[#ff6d34]"
  : "w-full bg-gray-50 rounded-xl px-4 h-10 outline-none text-gray-600 text-sm border border-gray-200 focus:border-blue-400"
const sel = (darkMode) => darkMode
  ? "w-full bg-[#1A1A1A] rounded-xl px-4 h-10 outline-none text-gray-300 text-sm border border-[#3D3D3D] cursor-pointer focus:border-[#ff6d34]"
  : "w-full bg-gray-50 rounded-xl px-4 h-10 outline-none text-gray-600 text-sm border border-gray-200 cursor-pointer focus:border-blue-400"
const lbl = (darkMode) => darkMode ? "text-xs text-gray-500 mb-1 block" : "text-xs text-gray-400 mb-1 block"

const EditStudentForm = ({ student, onSubmit, onCancel, loading, darkMode }) => {
  const [form, setForm] = useState({ ...student, skills: student.skills?.join(", ") || "" })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm({ ...student, skills: student.skills?.join(", ") || "" })
  }, [student])

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
      <div className={`rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white'}`}>
        <div className={`flex items-center justify-between p-5 border-b ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-100'}`}>
          <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Edit Student</h2>
          <button onClick={onCancel} className={`cursor-pointer text-xl ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>✕</button>
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
              <label className={lbl(darkMode)}>{label}</label>
              <input type={type} className={inp(darkMode)} value={form[field] || ""} onChange={set(field)} placeholder={placeholder} />
              {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
            </div>
          ))}

          <div>
            <label className={lbl(darkMode)}>Department *</label>
            <select className={sel(darkMode)} value={form.department} onChange={set("department")}>
              {DEPARTMENTS.filter((d) => d !== "All").map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className={lbl(darkMode)}>Course *</label>
            <select className={sel(darkMode)} value={form.course} onChange={set("course")}>
              {COURSES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className={lbl(darkMode)}>Batch *</label>
            <select className={sel(darkMode)} value={form.batch} onChange={set("batch")}>
              {BATCHES.filter((b) => b !== "All").map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className={lbl(darkMode)}>Semester *</label>
            <select className={sel(darkMode)} value={form.semester} onChange={set("semester")}>
              {SEMESTERS.filter((s) => s !== "All").map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className={lbl(darkMode)}>Placement Status *</label>
            <select className={sel(darkMode)} value={form.placementStatus} onChange={set("placementStatus")}>
              {PLACEMENT_STATUSES.filter((s) => s !== "All").map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className={lbl(darkMode)}>Resume Status</label>
            <select className={sel(darkMode)} value={form.resumeStatus} onChange={set("resumeStatus")}>
              {RESUME_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {form.placementStatus === "Placed" && (
            <>
              <div>
                <label className={lbl(darkMode)}>Placed At</label>
                <input className={inp(darkMode)} value={form.placedAt || ""} onChange={set("placedAt")} placeholder="TCS, Infosys..." />
              </div>
              <div>
                <label className={lbl(darkMode)}>Package</label>
                <input className={inp(darkMode)} value={form.package || ""} onChange={set("package")} placeholder="7.5 LPA" />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <label className={lbl(darkMode)}>Skills (comma separated)</label>
            <input className={inp(darkMode)} value={form.skills} onChange={set("skills")} placeholder="React, Node.js, Python" />
          </div>

          <div>
            <label className={lbl(darkMode)}>LinkedIn</label>
            <input className={inp(darkMode)} value={form.linkedin || ""} onChange={set("linkedin")} placeholder="linkedin.com/in/..." />
          </div>

          <div>
            <label className={lbl(darkMode)}>GitHub</label>
            <input className={inp(darkMode)} value={form.github || ""} onChange={set("github")} placeholder="github.com/..." />
          </div>
        </div>

        <div className={`flex gap-3 p-5 border-t ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-100'}`}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#ff6d34] text-white rounded-xl h-10 text-sm font-semibold hover:bg-[#e85d2b] cursor-pointer disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onCancel}
            className={`flex-1 rounded-xl h-10 text-sm font-semibold cursor-pointer ${darkMode ? 'bg-[#1A1A1A] text-gray-300 hover:bg-[#3D3D3D]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditStudentForm