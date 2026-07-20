import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Trash2 } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

const RemoveNominationModal = ({ student, onClose, onRemove }) => {
  const { darkMode } = useOutletContext();
  const [reason, setReason] = useState("");
  const [confirmationText, setConfirmationText] = useState("");

  const confirmationValid = confirmationText.trim() === "REMOVE";

  const handleRemove = () => {
    if (!confirmationValid) return;

    const updatedStudent = {
      ...student,
      removalReason: reason,
      nominationRemoved: true,
      status: "Eligible",
    };

    if (onRemove) {
      onRemove(updatedStudent);
    }
    onClose();
  };

  return (
    <div
      className={`mx-auto w-full max-w-5xl rounded-3xl border shadow-xl ${
        darkMode ? "border-slate-700 bg-[#151D30]" : "border-slate-200 bg-white"
      }`}
    >
      <div className={`flex items-center justify-between border-b px-8 py-6 ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
              darkMode ? "bg-red-500/10 text-red-400" : "bg-red-100 text-red-600"
            }`}
          >
            <Trash2 size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Remove Nomination</h1>
            <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Remove an existing nomination from the placement process.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-8">
        <div>
          <h3 className="mb-5 text-lg font-semibold">Nomination Details</h3>
          <div
            className={`rounded-3xl border p-6 ${
              darkMode ? "border-slate-700 bg-slate-800/30" : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
              <div>
                <p className={`text-xs uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Student</p>
                <p className="mt-2 text-lg font-semibold">{student?.name}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Enrollment</p>
                <p className="mt-2 font-semibold">{student?.enrollmentNo}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Company</p>
                <p className="mt-2 font-semibold">{student?.company}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Role</p>
                <p className="mt-2 font-semibold">{student?.role}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Package</p>
                <p className="mt-2 font-semibold">{student?.package}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold">Status Transition</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className={`rounded-2xl border p-5 ${darkMode ? "border-slate-700 bg-slate-800/30" : "border-slate-200 bg-slate-50"}`}>
              <p className={`text-xs uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Current Status</p>
              <div className="mt-4"><StatusBadge status={student?.status} /></div>
            </div>
            <div className={`rounded-2xl border p-5 ${darkMode ? "border-emerald-700 bg-emerald-500/10" : "border-emerald-200 bg-emerald-50"}`}>
              <p className={`text-xs uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>After Removal</p>
              <div className="mt-4"><StatusBadge status="Eligible" /></div>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl border p-6 ${darkMode ? "border-red-700 bg-red-500/10" : "border-red-200 bg-red-50"}`}>
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${darkMode ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`}>
              <Trash2 size={22} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? "text-red-400" : "text-red-700"}`}>This action requires confirmation</h3>
              <p className={`mt-3 text-sm leading-7 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Removing this nomination will immediately remove the student from the active active nomination list.
              </p>
              <ul className={`mt-4 list-disc space-y-2 pl-5 text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                <li>The nomination record will be removed.</li>
                <li>The student's status will become <strong>Eligible</strong>.</li>
                <li>The student can be nominated again in the future.</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Removal Reason <span className="text-slate-500">(Optional)</span></label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Duplicate nomination, student opted out..."
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
              darkMode ? "border-slate-700 bg-slate-800 focus:border-red-500" : "border-slate-300 bg-white focus:border-red-500"
                }`}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Type <span className="font-bold text-red-500">REMOVE</span> to continue.</label>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="REMOVE"
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
              darkMode ? "border-slate-700 bg-slate-800 focus:border-red-500" : "border-slate-300 bg-white focus:border-red-500"
            }`}
          />
        </div>

        <div className={`flex items-center justify-end gap-4 border-t pt-6 ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl border px-6 py-3 font-medium transition ${
              darkMode ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!confirmationValid}
            onClick={handleRemove}
            className={`rounded-xl px-6 py-3 font-medium text-white transition-all duration-200 ${
              confirmationValid ? "bg-red-600 hover:bg-red-700 shadow-lg" : "cursor-not-allowed bg-slate-400"
            }`}
          >
            Remove Nomination
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveNominationModal;