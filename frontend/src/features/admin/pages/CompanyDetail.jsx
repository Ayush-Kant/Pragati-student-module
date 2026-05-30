import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { getCompanyById } from "../services/companyService";

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

  return (
    <div
      className={`p-6 ${darkMode ? "text-white" : "text-slate-900"
        }`}
    >
      <h1 className="text-3xl font-bold mb-4">
        {company.name}
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <p>
            <strong>Industry:</strong> {company.industry}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <p>
            <strong>Location:</strong> {company.location}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <p>
            <strong>Status:</strong> {company.status}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <p>
            <strong>Engagement Score:</strong>{" "}
            {company.engagementScore}
          </p>
        </div>
      </div>
    </div>
  );
}