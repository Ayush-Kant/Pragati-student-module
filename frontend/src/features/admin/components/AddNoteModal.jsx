import { useState } from "react";

export default function AddNoteModal({
  open,
  onClose,
  onSubmit,
  darkMode,
}) {
  const [note, setNote] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!note.trim()) return;

    onSubmit(note);

    setNote("");

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div
        className={`w-full max-w-lg rounded-xl p-6 ${
          darkMode
            ? "bg-slate-900 text-white"
            : "bg-white"
        }`}
      >

        <h2 className="text-2xl font-bold mb-5">
          Add Admin Note
        </h2>

        <textarea
          rows={6}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`w-full border rounded-lg p-3 ${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : ""
          }`}
          placeholder="Write note..."
        />

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-gray-500 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded bg-blue-600 text-white"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}