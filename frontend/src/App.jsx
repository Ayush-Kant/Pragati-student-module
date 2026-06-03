import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from 'react-router-dom';

// ── Auth Pages  ──
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";


// ── Student Module ───────────────────────────────────────────────────────────
import { AuthProvider} from './context/AuthContext';
import PrivateRoute from "./routes/PrivateRoute";
import VerificationPage from './features/student/pages/public/VerificationPage';
import StudentRoutes from "./features/student/routes/StudentRoutes";
import AdminRoute from "./features/admin/routes/AdminRoutes";
// import mentorRoute from "./features/mentor/routes/MentorRoutes";
import MentorLayout from "./features/mentor/MentorLayout";
import Activities from "./features/mentor/pages/Activities";
import CreateActivity from "./features/mentor/pages/CreateActivity";
import ActivityTemplates from "./features/mentor/pages/ActivityTemplates";
import ManageDeadlines from "./features/mentor/pages/ManageDeadlines";
import BulkAssignActivity from "./features/mentor/pages/BulkAssignActivity";
import ActivityCalendar from "./features/mentor/pages/ActivityCalendar";
import collegeRoute from "./features/college/routes/AppRoutes";
import NotFoundPage from "./routes/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Routes>
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* ── Auth Routes ────────────────────────────────────────── */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* ── Mentor (protected) ─────────────────────────────────────────── */}
        <Route element={<PrivateRoute />}>
          <Route path="/mentor" element={<MentorLayout />}>
            <Route index element={<Activities />} />
            <Route path="activities" element={<Activities />} />
            <Route path="activities/create" element={<CreateActivity />} />
            <Route path="activities/templates" element={<ActivityTemplates />} />
            <Route path="activities/deadlines" element={<ManageDeadlines />} />
            <Route path="activities/bulk-assign" element={<BulkAssignActivity />} />
            <Route path="activities/calendar" element={<ActivityCalendar />} />
            {/* Add other mentor routes here as needed */}
          </Route>
        </Route>

        {/* ── Admin ─────────────────────────────────────────────────── */}
       
        {AdminRoute}

        {/* ── Student ───────────────────────────────────────────────── */}
        {StudentRoutes}

      {/* Collge */}

      {collegeRoute}
  
        {/* Public certificate verification */}
        <Route path='/verify/:code' element={<VerificationPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;