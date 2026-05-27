import "./App.css";

import { Routes, Route } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";

import Header from "./components/Header";

import AdminLayout from "./features/admin/adminLayout";
import AdminDashboard from "./features/admin/adminDashboard/AdminDashboard";
import AdminProfile from "./features/admin/adminProfile/AdminProfile";
import AdminAssesment from "./features/admin/adminAssesments/AdminAssesment";
import AdminCollege from "./features/admin/adminColleges/AdminCollege";
import AdminCompanies from "./features/admin/adminCompanies/AdminCompanies";
import AdminMentors from "./features/admin/adminMentors/AdminMentors";
import AdminStudent from "./features/admin/adminStudents/AdminStudent";
import AdminDrives from "./features/admin/adminDrives/AdminDrives";
import AdminTraining from "./features/admin/adminTraining/AdminTraining";
import AdminDisputes from "./features/admin/adminDisputes/AdminDisputes";
import AdminNotifications from "./features/admin/adminNotifications/AdminNotifications";

function App() {
  return (
    <>
      <Header />

      <Routes>

        {/* COMPANY ROUTES */}
        <Route path="/*" element={<AppRoutes />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="colleges" element={<AdminCollege />} />
          <Route path="students" element={<AdminStudent />} />
          <Route path="mentors" element={<AdminMentors />} />
          <Route path="assesments" element={<AdminAssesment />} />
          <Route path="training" element={<AdminTraining />} />
          <Route path="drives" element={<AdminDrives />} />
          <Route path="notification" element={<AdminNotifications />} />
          <Route path="disputes" element={<AdminDisputes />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;