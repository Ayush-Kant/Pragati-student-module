import { Toaster } from "react-hot-toast";

import { Routes, Route, Navigate } from "react-router-dom";

import ToastContainer from "./features/mentor/components/ToastContainer";

// ── Auth Pages ──
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import StudentLoginPage from "./features/auth/StudentLoginPage";
import StudentRegisterPage from "./features/auth/StudentRegisterPage";

// ── Student Module ───────────────────────────────────────────────────────────
import { AuthProvider } from "./context/AuthContext";
import VerificationPage from "./features/student/pages/public/VerificationPage";
import StudentRoutes from "./features/student/routes/StudentRoutes";
import AdminRoute from "./features/admin/routes/AdminRoutes";
import mentorRoute from "./features/mentor/routes/MentorRoutes";
import collegeRoute from "./features/college/routes/AppRoutes";
import NotFoundPage from "./routes/NotFoundPage";
import CompanyRoute from "./features/company/routes/CompanyRoute";

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Existing shared authentication remains unchanged. */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* PRD SM-01 dedicated student Firebase auth entry points. */}
        <Route path="/student/login" element={<StudentLoginPage />} />
        <Route path="/student/register" element={<StudentRegisterPage />} />

        {mentorRoute}
        {AdminRoute}
        {StudentRoutes}
        {collegeRoute}
        {CompanyRoute}

        <Route path="/verify/:code" element={<VerificationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
