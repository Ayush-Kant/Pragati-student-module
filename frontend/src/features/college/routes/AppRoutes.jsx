import { Navigate, Route } from 'react-router-dom';
import { CollegeLayout } from '../layouts/CollegeLayout';
import CollegeProfilePage from '../profile/pages/CollegeProfilePage';
import DashboardPage from '../dashboard/pages/DashboardPage';

const collegeRoute = (
  <Route path="college" element={<CollegeLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="profile" element={<CollegeProfilePage />} />
  </Route>
);

export default collegeRoute;
