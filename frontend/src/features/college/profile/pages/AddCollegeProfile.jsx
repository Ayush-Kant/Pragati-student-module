import React, { useEffect, useState } from "react";
import { useOutletContext } from 'react-router-dom';
import { addProfile, getProfile, updateProfile } from "../../services/collegeService";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

const OrganizationProfile = () => {
    const { darkMode } = useOutletContext() || {};
    const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

   const fetchProfile = async () => {
     try {
        const result = await getProfile();
        if(result.success){
            setProfile(result.data)
        }
      } catch (err) {
        console.error('Login error:', err);
      }
     };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        profile_code: formData.get("profileCode"),
        established: formData.get("established"),
        category: formData.get("category"),
        contact_person: formData.get("contactPerson"),
        designation: formData.get("designation"),
        address: formData.get("address"),
        contact_lead: formData.get("contactLead"),
        website: formData.get("website"),
        learners_guided: formData.get("learners_guided"),
        about:formData.get('about')
      };

    try {
      setLoading(true);

      let response = null
      if(profile){
        response = await updateProfile(data);
      }else{
        response = await addProfile(data);
      }
      if(response.success){
        toast.success(
            response.message || "Profile created successfully"
          );
        navigate(`/college/profile`);
     }else{
        toast.error(
            response.message || "Failed to create profile."
          );
     }

      e.target.reset();
    } catch (error) {
      console.error("Create Profile Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full border rounded-lg p-3 text-sm ${
    darkMode
      ? "bg-[#1A1A1A] border-[#3D3D3D] text-white placeholder-gray-500"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
  } focus:outline-none focus:ring-2 focus:ring-[#ff6d34]/50 focus:border-[#ff6d34] transition-all`;
  const labelClass = "block text-sm font-medium mb-2";
  const sectionClass = `rounded-lg p-6 ${
    darkMode ? "bg-[#2D2D2D] border border-[#3D3D3D]" : "bg-white shadow border border-gray-100"
  }`;

  return (
    <div>
        {
            profile ? (
                <div className="mb-6">
                <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  College Profile
                </h1>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Dashboard &rsaquo; Profile &rsaquo; Add
                </p>
              </div>
            ) : null
        }

      <div className="max-w-6xl mx-auto p-6">
        <form
          id="organizationForm"
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Organization Profile */}
          <div className={sectionClass}>
            <h2 className={`text-xl font-semibold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Organization Profile
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`${labelClass} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Organization Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={profile?.name || ''}
                  required
                  className={inputClass}
                  placeholder="Enter organization name"
                />
              </div>

              <div>
                <label className={`${labelClass} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Profile Code
                </label>
                <input
                  type="text"
                  name="profileCode"
                  defaultValue={profile?.profile_code || ''}
                  className={inputClass}
                  placeholder="UTS2021"
                />
              </div>

              <div>
                <label className={`${labelClass} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Established Year
                </label>
                <input
                  type="number"
                  name="established"
                  defaultValue={profile?.established || ''}
                  className={inputClass}
                  placeholder="2021"
                />
              </div>

              <div>
                <label className={`${labelClass} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  defaultValue={profile?.category || ''}
                  className={inputClass}
                  placeholder="EdTech Organization"
                />
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div className={sectionClass}>
            <h2 className={`text-xl font-semibold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Contact Person
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`${labelClass} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Contact Person Name
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  defaultValue={profile?.contact_person || ''}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={`${labelClass} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  defaultValue={profile?.designation || ''}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className={sectionClass}>
            <h2 className={`text-xl font-semibold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Organization Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`${labelClass} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  defaultValue={profile?.address || ''}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={`${labelClass} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Contact Lead
                </label>
                <input
                  type="text"
                  name="contactLead"
                  defaultValue={profile?.contact_lead || ''}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={`${labelClass} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  defaultValue={profile?.website || ''}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={`${labelClass} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={profile?.email || ''}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={`${labelClass} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={profile?.phone || ''}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={`${labelClass} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Learners Guided
                </label>
                <input
                  type="number"
                  name="learners_guided"
                  defaultValue={profile?.learners_guided || ''}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className={`${labelClass} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                About Organization
              </label>
              <textarea
                rows={5}
                name="about"
                defaultValue={profile?.about || ''}
                className={inputClass + " resize-none"}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#ff6d34] hover:bg-[#e55a2b] text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 shadow-sm"
          >
            {loading ? "Saving..." : profile ? 'Update Profile' : 'Add Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizationProfile;