// import { Routes, Route } from "react-router-dom";

// import MentorProfile from "../pages/MentorProfile";
// const MentorRoutes = () => {

//   return (
//     <Routes>

//     </Routes>
//   );
// };

// export default MentorRoutes;
import { Route, Navigate } from "react-router-dom";
import PrivateRoute from "../../../routes/PrivateRoute";
import RoleRoute from "../../../routes/RoleRoute";
import MentorLayout from "../components/layout/MentorLayout";
import Dashboard from "../pages/Dashboard";

import BasicInfo from "../pages/BasicInfo";
import ProfessionalProfile from "../pages/ProfessionalProfile";
import ExperienceLinks from "../pages/ExperienceLinks";
import Availability from "../pages/Availability";

const mentorRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={["mentor"]} />}>
      <Route path="mentor" element={<MentorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="onboarding/basic-info" element={<BasicInfo />} />

        <Route
          path="onboarding/professional-profile"
          element={<ProfessionalProfile />}
        />

        <Route
          path="onboarding/experience-links"
          element={<ExperienceLinks />}
        />

        <Route path="onboarding/availability" element={<Availability />} />
      </Route>
    </Route>
  </Route>
);

export default mentorRoute;
