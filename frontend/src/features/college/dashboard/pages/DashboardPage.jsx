import AdmissionsChart from "../components/charts/AdmissionsChart";
import PlacementChart from "../components/charts/PlacementChart";
import RevenueChart from "../components/charts/RevenueChart";
import DashboardLayout from "../components/layout/DashboardLayout";

const DashboardPage = () => {
  return (
   <DashboardLayout>
    <div>
      <AdmissionsChart/>
      <PlacementChart/>
      <RevenueChart/>
      
    </div>
   </DashboardLayout>
  );
};

export default DashboardPage;