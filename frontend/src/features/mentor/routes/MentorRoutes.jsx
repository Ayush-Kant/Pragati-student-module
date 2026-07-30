import { Route, Navigate } from "react-router-dom";

// --- Layouts & Guards ---
import PrivateRoute from "../../../routes/PrivateRoute";
import RoleRoute from "../../../routes/RoleRoute";

import MentorLayout from "../components/layout/MentorLayout";

// --- Core Mentor Pages ---
import Dashboard from "../pages/Dashboard";
import SettingsPage from "../../../pages/mentor/SettingsPage";

// --- Onboarding Pages ---
import BasicInfo from "../pages/BasicInfo";
import ProfessionalProfile from "../pages/ProfessionalProfile";
import ExperienceLinks from "../pages/ExperienceLinks";
import Availability from "../pages/Availability";

// --- Existing Mentor Pages ---
import MenteeManagementPage from "../pages/MenteeManagementPage";
// --- Courses & Projects ---
import Courses from "../../../pages/mentor/CoursesPage";
import CreateCourse from "../../../pages/mentor/CreateCoursePage";
import ProjectCreationPage from "../pages/ProjectCreationPage";
import CertificateTemplatePage from "../pages/CertificateTemplatePage";
import CoursePreview from "../courses/pages/CoursePreview";
import EditCourse from "../courses/pages/EditCourse";

// --- Activities ---
import { ActivityProvider } from "../context/ActivityContext";
import Activities from "../pages/Activities";
import CreateActivity from "../pages/CreateActivity";

// --- Question Bank & Quizzes ---
import QuestionBankPage from "../pages/QuestionBankPage";
import CreateQuestionPage from "../pages/CreateQuestionPage";
import EditQuestionPage from "../pages/EditQuestionPage";
import QuestionPreviewPage from "../pages/QuestionPreviewPage";
import QuestionBankPageQuizBuilder from "../pages/QuizBuilderPage";
import AttemptHistoryPage from "../pages/AttemptHistoryPage";

// --- Challenges, Submissions, Hiring & Grading ---
import ChallengeCreatorPage from "../pages/mentor/ChallengeCreatorPage";
import ChallengeWorkspacePage from "../pages/student/ChallengeWorkspacePage";

import HiringPipelinePage from "../pages/HiringPipelinePage";

import SubmissionMonitoringPage from "../pages/SubmissionMonitoringPage";
import ReviewGradingPage from "../pages/ReviewGradingPage";

// --- Analytics & Reports ---
import AnalyticsDashboardPage from "../pages/AnalyticsDashboardPage";
import ExportReport from "../pages/ExportReport";

// --- Communication & Scheduling ---
import NotificationsPage from "../pages/NotificationsPage";
import DiscussionForumPage from "../pages/DiscussionForumPage";
import SlotsCalendarPage from "../pages/SlotsCalendarPage";

const mentorRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={["mentor"]} />}>
      {/* ==========================================
          MAIN MENTOR PORTAL (Shared Sidebar & Topnav)
          ========================================== */}
      <Route path="mentor" element={<MentorLayout />}>
        {/* Core */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />

        {/* Profile */}
        <Route path="profile" element={<MentorProfile />} />

        {/* Existing Mentee Route */}
        <Route path="mentees" element={<MenteeManagementPage />} />

        {/* Courses */}
        <Route path="courses" element={<Courses />} />
        <Route path="courses/create" element={<CreateCourse />} />

        {/* Settings */}
        <Route path="settings" element={<SettingsPage />} />

        {/* Reports */}
        <Route path="export-report" element={<ExportReport />} />

        {/* Projects */}
        <Route path="projects/create" element={<ProjectCreationPage />} />

        {/* Challenges */}
        <Route path="challenge-creator" element={<ChallengeCreatorPage />} />
        <Route
          path="challenge-workspace"
          element={<ChallengeWorkspacePage />}
        />

        {/* Submission */}
        <Route path="hiring-pipeline" element={<HiringPipelinePage />} />

        <Route path="settings" element={<SettingsPage />} />

        {/* Courses & Projects */}
        <Route path="courses" element={<Courses />} />
        <Route path="courses/create" element={<CreateCourse />} />
        <Route path="courses/:courseId/preview" element={<CoursePreview />} />
        <Route path="courses/:courseId/edit" element={<EditCourse />} />
        <Route path="projects/create" element={<ProjectCreationPage />} />
        <Route
          path="certificates/template"
          element={<CertificateTemplatePage />}
        />
        <Route path="review-grading" element={<ReviewGradingPage />} />
        <Route
          path="project-analytics"
          element={<AnalyticsDashboardPage />}
        />

        {/* Activities */}
        <Route element={<ActivityProvider />}>
          <Route path="activities" element={<Activities />} />
          <Route path="activities/create" element={<CreateActivity />} />
        </Route>

        {/* Question Bank & Quizzes */}
        <Route path="question-bank" element={<QuestionBankPage />} />
        <Route path="question-bank/create" element={<CreateQuestionPage />} />
        <Route
          path="question-bank/edit/:id"
          element={<EditQuestionPage />}
        />
        <Route
          path="question-bank/preview/:id"
          element={<QuestionPreviewPage />}
        />
        <Route
          path="question-bank/quiz-builder"
          element={<QuestionBankPageQuizBuilder />}
        />
        <Route
          path="question-bank/attempts"
          element={<AttemptHistoryPage />}
        />

        {/* Challenges, Submissions & Grading */}
        <Route path="challenge-creator" element={<ChallengeCreatorPage />} />
        <Route
          path="challenge-workspace"
          element={<ChallengeWorkspacePage />}
        />
        <Route
          path="submissions/monitoring"
          element={<SubmissionMonitoringPage />}
        />
        <Route path="submissions/review" element={<ReviewGradingPage />} />

        {/* Analytics & Reports */}
        <Route path="analytics" element={<AnalyticsDashboardPage />} />
        <Route path="export-report" element={<ExportReport />} />

        {/* Communication & Scheduling */}
        <Route path="notifications" element={<NotificationsPage />} />
        <Route
          path="discussion-forum"
          element={<DiscussionForumPage />}
        />
        <Route path="slots" element={<SlotsCalendarPage />} />
      </Route>

      {/* ==========================================
          ONBOARDING FLOW (No MentorLayout)
          ========================================== */}
      <Route path="mentor/onboarding/basic-info" element={<BasicInfo />} />
      <Route
        path="mentor/onboarding/professional-profile"
        element={<ProfessionalProfile />}
      />
      <Route
        path="mentor/onboarding/experience-links"
        element={<ExperienceLinks />}
      />
      <Route
        path="mentor/onboarding/availability"
        element={<Availability />}
      />
    </Route>
  </Route>
);

export default mentorRoute;