import { Navigate, Route } from "react-router-dom";

import CollegeLayout from "../layouts/CollegeLayout";

import DashboardPage from "../dashboard/pages/DashboardPage";
import CollegeProfilePage from "../profile/pages/CollegeProfilePage";
import OrganizationProfile from "../profile/pages/AddCollegeProfile";
import StudentDatabasePage from "../students/pages/StudentDatabasePage";
import CompanyJobPostingsPage from "../company-job-postings/pages/CompanyJobPostingsPage";
import PlacementDrivesPage from "../placement-drives/pages/PlacementDrivesPage";

const collegeRoute = (
  <>
    {/* Public Route */}
    <Route
      path="add-profile"
      element={<OrganizationProfile />}
    />

    {/* College Layout */}
    <Route
      path="college"
      element={<CollegeLayout />}
    >
      <Route
        index
        element={<Navigate to="dashboard" replace />}
      />

      {/* Dashboard */}
      <Route
        path="dashboard"
        element={<DashboardPage />}
      />

      {/* Profile */}
      <Route
        path="profile"
        element={<CollegeProfilePage />}
      />

      <Route
        path="update-profile"
        element={<OrganizationProfile />}
      />

      {/* Students */}
      <Route
        path="student"
        element={<StudentDatabasePage />}
      />

      {/* Companies */}
      <Route
        path="companies"
        element={<CompanyJobPostingsPage />}
      />

      {/* Placement Drives */}
      <Route
        path="drives"
        element={<PlacementDrivesPage />}
      />
    </Route>
  </>
);

export default collegeRoute;