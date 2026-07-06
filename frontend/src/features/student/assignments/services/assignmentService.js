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

export const getSubmissionHistory = async () => {
  return {
    success: true,
    data: [],
  };
};

export const getFeedback = async () => {
  return {
    success: true,
    data: null,
  };
};

export const getGrades = async () => {
  return {
    success: true,
    data: [],
  };
};