import { useState } from "react";

export default function ResolveDisputeModal({
  open,
  onClose,
  onResolve,
  darkMode,
}) {
  const [resolution, setResolution] = useState("");

  if (!open) return null;

  const handleResolve = () => {
    if (!resolution.trim()) return;

    onResolve(resolution);

    setResolution("");

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
          Resolve Dispute
        </h2>

        <textarea
          rows={6}
          value={resolution}
          onChange={(e) =>
            setResolution(e.target.value)
          }
          className={`w-full border rounded-lg p-3 ${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : ""
          }`}
          placeholder="Resolution..."
        />

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-gray-500 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleResolve}
            className="px-5 py-2 rounded bg-green-600 text-white"
          >
            Resolve
          </button>

        </div>

      </div>

    </div>
  );
}