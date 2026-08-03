import CompanyStatusBadge from "./CompanyStatusBadge";
import CompanyActionBar from "./CompanyActionBar";

export default function CompanyTable(props) {
  console.log("CompanyTable props:", props);

  const {
    companies,
    darkMode,
    onStatusChange,
    actionLoading,
  } = props; 
  console.table(companies);
  return (
    <div
      className={`overflow-x-auto rounded-lg shadow mt-6 ${
        darkMode
          ? "bg-slate-950 border border-slate-700"
          : "bg-white"
      }`}
    >
      <table className="w-full">
        <thead>
          <tr
            className={`border-b ${
              darkMode
                ? "border-slate-700 text-slate-300"
                : "border-slate-200 text-slate-600"
            }`}
          >
            <th className="text-left p-4">Company</th>
            <th className="text-left p-4">Industry</th>
            <th className="text-left p-4">Location</th>
            <th className="text-left p-4">Size</th>
            <th className="text-left p-4">Package</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Score</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {companies.length > 0 ? (
            companies.map((company) => {
              const companyName =
                company.name ||
                company.company ||
                company.companyName ||
                "-";

              return (
                <tr
                  key={company.id}
                  className={`border-b ${
                    darkMode
                      ? "border-slate-800"
                      : "border-slate-100"
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                        {companyName.charAt(0).toUpperCase()}
                      </div>

                      <td className="p-4 text-red-600 font-bold text-xl">
  {JSON.stringify(company.name)}
</td>
                    </div>
                  </td>

                  <td className="p-4">
                    {company.industry || "-"}
                  </td>

                  <td className="p-4">
                    {company.location || "-"}
                  </td>

                  <td className="p-4">
                    {company.size || "-"}
                  </td>

                  <td className="p-4">
                    {company.package ||
                      company.packageOffered ||
                      "-"}
                  </td>

                  <td className="p-4">
                    <CompanyStatusBadge
                      status={company.status || "pending"}
                      darkMode={darkMode}
                    />
                  </td>

                  <td className="p-4">
                    {company.engagementScore ?? "-"}
                  </td>

                  <td className="p-4">
                    <CompanyActionBar
                      company={company}
                      onStatusChange={onStatusChange}
                      actionLoading={actionLoading}
                      showViewButton={true}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className="text-center p-6">
                No companies found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}