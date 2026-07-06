import {
  ALLOWED_FILE_TYPES,
  ERROR_MESSAGES,
  MAX_FILE_SIZE,
} from "../constants/assignmentConstants";

export const validateAssignment = (assignment) => {
  const errors = {};

  if (!assignment) {
    errors.general = ERROR_MESSAGES.SOMETHING_WENT_WRONG;
    return errors;
  }

  if (!assignment.title || !assignment.title.trim()) {
    errors.title = "Assignment title is required.";
  }

  if (!assignment.subject || !assignment.subject.trim()) {
    errors.subject = "Subject is required.";
  }

  if (!assignment.dueDate) {
    errors.dueDate = "Due date is required.";
  }

  return errors;
};

export const validateSubmission = (submissionData) => {
  const errors = {};

  if (!submissionData) {
    errors.general = ERROR_MESSAGES.SOMETHING_WENT_WRONG;
    return errors;
  }

  if (!submissionData.notes || !submissionData.notes.trim()) {
    errors.notes = "Submission notes are required.";
  }

  if (!submissionData.file && !submissionData.fileUrl) {
    errors.file = "Please upload a file before submitting.";
  }

  return errors;
};

export const validateUpload = (file) => {
  const errors = {};

  if (!file) {
    errors.file = "No file selected.";
    return errors;
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    errors.file = ERROR_MESSAGES.INVALID_FILE;
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.file = ERROR_MESSAGES.FILE_TOO_LARGE;
  }

  return errors;
};

export const validateFeedback = (feedback) => {
  const errors = {};

  if (!feedback || !feedback.comment || !feedback.comment.trim()) {
    errors.comment = "Feedback comment is required.";
  }

  return errors;
};
