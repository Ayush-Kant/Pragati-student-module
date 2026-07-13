import { useMemo, useState } from "react";

const useDriveFilters = (drives = []) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredDrives = useMemo(() => {
    return drives.filter((drive) => {
      const matchesSearch =
        drive.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drive.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCompany =
        !companyFilter || drive.company === companyFilter;

      const matchesStatus =
        !statusFilter || drive.status === statusFilter;

      const matchesDate =
        !dateFilter || drive.driveDate === dateFilter;

      return (
        matchesSearch &&
        matchesCompany &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [drives, searchTerm, companyFilter, statusFilter, dateFilter]);

  return {
    filteredDrives,
    searchTerm,
    setSearchTerm,
    companyFilter,
    setCompanyFilter,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
  };
};

export default useDriveFilters;