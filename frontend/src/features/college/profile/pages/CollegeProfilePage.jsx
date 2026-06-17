import { useEffect, useState } from 'react';
import ProfileBanner from './../components/view-profile/ProfileBanner';
import ProfileDetails from './../components/view-profile/ProfileDetails';
import { profileDummyData } from './../types/profileDummyData';

export default function CollegeProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate an API call delay
    const timer = setTimeout(() => {
      if (!profileDummyData) {
        setError("No profile data available");
        setLoading(false);
        return;
      }
      setProfile(profileDummyData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-[#f8fafc]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff7a00] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold bg-red-50 rounded-lg m-6 border border-red-200">
        <h3 className="text-lg mb-2">Error Loading Profile</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center text-gray-600 font-semibold bg-yellow-50 rounded-lg m-6 border border-yellow-200">
        <h3 className="text-lg mb-2">No Profile Data</h3>
        <p>Please try again later</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header / Breadcrumb */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Uptoskills Profile</h1>
          <p className="text-sm text-gray-600 font-medium mt-2">Dashboard &gt; Uptoskills Profile</p>
        </div>

        {/* Top Banner section */}
        <ProfileBanner profile={profile} />

        {/* Bottom Details section */}
        <ProfileDetails profile={profile} />

      </div>
    </div>
  );
}
