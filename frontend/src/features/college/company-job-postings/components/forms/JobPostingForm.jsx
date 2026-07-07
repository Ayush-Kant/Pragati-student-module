import { useEffect, useReducer, useState } from "react";
import { Plus } from "lucide-react";
import { validateJobPosting } from "../../validations/companyJobPostingValidation";

const getInitialFormData = (job) => ({
  role: job?.role || "",
  company: job?.company || "",
  cgpa: job?.cgpa || "",
  batch: job?.batch || "",
  deadline: job?.deadline || "",
  status: job?.status || "Open",
});

const formReducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return action.payload;

    case "change":
      return {
        ...state,
        [action.name]: action.value,
      };

    default:
      return state;
  }
};

const JobPostingForm = ({ onSubmit, editingJob }) => {
  const [formData, dispatch] = useReducer(
    formReducer,
    editingJob,
    getInitialFormData
  );

  const [errors, setErrors] = useState({
    role: "",
    company: "",
    cgpa: "",
    batch: "",
    deadline: "",
  });

  useEffect(() => {
    // Update form data when editingJob changes
    dispatch({
      type: "reset",
      payload: getInitialFormData(editingJob),
    });

    // Reset errors in the next microtask to avoid synchronous setState in effect
    Promise.resolve().then(() => {
      setErrors({
        role: "",
        company: "",
        cgpa: "",
        batch: "",
        deadline: "",
      });
    });
  }, [editingJob]);

  const handleChange = (e) => {
    dispatch({
      type: "change",
      name: e.target.name,
      value: e.target.value,
    });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateJobPosting(formData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await onSubmit(formData);

    dispatch({
      type: "reset",
      payload: getInitialFormData(),
    });

    setErrors({
      role: "",
      company: "",
      cgpa: "",
      batch: "",
      deadline: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">
        {editingJob ? "Edit Job Posting" : "Create Job Posting"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Role */}
        <div>
          <input
            name="role"
            placeholder="Job Role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500 ${
              errors.role ? "border border-red-500" : "border"
            }`}
          />

          {errors.role && (
            <p className="text-red-500 text-sm mt-1">
              {errors.role}
            </p>
          )}
        </div>

        {/* Company */}
        <div>
          <input
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500 ${
              errors.company ? "border border-red-500" : "border"
            }`}
          />

          {errors.company && (
            <p className="text-red-500 text-sm mt-1">
              {errors.company}
            </p>
          )}
        </div>

        {/* CGPA */}
        <div>
          <input
            type="number"
            name="cgpa"
            placeholder="CGPA"
            value={formData.cgpa}
            onChange={handleChange}
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500 ${
              errors.cgpa ? "border border-red-500" : "border"
            }`}
          />

          {errors.cgpa && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cgpa}
            </p>
          )}
        </div>

        {/* Batch */}
        <div>
          <input
            name="batch"
            placeholder="Batch"
            value={formData.batch}
            onChange={handleChange}
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500 ${
              errors.batch ? "border border-red-500" : "border"
            }`}
          />

          {errors.batch && (
            <p className="text-red-500 text-sm mt-1">
              {errors.batch}
            </p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500 ${
              errors.deadline ? "border border-red-500" : "border"
            }`}
          />

          {errors.deadline && (
            <p className="text-red-500 text-sm mt-1">
              {errors.deadline}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 flex justify-center items-center gap-2"
        >
          <Plus size={18} />
          {editingJob ? "Update Job" : "Create Job"}
        </button>

      </form>
    </div>
  );
};

export default JobPostingForm;