import { useState } from "react";
import Pagination from "../components/common/Pagination";

import BatchFilter from "../components/filters/BatchFilter";
import CompanyFilter from "../components/filters/CompanyFilter";
import DepartmentFilter from "../components/filters/DepartmentFilter";
import SearchStudent from "../components/filters/SearchStudent";
import StatusFilter from "../components/filters/StatusFilter";

import NominationDetails from "../components/nomination/NominationDetails";
import NominationStatistics from "../components/nomination/NominationStatistics";
import NominationTable from "../components/nomination/NominationTable";

import ShortlistedStudents from "../components/shortlist/ShortlistedStudents";

import NominationTabs from "../components/nomination/NominationTabs";
import NominatedTable from "../components/nomination/NominatedTable";

import {
  eligibleStudents,
  nominatedStudents,
} from "../types/studentNominationDummyData";

const StudentNominationPage = () => {
  const [activeTab, setActiveTab] = useState("eligible");

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    setCurrentPage(1);

    setSelectedStudent(null);
    setIsDetailOpen(false);
  };

  const students =
    activeTab === "eligible" ? eligibleStudents : nominatedStudents;

  const totalStudents = students.length;

  const totalPages = Math.ceil(totalStudents / ITEMS_PER_PAGE);

  const indexOfLastStudent = currentPage * ITEMS_PER_PAGE;

  const indexOfFirstStudent = indexOfLastStudent - ITEMS_PER_PAGE;

  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent,
  );

  return (
    <div className="flex w-full flex-col gap-6 px-2 py-4 sm:px-4 lg:px-6">
      <NominationStatistics />

      <NominationTabs
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        eligibleCount={eligibleStudents.length}
        nominatedCount={nominatedStudents.length}
      />
      {/* =========================
            Filters
      ========================== */}

      <div className="mt-2">
        <SearchStudent />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CompanyFilter />
        <DepartmentFilter />

        {activeTab === "nominated" && <StatusFilter />}

        <BatchFilter />
      </div>

      {/* =========================
            Table + Details
      ========================== */}

      <div className="flex h-167 gap-4">
        {/* Table */}

        <div className="flex min-w-0 h-full flex-1 flex-col">
          {activeTab === "eligible" ? (
            <NominationTable
              students={currentStudents}
              totalStudents={totalStudents}
              selectedStudent={selectedStudent}
              isDetailOpen={isDetailOpen}
              setSelectedStudent={setSelectedStudent}
              setIsDetailOpen={setIsDetailOpen}
            />
          ) : (
            <NominatedTable
              students={currentStudents}
              totalStudents={totalStudents}
              selectedStudent={selectedStudent}
              isDetailOpen={isDetailOpen}
              setSelectedStudent={setSelectedStudent}
              setIsDetailOpen={setIsDetailOpen}
            />
          )}
        </div>

        {/* Details Drawer */}

        <div
          className={`h-full overflow-hidden transition-all duration-300 ease-in-out ${
            isDetailOpen ? "h-full w-[520px] shrink-0" : "w-0"
          }`}
        >
          <NominationDetails
            student={selectedStudent}
            isOpen={isDetailOpen}
            onClose={() => {
              setSelectedStudent(null);
              setIsDetailOpen(false);
            }}
          />
        </div>
      </div>

      {/* =========================
            Pagination
      ========================== */}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* =========================
            Shortlisted Students
      ========================== */}

      <ShortlistedStudents />
    </div>
  );
};

export default StudentNominationPage;
