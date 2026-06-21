import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
<<<<<<< HEAD
import { Toaster } from "react-hot-toast";
=======
import ProfileManagementPage from "./features/student/profile/pages/ProfileManagementPage";
>>>>>>> parent of 9a0f98c (Revert "Feature/mentor export report fe")

// Auth Pages
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";

// ── Student Module ───────────────────────────────────────────────────────────
import { AuthProvider } from "./context/AuthContext";
import VerificationPage from "./features/student/pages/public/VerificationPage";
import StudentRoutes from "./features/student/routes/StudentRoutes";

// Admin / Mentor / College / Company Routes
import AdminRoute from "./features/admin/routes/AdminRoutes";
import mentorRoute from "./features/mentor/routes/MentorRoutes";
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

        {/* Mentor */}
        {mentorRoute}

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
