import { useState } from "react";
import AddNoteModal from "./AddNoteModal";
import { addDisputeNote } from "../services/adminService";

export default function AdminNotesPanel({
  notes = [],
  disputeId,
  refreshDispute,
  darkMode,
}) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddNote = async (note) => {
    try {
      setLoading(true);

      // Uncomment when backend is ready
      // await addDisputeNote(disputeId, note);

      console.log("Dispute ID:", disputeId);
      console.log("New Note:", note);

      if (refreshDispute) {
        await refreshDispute();
      }
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`rounded-xl p-6 ${
          darkMode
            ? "bg-slate-900 border border-slate-700"
            : "bg-white shadow"
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">
            Admin Notes
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            + Add Note
          </button>
        </div>

        {notes.length === 0 ? (
          <div
            className={`text-center py-10 rounded-lg border ${
              darkMode
                ? "border-slate-700 text-gray-400"
                : "border-gray-200 text-gray-500"
            }`}
          >
            No notes added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`rounded-lg border p-4 ${
                  darkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">
                    {note.author}
                  </h3>

                  <span
                    className={`text-xs ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {note.createdAt}
                  </span>
                </div>

                <p
                  className={`leading-7 ${
                    darkMode
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  {note.note}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddNoteModal
        open={showModal}
        darkMode={darkMode}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddNote}
      />

      {loading && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Saving note...
        </div>
      )}
    </>
  );
}