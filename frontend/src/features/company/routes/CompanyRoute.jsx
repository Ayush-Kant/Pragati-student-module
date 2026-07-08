import { Navigate, Route } from "react-router-dom";
import CompanyLayout from "../layouts/CompanyLayout";
import CompanyDashboard from "../pages/CompanyDashboard";
import { RecruitmentDrives as Drives } from "../drives/pages/RecruitmentDrives";
import Candidates from "../candidates/pages/CandidateManagement";
import Assessments from "../assessments/Assessments";
import Interviews from "../pages/InterviewPage";
import { TrainingManagement as Training } from "../training/pages/TrainingManagement";
import Messages from "../../college/pages/PlaceholderPage";
import Offers from "../offers/Offers";
import Reports from "../../college/pages/PlaceholderPage";
import CompanySettings from "../pages/CompanySettings";

const CompanyRoute = (
  <Route path="company" element={<CompanyLayout />}>
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


