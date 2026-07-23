import { Edit2, BadgeCheck } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function ProfileBanner({ profile }) {
  const { darkMode } = useOutletContext() || {};
  const navigate = useNavigate();

  if (!profile) return null;

  const initials = profile.name
    ?.split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'NA';

  return (
    <div className={`rounded-xl border p-6 md:p-8 mb-6 ${
      darkMode
        ? "bg-[#2D2D2D] border-[#3D3D3D]"
        : "bg-white border-gray-100 shadow-sm"
    }`}>
      <div className="flex flex-col md:flex-row gap-8 items-start">

        {/* Left: Logo */}
        <div className="shrink-0 flex justify-center w-full md:w-auto">
          <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 shadow-lg ${
            darkMode ? "border-[#3D3D3D] bg-[#1A1A1A]" : "border-white bg-gray-50"
          }`}>
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#ff6d34]/10 text-[#ff6d34] font-extrabold text-4xl">
                {initials}
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="grow flex flex-col justify-between w-full">
          <div>
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-1.5">
                  <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{profile.name}</h1>
                  {profile.verified && (
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-green-100 uppercase tracking-wide">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Verified Profile
                    </span>
                  )}
                </div>
              </div>

              <button onClick={()=>navigate('/college/update-profile')} className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#ff6d34] hover:bg-[#e55a2b] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm">
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t ${
            darkMode ? "border-[#3D3D3D]" : "border-gray-100"
          }`}>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Profile Code</p>
              <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{profile.profile_code}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Established</p>
              <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{profile.established}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Category</p>
              <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{profile.category}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Partners</p>
              <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>-</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
