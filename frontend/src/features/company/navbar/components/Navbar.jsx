import "./../styles/navbar.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { FiBell, FiSettings, FiSearch } from "react-icons/fi";
import {
  X,
  User,
  Settings,
  Lock,
  LogOut,
  CheckCheck,
  Bell,
  Mail,
  Moon,
  Eye,
  EyeOff,
  Edit2,
  Save,
} from "lucide-react";

// ─── Sample Notifications ────────────────────────────────────────────────────

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Rahul Patil completed interview round",
    timestamp: "2 min ago",
    read: false,
  },
  {
    id: 2,
    title: "Sneha Reddy accepted offer",
    timestamp: "15 min ago",
    read: false,
  },
  {
    id: 3,
    title: "New drive created for Software Engineer",
    timestamp: "1 hr ago",
    read: false,
  },
  {
    id: 4,
    title: "Assessment results published",
    timestamp: "3 hrs ago",
    read: false,
  },
];

// ─── Initial Profile ─────────────────────────────────────────────────────────

const INITIAL_PROFILE = {
  name: "Admin User",
  email: "admin@pragati.com",
  role: "HR Manager",
  department: "Human Resources",
  phone: "+91 98765 43210",
};

// ─── Helper: close on outside click ─────────────────────────────────────────

function useOutsideClick(ref, callback) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) callback();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, callback]);
}

// ─── Notification Dropdown ───────────────────────────────────────────────────

const NotificationDropdown = ({ notifications, onMarkRead, onMarkAllRead }) => (
  <div className="absolute right-0 top-[calc(100%+10px)] w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[2000] overflow-hidden">
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <span className="font-bold text-gray-900 text-[15px]">Notifications</span>
      <button
        onClick={onMarkAllRead}
        className="flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:text-blue-800 transition"
      >
        <CheckCheck size={13} />
        Mark all as read
      </button>
    </div>

    {/* List */}
    <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
      {notifications.map((n) => (
        <button
          key={n.id}
          onClick={() => onMarkRead(n.id)}
          className={`w-full text-left px-5 py-3.5 flex items-start gap-3 transition hover:bg-gray-50 ${
            n.read ? "opacity-60" : ""
          }`}
        >
          {/* Unread dot */}
          <span
            className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
              n.read ? "bg-gray-200" : "bg-blue-500"
            }`}
          />
          <div>
            <p
              className={`text-sm leading-snug ${
                n.read ? "text-gray-500 font-normal" : "text-gray-800 font-semibold"
              }`}
            >
              {n.title}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{n.timestamp}</p>
          </div>
        </button>
      ))}
    </div>

    {/* Footer */}
    <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-center">
      <span className="text-xs text-gray-400">
        {notifications.filter((n) => !n.read).length} unread notification
        {notifications.filter((n) => !n.read).length !== 1 ? "s" : ""}
      </span>
    </div>
  </div>
);

// ─── Profile Dropdown ────────────────────────────────────────────────────────

const ProfileDropdown = ({ onSelect }) => {
  const items = [
    { id: "profile", icon: User, label: "My Profile" },
    { id: "settings", icon: Settings, label: "Account Settings" },
    { id: "password", icon: Lock, label: "Change Password" },
    { id: "logout", icon: LogOut, label: "Logout", danger: true },
  ];

  return (
    <div className="absolute right-0 top-[calc(100%+10px)] w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[2000] py-2 overflow-hidden">
      {items.map((item, i) => (
        <div key={item.id}>
          {item.danger && <div className="my-1 border-t border-gray-100" />}
          <button
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 text-left ${
              item.danger ? "text-red-600 hover:bg-red-50" : "text-gray-700"
            }`}
          >
            <item.icon size={15} className="flex-shrink-0 opacity-70" />
            {item.label}
          </button>
        </div>
      ))}
    </div>
  );
};

// ─── Modal Shell ─────────────────────────────────────────────────────────────

const Modal = ({ title, subtitle, onClose, children, footer }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition mt-1"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-8 space-y-5">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          {footer}
        </div>
      )}
    </div>
  </div>
);

// ─── My Profile Modal ─────────────────────────────────────────────────────────

const ProfileModal = ({ profile, onClose, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });

  const handleSave = () => {
    onSave(form);
    setEditing(false);
    toast.success("Profile updated successfully");
  };

  const Field = ({ label, value, field }) => (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      {editing ? (
        <input
          type="text"
          value={form[field]}
          onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
        />
      ) : (
        <p className="text-gray-800 font-medium text-[15px]">{value}</p>
      )}
    </div>
  );

  return (
    <Modal
      title="My Profile"
      subtitle="Your account information"
      onClose={onClose}
      footer={
        editing ? (
          <>
            <button
              onClick={() => { setEditing(false); setForm({ ...profile }); }}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Save size={14} />
              Save Changes
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition flex items-center gap-2"
          >
            <Edit2 size={14} />
            Edit Profile
          </button>
        )
      }
    >
      {/* Avatar */}
      <div className="flex items-center gap-4 pb-2">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
          {profile.name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">{profile.name}</p>
          <p className="text-sm text-gray-500">{profile.role}</p>
        </div>
      </div>

      <Field label="Name" value={profile.name} field="name" />
      <Field label="Email" value={profile.email} field="email" />
      <Field label="Role" value={profile.role} field="role" />
      <Field label="Department" value={profile.department} field="department" />
      <Field label="Phone" value={profile.phone} field="phone" />
    </Modal>
  );
};

// ─── Account Settings Modal ───────────────────────────────────────────────────

