import { Navigate, Route } from "react-router-dom";
import PrivateRoute from "../../../routes/PrivateRoute";
import RoleRoute from "../../../routes/RoleRoute";
import CompanyLayout from "../layouts/CompanyLayout";
import CompanyDashboard from "../pages/CompanyDashboard";
import { RecruitmentDrives } from "../drives/pages/RecruitmentDrives";
import CandidateManagement from "../candidates/pages/CandidateManagement";
import Assessments from "../assessments/Assessments";
import InterviewPage from "../pages/InterviewPage";
import { TrainingManagement } from "../training/pages/TrainingManagement";
import Offers from "../offers/Offers";
import CompanySettings from "../pages/CompanySettings";
import CompanyMessages from "../pages/CompanyMessages";
import Reports from "../pages/Reports";

const CompanyRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={["company"]} />}>
      <Route path="company" element={<CompanyLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="drives" element={<RecruitmentDrives />} />
        <Route path="candidates" element={<CandidateManagement />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="interviews" element={<InterviewPage />} />
        <Route path="training" element={<TrainingManagement />} />
        <Route path="messages" element={<CompanyMessages />} />
        <Route path="offers" element={<Offers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<CompanySettings />} />
        <Route path="add" element={<CompanyDashboard />} />
      </Route>
    </Route>
  </Route>
);

export default CompanyRoute;
