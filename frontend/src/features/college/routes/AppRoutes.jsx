import { Navigate, Route } from "react-router-dom";
import PrivateRoute from "../../../routes/PrivateRoute";
import RoleRoute from "../../../routes/RoleRoute";
import { CollegeLayout } from "../layouts/CollegeLayout";
import Dashboard from "../pages/Dashboard";
import CollegeProfilePage from "../profile/pages/CollegeProfilePage"; // Added Profile Page
import Students from "../pages/Students";

const collegeRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={['college']} />}>
      <Route path="college" element={<CollegeLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<CollegeProfilePage />} />
        <Route path="students" element={<Students />} />
      </Route>
    </Route>
  </Route>
);

export default collegeRoute;