import { Route, Navigate } from "react-router-dom";
import PrivateRoute from "../../../routes/PrivateRoute";
import RoleRoute from "../../../routes/RoleRoute";
import MentorLayout from "../components/layout/MentorLayout";
import Dashboard from "../pages/Dashboard";
import ExportReport from "../pages/ExportReport";
import { ActivityProvider } from "../context/ActivityContext";
import Activities from "../pages/Activities";
import CreateActivity from "../pages/CreateActivity";
import ProjectCreationPage from "../pages/ProjectCreationPage";

const mentorRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={["mentor"]} />}>
      <Route path="mentor" element={<MentorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="export-report" element={<ExportReport />} />
        <Route path="projects/create" element={<ProjectCreationPage />} />
        <Route element={<ActivityProvider />}>
          <Route path="activities" element={<Activities />} />
          <Route path="activities/create" element={<CreateActivity />} />
        </Route>
      </Route>
    </Route>
  </Route>
);

export default mentorRoute;
