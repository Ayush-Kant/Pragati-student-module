import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from 'react-router-dom';

// ── Auth Pages  ──
import LoginPage from "./features/student/pages/auth/LoginPage";
import RegisterPage from "./features/student/pages/auth/RegisterPage";


// ── Mentor Module ──────────────────────────────────────────────────
import Dashboard from './features/mentor/pages/Dashboard';

// ── Admin Module ───────────────────────────────────────────────────
import AdminProfile       from './features/admin/pages/AdminProfile';
import AdminLayout        from './features/admin/adminLayout';
import AdminDashboard     from './features/admin/adminDashboard/AdminDashboard';
import AdminAssesment     from './features/admin/adminAssesments/AdminAssesment';
import AdminCollege       from './features/admin/adminColleges/AdminCollege';
import AdminCompanies     from './features/admin/adminCompanies/AdminCompanies';
import AdminMentors       from './features/admin/adminMentors/AdminMentors';
import AdminStudent       from './features/admin/adminStudents/AdminStudent';
import AdminDrives        from './features/admin/adminDrives/AdminDrives';
import AdminTraining      from './features/admin/adminTraining/AdminTraining';
import AdminDisputes      from './features/admin/adminDisputes/AdminDisputes';
import AdminNotifications from './features/admin/adminNotifications/AdminNotifications';

// ── Student Module ───────────────────────────────────────────────────────────
import { AuthProvider, StudentRoutes } from './features/student';
import VerificationPage from './features/student/pages/public/VerificationPage';
import CollegeDetail from "./features/admin/pages/CollegeDetail";

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
        <Route path='/mentor/dashboard' element={<Dashboard />} />

        {/* ── Admin ─────────────────────────────────────────────────── */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index          element={<AdminDashboard />} />
          <Route path='profile'      element={<AdminProfile />} />
          <Route path='companies'    element={<AdminCompanies />} />
          <Route path='colleges'     element={<AdminCollege />} />
          <Route path='colleges/:id' element={<CollegeDetail />} />
          <Route path='students'     element={<AdminStudent />} />
          <Route path='mentors'      element={<AdminMentors />} />
          <Route path='assesments'   element={<AdminAssesment />} />
          <Route path='training'     element={<AdminTraining />} />
          <Route path='drives'       element={<AdminDrives />} />
          <Route path='notification' element={<AdminNotifications />} />
          <Route path='disputes'     element={<AdminDisputes />} />
        </Route>

        {/* ── Student ───────────────────────────────────────────────── */}
        <Route path='/student/*' element={<StudentRoutes />} />

        {/* Public certificate verification */}
        <Route path='/verify/:code' element={<VerificationPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;