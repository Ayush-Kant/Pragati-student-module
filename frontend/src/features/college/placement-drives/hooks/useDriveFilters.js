import { useMemo, useState } from "react";

const useDriveFilters = (drives = []) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredDrives = useMemo(() => {
    return drives.filter((drive) => {
      const search = searchTerm.trim().toLowerCase();
      const matchesSearch = !search || (() => {
        const company = (drive.company || "").toLowerCase();
        const role = (drive.role || "").toLowerCase();
        const location = (drive.location || "").toLowerCase();
        const skills = (drive.skills || drive.eligibility?.skills || "").toLowerCase();
        const hiringProcess = (drive.hiringProcess || "").toLowerCase();
        const status = (drive.status || "").toLowerCase();
        const eligibilityStr = JSON.stringify(drive.eligibility || {}).toLowerCase();
        
        return (
          company.includes(search) ||
          role.includes(search) ||
          location.includes(search) ||
          skills.includes(search) ||
          hiringProcess.includes(search) ||
          status.includes(search) ||
          eligibilityStr.includes(search)
        );
      })();

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