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
import StudentNominationForm from "../components/forms/StudentNominationForm";

import ShortlistedStudents from "../components/shortlist/ShortlistedStudents";

import NominationTabs from "../components/nomination/NominationTabs";
import NominatedTable from "../components/nomination/NominatedTable";
import EditNominationForm from "../components/forms/EditNominationForm";
import RemoveNominationModal from "../components/forms/RemoveNominationModal";

import {
  eligibleStudents,
  nominatedStudents,
} from "../types/studentNominationDummyData";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import NominationCard from "../components/nomination/NominationCard";

const StudentNominationPage = () => {
  const [activeTab, setActiveTab] = useState("eligible");

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [showNominationForm, setShowNominationForm] = useState(false);

  const [nominatingStudent, setNominatingStudent] = useState(null);

  const [showEditForm, setShowEditForm] = useState(false);

  const [editingStudent, setEditingStudent] = useState(null);

  const [nominatedData, setNominatedData] = useState(nominatedStudents);

  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const [removingStudent, setRemovingStudent] = useState(null);

  const [eligibleData, setEligibleData] = useState(eligibleStudents);

  const ITEMS_PER_PAGE = 8;

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    setCurrentPage(1);

    setSelectedStudent(null);
    setIsDetailOpen(false);
  };

  const students = activeTab === "eligible" ? eligibleData : nominatedData;

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
        eligibleCount={eligibleData.length}
        nominatedCount={nominatedData.length}
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

      {showNominationForm ? (
        <StudentNominationForm
          student={nominatingStudent}
          onClose={() => {
            setShowNominationForm(false);
            setNominatingStudent(null);
          }}
          onSave={(newNomination) => {
            /* Remove from Eligible */

            setEligibleData((prev) =>
              prev.filter((student) => student.id !== newNomination.id),
            );

            /* Add to Nominated */

            setNominatedData((prev) => [newNomination, ...prev]);

            /* Close Form */

            setShowNominationForm(false);

            setNominatingStudent(null);
          }}
        />
      ) : showEditForm ? (
        <EditNominationForm
          student={editingStudent}
          onClose={() => {
            setShowEditForm(false);
            setEditingStudent(null);
          }}
          onSave={(updatedNomination) => {
            setNominatedData((prev) =>
              prev.map((student) =>
                student.id === updatedNomination.id
                  ? updatedNomination
                  : student,
              ),
            );

            setEditingStudent(updatedNomination);
          }}
        />
      ) : showRemoveModal ? (
        <RemoveNominationModal
          student={removingStudent}
          onClose={() => {
            setShowRemoveModal(false);
            setRemovingStudent(null);
          }}
          onRemove={(updatedStudent) => {
            /* Remove student from nominated list */

            setNominatedData((prev) =>
              prev.filter((student) => student.id !== updatedStudent.id),
            );

            /* Reset nomination fields */

            const eligibleStudent = {
              ...updatedStudent,

              company: "--",

              role: "--",

              package: "--",

              remarks: "",

              shortlistedDate: "--",

              status: "Eligible",
            };

            /* Add back to eligible list */

            setEligibleData((prev) => [...prev, eligibleStudent]);

            /* Close modal */

            setShowRemoveModal(false);

            setRemovingStudent(null);
          }}
        />
      ) : (
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
                onNominate={(student) => {
                  setNominatingStudent(student);
                  setShowNominationForm(true);
                }}
              />
            ) : (
              <NominatedTable
                students={currentStudents}
                totalStudents={totalStudents}
                selectedStudent={selectedStudent}
                isDetailOpen={isDetailOpen}
                setSelectedStudent={setSelectedStudent}
                setIsDetailOpen={setIsDetailOpen}
                onEditNomination={(student) => {
                  setEditingStudent(student);
                  setShowEditForm(true);
                }}
                onRemoveNomination={(student) => {
                  setRemovingStudent(student);
                  setShowRemoveModal(true);
                }}
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
      )}
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

      <LoadingSpinner />
      <EmptyState />
      <ErrorState />
      
      <NominationCard
  students={currentStudents}
  selectedStudent={selectedStudent}
  isDetailOpen={isDetailOpen}
  onViewStudent={(student) => {
    setSelectedStudent(student);
    setIsDetailOpen(true);
  }}
  onEditNomination={(student) => {
    setEditingStudent(student);
    setShowEditForm(true);
  }}
  onRemoveNomination={(student) => {
    setRemovingStudent(student);
    setShowRemoveModal(true);
  }}
  onReNominate={(student) => {
    console.log("Re-Nominate", student);
  }}
  onMarkSelected={(student) => {
    console.log("Mark Selected", student);
  }}
  getStudentActions={(student) => {
    switch (student.status) {
      case "Waiting":
        return {
          canEdit: true,
          canRemove: true,
        };

      case "Rejected":
        return {
          canReNominate: true,
        };

      case "Shortlisted":
        return {
          canMarkSelected: true,
        };

      case "Selected":
        return {
          isSelected: true,
        };

      default:
        return {};
    }
  }}
/>
    </div>
  );
};

export default StudentNominationPage;
