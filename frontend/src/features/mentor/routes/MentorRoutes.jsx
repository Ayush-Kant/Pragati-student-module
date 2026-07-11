import { Route, Navigate } from "react-router-dom";
import PrivateRoute from "../../../routes/PrivateRoute";
import RoleRoute from "../../../routes/RoleRoute";
import MentorLayout from "../components/layout/MentorLayout";
import Dashboard from "../pages/Dashboard";

const mentorRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={['mentor']} />}>
      <Route path="mentor" element={<MentorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Route>
  </Route>
);

export default mentorRoute;