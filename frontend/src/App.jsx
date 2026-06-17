import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from 'react-router-dom';

// ── College Module ────────────────────────────────────────────────────────
import { CollegeLayout } from './features/college/layouts/CollegeLayout';
import DashboardPage from './features/college/dashboard/pages/DashboardPage';
import CollegeProfilePage from './features/college/profile/pages/CollegeProfilePage';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Default → college dashboard */}
        <Route path="/" element={<Navigate to="/college/dashboard" replace />} />

        {/* College routes — no auth required */}
        <Route path="college" element={<CollegeLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile"   element={<CollegeProfilePage />} />
        </Route>

        {/* Catch-all → college dashboard */}
        <Route path="*" element={<Navigate to="/college/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
