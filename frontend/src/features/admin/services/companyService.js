import { mockCompanies } from "../adminCompanyMockData";

export const getCompanies = async () => {
  return mockCompanies;
};

export const getCompanyById = async (id) => {
  return mockCompanies.find(
    (company) => company.id === Number(id)
  );
};