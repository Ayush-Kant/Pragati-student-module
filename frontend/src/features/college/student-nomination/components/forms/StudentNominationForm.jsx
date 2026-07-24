import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useEffect } from "react";
import { getCompanies } from "../../../company-job-postings/services/companyJobPostingService";

const StudentNominationForm = ({ student, onClose, onSave }) => {
  const { darkMode } = useOutletContext();

  /* =====================================
        STATES
  ====================================== */
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    package: "",
    remarks: "",
  });
  const [companies, setCompanies] = useState([]);

  /* =====================================
      NOMINATE STUDENT
  ===================================== */
  useEffect(() => {
    const loadCompanies = async () => {
      const data = await getCompanies();
      console.log("Companies:", data);
      setCompanies(data);
    };

    loadCompanies();
  }, []);
  const handleNominate = () => {
  if (!formData.company.trim() || !formData.role.trim()) {
    alert("Please fill Company and Role before nominating.")
    return
  }

  const companyMap = {
    "Google": 1,
    "Microsoft": 2,
    "Amazon": 3,
    "Adobe": 4,
    "Salesforce": 5,
    "Oracle": 6,
    "Infosys": 7,
    "TCS": 8,
  }

  const newNomination = {
    // for frontend validation
    company: formData.company,
    role: formData.role,
    package: formData.package || "0",
    remarks: formData.remarks,

    // for backend API
    student_id: student.id,
    company_id: companyMap[formData.company] || 1,
    company_name: formData.company,
  }

  if (onSave) onSave(newNomination)
  onClose()
}
  return (
    <div
      className={`rounded-3xl border shadow-lg ${darkMode ? "border-[#3D3D3D] bg-[#2D2D2D]" : "border-slate-200 bg-white"
        }`}
    >
      {/* HEADER */}
      <div
        className={`flex items-center gap-3 border-b px-8 py-6 ${darkMode ? "border-[#3D3D3D]" : "border-slate-200"
          }`}
      >
        <div
          className={`rounded-2xl p-3 ${darkMode ? "bg-[#ff6d34]/10 text-[#ff6d34]" : "bg-orange-100 text-[#ff7a00]"
            }`}
        >
          <UserPlus size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Student Nomination Form</h2>
          <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Nominate eligible students for placement opportunities.
          </p>
        </div>
      </div>

      {/* FORM BODY */}
      <div className="space-y-8 p-8">
        <div>
          <h3 className="mb-6 text-lg font-semibold">Student Information</h3>
          <div
            className={`rounded-3xl border p-6 ${darkMode ? "border-[#3D3D3D] bg-[#1A1A1A]" : "border-slate-200 bg-slate-50"
              }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold ${darkMode ? "bg-[#ff6d34]/10 text-[#ff6d34]" : "bg-orange-100 text-[#ff7a00]"
                  }`}
              >
                {student?.name?.charAt(0) || "S"}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="trunAe text-xl font-bold">{student?.name}</h2>
                <p className={`mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {student?.enrollmentNo}
                </p>
              </div>
            </div>

            <div className={`my-6 border-t ${darkMode ? "border-slate-700" : "border-slate-200"}`} />

            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              <div>
                <p className={`text-xs uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  Department
                </p>
                <p className="mt-2 font-semibold">{student?.department}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  Batch
                </p>
                <p className="mt-2 font-semibold">{student?.batch}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  CGPA
                </p>
                <p className="mt-2 font-semibold">{student?.cgpa}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  Email
                </p>
                <p className="mt-2 truncate font-semibold">{student?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold">Nomination Details</h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Company</label>
              <select
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${darkMode ? "border-slate-700 bg-slate-800 focus:border-[#ff7a00]" : "border-slate-300 bg-white focus:border-[#ff7a00]"
                  }`}
              >
                <option value="">Select Company</option>
                <option>Google</option>
                <option>Microsoft</option>
                <option>Amazon</option>
                <option>Adobe</option>
                <option>Salesforce</option>
                <option>Oracle</option>
                <option>Infosys</option>
                <option>TCS</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Job Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                placeholder="Software Engineer"
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${darkMode ? "border-slate-700 bg-slate-800 focus:border-[#ff7a00]" : "border-slate-300 bg-white focus:border-[#ff7a00]"
                  }`}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Package (LPA)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.package}
                onChange={(e) => setFormData((prev) => ({ ...prev, package: e.target.value }))}
                placeholder="12"
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${darkMode ? "border-slate-700 bg-slate-800 focus:border-[#ff7a00]" : "border-slate-300 bg-white focus:border-[#ff7a00]"
                  }`}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <div
                className={`flex h-[50px] items-center rounded-xl border px-4 ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-300 bg-slate-50"
                  }`}
              >
                <span className="rounded-full bg-[#ff6d34]/10 px-3 py-1 text-sm font-medium text-[#ff6d34]">
                  Nominated
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium">Remarks</label>
            <textarea
              rows={4}
              value={formData.remarks}
              onChange={(e) => setFormData((prev) => ({ ...prev, remarks: e.target.value }))}
              placeholder="Enter remarks (optional)..."
              className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition ${darkMode ? "border-slate-700 bg-slate-800 focus:border-[#ff7a00]" : "border-slate-300 bg-white focus:border-[#ff7a00]"
                }`}
            />
          </div>
        </div>

        <div className={`flex items-center justify-end gap-4 border-t pt-6 ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl border px-6 py-3 font-medium transition ${darkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-300 hover:bg-slate-100"
              }`}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-xl bg-[#ff7a00] px-6 py-3 font-medium text-white transition hover:bg-[#e06b00]"
            onClick={handleNominate}
          >
            Nominate Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentNominationForm;