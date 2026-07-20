import { Route } from "react-router-dom";
import AdminLayout from "../adminLayout";
import AdminDashboard from "../adminDashboard/AdminDashboard";
import AdminCompanies from "../adminCompanies/AdminCompanies";
import AdminCollege from "../adminColleges/AdminCollege";
import StudentDetail from "../pages/StudentDetail";
import CollegeDetail from "../pages/CollegeDetail";
import AdminStudent from "../adminStudents/AdminStudent";
import AdminMentors from "../adminMentors/AdminMentors";
import AdminTraining from "../adminTraining/AdminTraining";
import AdminDrives from "../adminDrives/AdminDrives";
import DriveDetail from "../pages/DriveDetail";
import AdminNotifications from "../adminNotifications/AdminNotifications";
import AdminDisputes from "../adminDisputes/AdminDisputes";
import AdminAssesment from "../adminAssesments/AdminAssesment";
import AdminProfile from "../pages/AdminProfile";
import PrivateRoute from "../../../routes/PrivateRoute";
import RoleRoute from "../../../routes/RoleRoute";
import CompanyDetail from "../pages/CompanyDetail";
import ActiveDrives from "../pages/ActiveDrives";
import CompanyRankings from "../pages/CompanyRankings";

const AdminRoute = (
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path='profile' element={<AdminProfile />} />
        <Route path='companies' element={<AdminCompanies />} />
        <Route path="companies/rankings" element={<CompanyRankings />} />
        <Route path="companies/:id" element={<CompanyDetail />} />
        <Route path="companies/active-drives" element={<ActiveDrives />} />
        <Route path='colleges' element={<AdminCollege />} />
        <Route path='colleges/:id' element={<CollegeDetail />} />
        <Route path='students' element={<AdminStudent />} />
        <Route path='students/:id' element={<StudentDetail />} />    
        <Route path='mentors' element={<AdminMentors />} />
        <Route path='assesments' element={<AdminAssesment />} />
        <Route path='training' element={<AdminTraining />} />
        <Route path='drives' element={<AdminDrives />} />
        <Route path='drives/:id' element={<DriveDetail />} />
        <Route path='notification' element={<AdminNotifications />} />
        <Route path='disputes' element={<AdminDisputes />} />
      </Route>
)

export default AdminRoute;
