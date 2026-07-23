import { useMemo, useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import SearchStudent from "../filters/SearchStudent";
import CompanyFilter from "../filters/CompanyFilter";
import ShortlistCard from "./ShortlistCard";
import Pagination from "../common/Pagination";

import { shortlistedStudents } from "../../types/studentNominationDummyData";

const CompanyShortlist = () => {
  const { darkMode } = useOutletContext();

  /* =====================================
            STATES
  ====================================== */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(""); // Unified default value matching empty filter string
  const [expandedCompanies, setExpandedCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const scrollRefs = useRef({});
  const COMPANIES_PER_PAGE = 5;

  /* =====================================
        RESET PAGINATION
  ====================================== */
  useEffect(() => {
    setCurrentPage(1);
    setExpandedCompanies([]);
  }, [searchTerm, selectedCompany]);

  /* =====================================
        EVENT HANDLERS
  ====================================== */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCompanyChange = (value) => {
    setSelectedCompany(value);
  };

  /* =====================================
          FILTER STUDENTS
  ====================================== */
  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return shortlistedStudents.filter((student) => {
      const studentName = (student.student || "").toLowerCase();
      const role = (student.role || "").toLowerCase();
      const company = (student.company || "").toLowerCase();

      const matchesSearch =
        studentName.includes(query) ||
        role.includes(query) ||
        company.includes(query);

      const matchesCompany =
        selectedCompany === "" || student.company === selectedCompany;

      return matchesSearch && matchesCompany;
    });
  }, [searchTerm, selectedCompany]);

  /* =====================================
          GROUP BY COMPANY
  ====================================== */
  const companyGroups = useMemo(() => {
    const grouped = {};

    filteredStudents.forEach((student) => {
      if (!grouped[student.company]) {
        grouped[student.company] = [];
      }
      grouped[student.company].push(student);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([company, students]) => ({
        company,
        students,
        totalStudents: students.length,
        selectedStudents: students.length,
      }));
  }, [filteredStudents]);

  /* =====================================
          PAGINATION
  ====================================== */
  const totalPages = Math.ceil(companyGroups.length / COMPANIES_PER_PAGE);

  const paginatedCompanies = companyGroups.slice(
    (currentPage - 1) * COMPANIES_PER_PAGE,
    currentPage * COMPANIES_PER_PAGE,
  );

  /* =====================================
        EXPAND / COLLAPSE
  ====================================== */
  const toggleCompany = (companyName) => {
    setExpandedCompanies((prev) =>
      prev.includes(companyName)
        ? prev.filter((item) => item !== companyName)
        : [...prev, companyName],
    );
  };

  /* =====================================
        HORIZONTAL SCROLL
  ====================================== */
  const scrollCards = (companyName, direction) => {
    const container = scrollRefs.current[companyName];
    if (!container) return;

    const card = container.querySelector("[data-shortlist-card]");
    if (!card) return;

    const gap = 24;
    const scrollAmount = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount * 2 : scrollAmount * 2,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-0 min-w-full flex flex-col gap-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Company-wise Shortlists</h1>
        <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Browse shortlisted students grouped by company.
        </p>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SearchStudent value={searchTerm} onChange={handleSearchChange} />
        <CompanyFilter value={selectedCompany} onChange={handleCompanyChange} />
      </div>

      {/* COMPANY LIST */}
      <div className="flex flex-col gap-6 w-full min-w-0">
        {paginatedCompanies.map((company) => {
          const isExpanded = expandedCompanies.includes(company.company);

          return (
            <div
              key={company.company}
              className={`overflow-hidden rounded-3xl border w-full min-w-0 transition-all duration-300 ${
                darkMode
                  ? "border-[#3D3D3D] bg-[#2D2D2D]"
                  : "border-slate-200 bg-white"
              }`}
            >
              {/* COMPANY HEADER */}
              <button
                type="button"
                onClick={() => toggleCompany(company.company)}
                className={`w-full px-6 py-5 transition-colors ${
                  darkMode ? "hover:bg-[#1A1A1A]" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                        darkMode
                          ? "bg-[#1A1A1A] text-[#ff6d34]"
                          : "bg-orange-50 text-[#ff7a00]"
                      }`}
                    >
                      <Building2 size={24} strokeWidth={2} />
                    </div>

                    <div className="text-left">
                      <h2 className="text-xl font-bold">{company.company}</h2>
                      <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {company.totalStudents} Students Shortlisted
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className={`text-xs uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                        Shortlisted
                      </p>
                      <p className="mt-1 text-2xl font-bold text-emerald-500">
                        {company.selectedStudents}
                      </p>
                    </div>

                    <div className={`rounded-xl p-2 ${darkMode ? "bg-[#1A1A1A]" : "bg-slate-100"}`}>
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                  </div>
                </div>
              </button>

              {/* STUDENTS CAROUSEL */}
              {isExpanded && (
                <div className={`border-t px-8 py-8 w-full min-w-0 ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                  <div className="relative w-full min-w-0">
                    {/* Left Button */}
                    <button
                      type="button"
                      onClick={() => scrollCards(company.company, "left")}
                      className={`absolute left-0 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full p-3 shadow-xl ${
                        darkMode
                          ? "bg-[#2D2D2D] hover:bg-[#1A1A1A] text-white"
                          : "bg-white hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <ChevronLeft size={22} />
                    </button>

                    {/* Right Button */}
                    <button
                      type="button"
                      onClick={() => scrollCards(company.company, "right")}
                      className={`absolute right-0 top-1/2 z-20 translate-x-1/2 -translate-y-1/2 rounded-full p-3 shadow-xl ${
                        darkMode
                          ? "bg-[#2D2D2D] hover:bg-[#1A1A1A] text-white"
                          : "bg-white hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <ChevronRight size={22} />
                    </button>

                    <div className="w-full max-w-full overflow-hidden">
                      {/* SCROLL AREA */}
                      <div
                        ref={(el) => (scrollRefs.current[company.company] = el)}
                        className="flex flex-nowrap gap-6 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory px-1 pb-2 scrollbar-hide [&::-webkit-scrollbar]:hidden w-full"
                      >
                        {company.students.map((student) => (
                          <div
                            key={student.id}
                            data-shortlist-card
                            className="flex-none shrink-0 snap-start w-[280px] sm:w-[325px]"
                          >
                            <ShortlistCard student={student} variant="compact" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {companyGroups.length === 0 && (
        <div className={`flex h-72 flex-col items-center justify-center rounded-3xl border ${darkMode ? "border-[#3D3D3D] bg-[#2D2D2D]" : "border-slate-200 bg-white"}`}>
          <Building2 size={48} className={darkMode ? "text-slate-600" : "text-slate-400"} />
          <h3 className="mt-5 text-xl font-semibold">No Companies Found</h3>
          <p className={`mt-2 max-w-md text-center text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            No shortlisted students match your current search or selected company.
          </p>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
};

export default CompanyShortlist;