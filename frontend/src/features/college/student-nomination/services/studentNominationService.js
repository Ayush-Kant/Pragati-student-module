import {
  eligibleStudents,
  nominatedStudents,
  shortlistedStudents,
} from "../types/studentNominationDummyData";


const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const successResponse = (data, message = "Success") => ({
  success: true,
  message,
  data,
});

const errorResponse = (message) => ({
  success: false,
  message,
});

export const getEligibleStudents = async () => {
  await delay();
  return successResponse([...eligibleStudents]);
};

export const getNominatedStudents = async () => {
  await delay();
  return successResponse([...nominatedStudents]);
};

export const getShortlistedStudents = async () => {
  await delay();
  return successResponse([...shortlistedStudents]);
};


export const nominateStudent = async (student) => {
  await delay(500);
  if (!student) {
    return errorResponse("Student data is required.");
  }

  // Hydrate object structure matching schema requirements
  const newNomination = {
    ...student,
    id: student.id || Date.now(),
    status: "Waiting",
    nominatedDate: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    timeline: {
      nominated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      waiting: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      Shortlisted: null,
      rejected: null,
    }
  };

  // Prevent record collisions in working memory context reference arrays
  const exists = nominatedStudents.some(s => s.id === student.id);
  if (!exists) {
    nominatedStudents.push(newNomination);
  }

  return successResponse(newNomination, "Student nominated successfully.");
};

export const updateNomination = async (studentId, updatedData) => {
  await delay(500);
  const index = nominatedStudents.findIndex((student) => student.id === studentId);

  if (index === -1) {
    return errorResponse("Student nomination record not found.");
  }

  nominatedStudents[index] = {
    ...nominatedStudents[index],
    ...updatedData,
  };

  return successResponse(nominatedStudents[index], "Nomination updated successfully.");
};

/**
 * Drops candidate assignment allocations
 */
export const removeNomination = async (studentId) => {
  await delay(450);
  const index = nominatedStudents.findIndex((student) => student.id === studentId);

  if (index === -1) {
    return errorResponse("Student nomination record not found.");
  }

  const removedStudent = nominatedStudents[index];
  nominatedStudents.splice(index, 1);

  return successResponse(removedStudent, "Nomination removed successfully.");
};