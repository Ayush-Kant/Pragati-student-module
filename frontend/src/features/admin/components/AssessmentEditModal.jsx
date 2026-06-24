import { useEffect, useState } from "react";

const AssessmentEditModal = ({
  isOpen,
  onClose,
  assessment,
  onSave,
}) => {
  const [formData, setFormData] =
    useState({
      title: "",
      difficulty: "",
      timeLimitMinutes: "",
    });

  useEffect(() => {
    if (assessment) {
      setFormData({
        title: assessment.title,
        difficulty:
          assessment.difficulty,
        timeLimitMinutes:
          assessment.timeLimitMinutes,
      });
    }
  }, [assessment]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...assessment,
      ...formData,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">
          Edit Assessment
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title:
                  e.target.value,
              })
            }
            className="w-full border rounded p-3"
          />

          <select
            value={
              formData.difficulty
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                difficulty:
                  e.target.value,
              })
            }
            className="w-full border rounded p-3"
          >
            <option>
              Easy
            </option>
            <option>
              Medium
            </option>
            <option>
              Hard
            </option>
          </select>

          <input
            type="number"
            value={
              formData.timeLimitMinutes
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                timeLimitMinutes:
                  e.target.value,
              })
            }
            className="w-full border rounded p-3"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentEditModal;