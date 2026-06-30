import { Route } from "react-router-dom";
import RoleRoute from "../../../routes/RoleRoute";
import PrivateRoute from "../../../routes/PrivateRoute";
import CompanyLayout from "../layouts/CompanyLayout";

const CompanyRoute = (
    <Route element={<PrivateRoute />} >
        < Route element={<RoleRoute allowedRoles={['company']} />} >
            <Route path="/company/*" element={<CompanyLayout />} />
            <Route path="/company/add" element={<CompanyLayout />} />
        </Route>
    </Route>
)

export default CompanyRoute;

