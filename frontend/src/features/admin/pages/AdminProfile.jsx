import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const { userRole, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });x
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Admin Profile
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-800">Testing Profile Page</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              This page is ready for UI testing. You can review the admin details below and sign out when done.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-800">Account Details</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Name</span>
                <span className="font-medium text-slate-800">Admin User</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span className="font-medium text-slate-800">admin@pragati.com</span>
              </div>
              <div className="flex justify-between">
                <span>Role</span>
                <span className="font-medium text-slate-800">{userRole || "admin"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                Profile screen is ready for testing.
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                Logout button clears the session and returns to login.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
