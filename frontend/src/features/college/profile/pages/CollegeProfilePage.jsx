import { useEffect, useState } from "react";
import ProfileBanner from "../components/view-profile/ProfileBanner";
import ProfileDetails from "../components/view-profile/ProfileDetails";
import { getProfile } from "../../services/collegeService";

export default function CollegeProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const result = await getProfile();

      if (result?.success) {
        setProfile(result.data);
      } else {
        setError("No profile data available");
      }
    } catch (err) {
      console.error("Profile Error:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff7a00] mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  if (!profile) return null;

  return (

    <div className="bg-white min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Uptoskills Profile
          </h1>
          <p className="text-sm text-gray-600 font-medium mt-2">
            Dashboard &gt; Uptoskills Profile
          </p>
        </div>

        <ProfileBanner profile={profile} />
        <ProfileDetails profile={profile} />

    </div>

      <ProfileBanner profile={profile} />
      <ProfileDetails profile={profile} />
    </div>
  );
}