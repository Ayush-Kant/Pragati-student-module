import React, { useEffect, useState } from "react";
import { addProfile, getProfile, updateProfile } from "../../services/collegeService";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";


const OrganizationProfile = () => {
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

  return (
    <div>
        {
            profile ? (
                <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900">
                  College Profile
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
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
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">
              Organization Profile
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={profile?.name || ''}   
                  required
                  className="w-full border rounded-lg p-3"
                  placeholder="Enter organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Profile Code
                </label>
                <input
                  type="text"
                  name="profileCode"
                  defaultValue={profile?.profile_code || ''}
                  className="w-full border rounded-lg p-3"
                  placeholder="UTS2021"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Established Year
                </label>
                <input
                  type="number"
                  name="established"
                  defaultValue={profile?.established || ''}
                  className="w-full border rounded-lg p-3"
                  placeholder="2021"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  defaultValue={profile?.category || ''}
                  className="w-full border rounded-lg p-3"
                  placeholder="EdTech Organization"
                />
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">
              Contact Person
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  defaultValue={profile?.contact_person || ''}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  defaultValue={profile?.designation || ''}
                  className="w-full border rounded-lg p-3"
                />
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">
              Organization Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  defaultValue={profile?.address || ''}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Lead
                </label>
                <input
                  type="text"
                  name="contactLead"
                  defaultValue={profile?.contact_lead || ''}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  defaultValue={profile?.website || ''}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={profile?.email || ''}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={profile?.phone || ''}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Learners Guided
                </label>
                <input
                  type="number"
                  name="learners_guided"
                  defaultValue={profile?.learners_guided || ''}
                  className="w-full border rounded-lg p-3"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                About Organization
              </label>
              <textarea
                rows={5}
                name="about"
                defaultValue={profile?.about || ''}
                className="w-full border rounded-lg p-3"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : profile ? 'Update Profile' : 'Add Profile '}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizationProfile;