import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { getCompanyById } from "../services/companyService";
import CompanyStatsRow from "../components/CompanyStatsRow";
import CompanyActivityLog from "../components/CompanyActivityLog";
import CompanyDrivesList from "../components/CompanyDrivesList";
import CompanyPerformanceMetrics from "../components/CompanyPerformanceMetrics";
import CompanyHeader from "../components/CompanyHeader";
import CompanyActionBar from "../components/CompanyActionBar";
import { updateCompanyStatus } from "../services/companyService";
import toast from "react-hot-toast";

export default function CompanyDetail() {
  const { id } = useParams();
  const { darkMode } = useOutletContext();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompanyById(id);
        setCompany(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }
  if (!company) {
    return <div className="p-4">Company not found</div>;
  }

  const handleStatusChange = async (
    companyId,
    newStatus
  ) => {
    try {
      await updateCompanyStatus(
        companyId,
        newStatus
      );
      const updatedCompany = await getCompanyById(companyId);
      setCompany({ ...updatedCompany });
      toast.success(
        `Company ${newStatus} successfully`
      );
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div
      className={`p-6 ${darkMode ? "text-white" : "text-slate-900"
        }`}
    >
      <CompanyHeader company={company} />
      <CompanyActionBar company={company} onStatusChange={handleStatusChange} showViewButton={false} />
      <CompanyStatsRow company={company} />
      <CompanyPerformanceMetrics company={company} />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <CompanyActivityLog
          activityLogs={company.activityLogs}
        />

        <CompanyDrivesList
          activeDrives={company.activeDrives}
        />
      </div>
    </div>
  );
}