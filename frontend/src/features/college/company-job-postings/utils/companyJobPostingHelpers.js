export const formatPackage = (value) => value;

export const formatDeadline = (date) => date;

export const sortCompanies = (companies) =>
  [...companies].sort((a, b) =>
    a.company.localeCompare(b.company)
  );