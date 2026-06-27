import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from 'react-router-dom';

// ── Auth Pages  ──
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";

// ── Contexts ──
import { AuthProvider} from './context/AuthContext';

// ── Route Modules ──
import VerificationPage from './features/student/pages/public/VerificationPage';
import StudentRoutes from "./features/student/routes/StudentRoutes";
import AdminRoute from "./features/admin/routes/AdminRoutes";
import mentorRoute from "./features/mentor/routes/MentorRoutes";
import collegeRoute from "./features/college/routes/AppRoutes";
import NotFoundPage from "./routes/NotFoundPage";
import CompanyRoute from "./features/company/routes/CompanyRoute";
import CollegeProfilePage from "./features/college/profile/pages/CollegeProfilePage";

// 🚀 NEW IMPORT: Your Student Workspace
import ChallengeWorkspacePage from "./features/mentor/pages/student/ChallengeWorkspacePage";

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Auth Routes ────────────────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── Public Test Route (Preview) ── */}
        <Route path='/preview/college-profile' element={<CollegeProfilePage />} />
        <Route path='/uptoskills-profile' element={<CollegeProfilePage />} />
        
        {/* 🚀 NEW ROUTE: Navigate here to see your layout */}
        <Route path='/preview/challenge-workspace' element={<ChallengeWorkspacePage />} />

        {/* ── Mentor ── */}
        {mentorRoute}

        {/* ── Admin ── */}
        {AdminRoute}

        {/* ── Student ── */}
        {StudentRoutes}

        {/* ── College ── */}
        {collegeRoute}

        {/* ── Company ── */}
        {CompanyRoute}

        {/* ── Public ── */}
        <Route path='/verify/:code' element={<VerificationPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;