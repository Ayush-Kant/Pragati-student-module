const CompanyFilter = ({
    companies = [],
    selectedCompany,
    setSelectedCompany,
  }) => {
    return (
      <div className="w-full md:w-60">
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/20"
        >
          <option value="">All Companies</option>
  
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default CompanyFilter;