import { Routes, Route } from "react-router-dom";



import BasicInfo from "../pages/BasicInfo";
import ProfessionalProfile from "../pages/ProfessionalProfile";
import ExperienceLinks from "../pages/ExperienceLinks";
import Availability from "../pages/Availability";
import MentorProfile from "../pages/MentorProfile";
const MentorRoutes = () => {

  return (
    <Routes>

      

      <Route
        path="onboarding/basic-info"
        element={<BasicInfo />}
      />
      
<Route
  path="onboarding/professional-profile"
  element={<ProfessionalProfile />}
/>

<Route
  path="onboarding/experience-links"
  element={<ExperienceLinks />}
/>

<Route
  path="onboarding/availability"
  element={<Availability />}
/>

 <Route
        path="profile"
        element={<MentorProfile />}
      />

    </Routes>
  );
};

export default MentorRoutes;