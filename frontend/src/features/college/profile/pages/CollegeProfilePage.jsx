import { useEffect, useState } from 'react';
import ProfileBanner from '../components/view-profile/ProfileBanner';
import ProfileDetails from '../components/view-profile/ProfileDetails';
import { profileDummyData } from '../types/profileDummyData';
import { getProfile } from '../../services/collegeService';

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
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">College Profile</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Dashboard &rsaquo; Profile
        </p>
      </div>

      <ProfileBanner profile={profile} />
      <ProfileDetails profile={profile} />
    </div>
  );
}
