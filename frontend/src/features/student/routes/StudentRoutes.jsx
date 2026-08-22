import { Navigate, Route } from "react-router-dom";
import PrivateRoute from "../../../routes/PrivateRoute";

import VerificationPage from "../pages/public/VerificationPage";
import LoginPage from "../../auth/LoginPage";
import RegisterPage from "../../auth/RegisterPage";

import OnboardingWizard from "../pages/onboarding/OnboardingWizard";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProfilePage from "../pages/profile/ProfilePage";
import CoursesPage from "../pages/training/CoursesPage";
import CourseDetailPage from "../pages/training/CourseDetailPage";
import SessionsPage from "../pages/sessions/SessionsPage";
import AssignmentsPage from "../pages/assignments/AssignmentsPage";
import AssignmentDetail from "../pages/assignments/AssignmentDetail";
import QuizzesPage from "../pages/quizzes/QuizzesPage";
import CodingChallengePage from "../pages/coding/CodingChallengePage";
import CodingChallengesPage from "../coding-challenges/pages/CodingChallengesPage";
import ChallengeDetailsPage from "../coding-challenges/pages/ChallengeDetailsPage";
import SubmissionHistoryPage from "../coding-challenges/pages/SubmissionHistoryPage";
import LeaderboardPage from "../coding-challenges/pages/LeaderboardPage";
import ProjectsPage from "../pages/projects/ProjectsPage";
import ProjectDetailPage from "../pages/projects/ProjectDetailPage";
import ProjectWorkspacePage from "../projects/pages/ProjectWorkspacePage";
import ProjectEvaluationPage from "../projects/pages/ProjectEvaluationPage";
import PerformancePage from "../pages/performance/PerformancePage";
import InterviewsPage from "../pages/interviews/InterviewsPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";
import NotificationPreferences from "../pages/settings/NotificationPreferences";
import CertificatesPage from "../pages/public/CertificatesPage";


const studentRoute = (
  <>

    {/* Public Routes */}

    <Route path="login" element={<LoginPage />} />

    <Route path="register" element={<RegisterPage />} />

    <Route path="verify/:code" element={<VerificationPage />} />


    {/* Protected Student Routes */}

    <Route element={<PrivateRoute />}>

      <Route path="student">

        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />


        <Route
          path="dashboard"
          element={<DashboardPage />}
        />


        <Route
          path="onboarding"
          element={<OnboardingWizard />}
        />


        <Route
          path="profile"
          element={<ProfilePage />}
        />


        <Route
          path="courses"
          element={<CoursesPage />}
        />


        <Route
          path="courses/:courseId"
          element={<CourseDetailPage />}
        />


        <Route
          path="sessions"
          element={<SessionsPage />}
        />


        <Route
          path="assignments"
          element={<AssignmentsPage />}
        />


        <Route
          path="assignments/:id"
          element={<AssignmentDetail />}
        />


        <Route
          path="quizzes"
          element={<QuizzesPage />}
        />


        <Route
          path="coding-challenges"
          element={<CodingChallengesPage />}
        />


        {/* Challenge detail — canonical URL */}
        <Route
          path="coding-challenges/:challengeId"
          element={<ChallengeDetailsPage />}
        />


        <Route
          path="coding-challenges/:challengeId/submissions"
          element={<SubmissionHistoryPage />}
        />


        <Route
          path="coding-challenges/:challengeId/leaderboard"
          element={<LeaderboardPage />}
        />


        {/* Global leaderboard (no challenge scope) */}
        <Route
          path="leaderboard"
          element={<LeaderboardPage />}
        />


        {/* Legacy route kept for backwards-compatibility */}
        <Route
          path="coding/:challengeId"
          element={<CodingChallengePage />}
        />


        <Route
          path="projects"
          element={<ProjectsPage />}
        />


        <Route
          path="projects/:projectId"
          element={<ProjectDetailPage />}
        />


        <Route
          path="projects/:projectId/workspace"
          element={<ProjectWorkspacePage />}
        />


        <Route
          path="projects/:projectId/evaluation"
          element={<ProjectEvaluationPage />}
        />


        <Route
          path="performance"
          element={<PerformancePage />}
        />


        <Route
          path="interviews"
          element={<InterviewsPage />}
        />


        <Route
          path="notifications"
          element={<NotificationsPage />}
        />


        <Route
          path="settings/notifications"
          element={<NotificationPreferences />}
        />


        <Route
          path="certificates"
          element={<CertificatesPage />}
        />


      </Route>

    </Route>


  </>
);

export default studentRoute;
