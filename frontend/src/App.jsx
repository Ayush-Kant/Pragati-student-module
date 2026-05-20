// import './App.css'
import { Toaster } from "react-hot-toast";
import { Routes, Route } from 'react-router-dom';
import Dashboard from './features/mentor/pages/Dashboard';

import AdminProfile       from './features/admin/pages/AdminProfile'
import AdminLayout        from './features/admin/adminLayout'
import AdminDashboard     from './features/admin/adminDashboard/AdminDashboard'
import AdminAssesment     from './features/admin/adminAssesments/AdminAssesment'
import AdminCollege       from './features/admin/adminColleges/AdminCollege'
import AdminCompanies     from './features/admin/adminCompanies/AdminCompanies'
import AdminMentors       from './features/admin/adminMentors/AdminMentors'
import AdminStudent       from './features/admin/adminStudents/AdminStudent'
import AdminDrives        from './features/admin/adminDrives/AdminDrives'
import AdminTraining      from './features/admin/adminTraining/AdminTraining'
import AdminDisputes      from './features/admin/adminDisputes/AdminDisputes'
import AdminNotifications from './features/admin/adminNotifications/AdminNotifications'

// ── Student Module ───────────────────────────────────────────────────────────
import { AuthProvider, StudentRoutes } from './features/student';
import VerificationPage from './features/student/pages/public/VerificationPage';

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Routes>

        {/* ── Mentor ────────────────────────────────────────────────── */}
        <Route path='/mentor/dashboard' element={<Dashboard />} />

        {/* ── Admin ─────────────────────────────────────────────────── */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index          element={<AdminDashboard />} />
          <Route path='profile'      element={<AdminProfile />} />
          <Route path='companies'    element={<AdminCompanies />} />
          <Route path='colleges'     element={<AdminCollege />} />
          <Route path='students'     element={<AdminStudent />} />
          <Route path='mentors'      element={<AdminMentors />} />
          <Route path='assesments'   element={<AdminAssesment />} />
          <Route path='training'     element={<AdminTraining />} />
          <Route path='drives'       element={<AdminDrives />} />
          <Route path='notification' element={<AdminNotifications />} />
          <Route path='disputes'     element={<AdminDisputes />} />
        </Route>

        {/* ── Student ───────────────────────────────────────────────── */}
        {/* StudentRoutes uses relative paths internally (login, dashboard, etc.)  */}
        {/* The wildcard /* here lets React Router pass the remaining path to it   */}
        <Route path='/student/*' element={<StudentRoutes />} />

        {/* Public certificate verification — outside /student/ namespace */}
        <Route path='/verify/:code' element={<VerificationPage />} />

      </Routes>
    </AuthProvider>
  );
}

export default App;
