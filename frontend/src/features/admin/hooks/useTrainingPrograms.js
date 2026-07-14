import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "trainingPrograms";

const defaultPrograms = [
  {
    id: "course_201",
    title: "MERN Full Stack",
    targetRole: "App Developer",
    mentor: {
      id: "mentor_001",
      name: "Rohit Sharma",
    },
    modulesCount: 8,
    enrollment: 48,
    completionRate: "78%",
    status: "active",
    durationWeeks: 6,
    description: "Complete MERN Stack training",
    modules: [],
  },
  {
    id: "course_202",
    title: "Artificial Intelligence",
    targetRole: "AI Engineer",
    mentor: {
      id: "mentor_002",
      name: "Priya Singh",
    },
    modulesCount: 10,
    enrollment: 42,
    completionRate: "72%",
    status: "active",
    durationWeeks: 8,
    description:
      "Artificial Intelligence and Deep Learning",
    modules: [],
  },
  {
    id: "course_203",
    title: "Java Spring Boot",
    targetRole: "Backend Developer",
    mentor: {
      id: "mentor_003",
      name: "Arjun Das",
    },
    modulesCount: 9,
    enrollment: 35,
    completionRate: "65%",
    status: "draft",
    durationWeeks: 7,
    description:
      "Enterprise Java Backend Development",
    modules: [],
  },
  {
    id: "course_204",
    title: "Data Science & Machine Learning",
    targetRole: "Data Scientist",
    mentor: {
      id: "mentor_004",
      name: "Sneha Verma",
    },
    modulesCount: 12,
    enrollment: 55,
    completionRate: "84%",
    status: "active",
    durationWeeks: 10,
    description:
      "Python, Machine Learning & Data Science",
    modules: [],
  },
  {
    id: "course_205",
    title: "DevOps & Cloud",
    targetRole: "DevOps Engineer",
    mentor: {
      id: "mentor_005",
      name: "Rahul Kumar",
    },
    modulesCount: 11,
    enrollment: 30,
    completionRate: "58%",
    status: "inactive",
    durationWeeks: 8,
    description:
      "Docker, Kubernetes & AWS",
    modules: [],
  },
];

const useTrainingPrograms = () => {

  const [programs, setPrograms] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* ------------------------------
      Load Programs
  ------------------------------ */

  const loadPrograms = useCallback(() => {

    const storedPrograms =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      ) || [];

    let mergedPrograms = [...storedPrograms];

    defaultPrograms.forEach((defaultProgram) => {

      const exists =
        mergedPrograms.some(
          (program) =>
            program.id === defaultProgram.id
        );

      if (!exists) {

        mergedPrograms.push(defaultProgram);

      }

    });

    setPrograms(mergedPrograms);

    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(mergedPrograms)

    );

    setLoading(false);

  }, []);

  useEffect(() => {

    loadPrograms();

  }, [loadPrograms]);

  useEffect(() => {

    if (!loading) {

      localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(programs)

      );

    }

  }, [programs, loading]);
  /* ------------------------------
      Create Program
------------------------------ */

const createProgram = (newProgram) => {

  const mentors = {
    mentor_001: "Rohit Sharma",
    mentor_002: "Priya Singh",
    mentor_003: "Arjun Das",
    mentor_004: "Sneha Verma",
    mentor_005: "Rahul Kumar",
  };

  const program = {

    id: `course_${Date.now()}`,

    title: newProgram.title,

    targetRole: newProgram.targetRole,

    description: newProgram.description,

    durationWeeks: Number(
      newProgram.durationWeeks
    ),

    mentor: {
      id: newProgram.mentorId,

      name:
        mentors[newProgram.mentorId] ||
        "Not Assigned",
    },

    modules: [],

    modulesCount: 0,

    enrollment: 0,

    completionRate: "0%",

    status:
      newProgram.status || "draft",

  };

  const updatedPrograms = [
    program,
    ...programs,
  ];

  setPrograms(updatedPrograms);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedPrograms)
  );

};

/* ------------------------------
      Update Program
------------------------------ */

const updateProgram = (updatedProgram) => {

  const updatedPrograms =
    programs.map((program) =>

      program.id === updatedProgram.id

        ? {

            ...program,

            ...updatedProgram,

          }

        : program

    );

  setPrograms(updatedPrograms);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedPrograms)
  );

};
/* ------------------------------
      Delete Program
------------------------------ */

const deleteProgram = (programId) => {

  const updatedPrograms =
    programs.filter(

      (program) =>

        program.id !== programId

    );

  setPrograms(updatedPrograms);

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(updatedPrograms)

  );

};

/* ------------------------------
      Archive Program
------------------------------ */

const archiveProgram = (programId) => {

  const updatedPrograms =
    programs.map((program) =>

      program.id === programId

        ? {

            ...program,

            status: "archived",

          }

        : program

    );

  setPrograms(updatedPrograms);

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(updatedPrograms)

  );

};

/* ------------------------------
      Refresh Programs
------------------------------ */

const refreshPrograms = () => {

  const storedPrograms =
    JSON.parse(

      localStorage.getItem(STORAGE_KEY)

    ) || [];

  setPrograms(storedPrograms);

};
  /* ------------------------------
      Return Hook
  ------------------------------ */

  return {

    programs,

    loading,

    createProgram,

    updateProgram,

    deleteProgram,

    archiveProgram,

    refreshPrograms,

  };

};

export default useTrainingPrograms;