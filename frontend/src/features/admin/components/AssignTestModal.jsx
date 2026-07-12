import { useState } from "react";
import { toast } from "react-hot-toast";
import { assignTest } from "../services/adminService";

const AssignTestModal = ({ open, onClose, driveId, refreshDrive }) => {
  const [assessmentId, setAssessmentId] = useState("");

  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assessmentId.trim()) {
      toast.error("Assessment ID is required");
      return;
    }

    try {
      setSubmitting(true);

      await assignTest(driveId, {
        assessmentId,
      });

      toast.success("Test assigned successfully");

      await refreshDrive();

      setAssessmentId("");

      onClose();
    } catch (error) {
      console.error(error);

      toast.error("Failed to assign test");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setAssessmentId("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Assign Test</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Assessment ID
            </label>

            <input
              type="text"
              value={assessmentId}
              onChange={(e) => setAssessmentId(e.target.value)}
              placeholder="Enter Assessment ID"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {submitting ? "Assigning..." : "Assign Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTestModal;
