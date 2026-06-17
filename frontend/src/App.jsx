import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from 'react-router-dom';

// ── College Module ─────────────────────────────────────────────────────────
import { CollegeLayout } from './features/college/layouts/CollegeLayout';
import DashboardPage     from './features/college/dashboard/pages/DashboardPage';
import CollegeProfilePage from './features/college/profile/pages/CollegeProfilePage';
import PlaceholderPage   from './features/college/pages/PlaceholderPage';

function App() {
  return (
    <>
      <Toaster />
      <Routes>

        {/* Default → college dashboard */}
        <Route path="/" element={<Navigate to="/college/dashboard" replace />} />

        {/* ── College (no auth) ─────────────────────────────────────── */}
        <Route path="college" element={<CollegeLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Implemented pages */}
          <Route path="dashboard"   element={<DashboardPage />} />
          <Route path="profile"     element={<CollegeProfilePage />} />

          {/* Sidebar nav pages — placeholder until implemented */}
          <Route path="students"    element={<PlaceholderPage />} />
          <Route path="placements"  element={<PlaceholderPage />} />
          <Route path="drives"      element={<PlaceholderPage />} />
          <Route path="assessments" element={<PlaceholderPage />} />
          <Route path="analytics"   element={<PlaceholderPage />} />
          <Route path="reports"     element={<PlaceholderPage />} />
          <Route path="faculty"     element={<PlaceholderPage />} />
          <Route path="companies"   element={<PlaceholderPage />} />
          <Route path="internships" element={<PlaceholderPage />} />
          <Route path="settings"    element={<PlaceholderPage />} />
          <Route path="help"        element={<PlaceholderPage />} />
        </Route>

        {/* Catch-all → college dashboard */}
        <Route path="*" element={<Navigate to="/college/dashboard" replace />} />

      </Routes>
    </>
  );
}

export default App;
