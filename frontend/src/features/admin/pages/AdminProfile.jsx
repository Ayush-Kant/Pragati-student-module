import { useState } from "react";
import toast from "react-hot-toast";
import { useAdminProfile } from "../hooks/useAdminProfile";
import AdminProfileCard from "../components/AdminProfileCard";
import AdminEditForm from "../components/AdminEditForm";

const AdminProfile = () => {
  const {
    profile,
    loading,
    error,
    saveProfile,
  } = useAdminProfile();

  const [isEditing, setIsEditing] = useState(false);

  // LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        <h3>{error}</h3>
      </div>
    );
  }

  // SAVE HANDLER
  const handleSave = async (data) => {
    const result = await saveProfile(data);
    if (result.success) {
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {!isEditing && (
        <div className="bg-gradient-to-r from-slate-900 via-violet-700 to-sky-700 px-4 py-5 shadow-lg">
          <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 text-white">
            <div className="text-sm opacity-80">
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/30 transition hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 mx-auto max-w-[1320px] px-6 py-4 w-full overflow-y-auto">
        {isEditing ? (
          <AdminEditForm
            profile={profile}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <AdminProfileCard profile={profile} />
        )}
      </div>
    </div>
  );
};

export default AdminProfile;