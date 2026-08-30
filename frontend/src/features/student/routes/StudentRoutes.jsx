import React from "react";
import { Navigate, Route } from "react-router-dom";
import PrivateRoute from "../../../routes/PrivateRoute";
import DashboardPage from "../dashboard/pages/DashboardPage";

import VerificationPage from "../pages/public/VerificationPage";
import LoginPage from "../../auth/LoginPage";
import RegisterPage from "../../auth/RegisterPage";

import OnboardingWizard from "../pages/onboarding/OnboardingWizard";
import ProfilePage from "../pages/profile/ProfilePage";
import CoursesPage from "../pages/training/CoursesPage";
import CourseDetailPage from "../pages/training/CourseDetailPage";
import LiveSessionsPage from "../live-sessions/pages/LiveSessionsPage";
import AssignmentsPage from "../pages/assignments/AssignmentsPage";
import AssignmentDetail from "../pages/assignments/AssignmentDetail";

// Feature-level Assessments module imports
import AssessmentsPage from "../assessments/pages/AssessmentsPage";
import AssessmentDetailsPage from "../assessments/pages/AssessmentDetailsPage";
import AssessmentAttemptPage from "../assessments/pages/AssessmentAttemptPage";
import AssessmentResultPage from "../assessments/pages/AssessmentResultPage";

// Coding Challenges module imports
import CodingChallengePage from "../pages/coding/CodingChallengePage";
import CodingChallengesPage from "../coding-challenges/pages/CodingChallengesPage";
import ChallengeDetailsPage from "../coding-challenges/pages/ChallengeDetailsPage";
import SubmissionHistoryPage from "../coding-challenges/pages/SubmissionHistoryPage";
import LeaderboardPage from "../coding-challenges/pages/LeaderboardPage";

// Projects module imports
import ProjectsPage from "../pages/projects/ProjectsPage";
import ProjectDetailPage from "../pages/projects/ProjectDetailPage";
import ProjectWorkspacePage from "../projects/pages/ProjectWorkspacePage";
import ProjectEvaluationPage from "../projects/pages/ProjectEvaluationPage";

// Certificates module imports (from Ayush's official feature module)
import CertificatesPage from "../certificates/pages/CertificatesPage";
import CertificateDetailsPage from "../certificates/pages/CertificateDetailsPage";
import CertificatePreviewPage from "../certificates/pages/CertificatePreviewPage";
import CertificateVerificationPage from "../certificates/pages/CertificateVerificationPage";

// Performance, Interviews & Settings
import PerformancePage from "../pages/performance/PerformancePage";
import InterviewsPage from "../pages/interviews/InterviewsPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";
import NotificationPreferences from "../pages/settings/NotificationPreferences";

const studentRoute = (
  <>
    {/* Public Routes */}
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
    <Route path="verify/:code" element={<VerificationPage />} />

    {/* Protected Student Routes */}
    <Route element={<PrivateRoute />}>
      <Route path="student">
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="onboarding" element={<OnboardingWizard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:courseId" element={<CourseDetailPage />} />
        <Route path="sessions" element={<LiveSessionsPage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="assignments/:id" element={<AssignmentDetail />} />

        {/* Assessments (Fixed: uses :assessmentId matching useParams) */}
        <Route path="assessments" element={<AssessmentsPage />} />
        <Route path="assessments/:assessmentId" element={<AssessmentDetailsPage />} />
        <Route path="assessments/:assessmentId/attempt" element={<AssessmentAttemptPage />} />
        <Route path="assessments/:assessmentId/result" element={<AssessmentResultPage />} />
        <Route path="quizzes" element={<Navigate to="/student/assessments" replace />} />

        {/* Coding Challenges */}
        <Route path="coding-challenges" element={<CodingChallengesPage />} />
        <Route path="coding" element={<Navigate to="/student/coding-challenges" replace />} />
        <Route path="coding-challenges/:challengeId" element={<ChallengeDetailsPage />} />
        <Route path="coding-challenges/:challengeId/submissions" element={<SubmissionHistoryPage />} />
        <Route path="coding-challenges/:challengeId/leaderboard" element={<LeaderboardPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="coding/:challengeId" element={<CodingChallengePage />} />

        {/* Projects */}
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="projects/:projectId/workspace" element={<ProjectWorkspacePage />} />
        <Route path="projects/:projectId/evaluation" element={<ProjectEvaluationPage />} />

        {/* Certificates */}
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="certificates/:id" element={<CertificateDetailsPage />} />
        <Route path="certificates/:id/preview" element={<CertificatePreviewPage />} />
        <Route path="certificates/verify" element={<CertificateVerificationPage />} />

        {/* Account & Career */}
        <Route path="performance" element={<PerformancePage />} />
        <Route path="interviews" element={<InterviewsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings/notifications" element={<NotificationPreferences />} />
      </Route>
    </Route>
  </>
);

export default studentRoute;