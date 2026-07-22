import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import ModuleList from "../components/ModuleList";
import AnalyticsPanel from "../components/AnalyticsPanel";
import MentorAssignModal from "../components/MentorAssignModal";
import ArchiveProgramModal from "../components/ArchiveProgramModal";
import ModuleFormModal from "../components/ModuleFormModal";
import ProgramEditModal from "../components/ProgramEditModal";
import ProgramStatusBadge from "../components/ProgramStatusBadge";

import useTrainingProgramDetail from "../hooks/useTrainingProgramDetail";
import { adminService } from "../services/adminService";

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

const TrainingProgramDetail = () => {

  const { id } = useParams();

  const {
    program,
    analytics,
    loading,
    error,
    refetch,
  } = useTrainingProgramDetail(id);

  const [openModule, setOpenModule] =
    useState(false);

  const [editingModule, setEditingModule] =
    useState(null);

  const [openMentor, setOpenMentor] =
    useState(false);

  const [openArchive, setOpenArchive] =
    useState(false);

  const [openEdit, setOpenEdit] =
    useState(false);

 const modules = program?.modules || [];
  /* =====================================
        Save Program
===================================== */

const saveProgram = async (updatedProgram) => {

  try {

    await adminService.updateTrainingProgram(
    updatedProgram.id,
    updatedProgram
);

    await refetch();

  } catch (error) {

    console.error(
      "Failed to save program:",
      error
    );

  }

};

/* =====================================
        Edit Program
===================================== */

const handleEditProgram = async (
  updatedProgram
) => {

  await saveProgram(updatedProgram);

  setOpenEdit(false);

};

/* =====================================
        Add / Edit Module
===================================== */

const handleSaveModule = async (
  moduleData
) => {

  try {

    if (editingModule) {

      await adminService.updateModule(
    program.id,
    editingModule.id,
    {
        ...editingModule,
        ...moduleData,
    }
);

    }

    else {

      await adminService.addModule(

        program.id,

        moduleData

      );

    }

    await refetch();

    setEditingModule(null);

    setOpenModule(false);

  }

  catch (error) {

    console.error(
      "Failed to save module:",
      error
    );

  }

};

/* =====================================
        Delete Module
===================================== */

const handleDeleteModule = async (
  moduleId
) => {

  try {

    await adminService.deleteModule(

      program.id,

      moduleId

    );

    await refetch();

  }

  catch (error) {

    console.error(
      "Failed to delete module:",
      error
    );

  }

};

/* =====================================
        Loading
===================================== */

if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-pulse">
      {/* Back Button */}
      <div className="h-5 w-48 bg-gray-200 rounded mb-6"></div>

      {/* Program Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex-1">
            <div className="h-8 w-72 bg-gray-200 rounded mb-4"></div>
            <div className="h-5 w-48 bg-gray-200 rounded mb-6"></div>

            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded mb-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((item) => (
                <div key={item}>
                  <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
                  <div className="h-5 w-28 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-12 w-36 bg-gray-200 rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 bg-white border border-gray-200 rounded-2xl"
          />
        ))}
      </div>

      {/* Modules */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-7 w-52 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
          </div>

          <div className="h-12 w-40 bg-gray-200 rounded-xl"></div>
        </div>

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 bg-gray-100 rounded-xl mb-4"
          />
        ))}
      </div>
    </div>
  );
}

/* =====================================
        Error
===================================== */

