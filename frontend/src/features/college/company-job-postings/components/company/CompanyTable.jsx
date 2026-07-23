import CompanyRow from "./CompanyRow";

const CompanyTable = ({
  companies,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-slate-700">
          Companies
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-6 py-3">Company</th>
              <th className="text-left px-6 py-3">Location</th>
              <th className="text-left px-6 py-3">Package</th>
              <th className="text-center px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((company) => (
              <CompanyRow
                key={company.id}
                company={company}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyTable;