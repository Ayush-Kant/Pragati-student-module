import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
<<<<<<< HEAD
import { Toaster } from "react-hot-toast";
=======
import ProfileManagementPage from "./features/student/profile/pages/ProfileManagementPage";
>>>>>>> parent of 9a0f98c (Revert "Feature/mentor export report fe")

import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";

// Auth Pages
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";

// ── Student Module ───────────────────────────────────────────────────────────
import { AuthProvider } from "./context/AuthContext";
import VerificationPage from "./features/student/pages/public/VerificationPage";
import StudentRoutes from "./features/student/routes/StudentRoutes";

// Admin / Mentor / College / Company Routes
import AdminRoute from "./features/admin/routes/AdminRoutes";
import MentorLayout from "./features/mentor/MentorLayout";
import Activities from "./features/mentor/pages/Activities";
import CreateActivity from "./features/mentor/pages/CreateActivity";
import ActivityTemplates from "./features/mentor/pages/ActivityTemplates";
import ManageDeadlines from "./features/mentor/pages/ManageDeadlines";
import BulkAssignActivity from "./features/mentor/pages/BulkAssignActivity";
import ActivityCalendar from "./features/mentor/pages/ActivityCalendar";
import collegeRoute from "./features/college/routes/AppRoutes";
import CompanyRoute from "./features/company/routes/CompanyRoute";

import NotFoundPage from "./routes/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <Toaster />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Auth Routes ────────────────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Mentor (protected) */}
        <Route element={<PrivateRoute />}>
          <Route element={<RoleRoute allowedRoles={['mentor']} />}>
            <Route path="/mentor" element={<MentorLayout />}>
              <Route index element={<Activities />} />
              <Route path="activities" element={<Activities />} />
              <Route path="activities/create" element={<CreateActivity />} />
              <Route path="activities/templates" element={<ActivityTemplates />} />
              <Route path="activities/deadlines" element={<ManageDeadlines />} />
              <Route path="activities/bulk-assign" element={<BulkAssignActivity />} />
              <Route path="activities/calendar" element={<ActivityCalendar />} />
            </Route>
          </Route>
        </Route>

        {/* Admin */}
        {AdminRoute}

        {/* Student */}
        {StudentRoutes}

        {/* College */}
        {collegeRoute}

        {/* Company */}
        {CompanyRoute}

        {/* Public Certificate Verification */}
        <Route path="/verify/:code" element={<VerificationPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
