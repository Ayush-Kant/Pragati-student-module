import { useState } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";

export default function MentorActionButtons({ mentor, onRemove, onAssign, onReplace, darkMode = false }) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const [batchId, setBatchId] = useState("");
  const [newMentorId, setNewMentorId] = useState("");

  const handleAssignSubmit = async () => {
    if (!batchId) {
      toast.error("Please enter Batch ID");
      return;
    }

    try {
      await onAssign(mentor.id, batchId);
      toast.success(`${mentor.name} assigned successfully`);
    } catch (error) {
      toast.error("Unable to assign mentor");
    } finally {
      setIsAssignModalOpen(false);
      setBatchId("");
    }
  };

  const handleReplaceSubmit = async () => {
    if (!newMentorId) {
      toast.error("Please enter New Mentor ID");
      return;
    }

    try {
      await onReplace(mentor.id, newMentorId);
      toast.success(`${mentor.name} replaced successfully`);
    } catch (error) {
      toast.error("Unable to replace mentor");
    } finally {
      setIsReplaceModalOpen(false);
      setNewMentorId("");
    }
  };

  const handleRemoveSubmit = async () => {
    try {
      if (onRemove) {
        await onRemove(mentor.id);
      }
      toast.success(`${mentor.name} removed successfully`);
    } catch (error) {
      toast.error("Unable to remove mentor");
    } finally {
      setIsRemoveModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 whitespace-nowrap">
        <button
          onClick={() => setIsAssignModalOpen(true)}
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        >
          Assign
        </button>

        <button
          onClick={() => setIsReplaceModalOpen(true)}
          className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
        >
          Replace
        </button>

        <button
          onClick={() => setIsRemoveModalOpen(true)}
          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
        >
          Remove
        </button>
      </div>

      {/* Assign Mentor Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onRequestClose={() => setIsAssignModalOpen(false)}
        ariaHideApp={false}
        className={`p-6 rounded-lg w-100 mx-auto mt-20 outline-none ${
          darkMode ? "bg-slate-950 border border-slate-700" : "bg-white"
        }`}
        overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start"
      >
        <h2 className={`text-xl font-bold mb-4 ${
          darkMode ? "text-white" : "text-slate-900"
        }`}>Assign Batch</h2>

        <p className={`mb-4 ${
          darkMode ? "text-slate-400" : "text-gray-600"
        }`}>
          Assign mentor <span className="font-semibold">{mentor.name}</span> to
          a batch
        </p>

        <input
          type="text"
          placeholder="Enter Batch ID"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className={`w-full border rounded px-3 py-2 mb-6 ${
            darkMode
              ? "bg-slate-900 border-slate-700 text-white"
              : "border-slate-300 text-slate-900"
          }`}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsAssignModalOpen(false)}
            className={`px-4 py-2 border rounded ${
              darkMode
                ? "border-slate-600 text-slate-300 hover:bg-slate-800"
                : "border-slate-300 text-slate-900 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleAssignSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Assign
          </button>
        </div>
      </Modal>

      {/* Replace Mentor Modal */}
      <Modal
        isOpen={isReplaceModalOpen}
        onRequestClose={() => setIsReplaceModalOpen(false)}
        ariaHideApp={false}
        className={`p-6 rounded-lg w-100 mx-auto mt-20 outline-none ${
          darkMode ? "bg-slate-950 border border-slate-700" : "bg-white"
        }`}
        overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start"
      >
        <h2 className={`text-xl font-bold mb-4 ${
          darkMode ? "text-white" : "text-slate-900"
        }`}>Replace Mentor</h2>

        <p className={`mb-4 ${
          darkMode ? "text-slate-400" : "text-gray-600"
        }`}>
          Replace <span className="font-semibold">{mentor.name}</span> with a
          new mentor
        </p>

        <input
          type="text"
          placeholder="Enter New Mentor ID"
          value={newMentorId}
          onChange={(e) => setNewMentorId(e.target.value)}
          className={`w-full border rounded px-3 py-2 mb-6 ${
            darkMode
              ? "bg-slate-900 border-slate-700 text-white"
              : "border-slate-300 text-slate-900"
          }`}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsReplaceModalOpen(false)}
            className={`px-4 py-2 border rounded ${
              darkMode
                ? "border-slate-600 text-slate-300 hover:bg-slate-800"
                : "border-slate-300 text-slate-900 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleReplaceSubmit}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Replace
          </button>
        </div>
      </Modal>

      {/* Remove Mentor Modal */}
      <Modal
        isOpen={isRemoveModalOpen}
        onRequestClose={() => setIsRemoveModalOpen(false)}
        ariaHideApp={false}
        className={`p-6 rounded-lg w-100 mx-auto mt-20 outline-none ${
          darkMode ? "bg-slate-950 border border-slate-700" : "bg-white"
        }`}
        overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start"
      >
        <h2 className={`text-xl font-bold mb-4 ${
          darkMode ? "text-white" : "text-slate-900"
        }`}>Remove Mentor</h2>

        <p className={`mb-6 ${
          darkMode ? "text-slate-400" : "text-gray-600"
        }`}>
          Are you sure you want to remove{" "}
          <span className="font-semibold">{mentor.name}</span>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsRemoveModalOpen(false)}
            className={`px-4 py-2 border rounded ${
              darkMode
                ? "border-slate-600 text-slate-300 hover:bg-slate-800"
                : "border-slate-300 text-slate-900 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleRemoveSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}