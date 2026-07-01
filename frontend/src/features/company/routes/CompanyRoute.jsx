import { Navigate, Route } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import CompanyDashboard from "../pages/CompanyDashboard";
import Drives from "../../../pages/Drives";
import Candidates from "../../../pages/Candidates";
import Assessments from "../assessments/Assessments";
import Interviews from "../../../pages/Interviews";
import Training from "../../../pages/Training";
import Messages from "../../../pages/Messages";
import Offers from "../offers/Offers";
import Reports from "../../../pages/Reports";
import CompanySettings from "../pages/CompanySettings";

const CompanyRoute = (
  <Route path="company" element={<MainLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<CompanyDashboard />} />
    <Route path="drives" element={<Drives />} />
    <Route path="candidates" element={<Candidates />} />
    <Route path="assessments" element={<Assessments />} />
    <Route path="interviews" element={<Interviews />} />
    <Route path="training" element={<Training />} />
    <Route path="messages" element={<Messages />} />
    <Route path="offers" element={<Offers />} />
    <Route path="reports" element={<Reports />} />
    <Route path="settings" element={<CompanySettings />} />
  </Route>
);

export default CompanyRoute;


