const CompanyFilter = ({
  companies = [],
  selectedCompany = "",
  onChange,
}) => {
  return (
    <select
      value={selectedCompany}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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