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
import { useNavigate } from "react-router-dom";

export default function CompanyDetail() {
  const { id } = useParams();
  const { darkMode } = useOutletContext();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCompanyById(id);
        if (!data) {
          setError("Company not found");
        } else {
          setCompany(data);
        }
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Failed to load company details");
        console.error("Error fetching company:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className={`p-6 transition ${darkMode ? "text-white" : "text-slate-900"}`}>
        <div className={`rounded-lg p-6 ${darkMode ? "bg-slate-950 border border-slate-700" : "bg-white"}`}>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`animate-pulse h-12 rounded ${darkMode ? "bg-slate-800" : "bg-gray-200"}`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className={`p-6 transition ${darkMode ? "text-white" : "text-slate-900"}`}>
        <div className={`rounded-lg p-6 border ${darkMode ? "bg-red-950 border-red-700" : "bg-red-50 border-red-200"}`}>
          <p className={`text-lg font-semibold ${darkMode ? "text-red-200" : "text-red-700"}`}>
            ❌ {error || "Company not found"}
          </p>
          <button
            onClick={() => navigate("/admin/companies")}
            className={`mt-4 px-4 py-2 rounded transition ${darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-200 hover:bg-slate-300"}`}
          >
            ← Back to Companies
          </button>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (companyId, newStatus, reason = "") => {
    try {
      setActionLoading(true);
      setError(null);
      await updateCompanyStatus(companyId, {
        status: newStatus,
        reason,
      });
      const updatedCompany = await getCompanyById(companyId);
      setCompany({ ...updatedCompany });
      toast.success(`Company ${newStatus} successfully`);
      console.log(reason);
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err.message || "Something went wrong";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Status change error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className={`p-6 transition ${darkMode ? "text-white" : "text-slate-900"}`} >
      {error && (
        <div className={`mb-4 p-4 rounded-lg border ${darkMode ? "bg-red-950 border-red-700 text-red-200" : "bg-red-50 border-red-200 text-red-700"}`}>
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <CompanyHeader company={company} darkMode={darkMode} />
      <CompanyActionBar
        company={company}
        onStatusChange={handleStatusChange}
        showViewButton={false}
        darkMode={darkMode}
        actionLoading={actionLoading}
      />
      <CompanyStatsRow company={company} darkMode={darkMode} />

      <h2 className={`text-xl font-semibold mt-8 mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
        Performance Metrics
      </h2>
      <CompanyPerformanceMetrics company={company} darkMode={darkMode} />


      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <CompanyActivityLog activityLogs={company.activityLogs} darkMode={darkMode} />
        <CompanyDrivesList activeDrives={company.activeDrives} darkMode={darkMode} />
      </div>

      <button
        onClick={() => navigate("/admin/companies")}
        className={`mt-4 px-4 py-2 border rounded-lg cursor-pointer transition ${darkMode ? "bg-orange-500 border-orange-500 text-white hover:bg-orange-400" : "bg-orange-400 border-orange-400 text-white hover:bg-orange-500"}`}
      >
        ← Back to Companies
      </button>
    </div>
  );
}