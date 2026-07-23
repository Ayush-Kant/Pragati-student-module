import { useState } from "react";

const AssessmentCreateModal = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] =
    useState({
      title: "",
      type: "",
      difficulty: "",
      timeLimit: "",
      totalMarks: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!formData.type) {
      alert("Type is required");
      return;
    }

    if (!formData.difficulty) {
      alert("Difficulty is required");
      return;
    }

    if (
      !formData.timeLimit ||
      Number(formData.timeLimit) <= 0
    ) {
      alert(
        "Time Limit must be greater than 0"
      );
      return;
    }

    if (
      !formData.totalMarks ||
      Number(formData.totalMarks) <= 0
    ) {
      alert(
        "Total Marks must be greater than 0"
      );
      return;
    }

    const newAssessment = {
      id: `assess_${Date.now()}`,
      title: formData.title,
      type: formData.type,
      difficulty: formData.difficulty,
      timeLimitMinutes: Number(
        formData.timeLimit
      ),
      status: "Draft",
      questionsCount: 0,
    };

    onCreate(newAssessment);

    setFormData({
      title: "",
      type: "",
      difficulty: "",
      timeLimit: "",
      totalMarks: "",
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-4 md:p-6 shadow-lg">
        <h2 className="mb-5 text-xl font-bold md:text-2xl">
          Create Assessment
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            name="title"
            placeholder="Assessment Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm md:p-3 md:text-base"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm md:p-3 md:text-base"
          >
            <option value="">
              Select Type
            </option>

            <option value="MCQ">
              MCQ
            </option>

            <option value="Coding">
              Coding
            </option>
          </select>

          <select
            name="difficulty"
            value={
              formData.difficulty
            }
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm md:p-3 md:text-base"
          >
            <option value="">
              Select Difficulty
            </option>

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

          <input
            type="number"
            name="timeLimit"
            placeholder="Time Limit (Minutes)"
            value={
              formData.timeLimit
            }
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm md:p-3 md:text-base"
          />

          <input
            type="number"
            name="totalMarks"
            placeholder="Total Marks"
            value={
              formData.totalMarks
            }
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm md:p-3 md:text-base"
          />

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm md:px-4 md:text-base border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-3 py-2 text-sm md:px-4 md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentCreateModal;