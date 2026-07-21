import { useState } from "react";

export default function EscalateDisputeModal({
  open,
  onClose,
  onEscalate,
  darkMode,
}) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  const handleEscalate = () => {
    if (!reason.trim()) return;

    onEscalate(reason);

    setReason("");

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div
        className={`w-full max-w-xl rounded-xl p-6 ${
          darkMode
            ? "bg-slate-900 text-white"
            : "bg-white"
        }`}
      >

        <h2 className="text-2xl font-bold mb-5">
          Escalate Dispute
        </h2>

        <textarea
          rows={6}
          value={reason}
          onChange={(e) =>
            setReason(e.target.value)
          }
          className={`w-full border rounded-lg p-3 ${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : ""
          }`}
          placeholder="Reason..."
        />

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-gray-500 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleEscalate}
            className="px-5 py-2 rounded bg-red-600 text-white"
          >
            Escalate
          </button>

        </div>

      </div>

    </div>
  );
}