import { Navigate, Route } from "react-router-dom";

import CollegeLayout from "../layouts/CollegeLayout";

import DashboardPage from "../dashboard/pages/DashboardPage";
import CollegeProfilePage from "../profile/pages/CollegeProfilePage";
import OrganizationProfile from "../profile/pages/AddCollegeProfile";
import StudentDatabasePage from "../students/pages/StudentDatabasePage";

import StudentNominationPage from "../student-nomination/pages/StudentNominationPage";

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


      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="student" element={<StudentDatabasePage />} />
      <Route path="profile" element={<CollegeProfilePage />} />
      <Route path="update-profile" element={<OrganizationProfile />} />
      
  

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