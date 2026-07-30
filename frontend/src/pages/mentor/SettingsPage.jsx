import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Briefcase,
  Sliders,
  Calendar,
  Bell,
  Eye,
  Lock,
  AlertTriangle,
  LogOut,
  Upload,
  Trash2,
  Plus,
  X,
  Globe,
  Code,
  Save,
  RotateCcw
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");

  // --- Initial Data for Resetting ---
  const initialProfile = {
    fullName: "Eleanor Rigby",
    displayName: "Eleanor R.",
    professionalTitle: "Senior Staff Engineer",
    bio: "Passionate about scaling distributed systems and mentoring the next generation of engineering leaders.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
  };

  const initialProfessional = {
    currentCompany: "TechNova Solutions",
    industry: "Software Technology",
    expertise: ["Software Engineering", "System Architecture"],
    linkedin: "https://linkedin.com/in/username",
    github: "https://github.com/username"
  };

  const initialPreferences = {
    timezone: "Asia/Kolkata",
    language: "English",
    theme: "Light"
  };

  const initialAvailability = {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
    startTime: "09:00",
    endTime: "17:00"
  };

  const initialNotifications = {
    sessionBookings: true,
    menteeMessages: true,
    marketingEmails: false,
    weeklyDigest: true
  };

  const initialPrivacy = {
    profileVisibility: "public",
    showEmail: false,
    showActivity: true
  };

  // --- State Hooks ---
  const [profile, setProfile] = useState(initialProfile);
  const [professional, setProfessional] = useState(initialProfessional);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [availability, setAvailability] = useState(initialAvailability);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [privacy, setPrivacy] = useState(initialPrivacy);
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [newTag, setNewTag] = useState("");

  // --- Action Handlers ---
  const handleSave = () => {
    // Validate password changes if any
    if (activeTab === "Security") {
      if (security.newPassword || security.confirmPassword || security.currentPassword) {
        if (!security.currentPassword) {
          toast.error("Please enter your current password");
          return;
        }
        if (security.newPassword !== security.confirmPassword) {
          toast.error("New passwords do not match");
          return;
        }
        if (security.newPassword.length < 6) {
          toast.error("Password must be at least 6 characters long");
          return;
        }
      }
    }

    toast.success("Changes saved successfully!");
    // Clear security fields on successful save
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleDiscard = () => {
    if (activeTab === "Profile") setProfile(initialProfile);
    if (activeTab === "Professional Info") setProfessional(initialProfessional);
    if (activeTab === "Preferences") setPreferences(initialPreferences);
    if (activeTab === "Availability") setAvailability(initialAvailability);
    if (activeTab === "Notifications") setNotifications(initialNotifications);
    if (activeTab === "Privacy") setPrivacy(initialPrivacy);
    if (activeTab === "Security") {
      setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
    toast.success("Reset to original settings");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    }
  };

  const handleAvatarUpload = () => {
    const newAvatar = prompt("Enter an image URL for your avatar:");
    if (newAvatar) {
      setProfile({ ...profile, avatar: newAvatar });
      toast.success("Avatar updated");
    }
  };

  const handleRemoveAvatar = () => {
    setProfile({ ...profile, avatar: "" });
    toast.success("Avatar removed");
  };

  const handleAddExpertise = (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    if (professional.expertise.includes(newTag.trim())) {
      toast.error("Tag already exists");
      return;
    }
    setProfessional({
      ...professional,
      expertise: [...professional.expertise, newTag.trim()]
    });
    setNewTag("");
  };

  const handleRemoveExpertise = (tagToRemove) => {
    setProfessional({
      ...professional,
      expertise: professional.expertise.filter((tag) => tag !== tagToRemove)
    });
  };

  const handleDeactivate = () => {
    if (window.confirm("Are you sure you want to deactivate your account? Your profile will be hidden until you sign back in.")) {
      toast.success("Account deactivated successfully");
      logout();
      navigate("/login");
    }
  };

  const handleDeleteAccount = () => {
    const confirmText = prompt("Type 'DELETE' to confirm you want to permanently delete your account:");
    if (confirmText === "DELETE") {
      toast.success("Account permanently deleted");
      logout();
      navigate("/login");
    } else if (confirmText !== null) {
      toast.error("Incorrect confirmation text. Account deletion cancelled.");
    }
  };

  // --- Sidebar Items Setup ---
  const tabs = [
    { name: "Profile", icon: <User className="w-4 h-4" /> },
    { name: "Professional Info", icon: <Briefcase className="w-4 h-4" /> },
    { name: "Preferences", icon: <Sliders className="w-4 h-4" /> },
    { name: "Availability", icon: <Calendar className="w-4 h-4" /> },
    { name: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { name: "Privacy", icon: <Eye className="w-4 h-4" /> },
    { name: "Security", icon: <Lock className="w-4 h-4" /> },
    { name: "Danger Zone", icon: <AlertTriangle className="w-4 h-4 text-red-500" />, className: "text-red-600 hover:bg-red-50" }
  ];

  return (
    <div className="max-w-6xl mx-auto py-4 px-2">
      {/* Settings Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mentor Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your professional profile and mentoring preferences.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <button
            onClick={handleDiscard}
            className="flex flex-1 sm:flex-none justify-center items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Discard
          </button>
          <button
            onClick={handleSave}
            className="flex flex-1 sm:flex-none justify-center items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-600 active:scale-95 shadow-sm whitespace-nowrap"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Settings Body Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Left Column Navigation Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-6 w-full max-w-full overflow-hidden">
          <nav className="flex overflow-x-auto md:flex-col gap-1 bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => {
              const active = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center justify-center md:justify-start gap-3 whitespace-nowrap shrink-0 md:w-full rounded-lg px-3.5 py-3 text-sm font-medium transition-all ${active
                      ? tab.name === "Danger Zone"
                        ? "bg-red-50 text-red-600 font-semibold"
                        : "bg-sky-50 text-sky-600 font-semibold"
                      : tab.className || "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              );
            })}

            {/* Divider */}
            <div className="hidden md:block h-px bg-slate-100 my-2.5 mx-2"></div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center md:justify-start gap-3 whitespace-nowrap shrink-0 md:w-full rounded-lg px-3.5 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </nav>
        </div>

        {/* Right Column Content Panel */}
        <div className="md:col-span-3 bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">

          {/* TAB 1: Profile */}
          {activeTab === "Profile" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <User className="w-5 h-5 text-sky-500" />
                <h2 className="text-lg font-bold text-slate-800">Personal Profile</h2>
              </div>

              {/* Avatar Upload */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 rounded-xl p-5 border border-slate-100">
                <div className="relative">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-2xl font-bold shadow-inner">
                      {profile.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-row gap-3">
                  <button
                    onClick={handleAvatarUpload}
                    className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm active:scale-95"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                  </button>
                  <button
                    onClick={handleRemoveAvatar}
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-all active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>

              {/* Profile Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="Enter display name"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Title</label>
                  <input
                    type="text"
                    value={profile.professionalTitle}
                    onChange={(e) => setProfile({ ...profile, professionalTitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="e.g. Senior Staff Engineer"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none"
                    placeholder="Write a brief bio..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Professional Info */}
          {activeTab === "Professional Info" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Briefcase className="w-5 h-5 text-sky-500" />
                <h2 className="text-lg font-bold text-slate-800">Professional Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Company</label>
                  <input
                    type="text"
                    value={professional.currentCompany}
                    onChange={(e) => setProfessional({ ...professional, currentCompany: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="Enter current company"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Industry</label>
                  <select
                    value={professional.industry}
                    onChange={(e) => setProfessional({ ...professional, industry: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500 bg-white"
                  >
                    <option value="Software Technology">Software Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education Technology">Education Technology</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="E-commerce">E-commerce</option>
                  </select>
                </div>

                {/* Primary Expertise Tags */}
                <div className="flex flex-col gap-2.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Expertise</label>
                  <div className="flex flex-wrap gap-2.5 items-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                    {professional.expertise.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-100 text-sky-700 font-semibold px-2.5 py-1.5 rounded-lg text-xs"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveExpertise(tag)}
                          className="hover:bg-sky-200 text-sky-500 hover:text-sky-700 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {/* Add tag form */}
                    <form onSubmit={handleAddExpertise} className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="Add expertise tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="border-none bg-transparent text-xs text-slate-700 outline-none py-1.5 px-2.5 placeholder-slate-400 w-32"
                      />
                      <button
                        type="submit"
                        className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-sky-500 hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Social Links</label>

                  {/* Linkedin input */}
                  <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-3.5 py-2 hover:border-sky-500 transition-colors focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500">
                    <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={professional.linkedin}
                      onChange={(e) => setProfessional({ ...professional, linkedin: e.target.value })}
                      className="w-full bg-transparent text-sm text-slate-800 outline-none border-none p-0"
                      placeholder="LinkedIn Profile URL"
                    />
                  </div>

                  {/* Github input */}
                  <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-3.5 py-2 hover:border-sky-500 transition-colors focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 mt-2">
                    <Code className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={professional.github}
                      onChange={(e) => setProfessional({ ...professional, github: e.target.value })}
                      className="w-full bg-transparent text-sm text-slate-800 outline-none border-none p-0"
                      placeholder="GitHub Profile URL"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Preferences */}
          {activeTab === "Preferences" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Sliders className="w-5 h-5 text-sky-500" />
                <h2 className="text-lg font-bold text-slate-800">Preferences</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Timezone</label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none bg-white"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+5:30)</option>
                    <option value="America/New_York">America/New_York (EST - UTC-5:00)</option>
                    <option value="Europe/London">Europe/London (GMT - UTC+0:00)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT - UTC+8:00)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Hindi">Hindi</option>
                    <option value="German">German</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Theme Mode</label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {["Light", "Dark", "System"].map((mode) => (
                      <label key={mode} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          value={mode}
                          checked={preferences.theme === mode}
                          onChange={() => setPreferences({ ...preferences, theme: mode })}
                          className="text-sky-500 focus:ring-sky-500"
                        />
                        <span>{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Availability */}
          {activeTab === "Availability" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Calendar className="w-5 h-5 text-sky-500" />
                <h2 className="text-lg font-bold text-slate-800">Availability Preferences</h2>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weekly Available Days</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                    <label key={day} className="flex items-center gap-2.5 text-sm text-slate-700 font-medium capitalize cursor-pointer">
                      <input
                        type="checkbox"
                        checked={availability[day]}
                        onChange={(e) => setAvailability({ ...availability, [day]: e.target.checked })}
                        className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Time</label>
                    <input
                      type="time"
                      value={availability.startTime}
                      onChange={(e) => setAvailability({ ...availability, startTime: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">End Time</label>
                    <input
                      type="time"
                      value={availability.endTime}
                      onChange={(e) => setAvailability({ ...availability, endTime: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Notifications */}
          {activeTab === "Notifications" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Bell className="w-5 h-5 text-sky-500" />
                <h2 className="text-lg font-bold text-slate-800">Notification Settings</h2>
              </div>

              <div className="space-y-4">
                {[
                  { key: "sessionBookings", label: "Email notifications for session bookings", desc: "Get alerted when a mentee schedules or reschedules a session" },
                  { key: "menteeMessages", label: "New messages from mentees", desc: "Receive immediate notifications for chat messages" },
                  { key: "marketingEmails", label: "Marketing updates and newsletters", desc: "Keep up-to-date with platform releases and news" },
                  { key: "weeklyDigest", label: "Weekly performance digest", desc: "Get a summary of mentoring analytics and ratings every Sunday" }
                ].map((item) => (
                  <div key={item.key} className="flex gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <input
                      type="checkbox"
                      id={item.key}
                      checked={notifications[item.key]}
                      onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                      className="rounded border-slate-300 text-sky-500 focus:ring-sky-500 mt-1 h-4 w-4 shrink-0"
                    />
                    <div className="flex flex-col">
                      <label htmlFor={item.key} className="text-sm font-bold text-slate-700 cursor-pointer">{item.label}</label>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Privacy */}
          {activeTab === "Privacy" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Eye className="w-5 h-5 text-sky-500" />
                <h2 className="text-lg font-bold text-slate-800">Privacy Preferences</h2>
              </div>

              <div className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Visibility</label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none bg-white"
                  >
                    <option value="public">Public (Visible to everyone on the platform)</option>
                    <option value="mentees">Mentees Only (Only visible to registered students)</option>
                    <option value="private">Private (Hidden from all searches)</option>
                  </select>
                </div>

                <div className="h-px bg-slate-100 my-4"></div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">Display Email Address</span>
                    <span className="text-xs text-slate-500 mt-0.5">Allow mentees to see your email address on your profile page</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacy.showEmail}
                    onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
                    className="rounded border-slate-300 text-sky-500 focus:ring-sky-500 h-4 w-4 shrink-0"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">Show Online Status</span>
                    <span className="text-xs text-slate-500 mt-0.5">Let mentees see when you are active on the platform</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacy.showActivity}
                    onChange={(e) => setPrivacy({ ...privacy, showActivity: e.target.checked })}
                    className="rounded border-slate-300 text-sky-500 focus:ring-sky-500 h-4 w-4 shrink-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Security */}
          {activeTab === "Security" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Lock className="w-5 h-5 text-sky-500" />
                <h2 className="text-lg font-bold text-slate-800">Security / Password Settings</h2>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    value={security.newPassword}
                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Danger Zone */}
          {activeTab === "Danger Zone" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-red-100 pb-4">
                <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
              </div>

              <div className="space-y-5">
                {/* Deactivate Account */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl p-5">
                  <div className="flex flex-col max-w-lg">
                    <span className="text-sm font-bold text-slate-700">Deactivate Account</span>
                    <span className="text-xs text-slate-500 mt-1">Temporarily hide your profile. You can reactivate by signing back in.</span>
                  </div>
                  <button
                    onClick={handleDeactivate}
                    className="w-full sm:w-auto rounded-lg bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm shrink-0"
                  >
                    Deactivate Account
                  </button>
                </div>

                {/* Delete Account */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-red-50/30 border border-red-100 rounded-xl p-5">
                  <div className="flex flex-col max-w-lg">
                    <span className="text-sm font-bold text-slate-700">Delete Account</span>
                    <span className="text-xs text-slate-500 mt-1">Permanently remove your account, profile, courses, and data. This action cannot be undone.</span>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full sm:w-auto rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm shrink-0"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
