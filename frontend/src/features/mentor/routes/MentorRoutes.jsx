import { Route, Navigate } from "react-router-dom";
import MentorLayout from "../components/layout/MentorLayout";
import Dashboard from "../pages/Dashboard";
import MentorProfile from "../pages/MentorProfile";
import BasicInfo from "../pages/BasicInfo";
import ProfessionalProfile from "../pages/ProfessionalProfile";
import ExperienceLinks from "../pages/ExperienceLinks";
import Availability from "../pages/Availability";

const mentorRoute = (
  <>
    {/* All mentor pages share MentorLayout (sidebar + topnav) */}
    <Route path="mentor" element={<MentorLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={<MentorProfile />} />
    </Route>

    {/* Onboarding pages use their own OnboardingLayout — no MentorLayout */}
    <Route path="mentor/onboarding/basic-info" element={<BasicInfo />} />
    <Route path="mentor/onboarding/professional-profile" element={<ProfessionalProfile />} />
    <Route path="mentor/onboarding/experience-links" element={<ExperienceLinks />} />
    <Route path="mentor/onboarding/availability" element={<Availability />} />
  </>
);

export default mentorRoute;
