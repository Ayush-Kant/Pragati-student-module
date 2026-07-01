import { useEffect, useState } from "react";

const AssessmentEditModal = ({
  isOpen,
  onClose,
  assessment,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    difficulty: "",
    timeLimitMinutes: "",
  });

  useEffect(() => {
    if (assessment) {
      setFormData({
        title: assessment.title,
        difficulty: assessment.difficulty,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-2xl transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Edit Assessment
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Assessment Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
              Assessment Title
            </label>

            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
              Difficulty
            </label>

            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  difficulty:
                    e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="Easy">
                Easy
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Hard">
                Hard
              </option>
            </select>
          </div>

          {/* Time Limit */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
              Time Limit (Minutes)
            </label>

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
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
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