import { Navigate, Route } from "react-router-dom";
import PrivateRoute from "../../../routes/PrivateRoute";
import RoleRoute from "../../../routes/RoleRoute";
import { CollegeLayout } from "../layouts/CollegeLayout";
import Dashboard from "../pages/Dashboard";
import CollegeProfilePage from "../profile/pages/CollegeProfilePage"; // Added Profile Page

const collegeRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={['college']} />}>
      <Route path="college" element={<CollegeLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<CollegeProfilePage />} />
      </Route>
    </Route>
  </Route>
);

export default collegeRoute;