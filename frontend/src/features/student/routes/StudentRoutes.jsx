import { Navigate, Route } from 'react-router-dom';
import PrivateRoute from '../../../routes/PrivateRoute';
import RoleRoute from '../../../routes/RoleRoute';

import VerificationPage from '../pages/public/VerificationPage';
import LoginPage from '../../auth/LoginPage';
import RegisterPage from '../../auth/RegisterPage';

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

const studentRoute = (
  <>
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
    <Route path="verify/:code" element={<VerificationPage />} />

    <Route element={<PrivateRoute />}>
      <Route element={<RoleRoute allowedRoles={['student']} />}>
        <Route path="student">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="onboarding" element={<OnboardingWizard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:courseId" element={<CourseDetailPage />} />
          <Route path="sessions" element={<SessionsPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="assignments/:id" element={<AssignmentDetail />} />
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="coding/:challengeId" element={<CodingChallengePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="performance" element={<PerformancePage />} />
          <Route path="interviews" element={<InterviewsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings/notifications" element={<NotificationPreferences />} />
          <Route path="certificates" element={<CertificatesPage />} />
        </Route>
      </Route>
    </Route>
  </>
);

export default studentRoute;
