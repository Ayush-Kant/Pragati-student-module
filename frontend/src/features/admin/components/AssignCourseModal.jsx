import { useState } from "react";
import { toast } from "react-hot-toast";

import { assignCourse } from "../services/adminService";

const AssignCourseModal = ({ open, onClose, driveId, refreshDrive }) => {
  const [courseId, setCourseId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseId.trim()) {
      toast.error("Course ID is required");
      return;
    }

    try {
      setSubmitting(true);

      await assignCourse(driveId, {
        courseId,
      });

      toast.success("Course assigned successfully");

      setCourseId("");

      await refreshDrive();

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign course");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setCourseId("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Assign Course</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Course ID</label>

            <input
              type="text"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              placeholder="Enter Course ID"
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
              className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {submitting ? "Assigning..." : "Assign Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignCourseModal;
