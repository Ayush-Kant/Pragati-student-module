import { Route, Navigate } from "react-router-dom";
import PrivateRoute from "../../../routes/PrivateRoute";
import RoleRoute from "../../../routes/RoleRoute";
import MentorLayout from "../components/layout/MentorLayout";
import Dashboard from "../pages/Dashboard";

// --- Profile & Onboarding Imports ---
import MentorProfile from "../pages/MentorProfile";
import BasicInfo from "../pages/BasicInfo";
import ProfessionalProfile from "../pages/ProfessionalProfile";
import ExperienceLinks from "../pages/ExperienceLinks";
import Availability from "../pages/Availability";

// --- Course & Feature Imports ---
import Courses from "../../../pages/mentor/CoursesPage";
import CreateCourse from "../../../pages/mentor/CreateCoursePage";
import ExportReport from "../pages/ExportReport";
import { ActivityProvider } from "../context/ActivityContext";
import Activities from "../pages/Activities";
import CreateActivity from "../pages/CreateActivity";
import ProjectCreationPage from "../pages/ProjectCreationPage";
import QuestionBankPage from "../pages/QuestionBankPage";
import CreateQuestionPage from "../pages/CreateQuestionPage";
import EditQuestionPage from "../pages/EditQuestionPage";
import QuestionPreviewPage from "../pages/QuestionPreviewPage";
import QuestionBankPageQuizBuilder from "../pages/QuizBuilderPage";
import AttemptHistoryPage from "../pages/AttemptHistoryPage";
import ChallengeCreatorPage from "../pages/mentor/ChallengeCreatorPage";
import ChallengeWorkspacePage from "../pages/student/ChallengeWorkspacePage.jsx";
import SubmissionMonitoringPage from "../pages/SubmissionMonitoringPage";
import ReviewGradingPage from "../pages/ReviewGradingPage";
import AnalyticsDashboardPage from "../pages/AnalyticsDashboardPage";

import NotificationsPage from "../pages/NotificationsPage";
import DiscussionForumPage from "../pages/DiscussionForumPage";
import SlotsCalendarPage from "../pages/SlotsCalendarPage";

const mentorRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={["mentor"]} />}>
      {/* All mentor pages share MentorLayout (sidebar + topnav) */}
      <Route path="mentor" element={<MentorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<MentorProfile />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/create" element={<CreateCourse />} />
        <Route path="export-report" element={<ExportReport />} />
        <Route path="projects/create" element={<ProjectCreationPage />} />
        <Route path="challenge-creator" element={<ChallengeCreatorPage />} />
        <Route
          path="challenge-workspace"
          element={<ChallengeWorkspacePage />}
        />
        <Route
          path="submission-monitoring"
          element={<SubmissionMonitoringPage />}
        />
        <Route path="review-grading" element={<ReviewGradingPage />} />
        <Route path="project-analytics" element={<AnalyticsDashboardPage />} />

        <Route element={<ActivityProvider />}>
          <Route path="activities" element={<Activities />} />
          <Route path="activities/create" element={<CreateActivity />} />
        </Route>

        <Route path="question-bank" element={<QuestionBankPage />} />
        <Route path="question-bank/create" element={<CreateQuestionPage />} />
        <Route path="question-bank/edit/:id" element={<EditQuestionPage />} />
        <Route
          path="question-bank/preview/:id"
          element={<QuestionPreviewPage />}
        />
        <Route
          path="question-bank/quiz-builder"
          element={<QuestionBankPageQuizBuilder />}
        />
        <Route path="question-bank/attempts" element={<AttemptHistoryPage />} />

        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="discussion-forum" element={<DiscussionForumPage />} />
        <Route path="slots" element={<SlotsCalendarPage />} />
      </Route>

      {/* Onboarding pages use their own OnboardingLayout — no MentorLayout */}
      <Route path="mentor/onboarding/basic-info" element={<BasicInfo />} />
      <Route
        path="mentor/onboarding/professional-profile"
        element={<ProfessionalProfile />}
      />
      <Route
        path="mentor/onboarding/experience-links"
        element={<ExperienceLinks />}
      />
      <Route path="mentor/onboarding/availability" element={<Availability />} />
    </Route>
  </Route>
);

export default mentorRoute;
