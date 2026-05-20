// StudentRoutes.jsx
// Purpose: Defines all student-facing routes; imported into App.jsx to mount the student module

import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/routing/PrivateRoute';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import OnboardingWizard from '../pages/onboarding/OnboardingWizard';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProfilePage from '../pages/profile/ProfilePage';
import CoursesPage from '../pages/training/CoursesPage';
import CourseDetailPage from '../pages/training/CourseDetailPage';
import SessionsPage from '../pages/sessions/SessionsPage';
import AssignmentsPage from '../pages/assignments/AssignmentsPage';
import AssignmentDetail from '../pages/assignments/AssignmentDetail';
import QuizzesPage from '../pages/quizzes/QuizzesPage';
import CodingChallengePage from '../pages/coding/CodingChallengePage';
import ProjectsPage from '../pages/projects/ProjectsPage';
import ProjectDetailPage from '../pages/projects/ProjectDetailPage';
import PerformancePage from '../pages/performance/PerformancePage';
import InterviewsPage from '../pages/interviews/InterviewsPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import NotificationPreferences from '../pages/settings/NotificationPreferences';
import CertificatesPage from '../pages/public/CertificatesPage';
import VerificationPage from '../pages/public/VerificationPage';

const StudentRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/student/login" element={<LoginPage />} />
      <Route path="/student/register" element={<RegisterPage />} />
      <Route path="/verify/:code" element={<VerificationPage />} />

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/student/onboarding" element={<OnboardingWizard />} />
        <Route path="/student/dashboard" element={<DashboardPage />} />
        <Route path="/student/profile" element={<ProfilePage />} />
        <Route path="/student/courses" element={<CoursesPage />} />
        <Route path="/student/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/student/sessions" element={<SessionsPage />} />
        <Route path="/student/assignments" element={<AssignmentsPage />} />
        <Route path="/student/assignments/:id" element={<AssignmentDetail />} />
        <Route path="/student/quizzes" element={<QuizzesPage />} />
        <Route path="/student/coding/:challengeId" element={<CodingChallengePage />} />
        <Route path="/student/projects" element={<ProjectsPage />} />
        <Route path="/student/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/student/performance" element={<PerformancePage />} />
        <Route path="/student/interviews" element={<InterviewsPage />} />
        <Route path="/student/notifications" element={<NotificationsPage />} />
        <Route path="/student/settings/notifications" element={<NotificationPreferences />} />
        <Route path="/student/certificates" element={<CertificatesPage />} />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
