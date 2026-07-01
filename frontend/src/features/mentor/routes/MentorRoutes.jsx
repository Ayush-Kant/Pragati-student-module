import { Route, Navigate } from "react-router-dom";
import PrivateRoute from "../../../routes/PrivateRoute";
import RoleRoute from "../../../routes/RoleRoute";
import MentorLayout from "../components/layout/MentorLayout";
import Dashboard from "../pages/Dashboard";
import ExportReport from "../pages/ExportReport";
import { ActivityProvider } from "../context/ActivityContext";
import Activities from "../pages/Activities";
import CreateActivity from "../pages/CreateActivity";
import SubmissionMonitoringPage from "../pages/SubmissionMonitoringPage";
import ReviewGradingPage from "../pages/ReviewGradingPage";

const mentorRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={["mentor"]} />}>
      <Route path="mentor" element={<MentorLayout />}>
      <Route path="submission-monitoring" element={<SubmissionMonitoringPage />}/>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="export-report" element={<ExportReport />} />
        <Route path="submission-monitoring" element={<SubmissionMonitoringPage />}/>
        <Route path="review-grading" element={<ReviewGradingPage />}/>
        
        <Route element={<ActivityProvider />}>
          <Route path="activities" element={<Activities />} />
          <Route path="activities/create" element={<CreateActivity />} />
        </Route>
      </Route>
    </Route>
  </Route>
);

export default mentorRoute;
