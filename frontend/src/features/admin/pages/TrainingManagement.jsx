import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProgramStats from "../components/ProgramStats";
import ProgramCard from "../components/ProgramCard";
import ProgramCreateModal from "../components/ProgramCreateModal";
import ProgramEditModal from "../components/ProgramEditModal";

import useTrainingPrograms from "../hooks/useTrainingPrograms";

const mentors = [
  {
    id: "mentor_001",
    name: "Rohit Sharma",
  },
  {
    id: "mentor_002",
    name: "Priya Singh",
  },
  {
    id: "mentor_003",
    name: "Arjun Das",
  },
  {
    id: "mentor_004",
    name: "Sneha Verma",
  },
  {
    id: "mentor_005",
    name: "Rahul Kumar",
  },
];

const TrainingManagement = () => {

  const navigate = useNavigate();

  const {
    programs,
    loading,
    createProgram,
    updateProgram,
  } = useTrainingPrograms();

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [openCreate, setOpenCreate] =
    useState(false);

  const [openEdit, setOpenEdit] =
    useState(false);

  const [selectedProgram, setSelectedProgram] =
    useState(null);
    /* =====================================
        Statistics
===================================== */

const totalPrograms =
  programs.length;

const activePrograms =
  programs.filter(
    (program) =>
      program.status === "active"
  ).length;

const avgCompletion =
  programs.length
    ? Math.round(

        programs.reduce(
          (sum, program) =>

            sum +
            parseInt(
              program.completionRate
            ),

          0

        ) / programs.length

      )
    : 0;

/* =====================================
        Search & Filters
===================================== */

const filteredPrograms =
  useMemo(() => {

    return programs.filter(
      (program) => {

        const matchesSearch =
          program.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesRole =
          roleFilter === "All"

            ? true

            : program.targetRole ===
              roleFilter;

        const matchesStatus =
          statusFilter === "All"

            ? true

            : program.status ===
              statusFilter;

        return (

          matchesSearch &&

          matchesRole &&

          matchesStatus

        );

      }

    );

  }, [

    programs,

    search,

    roleFilter,

    statusFilter,

  ]);

/* =====================================
        Create Program
===================================== */

const handleCreateProgram = (
  newProgram
) => {

  createProgram(newProgram);

  setOpenCreate(false);

};

/* =====================================
        Edit Program
===================================== */

const handleEditProgram = (
  updatedProgram
) => {

  updateProgram(updatedProgram);

  setOpenEdit(false);

  setSelectedProgram(null);

};

/* =====================================
        Manage Program
===================================== */

const handleManageProgram = (
  program
) => {

  navigate(
    `/admin/training/${program.id}`
  );

};

/* =====================================
        Loading
===================================== */

if (loading) {

  return (

    <div className="min-h-screen bg-white flex items-center justify-center">

      <h2 className="text-xl font-semibold text-gray-500">

        Loading Training Programs...

      </h2>

    </div>

  );

}
return (

  <div className="min-h-screen bg-white p-6">

    {/* ===========================
            Header
    =========================== */}

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

      <div>

        <h1 className="text-4xl font-bold text-slate-900">

          Training Management (LMS)

        </h1>

        <p className="text-slate-500 mt-2 text-lg">

          Create, manage and monitor training programs.

        </p>

      </div>

      <button
        onClick={() => setOpenCreate(true)}
        className="
          bg-orange-500
          hover:bg-orange-600
          text-white
          px-6
          py-3
          rounded-xl
          font-semibold
          shadow-md
          transition-all
          duration-300
        "
      >
        + Create Program
      </button>

    </div>

    {/* ===========================
            Statistics
    =========================== */}

    <ProgramStats
      totalPrograms={totalPrograms}
      activePrograms={activePrograms}
      avgCompletion={avgCompletion}
    />

    {/* ===========================
            Search & Filters
    =========================== */}

    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 mt-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Search */}

        <input
          type="text"
          placeholder="Search by program title..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            border
            border-slate-300
            rounded-xl
            px-5
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-orange-400
          "
        />

        {/* Role Filter */}

        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value)
          }
          className="
            border
            border-slate-300
            rounded-xl
            px-5
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-orange-400
          "
        >
          <option>All</option>
          <option>App Developer</option>
          <option>AI Engineer</option>
          <option>Backend Developer</option>
          <option>Data Scientist</option>
          <option>DevOps Engineer</option>
        </select>

        {/* Status Filter */}

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="
            border
            border-slate-300
            rounded-xl
            px-5
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-orange-400
          "
        >
          <option value="All">All</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>

      </div>

      <p className="text-slate-500 mt-5">

        Showing

        <span className="font-semibold text-slate-900 mx-1">

          {filteredPrograms.length}

        </span>

        of

        <span className="font-semibold text-slate-900 mx-1">

          {programs.length}

        </span>

        Programs

      </p>

    </div>
        {/* ===========================
            Program Cards
    =========================== */}

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">

      {

        filteredPrograms.length > 0 ? (

          filteredPrograms.map((program) => (

            <ProgramCard

              key={program.id}

              program={program}

              onEdit={() => {

                setSelectedProgram(program);

                setOpenEdit(true);

              }}

              onManage={() => {

                handleManageProgram(program);

              }}

            />

          ))

        ) : (

          <div className="col-span-full">

            <div className="border border-dashed border-slate-300 rounded-2xl p-12 text-center">

              <div className="text-6xl mb-5">

                📚

              </div>

              <h2 className="text-2xl font-bold text-slate-900">

                No Programs Found

              </h2>

              <p className="text-slate-500 mt-3">

                Try changing the filters or create a new training program.

              </p>

              <button
                onClick={() => setOpenCreate(true)}
                className="
                  mt-6
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                  px-6
                  py-3
                  rounded-xl
                  font-semibold
                  shadow-sm
                  transition-all
                  duration-300
                "
              >
                + Create Program
              </button>

            </div>

          </div>

        )

      }

    </div>
        {/* ===========================
            Create Program Modal
    =========================== */}

    <ProgramCreateModal
      isOpen={openCreate}
      mentors={mentors}
      onClose={() => {

        setOpenCreate(false);

      }}
      onSubmit={handleCreateProgram}
    />

    {/* ===========================
            Edit Program Modal
    =========================== */}

    <ProgramEditModal
      isOpen={openEdit}
      programData={selectedProgram}
      mentors={mentors}
      onClose={() => {

        setOpenEdit(false);

        setSelectedProgram(null);

      }}
      onSubmit={handleEditProgram}
    />

  </div>

);

};

export default TrainingManagement;