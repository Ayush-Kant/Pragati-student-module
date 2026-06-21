import React, { useState } from "react";
import ProfileInput from "./ProfileInput";
import ProfileTextarea from "./ProfileTextarea";
import editProfileDummyData from "../../types/editProfileDummyData";

const EditProfileForm = ({ onCancel }) => {
  const [formData, setFormData] = useState(editProfileDummyData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen w-full p-6 font-sans">
      <div className="w-full max-w-none">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Edit College Profile
          </h1>

          <div className="flex items-center text-sm text-gray-500 gap-2">
            <span>Dashboard</span>

            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>

            <span>Profile</span>

            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>

            <span>Edit Profile</span>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 mb-6">
            {/* Logo Section */}
            <div>
              <label className="text-sm font-semibold text-gray-900 block mb-4">
                College Logo
              </label>

              <div className="flex flex-col items-center md:items-start">
                <div className="relative inline-block">
                  <img
                    src={formData.collegeLogo}
                    alt="logo"
                    className="w-32 h-32 rounded-full object-cover shadow-sm border border-gray-100"
                  />

                  <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>

                    <input type="file" className="hidden" />
                  </label>
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center md:text-left">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>

            {/* Top Fields */}
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInput
                  label="College Name"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  required
                />

                <ProfileInput
                  label="College Code"
                  name="collegeCode"
                  value={formData.collegeCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <ProfileInput
                label="Tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
              />

              <ProfileTextarea
                label="About College"
                name="aboutCollege"
                value={formData.aboutCollege}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
          </div>

          {/* Remaining Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-2">
            <ProfileTextarea
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              required
            />

            <ProfileInput
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              required
            />

            <ProfileInput
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <ProfileInput
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <ProfileInput
              label="Established Year"
              name="establishedYear"
              value={formData.establishedYear}
              onChange={handleChange}
              type="select"
              options={Array.from(
                { length: new Date().getFullYear() - 1950 + 1 },
                (_, i) => `${new Date().getFullYear() - i}`
              )}
              required
            />

            <ProfileInput
              label="College Type"
              name="collegeType"
              value={formData.collegeType}
              onChange={handleChange}
              type="select"
              required
              options={["Private", "Government", "Semi-Government"]}
            />

            <ProfileInput
              label="Affiliated To"
              name="affiliatedTo"
              value={formData.affiliatedTo}
              onChange={handleChange}
              type="select"
              required
              options={["AICTE", "UGC", "State University"]}
            />

            <ProfileInput
              label="Accreditation"
              name="accreditation"
              value={formData.accreditation}
              onChange={handleChange}
              type="select"
              required
              options={["NAAC A+", "NAAC A", "NAAC B", "NBA"]}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => onCancel?.()}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;