import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { SquarePen } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

const EditNominationForm = ({ student, onClose, onSave }) => {
  const { darkMode } = useOutletContext();

  /* =====================================
        FORM DATA
  ====================================== */

  const [formData, setFormData] = useState({
    company: student?.company || "",
    role: student?.role || "",
    package: student?.package || "",
    remarks: student?.remarks || "",
  });

  /* =====================================
        CONFIRMATION
  ====================================== */

  const [confirmationText, setConfirmationText] = useState("");

  /* =====================================
        CHANGE DETECTION
  ====================================== */

  const companyChanged =
    formData.company.trim() !== (student?.company || "").trim();

  const roleChanged = formData.role.trim() !== (student?.role || "").trim();

  const packageChanged =
    formData.package.trim() !== (student?.package || "").trim();

  const remarksChanged =
    formData.remarks.trim() !== (student?.remarks || "").trim();

  /* =====================================
        BUSINESS RULE
  ====================================== */

  // Company or Role changed
  // => Treat as New Nomination

  const isNewNomination = companyChanged || roleChanged;

  // Package / Remarks only
  // => Preserve Status

  const resultingStatus = isNewNomination ? "Nominated" : student?.status;

  /* =====================================
        CONFIRMATION KEYWORD
  ====================================== */

  const confirmationKeyword = isNewNomination ? "NEW NOMINATION" : "EDIT";

  const confirmationValid = confirmationText.trim() === confirmationKeyword;

  /* =====================================
        SAVE
  ====================================== */

  const handleSave = () => {
    if (!confirmationValid) return;

    const updatedNomination = {
      ...student,

      company: formData.company,
      role: formData.role,
      package: formData.package,
      remarks: formData.remarks,

      status: resultingStatus,
    };

    console.log(updatedNomination);

    if (onSave) {
      onSave(updatedNomination);
    }

    onClose();
  };

  const hasChanges =
    companyChanged || roleChanged || packageChanged || remarksChanged;

  return (
    <div
      className={`mx-auto w-full max-w-6xl rounded-3xl border shadow-xl ${
        darkMode ? "border-slate-700 bg-[#151D30]" : "border-slate-200 bg-white"
      }`}
    >
      {/* =====================================
            HEADER
      ====================================== */}

      <div
        className={`flex items-center justify-between border-b px-8 py-6 ${
          darkMode ? "border-slate-700" : "border-slate-200"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
              darkMode
                ? "bg-blue-500/10 text-blue-400"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            <SquarePen size={24} strokeWidth={2} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Edit Nomination</h1>

            <p
              className={`mt-1 text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Update an existing student nomination.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
            BODY
      ====================================== */}

      <div className="space-y-8 p-8">
        {/* =====================================
              STUDENT PROFILE
        ====================================== */}

        <div>
          <h3 className="mb-5 text-lg font-semibold">Student Profile</h3>

          <div
            className={`rounded-3xl border p-6 ${
              darkMode
                ? "border-slate-700 bg-slate-800/30"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            {/* Top */}

            <div className="flex items-center gap-5">
              <div
                className={`flex h-18 w-18 items-center justify-center rounded-2xl text-2xl font-bold ${
                  darkMode
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {student?.name?.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-2xl font-bold">{student?.name}</h2>

                <p
                  className={`mt-2 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {student?.enrollmentNo}
                </p>
              </div>
            </div>

            {/* Divider */}

            <div
              className={`my-6 border-t ${
                darkMode ? "border-slate-700" : "border-slate-200"
              }`}
            />

            {/* Information */}

            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              <div>
                <p
                  className={`text-xs uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Department
                </p>

                <p className="mt-2 font-semibold">{student?.department}</p>
              </div>

              <div>
                <p
                  className={`text-xs uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Batch
                </p>

                <p className="mt-2 font-semibold">{student?.batch}</p>
              </div>

              <div>
                <p
                  className={`text-xs uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  CGPA
                </p>

                <p className="mt-2 font-semibold">{student?.cgpa}</p>
              </div>

              <div>
                <p
                  className={`text-xs uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Email
                </p>

                <p className="mt-2 truncate font-semibold">{student?.email}</p>
              </div>
            </div>
          </div>
        </div>
        {/* =====================================
              CURRENT NOMINATION
        ====================================== */}

        <div>
          <h3 className="mb-5 text-lg font-semibold">Current Nomination</h3>

          <div
            className={`rounded-3xl border p-6 ${
              darkMode
                ? "border-slate-700 bg-slate-800/30"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
              {/* Company */}

              <div>
                <p
                  className={`text-xs uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Company
                </p>

                <p className="mt-2 text-lg font-semibold">{student?.company}</p>
              </div>

              {/* Role */}

              <div>
                <p
                  className={`text-xs uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Role
                </p>

                <p className="mt-2 text-lg font-semibold">{student?.role}</p>
              </div>

              {/* Package */}

              <div>
                <p
                  className={`text-xs uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Package
                </p>

                <p className="mt-2 text-lg font-semibold">{student?.package}</p>
              </div>

              {/* Current Status */}

              <div>
                <p
                  className={`text-xs uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Current Status
                </p>

                <div className="mt-2">
                  <StatusBadge status={student?.status} />
                </div>
              </div>

              {/* Status After Save */}

              <div>
                <p
                  className={`text-xs uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  After Saving
                </p>

                <div className="mt-2">
                  <StatusBadge status={resultingStatus} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
              EDIT NOMINATION
        ====================================== */}

        <div>
          <h3 className="mb-5 text-lg font-semibold">Edit Nomination</h3>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Company */}

            <div>
              <label className="mb-2 block text-sm font-medium">Company</label>

              <input
                type="text"
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
              />
              <p className="mt-1 text-xs text-amber-500">
                Changing Company creates a new nomination.
              </p>
            </div>

            {/* Role */}

            <div>
              <label className="mb-2 block text-sm font-medium">Role</label>

              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-800 focus:border-blue-500"
                    : "border-slate-300 bg-white focus:border-blue-500"
                }`}
              />
              <p className="mt-1 text-xs text-amber-500">
                Changing Role creates a new nomination.
              </p>
            </div>

            {/* Package */}

            <div>
              <label className="mb-2 block text-sm font-medium">Package</label>

              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                value={formData.package}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    package: e.target.value,
                  }))
                }
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-800 focus:border-blue-500"
                    : "border-slate-300 bg-white focus:border-blue-500"
                }`}
              />
            </div>

            {/* Remarks */}

            <div>
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
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-800 focus:border-blue-500"
                    : "border-slate-300 bg-white focus:border-blue-500"
                }`}
              />
            </div>
          </div>
        </div>

        {/* =====================================
              WARNING
        ====================================== */}

        {hasChanges && (
          <div
            className={`rounded-2xl border p-5 ${
              isNewNomination
                ? darkMode
                  ? "border-amber-700 bg-amber-500/10"
                  : "border-amber-300 bg-amber-50"
                : darkMode
                  ? "border-emerald-700 bg-emerald-500/10"
                  : "border-emerald-300 bg-emerald-50"
            }`}
          >
            <h4 className="font-semibold">
              {isNewNomination ? "New Nomination Detected" : "Minor Update"}
            </h4>

            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {isNewNomination
                ? "Company or Role has changed. This edit will be treated as a new nomination and the student's status will be reset to Nominated."
                : "Only Package or Remarks have changed. The student's current status will be preserved."}
            </p>
          </div>
        )}

        {/* =====================================
              CONFIRMATION
        ====================================== */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Type{" "}
            <span className="font-bold text-blue-500">
              {confirmationKeyword}
            </span>{" "}
            exactly as shown to continue.
          </label>

          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder={confirmationKeyword}
            className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
              darkMode
                ? "border-slate-700 bg-slate-800 focus:border-blue-500"
                : "border-slate-300 bg-white focus:border-blue-500"
            }`}
          />
        </div>

        {/* =====================================
              ACTIONS
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
            disabled={!hasChanges || !confirmationValid}
            onClick={handleSave}
            className={`rounded-xl px-6 py-3 font-medium text-white transition ${
              confirmationValid
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-slate-400"
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNominationForm;
