import { Navigate, Route } from "react-router-dom";
import PrivateRoute from "../../../routes/PrivateRoute";
import RoleRoute from "../../../routes/RoleRoute";
import CollegeLayout from "../layouts/CollegeLayout";

import DashboardPage from "../dashboard/pages/DashboardPage";
import CollegeProfilePage from "../profile/pages/CollegeProfilePage";
import OrganizationProfile from "../profile/pages/AddCollegeProfile";
import StudentDatabasePage from "../students/pages/StudentDatabasePage";
import ReportsPage from "../reports/pages/ReportsPage";
import StudentNominationPage from "../student-nomination/pages/StudentNominationPage";
import CompanyJobPostingsPage from "../company-job-postings/pages/CompanyJobPostingsPage";
import StudentProfilePage from "../student-profile/pages/StudentProfilePage";
import DepartmentsPage from "../departments/pages/DepartmentsPage";
import PlacementDrivesPage from "../placement-drives/pages/PlacementDrivesPage";
import ReportsPage from "../reports/pages/ReportsPage";
import StudentNominationPage from "../student-nomination/pages/StudentNominationPage";
import AnalyticsDashboardPage from "../analytics/pages/AnalyticsDashboardPage";

const collegeRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={["college"]} />}>
      <Route path="college" element={<CollegeLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Profile */}
        <Route path="add-profile" element={<OrganizationProfile />} />
        <Route path="profile" element={<CollegeProfilePage />} />
        <Route path="update-profile" element={<OrganizationProfile />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Departments */}
        <Route path="departments" element={<DepartmentsPage />} />

        {/* Students */}
        <Route path="student" element={<StudentDatabasePage />} />
        <Route path="student-profile" element={<StudentProfilePage />} />
        <Route path="student-profile/:id" element={<StudentProfilePage />} />
        <Route path="student-performance" element={<StudentProfilePage />} />

        {/* Student Nomination */}
        <Route
          path="student-nomination"
          element={<StudentNominationPage />}
        />

        {/* Companies */}
        <Route
          path="company-job-postings"
          element={<CompanyJobPostingsPage />}
        />
        <Route
          path="companies"
          element={<CompanyJobPostingsPage />}
        />

        {/* Placement Drives */}
        <Route
          path="drives"
          element={<PlacementDrivesPage />}
        />

        {/* Reports */}
        <Route path="reports" element={<ReportsPage />} />
        <Route path="analytics" element={<AnalyticsDashboardPage />} />


        {/* Fallback */}

        {/* Render a blank page with sidebar/footer if page is not created yet */}

        <Route path="*" element={<div className="min-h-[400px]" />} />
      </Route>
    </Route>
  </Route>
);

export default collegeRoute;