import { useEffect, useReducer, useState } from "react";
import { Building2, MapPin, IndianRupee, Plus } from "lucide-react";
import { validateCompany } from "../../validations/companyJobPostingValidation";

const getInitialFormData = (company) => ({
  company: company?.company || "",
  location: company?.location || "",
  package: company?.package || "",
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

const CompanyForm = ({ onSubmit, editingCompany }) => {
  const [formData, dispatch] = useReducer(
    formReducer,
    editingCompany,
    getInitialFormData
  );

  const [errors, setErrors] = useState({
    company: "",
    location: "",
    package: "",
  });

  useEffect(() => {
    dispatch({
      type: "reset",
      payload: getInitialFormData(editingCompany),
    });

    // Defer setting errors to avoid synchronous setState inside effect
    // which can cause cascading renders.
    const t = setTimeout(() => {
      setErrors({
        company: "",
        location: "",
        package: "",
      });
    }, 0);

    return () => clearTimeout(t);
  }, [editingCompany]);

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

    const validationErrors = validateCompany(formData);

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
      company: "",
      location: "",
      package: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">
        {editingCompany ? "Edit Company" : "Add Company"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company */}

        <div>
          <div className="relative">
            <Building2
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              className={`w-full rounded-lg pl-10 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.company ? "border border-red-500" : "border"
              }`}
            />
          </div>

          {errors.company && (
            <p className="text-red-500 text-sm mt-1">
              {errors.company}
            </p>
          )}
        </div>

        {/* Location */}

        <div>
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full rounded-lg pl-10 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.location ? "border border-red-500" : "border"
              }`}
            />
          </div>

          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location}
            </p>
          )}
        </div>

        {/* Package */}

        <div>
          <div className="relative">
            <IndianRupee
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              name="package"
              placeholder="Package"
              value={formData.package}
              onChange={handleChange}
              className={`w-full rounded-lg pl-10 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.package ? "border border-red-500" : "border"
              }`}
            />
          </div>

          {errors.package && (
            <p className="text-red-500 text-sm mt-1">
              {errors.package}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex justify-center items-center gap-2"
        >
          <Plus size={18} />
          {editingCompany ? "Update Company" : "Add Company"}
        </button>
      </form>
    </div>
  );
};

export default CompanyForm;