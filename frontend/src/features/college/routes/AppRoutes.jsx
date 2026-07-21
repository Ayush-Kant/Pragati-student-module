import { Navigate, Route } from "react-router-dom";
import PrivateRoute from "../../../routes/PrivateRoute";
import RoleRoute from "../../../routes/RoleRoute";
import CollegeLayout from "../layouts/CollegeLayout";

import DashboardPage from "../dashboard/pages/DashboardPage";
import CollegeProfilePage from "../profile/pages/CollegeProfilePage";
import OrganizationProfile from "../profile/pages/AddCollegeProfile";
import StudentDatabasePage from "../students/pages/StudentDatabasePage";
import CompanyJobPostingsPage from "../company-job-postings/pages/CompanyJobPostingsPage";
import PlacementDrivesPage from "../placement-drives/pages/PlacementDrivesPage";

const collegeRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={['college']} />}>
      <Route path="college" element={<CollegeLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="add-profile" element={<OrganizationProfile />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="student" element={<StudentDatabasePage />} />
        <Route path="profile" element={<CollegeProfilePage />} />
        <Route path="update-profile" element={<OrganizationProfile />} />
        <Route path="company-job-postings" element={<CompanyJobPostingsPage />} />
        <Route path="companies" element={<CompanyJobPostingsPage />} />
        <Route path="drives" element={<PlacementDrivesPage />} />
        {/* Render a blank page with sidebar/footer if page is not created yet */}
        <Route path="*" element={<div className="min-h-[400px]" />} />
      </Route>
    </Route>
  </Route>
);

export default collegeRoute;