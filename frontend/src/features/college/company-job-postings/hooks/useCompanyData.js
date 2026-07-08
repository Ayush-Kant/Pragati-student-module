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
      setCompanies([...data]);
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
    try {
      const newCompany = await createCompany(company);
      setCompanies((prev) => [...prev, newCompany]);
    } catch {
      setError("Unable to add company.");
    }
  };

  const editCompany = async (id, company) => {
    try {
      const updated = await updateCompany(id, company);
      setCompanies((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
    } catch {
      setError("Unable to update company.");
    }
  };

  const removeCompany = async (id) => {
    try {
      await deleteCompany(id);
      setCompanies((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Unable to delete company.");
    }
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
