import { useState } from "react";
import { Plus } from "lucide-react";

const JobPostingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    cgpa: "",
    batch: "",
    deadline: "",
    status: "Open",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    setFormData({
      role: "",
      company: "",
      cgpa: "",
      batch: "",
      deadline: "",
      status: "Open",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-6">
        Create Job Posting
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          name="role"
          placeholder="Job Role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <input
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="number"
          name="cgpa"
          placeholder="CGPA"
          value={formData.cgpa}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <input
          name="batch"
          placeholder="Batch"
          value={formData.batch}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 flex justify-center items-center gap-2"
        >
          <Plus size={18}/>
          Create Job
        </button>

      </form>

    </div>
  );
};

export default JobPostingForm;