import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { UserPlus, Briefcase, Building2 } from "lucide-react";

/**
 * StudentNominationForm
 *
 * Props
 *   student      — the eligible_student object being nominated
 *   selectedDrive — full drive object (from DriveSelector) or null
 *   onClose       — close handler
 *   onSave        — async (nominationData) => void
 */
const StudentNominationForm = ({ student, selectedDrive, onClose, onSave }) => {
  const { darkMode } = useOutletContext();

  // When a drive is pre-selected, pre-fill and lock company/role/package
  const driveMode = !!selectedDrive;

  const [formData, setFormData] = useState({
    role: driveMode ? (selectedDrive.role || "") : "",
    package: driveMode ? (selectedDrive.package || "") : "",
    remarks: "",
  });

  const [errors, setErrors] = useState({});

  /* ── Validation ─────────────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!driveMode && !formData.company?.trim()) {
      e.company = "Company is required.";
    }
    if (!formData.role.trim()) {
      e.role = "Role is required.";
    } else if (formData.role.trim().length < 3) {
      e.role = "Role must be at least 3 characters.";
    }
    if (!formData.package || Number(formData.package) <= 0) {
      e.package = "Package must be greater than 0.";
    }
    if (formData.remarks.trim().length > 500) {
      e.remarks = "Remarks cannot exceed 500 characters.";
    }
    return e;
  };

  const handleNominate = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    const nomination = {
      // frontend validation fields
      company: driveMode ? selectedDrive.company : (formData.company || ""),
      role: formData.role,
      package: formData.package,
      remarks: formData.remarks,
      // API fields
      student_id: student.id,
      company_id: driveMode ? (selectedDrive.id || 1) : 1,
      company_name: driveMode ? selectedDrive.company : (formData.company || ""),
      drive_id: driveMode ? selectedDrive.id : null,
    };

    if (onSave) onSave(nomination);
  };

  /* ── Shared input styles ────────────────────────────────────────── */
  const inputCls = (field) =>
    `w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${errors[field]
      ? "border-red-500 focus:border-red-500"
      : darkMode
        ? "border-[#3D3D3D] bg-[#1A1A1A] focus:border-[#ff7a00]"
        : "border-slate-300 bg-white focus:border-[#ff7a00]"
    }`;

  const labelCls = `mb-1.5 block text-sm font-medium`;

  return (
    <div
      className={`rounded-3xl border shadow-lg ${darkMode ? "border-[#3D3D3D] bg-[#2D2D2D]" : "border-slate-200 bg-white"
        }`}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
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
            {driveMode
              ? `Nominating for ${selectedDrive.company} — ${selectedDrive.role}`
              : "Nominate an eligible student for a placement opportunity."}
          </p>
        </div>
      </div>

      <div className="space-y-8 p-8">
        {/* ── Drive banner (when drive is pre-selected) ───────────── */}
        {driveMode && (
          <div
            className={`flex items-start gap-4 rounded-2xl border p-5 ${darkMode
                ? "border-[#ff6d34]/20 bg-[#ff6d34]/5"
                : "border-orange-200 bg-orange-50"
              }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${darkMode ? "bg-[#ff6d34]/15 text-[#ff6d34]" : "bg-orange-100 text-[#ff7a00]"
                }`}
            >
              {selectedDrive.company?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{selectedDrive.company}</p>
              <div
                className={`mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
              >
                <span className="flex items-center gap-1">
                  <Briefcase size={11} /> {selectedDrive.role}
                </span>
                {selectedDrive.package && (
                  <span className="font-semibold text-[#ff7a00]">{selectedDrive.package}</span>
                )}
                {selectedDrive.driveDate && (
                  <span>
                    Drive:{" "}
                    {new Date(selectedDrive.driveDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
                {selectedDrive.eligibility?.cgpa && (
                  <span>Min CGPA: {selectedDrive.eligibility.cgpa}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Student Information ─────────────────────────────────── */}
        <div>
          <h3 className="mb-4 text-base font-semibold">Student Information</h3>
          <div
            className={`rounded-2xl border p-5 ${darkMode ? "border-[#3D3D3D] bg-[#1A1A1A]" : "border-slate-200 bg-slate-50"
              }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold ${darkMode ? "bg-[#ff6d34]/10 text-[#ff6d34]" : "bg-orange-100 text-[#ff7a00]"
                  }`}
              >
                {student?.name?.charAt(0)?.toUpperCase() || "S"}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-lg font-bold">{student?.name}</h4>
                <p className={`mt-0.5 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {student?.enrollmentNo}
                </p>
              </div>
            </div>

            <div className={`my-4 border-t ${darkMode ? "border-[#3D3D3D]" : "border-slate-200"}`} />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { label: "Department", value: student?.department },
                { label: "Batch", value: student?.batch },
                { label: "CGPA", value: student?.cgpa },
                { label: "Email", value: student?.email },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p
                    className={`text-[10px] uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"
                      }`}
                  >
                    {label}
                  </p>
                  <p className="mt-1.5 truncate text-sm font-semibold">{value || "—"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Nomination Details ──────────────────────────────────── */}
        <div>
          <h3 className="mb-4 text-base font-semibold">Nomination Details</h3>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* Company — locked when drive mode */}
            {!driveMode && (
              <div>
                <label className={labelCls}>Company *</label>
                <input
                  type="text"
                  value={formData.company || ""}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, company: e.target.value }))
                  }
                  placeholder="e.g. Google"
                  className={inputCls("company")}
                />
                {errors.company && (
                  <p className="mt-1 text-xs text-red-500">{errors.company}</p>
                )}
              </div>
            )}

            {/* Role */}
            <div>
              <label className={labelCls}>Job Role *</label>
              {driveMode ? (
                <div
                  className={`flex h-[46px] items-center rounded-xl border px-4 text-sm font-medium ${darkMode
                      ? "border-[#3D3D3D] bg-[#1A1A1A] text-slate-300"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                >
                  {selectedDrive.role}
                </div>
              ) : (
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, role: e.target.value }))
                  }
                  placeholder="e.g. Software Engineer"
                  className={inputCls("role")}
                />
              )}
              {errors.role && (
                <p className="mt-1 text-xs text-red-500">{errors.role}</p>
              )}
            </div>

            {/* Package */}
            <div>
              <label className={labelCls}>Package (LPA) *</label>
              {driveMode && selectedDrive.package ? (
                <div
                  className={`flex h-[46px] items-center rounded-xl border px-4 text-sm font-medium ${darkMode
                      ? "border-[#3D3D3D] bg-[#1A1A1A] text-slate-300"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                >
                  {selectedDrive.package}
                </div>
              ) : (
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.package}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, package: e.target.value }))
                  }
                  placeholder="e.g. 12"
                  className={inputCls("package")}
                />
              )}
              {errors.package && (
                <p className="mt-1 text-xs text-red-500">{errors.package}</p>
              )}
            </div>

            {/* Status — always read-only */}
            <div>
              <label className={labelCls}>Status</label>
              <div
                className={`flex h-[46px] items-center rounded-xl border px-4 ${darkMode ? "border-[#3D3D3D] bg-[#1A1A1A]" : "border-slate-200 bg-slate-50"
                  }`}
              >
                <span className="rounded-full bg-[#ff6d34]/10 px-3 py-1 text-xs font-semibold text-[#ff6d34]">
                  Nominated
                </span>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="mt-5">
            <label className={labelCls}>Remarks (optional)</label>
            <textarea
              rows={3}
              value={formData.remarks}
              onChange={(e) =>
                setFormData((p) => ({ ...p, remarks: e.target.value }))
              }
              placeholder="Any additional notes…"
              className={`${inputCls("remarks")} resize-none`}
            />
            {errors.remarks && (
              <p className="mt-1 text-xs text-red-500">{errors.remarks}</p>
            )}
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────────── */}
        <div
          className={`flex items-center justify-end gap-4 border-t pt-6 ${darkMode ? "border-[#3D3D3D]" : "border-slate-200"
            }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl border px-6 py-3 text-sm font-medium transition ${darkMode
                ? "border-[#3D3D3D] hover:bg-[#3D3D3D]"
                : "border-slate-300 hover:bg-slate-100"
              }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleNominate}
            className="rounded-xl bg-[#ff7a00] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#e06b00] active:scale-[0.98]"
          >
            Nominate Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentNominationForm;
