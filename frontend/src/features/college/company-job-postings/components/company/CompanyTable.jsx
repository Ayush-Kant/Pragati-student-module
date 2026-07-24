import CompanyRow from "./CompanyRow";

const CompanyTable = ({
  companies,
  onView,
  onEdit,
  onDelete,
  darkMode,
}) => {
  return (
    <div className={`rounded-xl shadow-md overflow-hidden ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white'}`}>
      <div className={`px-6 py-4 border-b ${darkMode ? 'border-[#3D3D3D]' : ''}`}>
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-700'}`}>
          Companies
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={darkMode ? 'bg-[#1A1A1A]' : 'bg-slate-100'}>
            <tr>
              <th className={`text-left px-6 py-3 ${darkMode ? 'text-gray-300' : ''}`}>Company</th>
              <th className={`text-left px-6 py-3 ${darkMode ? 'text-gray-300' : ''}`}>Location</th>
              <th className={`text-left px-6 py-3 ${darkMode ? 'text-gray-300' : ''}`}>Package</th>
              <th className={`text-center px-6 py-3 ${darkMode ? 'text-gray-300' : ''}`}>Actions</th>
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
                darkMode={darkMode}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyTable;