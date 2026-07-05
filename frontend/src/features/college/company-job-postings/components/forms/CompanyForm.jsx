import { useState } from "react";
import { Building2, MapPin, IndianRupee, Plus } from "lucide-react";

const CompanyForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    company: "",
    location: "",
    package: "",
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
      company: "",
      location: "",
      package: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-6">
        Add Company
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

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
            className="w-full border rounded-lg pl-10 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>

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
            className="w-full border rounded-lg pl-10 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>

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
            className="w-full border rounded-lg pl-10 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex justify-center items-center gap-2 transition"
        >
          <Plus size={18} />
          Add Company
        </button>

      </form>

    </div>
  );
};

export default CompanyForm;