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

console.log("Companies API Response:");
console.table(data);
setCompanies(data);
  } catch (error) {
    console.error("Fetch Companies Error:", error);
    console.error("Response:", error.response);

    setError(
      error.response?.data?.message ||
      error.message ||
      "Unable to fetch companies."
    );
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

    const payload = {
  name: company.name,
  location: company.location,
  package: company.package
};


    await createCompany(payload);

    await fetchCompanies(false);


  } catch(error) {

    console.error(
      "Add Company Error:",
      error
    );

    setError(
      error.response?.data?.message ||
      "Unable to add company."
    );

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
