import { Routes, Route } from "react-router-dom";

import MainLayout from "../layout/MainLayout";

import CompanyDashboard from "../features/company/pages/CompanyDashboard";

/* Existing Pages */
import Drives from "../pages/Drives";
import Candidates from "../pages/Candidates";
import Interviews from "../pages/Interviews";
import Training from "../pages/Training";
import Messages from "../pages/Messages";
import Offers from "../features/company/offers/Offers";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

/* New Assessments Feature */
import Assessments from "../features/company/assessments/Assessments";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        {/* Dashboard */}
        <Route
          path="/"
          element={<CompanyDashboard />}
        />

        {/* Sidebar Pages */}
        <Route
          path="/drives"
          element={<Drives />}
        />

        <Route
          path="/candidates"
          element={<Candidates />}
        />

        <Route
          path="/assessments"
          element={<Assessments />}
        />

        <Route
          path="/interviews"
          element={<Interviews />}
        />

        <Route
          path="/training"
          element={<Training />}
        />

        <Route
          path="/messages"
          element={<Messages />}
        />

        <Route
          path="/offers"
          element={<Offers />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Route>
    </Routes>
  );
};

export default AppRoutes;