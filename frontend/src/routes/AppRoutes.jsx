import { Routes, Route } from "react-router-dom";

import MainLayout from "../layout/MainLayout";

import Dashboard from "../pages/Dashboard";
import Drives from "../pages/Drives";
import Candidates from "../pages/Candidates";
import Assessments from "../pages/Assessments";
import Interviews from "../pages/Interviews";
import Training from "../pages/Training";
import Messages from "../pages/Messages";
import Offers from "../pages/Offers";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/drives" element={<Drives />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/training" element={<Training />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;