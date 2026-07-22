import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function DriveCreateModal({
  onClose,
  addDrive,
}) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    minGPA: "",
    requiredSkills: "",
    maxOpenings: "",
    deadline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newDrive = {
      id: `drive_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: formData.title,
      company: { name: formData.company },
      status: "active",
      currentStage: "screening",
      candidates: Number(formData.maxOpenings),
      minGPA: parseFloat(formData.minGPA) || 0,
      requiredSkills: formData.requiredSkills,
      maxOpenings: parseInt(formData.maxOpenings, 10) || 0,
      deadline: formData.deadline,
    };

    addDrive(newDrive);
    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      className="
        bg-white
        rounded-xl
        shadow-2xl
        w-full
        max-w-lg
        mx-auto
        outline-none
        max-h-[90vh]
        overflow-y-auto
      "
      overlayClassName="
        fixed
        inset-0
        z-50
        bg-black/40
        flex
        items-center
        justify-center
        p-4
        overflow-y-auto
      "
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Create Drive
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              h-10
              w-10
              rounded-lg
              border
              border-gray-300
              hover:bg-gray-100
              text-2xl
            "
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            name="title"
            placeholder="Drive Title"
            className="w-full border rounded-lg p-3"
            onChange={handleChange}
          />

          <input
            type="text"
            name="company"
            placeholder="Company"
            className="w-full border rounded-lg p-3"
            onChange={handleChange}
          />

          <input
            type="number"
            name="minGPA"
            placeholder="Minimum GPA"
            className="w-full border rounded-lg p-3"
            onChange={handleChange}
          />

          <input
            type="text"
            name="requiredSkills"
            placeholder="Required Skills"
            className="w-full border rounded-lg p-3"
            onChange={handleChange}
          />

          <input
            type="number"
            name="maxOpenings"
            placeholder="Max Openings"
            className="w-full border rounded-lg p-3"
            onChange={handleChange}
          />

          <input
            type="date"
            name="deadline"
            className="w-full border rounded-lg p-3"
            onChange={handleChange}
          />

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                w-full
                sm:w-auto
                px-5
                py-3
                rounded-lg
                border
                border-gray-300
                bg-white
                hover:bg-gray-100
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                w-full
                sm:w-auto
                px-5
                py-3
                rounded-lg
                bg-green-600
                hover:bg-green-700
                text-white
                font-medium
              "
            >
              Create Drive
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}