if (error) {

  return (

    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-red-50 border border-red-200 rounded-xl p-8">

        <h2 className="text-xl font-semibold text-red-600">

          Failed to load Training Program

        </h2>

        <p className="mt-3 text-gray-600">

         {error?.message || "Something went wrong."} 

        </p>

      </div>

    </div>

  );

}
return (

  <div className="min-h-screen bg-gray-50 p-6">

    {/* ===========================
            Back Button
    =========================== */}

    <Link
      to="/admin/training"
      className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium mb-6"
    >
      ← Back to Training Management
    </Link>

    {/* ===========================
            Program Header
    =========================== */}

    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

        {/* Left */}

        <div className="flex-1">

          <div className="flex items-center gap-3 flex-wrap">

            <h1 className="text-3xl font-bold text-slate-900">

              {program?.title}

            </h1>

            <ProgramStatusBadge
              status={program?.status}
            />

          </div>

          <p className="text-slate-500 mt-2">

            {program?.targetRole}

          </p>

          <p className="mt-5 text-slate-600">

            {program?.description}

          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

            <div>

              <p className="text-xs uppercase text-slate-400">

                Duration

              </p>

              <p className="font-semibold mt-1">

                {program?.durationWeeks} Weeks

              </p>

            </div>

            <div>

              <p className="text-xs uppercase text-slate-400">

                Mentor

              </p>

              <p className="font-semibold mt-1">

                {program?.mentor?.name || "Not Assigned"}

              </p>

            </div>

            <div>

              <p className="text-xs uppercase text-slate-400">

                Modules

              </p>

              <p className="font-semibold mt-1">

                {modules.length}

              </p>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() => setOpenMentor(true)}
            className="
              px-6
              py-3
              rounded-xl
              border
              border-orange-500
              text-orange-500
              hover:bg-orange-50
              transition
              font-semibold
            "
          >
            Assign Mentor
          </button>

          <button
            onClick={() => setOpenEdit(true)}
            className="
              bg-orange-500
              hover:bg-orange-600
              text-white
              px-6
              py-3
              rounded-xl
              shadow-sm
              transition
              font-semibold
            "
          >
            Edit Program
          </button>

          <button
            onClick={() => setOpenArchive(true)}
            className="
              bg-red-500
              hover:bg-red-600
              text-white
              px-6
              py-3
              rounded-xl
              shadow-sm
              transition
              font-semibold
            "
          >
            Archive Program
          </button>

        </div>

      </div>

    </div>

    {/* ===========================
            Analytics
    =========================== */}

    <div className="mt-8">

      <AnalyticsPanel
        analytics={analytics}
      />

    </div>
        {/* ===========================
            Training Modules
    =========================== */}

    <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>

          <h2 className="text-2xl font-bold text-slate-900">

            Training Modules

          </h2>

          <p className="text-slate-500 mt-1">

            Create and manage course modules.

          </p>

        </div>

        <button
          onClick={() => {

            setEditingModule(null);

            setOpenModule(true);

          }}
          className="
            bg-orange-500
            hover:bg-orange-600
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
            shadow-sm
            transition
          "
        >
          + Add Module
        </button>

      </div>

      {

        modules.length === 0 ? (

          <div className="border border-dashed border-slate-300 rounded-2xl p-12 text-center">

            <div className="text-6xl mb-4">

              📚

            </div>

            <h3 className="text-2xl font-semibold text-slate-900">

              No Modules Added

            </h3>

            <p className="text-slate-500 mt-3">

              Start building your course by creating the first module.

            </p>

            <button
              onClick={() => {

                setEditingModule(null);

                setOpenModule(true);

              }}
              className="
                mt-6
                bg-orange-500
                hover:bg-orange-600
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
              "
            >
              + Add Module
            </button>

          </div>

        ) : (

          <ModuleList

            modules={modules}

            onEdit={(module) => {

              setEditingModule(module);

              setOpenModule(true);

            }}

            onDelete={handleDeleteModule}

          />

        )

      }

    </div>
        {/* ===========================
            Module Form Modal
    =========================== */}

    <ModuleFormModal
      isOpen={openModule}
      moduleData={editingModule}
      onClose={() => {

        setEditingModule(null);

        setOpenModule(false);

      }}
      onSubmit={handleSaveModule}
    />

    {/* ===========================
            Assign Mentor Modal
    =========================== */}

    <MentorAssignModal
      isOpen={openMentor}
      mentors={mentors}
      onClose={() => {

        setOpenMentor(false);

      }}
      onAssign={async (mentorId) => {
  try {
    await adminService.assignMentor(
      program.id,
      mentorId
    );

    await refetch();

    setOpenMentor(false);
  } catch (error) {
    console.error(
      "Failed to assign mentor:",
      error
    );
  }
}}
    />

    {/* ===========================
            Edit Program Modal
    =========================== */}

    <ProgramEditModal
      isOpen={openEdit}
      programData={program}
      mentors={mentors}
      onClose={() => {

        setOpenEdit(false);

      }}
      onSubmit={handleEditProgram}
    />

    {/* ===========================
            Archive Program Modal
    =========================== */}

    <ArchiveProgramModal
      isOpen={openArchive}
      onClose={() => {

        setOpenArchive(false);

      }}
      onConfirm={async () => {

        try {

          await adminService.archiveTrainingProgram(
            program.id
          );

          await refetch();

          setOpenArchive(false);

        }

        catch (error) {

          console.error(
            "Archive failed:",
            error
          );

        }

      }}
    />

  </div>

);

};

export default TrainingProgramDetail;