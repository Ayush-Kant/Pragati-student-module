import { Navigate, Route } from 'react-router-dom';
import { CollegeLayout } from '../layouts/CollegeLayout';
import CollegeProfilePage from '../profile/pages/CollegeProfilePage';
import DashboardPage from '../dashboard/pages/DashboardPage';
import OrganizationProfile from '../profile/pages/AddCollegeProfile';

const collegeRoute = (
  <>
  <Route path="add-profile" element={<OrganizationProfile />} />
  <Route path="college" element={<CollegeLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="profile" element={<CollegeProfilePage />} />
    <Route path="update-profile" element={<OrganizationProfile />} />
  </Route>
  </>
);

export default collegeRoute;
