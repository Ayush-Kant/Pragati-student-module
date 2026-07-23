import { useEffect, useState } from "react";
import { getCompanies } from "../services/companyService";

export default function useCompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry =
      industry === ""
        ? true
        : company.industry
          .toLowerCase()
          .includes(industry.toLowerCase());
    const matchesLocation =
      location === ""
        ? true
        : company.location
          .toLowerCase()
          .includes(location.toLowerCase());
    const matchesStatus =
      status === "all"
        ? true
        : company.status.toLowerCase() === status.toLocaleLowerCase();
    return (
      matchesSearch &&
      matchesIndustry &&
      matchesLocation &&
      matchesStatus
    );
  });

  const totalPages = Math.ceil(
    filteredCompanies.length / itemsPerPage
  );

  const currentCompanies =
    filteredCompanies.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, industry, location, status]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);

      const data = await getCompanies();

      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    filteredCompanies,
    currentCompanies,

    loading,
    fetchCompanies,

    currentPage,
    setCurrentPage,
    totalPages,

    search,
    setSearch,

    industry,
    setIndustry,

    location,
    setLocation,

    status,
    setStatus,
  };
}