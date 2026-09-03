import React from "react";
import { Navigate, Route } from "react-router-dom";
import PrivateRoute from "../../../routes/PrivateRoute";
import StudentLayout from "../layout/StudentLayout";
import DashboardPage from "../dashboard/pages/DashboardPage";
import SM03DashboardPage from "../dashboard/pages/SM03DashboardPage";
import VerificationPage from "../pages/public/VerificationPage";
import OnboardingWizard from "../pages/onboarding/OnboardingWizard";
import ProfilePage from "../pages/profile/ProfilePage";
import SM02ProfileWorkspace from "../pages/profile/SM02ProfileWorkspace";
import CoursesPage from "../pages/training/CoursesPage";
import CourseDetailPage from "../pages/training/CourseDetailPage";
import SM04LearningWorkspace from "../pages/training/SM04LearningWorkspace";
import SM04CourseWorkspace from "../pages/training/SM04CourseWorkspace";
import LiveSessionsPage from "../live-sessions/pages/LiveSessionsPage";
import SM05LiveSessionsWorkspace from "../live-sessions/pages/SM05LiveSessionsWorkspace";
import AssignmentsPage from "../pages/assignments/AssignmentsPage";
import AssignmentDetail from "../pages/assignments/AssignmentDetail";
import SM06AssignmentsWorkspace from "../pages/assignments/SM06AssignmentsWorkspace";
import SM06AssignmentDetail from "../pages/assignments/SM06AssignmentDetail";
import AssessmentsPage from "../assessments/pages/AssessmentsPage";
import AssessmentDetailsPage from "../assessments/pages/AssessmentDetailsPage";
import AssessmentAttemptPage from "../assessments/pages/AssessmentAttemptPage";
import AssessmentResultPage from "../assessments/pages/AssessmentResultPage";
import AssessmentReviewPage from "../assessments/pages/AssessmentReviewPage";
import CodingChallengePage from "../pages/coding/CodingChallengePage";
import CodingChallengesPage from "../coding-challenges/pages/CodingChallengesPage";
import ChallengeDetailsPage from "../coding-challenges/pages/ChallengeDetailsPage";
import SubmissionHistoryPage from "../coding-challenges/pages/SubmissionHistoryPage";
import LeaderboardPage from "../coding-challenges/pages/LeaderboardPage";
import ProjectsPage from "../pages/projects/ProjectsPage";
import ProjectDetailPage from "../pages/projects/ProjectDetailPage";
import ProjectWorkspacePage from "../projects/pages/ProjectWorkspacePage";
import ProjectEvaluationPage from "../projects/pages/ProjectEvaluationPage";
import CertificatesPage from "../certificates/pages/CertificatesPage";
import CertificateDetailsPage from "../certificates/pages/CertificateDetailsPage";
import CertificatePreviewPage from "../certificates/pages/CertificatePreviewPage";
import CertificateVerificationPage from "../certificates/pages/CertificateVerificationPage";
import PerformancePage from "../pages/performance/PerformancePage";
import InterviewsPage from "../pages/interviews/InterviewsPage";
import PlacementDashboardPage from "../placement/pages/PlacementDashboardPage";
import NotificationsCenterPage from "../pages/notifications/NotificationsCenterPage";
import NotificationPreferences from "../pages/settings/NotificationPreferences";

const studentRoute = (
  <>
    <Route path="verify/:code" element={<VerificationPage />} />
    <Route element={<PrivateRoute />}>
      <Route path="student" element={<StudentLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SM03DashboardPage />} />
        <Route path="dashboard/legacy" element={<DashboardPage />} />
        <Route path="onboarding" element={<OnboardingWizard />} />
        <Route path="profile" element={<SM02ProfileWorkspace />} />
        <Route path="profile/legacy" element={<ProfilePage />} />
        <Route path="courses" element={<SM04LearningWorkspace />} />
        <Route path="courses/legacy" element={<CoursesPage />} />
        <Route path="courses/:courseId" element={<SM04CourseWorkspace />} />
        <Route path="courses-legacy/:courseId" element={<CourseDetailPage />} />
        <Route path="sessions" element={<SM05LiveSessionsWorkspace />} />
        <Route path="sessions/legacy" element={<LiveSessionsPage />} />
        <Route path="assignments" element={<SM06AssignmentsWorkspace />} />
        <Route path="assignments/:id" element={<SM06AssignmentDetail />} />
        <Route path="assignments-legacy" element={<AssignmentsPage />} />
        <Route path="assignments-legacy/:id" element={<AssignmentDetail />} />
        <Route path="assessments" element={<AssessmentsPage />} />
        <Route path="assessments/:assessmentId/review" element={<AssessmentReviewPage />} />
        <Route path="assessments/:assessmentId" element={<AssessmentDetailsPage />} />
        <Route path="assessments/:assessmentId/attempt" element={<AssessmentAttemptPage />} />
        <Route path="assessments/:assessmentId/result" element={<AssessmentResultPage />} />
        <Route path="quizzes" element={<Navigate to="/student/assessments" replace />} />
        <Route path="coding-challenges" element={<CodingChallengesPage />} />
        <Route path="coding" element={<Navigate to="/student/coding-challenges" replace />} />
        <Route path="coding-challenges/:challengeId" element={<ChallengeDetailsPage />} />
        <Route path="coding-challenges/:challengeId/submissions" element={<SubmissionHistoryPage />} />
        <Route path="coding-challenges/:challengeId/leaderboard" element={<LeaderboardPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="coding/:challengeId" element={<CodingChallengePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="projects/:projectId/workspace" element={<ProjectWorkspacePage />} />
        <Route path="projects/:projectId/evaluation" element={<ProjectEvaluationPage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="certificates/:certificateId" element={<CertificateDetailsPage />} />
        <Route path="certificates/:certificateId/preview" element={<CertificatePreviewPage />} />
        <Route path="certificates/verify" element={<CertificateVerificationPage />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="interviews" element={<InterviewsPage />} />
        <Route path="placement" element={<PlacementDashboardPage />} />
        <Route path="notifications" element={<NotificationsCenterPage />} />
        <Route path="settings/notifications" element={<NotificationPreferences />} />
      </Route>
    </Route>
  </>
);

export default studentRoute;
