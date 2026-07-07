import { useEffect, useState, useCallback } from "react";

import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../services/companyJobPostingService";

const useCompanyData = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCompanies = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const data = await getCompanies();
      setCompanies(data);
    } catch {
      setError("Unable to fetch companies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // call async function inside effect to avoid setting state synchronously
    const load = async () => {
      await fetchCompanies(false);
    };

    load();
  }, [fetchCompanies]);

  const addCompany = async (company) => {
    await createCompany(company);
    fetchCompanies();
  };

  const editCompany = async (id, company) => {
    await updateCompany(id, company);
    fetchCompanies();
  };

  const removeCompany = async (id) => {
    await deleteCompany(id);
    fetchCompanies();
  };

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    addCompany,
    editCompany,
    removeCompany,
  };
};

export default useCompanyData;
