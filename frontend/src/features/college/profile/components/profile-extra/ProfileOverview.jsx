import { CheckCircle, GraduationCap, MapPin } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import {
  profileData,
  overviewCardsData,
} from "../../types/profileExtraDummyData";

const socialIcons = {
  LinkedIn: FaLinkedin,
  Instagram: FaInstagram,
  Facebook: FaFacebook,
  YouTube: FaYoutube,
};

const colorVariants = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  orange: { bg: "bg-[#ff6d34]/10", text: "text-[#ff6d34]" },
};

const InfoCard = ({ icon: Icon, label, value, url, color = "blue", darkMode }) => {
  const colors = colorVariants[color] || colorVariants.blue;

  const content = (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
        <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{value}</p>
      </div>
    </div>
  );

  const classes = `rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg block ${
    darkMode
      ? "bg-[#2D2D2D] border-[#3D3D3D]"
      : "bg-white border-gray-100"
  }`;

  if (url) {
    return <a href={url} target="_blank" rel="noopener noreferrer" className={classes}>{content}</a>;
  }
  return <div className={classes}>{content}</div>;
};

const ProfileOverview = () => {
  const { darkMode } = useOutletContext() || {};

  return (
    <div className={`overflow-hidden rounded-3xl border ${
      darkMode
        ? "bg-[#2D2D2D] border-[#3D3D3D]"
        : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"
    }`}>
      {/* Banner */}
      <div className="relative h-56 md:h-72 lg:h-80">
        <img src={profileData.banner} alt={profileData.name} className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content */}
      <div className="relative px-6 pb-6 pt-24">
        {/* Logo */}
        <div className={`absolute left-6 -top-16 h-32 w-32 overflow-hidden rounded-full border-4 shadow-lg ${
          darkMode ? "border-[#3D3D3D] bg-[#1A1A1A]" : "border-white bg-white"
        }`}>
          <img src={profileData.logo} alt={profileData.name} className="h-full w-full object-cover" />
        </div>

        {/* College Name */}
        <div className="flex flex-col gap-3">
          <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{profileData.name}</h2>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {profileData.verified && (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle size={14} /> Verified
              </span>
            )}
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ff6d34]/10 px-3 py-1 text-xs font-semibold text-[#ff6d34]">
              <GraduationCap size={14} /> {profileData.collegeType}
            </span>
          </div>

          {/* Description */}
          <div className="mt-2">
            <h3 className={`mb-2 text-sm font-semibold uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}>About College</h3>
            <p className={`max-w-5xl leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{profileData.description}</p>
          </div>
        </div>

        {/* Information Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCardsData.map((item) => (
            <InfoCard key={item.label} darkMode={darkMode} icon={item.icon} label={item.label} value={item.value} url={item.url} color={item.color} />
          ))}
        </div>

        {/* Address & Social Links */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Address */}
          <div className={`rounded-2xl border p-5 ${
            darkMode ? "bg-[#1A1A1A] border-[#3D3D3D]" : "bg-gray-50 border-gray-100"
          }`}>
            <div className="mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-[#ff6d34]" />
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${darkMode ? "text-gray-300" : "text-gray-600"}`}>College Address</h3>
            </div>
            <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
              {profileData.address.line1}<br />
              {profileData.address.city}, {profileData.address.state} - {profileData.address.pincode}<br />
              {profileData.address.country}
            </p>
          </div>

          {/* Social Links */}
          <div className={`rounded-2xl border p-5 ${
            darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"
          }`}>
            <h3 className={`mb-4 text-sm font-semibold uppercase tracking-wide ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Connect With Us</h3>
            <div className="flex flex-wrap gap-3">
              {profileData.socialLinks.map((social) => {
                const Icon = socialIcons[social.name];
                return (
                  <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                      darkMode
                        ? "border-[#3D3D3D] text-gray-300 hover:border-[#ff6d34] hover:bg-[#ff6d34]/10 hover:text-[#ff6d34]"
                        : "border-gray-200 text-gray-700 hover:border-[#ff6d34] hover:bg-[#ff6d34]/10 hover:text-[#ff6d34]"
                    }`}>
                    <Icon size={16} /> {social.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
