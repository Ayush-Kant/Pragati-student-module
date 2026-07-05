import { useState } from "react";

const EditJobPostingForm = ({ job, onSubmit }) => {
  const [formData, setFormData] = useState(job);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-6">
        Edit Job
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
        className="space-y-4"
      >

        <input
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <button
          className="w-full bg-blue-600 text-white rounded-lg py-3"
        >
          Update Job
        </button>

      </form>

    </div>
  );
};

export default EditJobPostingForm;