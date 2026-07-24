import { useEffect, useReducer, useState } from "react";
import { Plus } from "lucide-react";
import { validateJobPosting } from "../../validations/companyJobPostingValidation";
import { DEPARTMENTS, BATCHES } from "../../constants/companyJobPostingConstants";

const getInitialFormData = (job) => ({
  role: job?.role || "",
  company: job?.company || "",
  location: job?.location || "",
  cgpa: job?.cgpa || "",
  batch: job?.batch || "",
  deadline: job?.deadline || "",
  status: job?.status || "Open",
  department: job?.department || "",
  package: job?.package || "",
  jobDescription: job?.jobDescription || "",
  hiringProcess: job?.hiringProcess || "",
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

const JobPostingForm = ({ onSubmit, editingJob, jobs = [], darkMode }) => {
  const [formData, dispatch] = useReducer(
    formReducer,
    editingJob,
    getInitialFormData
  );

  const [errors, setErrors] = useState({
    role: "",
    company: "",
    location: "",
    cgpa: "",
    batch: "",
    deadline: "",
    department: "",
    package: "",
    jobDescription: "",
    hiringProcess: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Update form data when editingJob changes
    dispatch({
      type: "reset",
      payload: getInitialFormData(editingJob),
    });

    // Reset errors synchronously to avoid asynchronous setState issues
    setErrors({
      role: "",
      company: "",
      location: "",
      cgpa: "",
      batch: "",
      deadline: "",
      department: "",
      package: "",
      jobDescription: "",
      hiringProcess: "",
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
    if (isSubmitting) return;

    const validationErrors = validateJobPosting(formData, jobs, editingJob?.id);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);

      dispatch({
        type: "reset",
        payload: getInitialFormData(),
      });

      setErrors({
        role: "",
        company: "",
        location: "",
        cgpa: "",
        batch: "",
        deadline: "",
        department: "",
        package: "",
        jobDescription: "",
        hiringProcess: "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white'}`}>
      <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : ''}`}>
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
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#ff6d34] ${
              darkMode
                ? 'bg-[#1A1A1A] border-[#3D3D3D] text-white placeholder-gray-500'
                : 'border'
            } ${errors.role ? "border-red-500" : darkMode ? '' : "border"}`}
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
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#ff6d34] ${
              darkMode
                ? 'bg-[#1A1A1A] border-[#3D3D3D] text-white placeholder-gray-500'
                : 'border'
            } ${errors.company ? "border-red-500" : darkMode ? '' : "border"}`}
          />

          {errors.company && (
            <p className="text-red-500 text-sm mt-1">
              {errors.company}
            </p>
          )}
        </div>

        {/* Department select dropdown */}
        <div>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#ff6d34] ${
              darkMode
                ? 'bg-[#1A1A1A] border-[#3D3D3D] text-white'
                : 'bg-white border'
            } ${errors.department ? "border-red-500" : darkMode ? '' : "border"}`}
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {errors.department && (
            <p className="text-red-500 text-sm mt-1">
              {errors.department}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#ff6d34] ${
              darkMode
                ? 'bg-[#1A1A1A] border-[#3D3D3D] text-white placeholder-gray-500'
                : 'border'
            } ${errors.location ? "border-red-500" : darkMode ? '' : "border"}`}
          />

          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location}
            </p>
          )}
        </div>

        {/* Package */}
        <div>
          <input
            name="package"
            placeholder="Package (e.g., 12 LPA)"
            value={formData.package}
            onChange={handleChange}
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#ff6d34] ${
              darkMode
                ? 'bg-[#1A1A1A] border-[#3D3D3D] text-white placeholder-gray-500'
                : 'border'
            } ${errors.package ? "border-red-500" : darkMode ? '' : "border"}`}
          />

          {errors.package && (
            <p className="text-red-500 text-sm mt-1">
              {errors.package}
            </p>
          )}
        </div>

        {/* CGPA */}
        <div>
          <input
            type="number"
            step="0.01"
            name="cgpa"
            placeholder="CGPA Limit (0-10)"
            value={formData.cgpa}
            onChange={handleChange}
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#ff6d34] ${
              darkMode
                ? 'bg-[#1A1A1A] border-[#3D3D3D] text-white placeholder-gray-500'
                : 'border'
            } ${errors.cgpa ? "border-red-500" : darkMode ? '' : "border"}`}
          />

          {errors.cgpa && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cgpa}
            </p>
          )}
        </div>

        {/* Batch select dropdown */}
        <div>
          <select
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#ff6d34] ${
              darkMode
                ? 'bg-[#1A1A1A] border-[#3D3D3D] text-white'
                : 'bg-white border'
            } ${errors.batch ? "border-red-500" : darkMode ? '' : "border"}`}
          >
            <option value="">Select Batch</option>
            {BATCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {errors.batch && (
            <p className="text-red-500 text-sm mt-1">
              {errors.batch}
            </p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
            Application Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#ff6d34] ${
              darkMode
                ? 'bg-[#1A1A1A] border-[#3D3D3D] text-white'
                : 'border'
            } ${errors.deadline ? "border-red-500" : darkMode ? '' : "border"}`}
          />

          {errors.deadline && (
            <p className="text-red-500 text-sm mt-1">
              {errors.deadline}
            </p>
          )}
        </div>

        {/* Job Description */}
        <div>
          <textarea
            name="jobDescription"
            placeholder="Job Description (minimum 10 characters)"
            value={formData.jobDescription}
            onChange={handleChange}
            rows={3}
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#ff6d34] ${
              darkMode
                ? 'bg-[#1A1A1A] border-[#3D3D3D] text-white placeholder-gray-500'
                : 'border'
            } ${errors.jobDescription ? "border-red-500" : darkMode ? '' : "border"}`}
          />

          {errors.jobDescription && (
            <p className="text-red-500 text-sm mt-1">
              {errors.jobDescription}
            </p>
          )}
        </div>

        {/* Hiring Process */}
        <div>
          <textarea
            name="hiringProcess"
            placeholder="Hiring Process"
            value={formData.hiringProcess}
            onChange={handleChange}
            rows={3}
            className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#ff6d34] ${
              darkMode
                ? 'bg-[#1A1A1A] border-[#3D3D3D] text-white placeholder-gray-500'
                : 'border'
            } ${errors.hiringProcess ? "border-red-500" : darkMode ? '' : "border"}`}
          />

          {errors.hiringProcess && (
            <p className="text-red-500 text-sm mt-1">
              {errors.hiringProcess}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-[#00bea3] hover:bg-[#00bea3]/90 text-white rounded-lg py-3 flex justify-center items-center gap-2 ${
            isSubmitting ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            editingJob ? "Updating..." : "Creating..."
          ) : (
            <>
              <Plus size={18} />
              {editingJob ? "Update Job" : "Create Job"}
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default JobPostingForm;