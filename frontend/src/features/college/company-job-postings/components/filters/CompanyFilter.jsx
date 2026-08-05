const CompanyFilter = ({
  companies = [],
  selectedCompany = "",
  onChange,
  darkMode,
}) => {
  return (
    <select
      value={selectedCompany}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#ff6d34] ${
        darkMode
          ? 'bg-[#1A1A1A] border-[#3D3D3D] text-white'
          : 'border border-slate-300 focus:border-blue-500 focus:ring-blue-200'
      }`}
    >
      <option value="">All Companies</option>

      {companies.map((company) => (
        <option
          key={company.id}
          value={company.company}
        >
          {company.company}
        </option>
      ))}
    </select>
  );
};

export default CompanyFilter;