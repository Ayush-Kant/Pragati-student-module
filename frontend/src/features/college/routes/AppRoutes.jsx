import { Navigate, Route } from 'react-router-dom';
import PrivateRoute from '../../../routes/PrivateRoute';
import RoleRoute from '../../../routes/RoleRoute';
import { CollegeLayout } from '../layouts/CollegeLayout';
import CollegeProfilePage from '../profile/pages/CollegeProfilePage';
import DashboardPage from '../dashboard/pages/DashboardPage';

const collegeRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={['college']} />}>
      <Route path="college" element={<CollegeLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<CollegeProfilePage />} />
      </Route>
    </Route>
  </Route>
);

export default collegeRoute;
