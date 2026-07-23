import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ProfileBanner from '../components/view-profile/ProfileBanner';
import ProfileDetails from '../components/view-profile/ProfileDetails';
import { getProfile } from '../../services/collegeService';

export default function CollegeProfilePage() {
  const { darkMode } = useOutletContext() || {};
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
   try {
      const result = await getProfile();
      setProfile(result.data);
    } catch (err) {
      console.error('Login error:', err);
    }
    setLoading(false);
   };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff6d34] mx-auto mb-3" />
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading profile...</p>
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

  if (!profile) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] rounded-xl border p-8 text-center ${
        darkMode
          ? "bg-[#2D2D2D] border-[#3D3D3D]"
          : "bg-white border-gray-100 shadow-sm"
      }`}>
        <div className="w-16 h-16 bg-[#ff6d34]/10 text-[#ff6d34] rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>No Profile Found</h3>
        <p className={`mb-6 max-w-md ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          You haven't set up your college profile yet. Create a profile to start managing your organization's details, placement drives, and more.
        </p>
        <a
          href="/college/add-profile"
          className="inline-flex items-center justify-center bg-[#ff6d34] hover:bg-[#e55a2b] text-white px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-sm"
        >
          Create College Profile
        </a>
      </div>
    );
  }
  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>College Profile</h1>
        <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Dashboard &rsaquo; Profile
        </p>
      </div>

      <ProfileBanner profile={profile} />
      <ProfileDetails profile={profile} />
    </div>
  );
}
