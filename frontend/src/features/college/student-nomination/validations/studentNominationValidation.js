/* =====================================
      PACKAGE VALIDATION
===================================== */

export const validatePackage = (packageValue) => {
  if (
    packageValue === undefined ||
    packageValue === null ||
    packageValue === ""
  ) {
    return "Package is required.";
  }

  const value = Number(packageValue);

  if (Number.isNaN(value)) {
    return "Package must be a valid number.";
  }

  if (value <= 0) {
    return "Package must be greater than 0.";
  }

  return "";
};

/* =====================================
      CONFIRMATION VALIDATION
===================================== */

export const validateConfirmation = (
  confirmationText,
  keyword
) => {
  return confirmationText.trim() === keyword.trim();
};

/* =====================================
      NOMINATION VALIDATION
===================================== */

export const validateNomination = (formData) => {
  const errors = {};

  if (!formData.company?.trim()) {
    errors.company = "Company is required.";
  }

  if (!formData.role?.trim()) {
    errors.role = "Role is required.";
  } else if (formData.role.trim().length < 3) {
    errors.role = "Role should contain at least 3 characters.";
  }

  const packageError = validatePackage(formData.package);

  if (packageError) {
    errors.package = packageError;
  }

  if (
    formData.remarks &&
    formData.remarks.trim().length > 500
  ) {
    errors.remarks =
      "Remarks cannot exceed 500 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/* =====================================
      EDIT NOMINATION VALIDATION
===================================== */

export const validateEditNomination = (
  formData,
  originalData
) => {
  const validation = validateNomination(formData);

  const hasChanges =
    formData.company.trim() !==
      (originalData.company || "").trim() ||
    formData.role.trim() !==
      (originalData.role || "").trim() ||
    formData.package.toString().trim() !==
      (originalData.package || "").toString().trim() ||
    formData.remarks.trim() !==
      (originalData.remarks || "").trim();

  if (!hasChanges) {
    validation.errors.form =
      "No changes detected.";
  }

  validation.isValid =
    Object.keys(validation.errors).length === 0;

  return validation;
};

/* =====================================
      ELIGIBILITY VALIDATION
===================================== */

/*
  Used when eligibility is calculated on the frontend.
  Current module receives pre-filtered eligible students.
*/

export const validateEligibility = (
  student,
  options = {}
) => {
  const {
    minimumCGPA = 7,
    requireDepartment = true,
    requireBatch = true,
    requireCourse = false,
    requireNoBacklogs = false,
  } = options;

  const reasons = [];

  if (!student) {
    reasons.push("Student not found.");
  } else {
    if (!student.name) {
      reasons.push("Student name is missing.");
    }

    if (
      requireDepartment &&
      !student.department
    ) {
      reasons.push("Department is missing.");
    }

    if (
      requireCourse &&
      !student.course
    ) {
      reasons.push("Course is missing.");
    }

    if (
      requireBatch &&
      !student.batch
    ) {
      reasons.push("Batch is missing.");
    }

    if (
      student.cgpa === undefined ||
      student.cgpa === null
    ) {
      reasons.push("CGPA is missing.");
    } else if (student.cgpa < minimumCGPA) {
      reasons.push(
        `Minimum CGPA required is ${minimumCGPA}.`
      );
    }

    if (
      requireNoBacklogs &&
      student.backlogs > 0
    ) {
      reasons.push(
        "Student has active backlogs."
      );
    }

    if (
      student.status &&
      student.status !== "Eligible"
    ) {
      reasons.push(
        "Student is not eligible for nomination."
      );
    }
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
  };
};

/* =====================================
      DUPLICATE NOMINATION
===================================== */

export const validateDuplicateNomination = (
  studentId,
  nominatedStudents = []
) => {
  const exists = nominatedStudents.some(
    (student) => student.id === studentId
  );

  return {
    isDuplicate: exists,
    message: exists
      ? "Student is already nominated."
      : "",
  };
};

/* =====================================
      SHORTLIST VALIDATION
===================================== */

export const validateShortlist = (student) => {
  const errors = {};

  if (!student) {
    errors.student =
      "Student details are required.";
  }

  if (!student.company) {
    errors.company =
      "Company must be assigned.";
  }

  if (!student.role) {
    errors.role =
      "Role must be assigned.";
  }

  if (
    student.status !== "Waiting" &&
    student.status !== "Shortlisted"
  ) {
    errors.status =
      "Student is not eligible for shortlisting.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};