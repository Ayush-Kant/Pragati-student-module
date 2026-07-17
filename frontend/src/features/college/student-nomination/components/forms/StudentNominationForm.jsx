import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { UserPlus } from "lucide-react";

const StudentNominationForm = ({ student, onClose }) => {
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

  /* =====================================
      SELECTED STUDENT
  ===================================== */

  const selectedStudent = student;

  return (
    <div
      className={`rounded-3xl border shadow-lg ${
        darkMode ? "border-slate-700 bg-[#151D30]" : "border-slate-200 bg-white"
      }`}
    >
      {/* =====================================
            HEADER
      ====================================== */}

      <div
        className={`flex items-center gap-3 border-b px-8 py-6 ${
          darkMode ? "border-slate-700" : "border-slate-200"
        }`}
      >
        <div
          className={`rounded-2xl p-3 ${
            darkMode
              ? "bg-blue-500/10 text-blue-400"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          <UserPlus size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-bold">Student Nomination Form</h2>

          <p
            className={`mt-1 text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Nominate eligible students for placement opportunities.
          </p>
        </div>
      </div>

      {/* =====================================
            FORM
      ====================================== */}

      <div className="space-y-8 p-8">
        {/* =====================================
              STUDENT INFORMATION
        ====================================== */}

        <div>
          <h3 className="mb-6 text-lg font-semibold">Student Information</h3>

          <div
            className={`rounded-3xl border p-6 ${
              darkMode
                ? "border-slate-700 bg-slate-800/30"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            {/* Student Header */}

            <div className="flex items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold ${
                  darkMode
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {selectedStudent?.name?.charAt(0) || "S"}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xl font-bold">
                  {selectedStudent?.name}
                </h2>

                <p
                  className={`mt-1 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {selectedStudent?.enrollmentNo}
                </p>
              </div>
            </div>

            {/* Divider */}

            <div
              className={`my-6 border-t ${
                darkMode ? "border-slate-700" : "border-slate-200"
              }`}
            />

            {/* Details */}

            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {/* Department */}

              <div>
                <p
                  className={`text-xs uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Department
                </p>

                <p className="mt-2 font-semibold">
                  {selectedStudent?.department}
                </p>
              </div>

              {/* Batch */}

              <div>
                <p
                  className={`text-xs uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Batch
                </p>

                <p className="mt-2 font-semibold">{selectedStudent?.batch}</p>
              </div>

              {/* CGPA */}

              <div>
                <p
                  className={`text-xs uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  CGPA
                </p>

                <p className="mt-2 font-semibold">{selectedStudent?.cgpa}</p>
              </div>

              {/* Email */}

              <div>
                <p
                  className={`text-xs uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Email
                </p>

                <p className="mt-2 truncate font-semibold">
                  {selectedStudent?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* =====================================
              NOMINATION DETAILS
        ====================================== */}

        <div>
          <h3 className="mb-5 text-lg font-semibold">Nomination Details</h3>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Company */}

            <div>
              <label className="mb-2 block text-sm font-medium">Company</label>

              <select
                value={formData.company}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-800 focus:border-blue-500"
                    : "border-slate-300 bg-white focus:border-blue-500"
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

            {/* Job Role */}

            <div>
              <label className="mb-2 block text-sm font-medium">Job Role</label>

              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                placeholder="Software Engineer"
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-800 focus:border-blue-500"
                    : "border-slate-300 bg-white focus:border-blue-500"
                }`}
              />
            </div>

            {/* Package */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Package (LPA)
              </label>

              <input
                type="text"
                value={formData.package}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    package: e.target.value,
                  }))
                }
                placeholder="12 LPA"
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-800 focus:border-blue-500"
                    : "border-slate-300 bg-white focus:border-blue-500"
                }`}
              />
            </div>

            {/* Status */}

            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>

              <div
                className={`flex h-[50px] items-center rounded-xl border px-4 ${
                  darkMode
                    ? "border-slate-700 bg-slate-800"
                    : "border-slate-300 bg-slate-50"
                }`}
              >
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-500">
                  Nominated
                </span>
              </div>
            </div>
          </div>

          {/* Remarks */}

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium">Remarks</label>

            <textarea
              rows={4}
              value={formData.remarks}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  remarks: e.target.value,
                }))
              }
              placeholder="Enter remarks (optional)..."
              className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition ${
                darkMode
                  ? "border-slate-700 bg-slate-800 focus:border-blue-500"
                  : "border-slate-300 bg-white focus:border-blue-500"
              }`}
            />
          </div>
        </div>

        {/* =====================================
              ACTION BUTTONS
        ====================================== */}

        <div
          className={`flex items-center justify-end gap-4 border-t pt-6 ${
            darkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl border px-6 py-3 font-medium transition ${
              darkMode
                ? "border-slate-700 hover:bg-slate-800"
                : "border-slate-300 hover:bg-slate-100"
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            onClick={() => console.log(formData)}
          >
            Nominate Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentNominationForm;