const AccountSettingsModal = ({ onClose }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
  });
  const [saved, setSaved] = useState(false);

  const Toggle = ({ label, description, field, icon: Icon }) => (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
          <Icon size={16} className="text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
      </div>
      <button
        onClick={() => setSettings((p) => ({ ...p, [field]: !p[field] }))}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
          settings[field] ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            settings[field] ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  const handleSave = () => {
    setSaved(true);
    toast.success("Settings saved successfully");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Modal
      title="Account Settings"
      subtitle="Manage your preferences"
      onClose={onClose}
      footer={
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
        >
          {saved ? "Saved!" : "Save Settings"}
        </button>
      }
    >
      <div className="space-y-4">
        <Toggle
          label="Notifications"
          description="Receive in-app notifications"
          field="notifications"
          icon={Bell}
        />
        <Toggle
          label="Email Alerts"
          description="Get updates via email"
          field="emailAlerts"
          icon={Mail}
        />
        <Toggle
          label="Dark Mode"
          description="UI appearance (state only)"
          field="darkMode"
          icon={Moon}
        />
      </div>
    </Modal>
  );
};

// ─── Change Password Modal ────────────────────────────────────────────────────

const ChangePasswordModal = ({ onClose }) => {
  const [form, setForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.current) e.current = "Current password is required";
    if (!form.newPass) e.newPass = "New password is required";
    else if (form.newPass.length < 6) e.newPass = "Must be at least 6 characters";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.newPass !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    toast.success("Password updated successfully");
    onClose();
  };

  const PasswordField = ({ label, field }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={show[field] ? "text" : "password"}
          value={form[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          className={`w-full px-4 py-3 pr-10 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
            errors[field] ? "border-red-400 bg-red-50" : "border-gray-200"
          }`}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShow((p) => ({ ...p, [field]: !p[field] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show[field] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <Modal
      title="Change Password"
      subtitle="Update your account password"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            form="change-password-form"
            type="submit"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
          >
            Update Password
          </button>
        </>
      }
    >
      <form id="change-password-form" onSubmit={handleSubmit} className="space-y-5">
        <PasswordField label="Current Password" field="current" />
        <PasswordField label="New Password" field="newPass" />
        <PasswordField label="Confirm New Password" field="confirm" />
      </form>
    </Modal>
  );
};

// ─── Logout Modal ─────────────────────────────────────────────────────────────

const LogoutModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any local auth state if present
    try { localStorage.clear(); } catch (_) {}
    toast.success("Logged out successfully");
    onClose();
    // Navigate to login if route exists, otherwise root
    navigate("/login", { replace: true });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <LogOut size={22} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Logout</h3>
          <p className="text-sm text-gray-500">
            Are you sure you want to logout? You will need to sign in again to access
            your account.
          </p>
        </div>
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Navbar ──────────────────────────────────────────────────────────────

const Navbar = () => {
  const navigate = useNavigate();

  // Notifications
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  // Profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Modals
  const [activeModal, setActiveModal] = useState(null); // 'profile' | 'settings' | 'password' | 'logout'

  // Profile data (local state)
  const [profileData, setProfileData] = useState(INITIAL_PROFILE);

  // Outside-click handlers
  useOutsideClick(bellRef, () => setBellOpen(false));
  useOutsideClick(profileRef, () => setProfileOpen(false));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleProfileSelect = (id) => {
    setProfileOpen(false);
    setActiveModal(id);
  };

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <header className="navbar">
        {/* Left */}
        <div className="navbar-left">
          <div className="navbar-logo">P</div>
          <h2>Pragati</h2>
        </div>

        {/* Center */}
        <div className="navbar-center">
          <div className="search-box">
            <FiSearch size={16} className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
        </div>

        {/* Right */}
        <div className="navbar-right">

          {/* Bell */}
          <div ref={bellRef} style={{ position: "relative" }}>
            <div
              className="nav-icon"
              onClick={() => { setBellOpen((p) => !p); setProfileOpen(false); }}
              style={{ position: "relative" }}
            >
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    width: "8px",
                    height: "8px",
                    background: "#ef4444",
                    borderRadius: "50%",
                    border: "2px solid white",
                  }}
                />
              )}
            </div>

            {bellOpen && (
              <NotificationDropdown
                notifications={notifications}
                onMarkRead={handleMarkRead}
                onMarkAllRead={handleMarkAllRead}
              />
            )}
          </div>

          {/* Settings icon (existing) */}
          <div
            className="nav-icon"
            onClick={() => navigate("/settings")}
            style={{ cursor: "pointer" }}
          >
            <FiSettings size={18} />
          </div>

          {/* Profile Avatar */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <div
              className="profile-circle"
              style={{ cursor: "pointer" }}
              onClick={() => { setProfileOpen((p) => !p); setBellOpen(false); }}
            >
              {profileData.name.charAt(0)}
            </div>

            {profileOpen && (
              <ProfileDropdown onSelect={handleProfileSelect} />
            )}
          </div>

        </div>
      </header>

      {/* ── Modals ── */}

      {activeModal === "profile" && (
        <ProfileModal
          profile={profileData}
          onClose={closeModal}
          onSave={(updated) => setProfileData(updated)}
        />
      )}

      {activeModal === "settings" && (
        <AccountSettingsModal onClose={closeModal} />
      )}

      {activeModal === "password" && (
        <ChangePasswordModal onClose={closeModal} />
      )}

      {activeModal === "logout" && (
        <LogoutModal onClose={closeModal} />
      )}
    </>
  );
};

export default Navbar;