
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from 'react-router-dom';

// ── Auth Pages  ──
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";


// ── Student Module ───────────────────────────────────────────────────────────
import { AuthProvider} from './context/AuthContext';
import VerificationPage from './features/student/pages/public/VerificationPage';
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
      <Routes>
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* ── Auth Routes ────────────────────────────────────────── */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* ── Mentor ────────────────────────────────────────────────── */}
        {mentorRoute}

        {/* ── Admin ─────────────────────────────────────────────────── */}
       
        {AdminRoute}

        {/* ── Student ───────────────────────────────────────────────── */}
        {StudentRoutes}

      {/* Collge */}

      {collegeRoute}


  {/* Company */}

      {CompanyRoute}

      
        {/* Public certificate verification */}
        <Route path='/verify/:code' element={<VerificationPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );


}
export default App;