import CompanyStatusBadge from "./CompanyStatusBadge";
import CompanyActionBar from "./CompanyActionBar";

export default function CompanyTable({ companies, darkMode, onStatusChange, actionLoading }) {
  return (
    <div
      className={`overflow-x-auto rounded-lg shadow mt-6 ${darkMode
          ? "bg-slate-950 border border-slate-700"
          : "bg-white"
        }`}
    >
      <table className="w-full">
        <thead>
          <tr
            className={`border-b ${darkMode
                ? "border-slate-700 text-slate-300"
                : "border-slate-200 text-slate-600"
              }`}
          >
            <th className="text-left p-4">Company</th>
            <th className="text-left p-4">Industry</th>
            <th className="text-left p-4">Location</th>
            <th className="text-left p-4">Size</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Score</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {companies.map((company) => (
            <tr
              key={company.id}
              className={`border-b ${darkMode
                  ? "border-slate-800"
                  : "border-slate-100"
                }`}
            >
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-6 h-6 rounded-full"
                  />

                  <span>{company.name}</span>
                </div>
              </td>

              <td className="p-4">{company.industry}</td>
              <td className="p-4">{company.location}</td>
              <td className="p-4">{company.size}</td>
              <td className="p-4">
                <CompanyStatusBadge
                  status={company.status}
                  darkMode={darkMode}
                />
              </td>
              <td className="p-4">
                {company.engagementScore}
              </td>
              <td className="p-4">
                <CompanyActionBar company={company} onStatusChange={onStatusChange} actionLoading={actionLoading} showViewButton={true} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}