import { mockCompanies, mockRankings } from "../adminCompanyMockData";

export const getCompanies = async () => {
  return mockCompanies;
};

export const getCompanyById = async (id) => {
  return mockCompanies.find(
    (company) => company.id === Number(id)
  );
};

export const updateCompanyStatus = async (
  companyId,
  newStatus
) => {
  console.log(companyId);
  console.log(typeof companyId);
  const company = mockCompanies.find(
    (c) => c.id === Number(companyId)
  );
  console.log(company);
  if (company) {
    company.status = newStatus;
  }
  return company;
};

export const getCompanyRankings = async () => {
  return mockRankings;
};