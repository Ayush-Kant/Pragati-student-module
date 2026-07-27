import {
  assignments,
  assignmentApiResponse,
} from "../types/assignmentDummyData";

export const getAssignments = async () => {
  return assignmentApiResponse;
};

export const getAssignmentById = async (id) => {
  const assignment = assignments.find(
    (assignment) => assignment.id === Number(id)
  );

  return {
    success: !!assignment,
    data: assignment || null,
  };
};

export const submitAssignment = async (id, submissionData) => {
  return {
    success: true,
    message: "Assignment submitted successfully.",
    data: {
      assignmentId: Number(id),
      ...submissionData,
    },
  };
};

export const updateSubmission = async (id, submissionData) => {
  return {
    success: true,
    message: "Submission updated successfully.",
    data: {
      assignmentId: Number(id),
      ...submissionData,
    },
  };
};

export const getSubmissionHistory = async (id) => {
  const assignment = assignments.find(
    (assignment) => assignment.id === Number(id)
  );

  return {
    success: true,
    data: assignment?.submissionHistory || [],
  };
};


export const getFeedback = async (id) => {
  const assignment = assignments.find(
    (assignment) => assignment.id === Number(id)
  );

  return {
    success: true,
    data: assignment?.feedback || null,
  };
};


export const getGrades = async (id) => {
  const assignment = assignments.find(
    (assignment) => assignment.id === Number(id)
  );

  return {
    success: true,
    data: assignment?.grades || [],
  };
};