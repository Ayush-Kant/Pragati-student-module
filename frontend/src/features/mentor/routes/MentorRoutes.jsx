import { Route, Navigate } from "react-router-dom";
import PrivateRoute from "../../../routes/PrivateRoute";
import RoleRoute from "../../../routes/RoleRoute";

import MentorLayout from "../components/layout/MentorLayout";
import Dashboard from "../pages/Dashboard";
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
import QuizBuilderPage from "../pages/QuizBuilderPage";
import AttemptHistoryPage from "../pages/AttemptHistoryPage";
import ChallengeCreatorPage from "../pages/mentor/ChallengeCreatorPage";
import ChallengeWorkspacePage from "../pages/student/ChallengeWorkspacePage";

import HiringPipelinePage from "../pages/HiringPipelinePage";

const mentorRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={["mentor"]} />}>
      <Route path="mentor" element={<MentorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />

        <Route path="hiring-pipeline" element={<HiringPipelinePage />} />

        <Route path="courses" element={<Courses />} />
        <Route path="courses/create" element={<CreateCourse />} />
        <Route path="export-report" element={<ExportReport />} />
        <Route path="projects/create" element={<ProjectCreationPage />} />
        <Route path="challenge-creator" element={<ChallengeCreatorPage />} />
        <Route
          path="challenge-workspace"
          element={<ChallengeWorkspacePage />}
        />

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
          element={<QuizBuilderPage />}
        />
        <Route
          path="question-bank/attempts"
          element={<AttemptHistoryPage />}
        />
      </Route>
    </Route>
  </Route>
);

export default mentorRoute;