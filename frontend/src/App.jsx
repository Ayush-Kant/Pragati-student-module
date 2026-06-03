import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layouts
import MainLayout from './layout/MainLayout'
import AdminLayout from './features/admin/adminLayout'

// Company pages
import CompanyDashboard from './features/company/pages/CompanyDashboard'
import CompanySettings from './features/company/pages/CompanySettings'
import Drives from './pages/Drives'
import Candidates from './pages/Candidates'
import Interviews from './pages/Interviews'
import Training from './pages/Training'
import Messages from './pages/Messages'
import Offers from './features/company/offers/Offers'
import Reports from './pages/Reports'
import Assessments from './features/company/assessments/Assessments'

// Admin pages
import AdminDashboard from './features/admin/adminDashboard/AdminDashboard'
import AdminProfile from './features/admin/adminProfile/AdminProfile'
import AdminAssesment from './features/admin/adminAssesments/AdminAssesment'
import AdminCollege from './features/admin/adminColleges/AdminCollege'
import AdminCompanies from './features/admin/adminCompanies/AdminCompanies'
import AdminMentors from './features/admin/adminMentors/AdminMentors'
import AdminStudent from './features/admin/adminStudents/AdminStudent'
import AdminDrives from './features/admin/adminDrives/AdminDrives'
import AdminTraining from './features/admin/adminTraining/AdminTraining'
import AdminDisputes from './features/admin/adminDisputes/AdminDisputes'
import AdminNotifications from './features/admin/adminNotifications/AdminNotifications'

function App() {
  return (
    <>
    <Routes>

      {/* ── COMPANY ROUTES (MainLayout: Navbar + Sidebar) ── */}
      <Route element={<MainLayout />}>
        <Route index element={<CompanyDashboard />} />
        <Route path='/drives'      element={<Drives />} />
        <Route path='/candidates'  element={<Candidates />} />
        <Route path='/assessments' element={<Assessments />} />
        <Route path='/interviews'  element={<Interviews />} />
        <Route path='/training'    element={<Training />} />
        <Route path='/messages'    element={<Messages />} />
        <Route path='/offers'      element={<Offers />} />
        <Route path='/reports'     element={<Reports />} />
        <Route path='/settings'    element={<CompanySettings />} />
      </Route>

      {/* ── ADMIN ROUTES (AdminLayout: AdminNavbar + AdminSidebar) ── */}
      <Route path='/admin' element={<AdminLayout />}>
        <Route index                  element={<AdminDashboard />} />
        <Route path='profile'         element={<AdminProfile />} />
        <Route path='companies'       element={<AdminCompanies />} />
        <Route path='colleges'        element={<AdminCollege />} />
        <Route path='students'        element={<AdminStudent />} />
        <Route path='mentors'         element={<AdminMentors />} />
        <Route path='assesments'      element={<AdminAssesment />} />
        <Route path='training'        element={<AdminTraining />} />
        <Route path='drives'          element={<AdminDrives />} />
        <Route path='messages'        element={<Messages />} />
        <Route path='notification'    element={<AdminNotifications />} />
        <Route path='disputes'        element={<AdminDisputes />} />
      </Route>

      {/* ── FALLBACK ── */}
      <Route path='*' element={<Navigate to='/' replace />} />

    </Routes>
    <Toaster position="top-right" />
    </>
  )
}

export default App
