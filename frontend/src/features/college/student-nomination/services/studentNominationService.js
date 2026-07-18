import {
  eligibleStudents,
  nominatedStudents,
  shortlistedStudents,
} from "../types/studentNominationDummyData";

/* =====================================
        Utility
===================================== */

const delay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const successResponse = (data, message = "Success") => ({
  success: true,
  message,
  data,
});

const errorResponse = (message) => ({
  success: false,
  message,
});

/* =====================================
      Eligible Students
===================================== */

export const getEligibleStudents = async () => {
  await delay();

  return successResponse(eligibleStudents);
};

/* =====================================
      Nominated Students
===================================== */

export const getNominatedStudents = async () => {
  await delay();

  return successResponse(nominatedStudents);
};

/* =====================================
      Shortlisted Students
===================================== */

export const getShortlistedStudents = async () => {
  await delay();

  return successResponse(shortlistedStudents);
};

/* =====================================
      Nominate Student
===================================== */

export const nominateStudent = async (student) => {
  await delay();

  if (!student) {
    return errorResponse("Student data is required.");
  }

  const newNomination = {
    ...student,
    id: Date.now(),
    status: "Waiting",
    nominatedDate: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };

  nominatedStudents.push(newNomination);

  return successResponse(
    newNomination,
    "Student nominated successfully."
  );
};

/* =====================================
      Update Nomination
===================================== */

export const updateNomination = async (
  studentId,
  updatedData
) => {
  await delay();

  const index = nominatedStudents.findIndex(
    (student) => student.id === studentId
  );

  if (index === -1) {
    return errorResponse("Student not found.");
  }

  nominatedStudents[index] = {
    ...nominatedStudents[index],
    ...updatedData,
  };

  return successResponse(
    nominatedStudents[index],
    "Nomination updated successfully."
  );
};

/* =====================================
      Remove Nomination
===================================== */

export const removeNomination = async (
  studentId
) => {
  await delay();

  const index = nominatedStudents.findIndex(
    (student) => student.id === studentId
  );

  if (index === -1) {
    return errorResponse("Student not found.");
  }

  const removedStudent = nominatedStudents[index];

  nominatedStudents.splice(index, 1);

  return successResponse(
    removedStudent,
    "Nomination removed successfully."
  );
};