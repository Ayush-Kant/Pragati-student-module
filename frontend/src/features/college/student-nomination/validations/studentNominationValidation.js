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

export const validateConfirmation = (confirmationText, keyword) => {
  if (!confirmationText || !keyword) return false;
  return confirmationText.trim().toLowerCase() === keyword.trim().toLowerCase();
};

/* =====================================
      NOMINATION VALIDATION
===================================== */

export const validateNomination = (formData) => {
  const errors = {};

  // Validate Required IDs matching backend schema (studentId, companyId, driveId)
  if (!formData.studentId) {
    errors.studentId = "Student selection is required.";
  }

  if (!formData.companyId && !formData.company?.trim()) {
    errors.company = "Company selection is required.";
  }

  if (!formData.driveId) {
    errors.driveId = "Placement drive is required.";
  }

  // Validate optional role if provided in UI
  if (formData.role && formData.role.trim().length < 3) {
    errors.role = "Role should contain at least 3 characters.";
  }

  // Validate optional package if provided
  if (formData.package !== undefined && formData.package !== null && formData.package !== "") {
    const packageError = validatePackage(formData.package);
    if (packageError) {
      errors.package = packageError;
    }
  }

  // Validate remarks length
  if (formData.remarks && formData.remarks.trim().length > 500) {
    errors.remarks = "Remarks cannot exceed 500 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/* =====================================
      EDIT NOMINATION VALIDATION
===================================== */

export const validateEditNomination = (formData, originalData = {}) => {
  const validation = validateNomination(formData);

  const hasChanges =
    (formData.companyId || formData.company || "").toString().trim() !==
      (originalData.companyId || originalData.company || "").toString().trim() ||
    (formData.role || "").trim() !== (originalData.role || "").trim() ||
    (formData.package || "").toString().trim() !==
      (originalData.package || "").toString().trim() ||
    (formData.remarks || "").trim() !== (originalData.remarks || "").trim() ||
    (formData.status || "").trim() !== (originalData.status || "").trim();

  if (!hasChanges) {
    validation.errors.form = "No changes detected.";
  }

  validation.isValid = Object.keys(validation.errors).length === 0;

  return validation;
};

/* =====================================
      ELIGIBILITY VALIDATION
===================================== */

export const validateEligibility = (student, options = {}) => {
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
    if (!student.name && !student.first_name) {
      reasons.push("Student name is missing.");
    }

    if (requireDepartment && !student.department) {
      reasons.push("Department is missing.");
    }

    if (requireCourse && !student.course) {
      reasons.push("Course is missing.");
    }

    if (requireBatch && !student.batch) {
      reasons.push("Batch is missing.");
    }

    if (student.cgpa === undefined || student.cgpa === null) {
      reasons.push("CGPA is missing.");
    } else if (Number(student.cgpa) < minimumCGPA) {
      reasons.push(`Minimum CGPA required is ${minimumCGPA}.`);
    }

    if (requireNoBacklogs && student.backlogs > 0) {
      reasons.push("Student has active backlogs.");
    }

    if (
      student.status &&
      student.status.toUpperCase() !== "ELIGIBLE" &&
      student.status.toUpperCase() !== "APPROVED"
    ) {
      reasons.push("Student is not eligible for nomination.");
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

export const validateDuplicateNomination = (studentId, nominatedStudents = []) => {
  const exists = nominatedStudents.some(
    (student) =>
      student.student_id === Number(studentId) || student.id === Number(studentId)
  );

  return {
    isDuplicate: exists,
    message: exists ? "Student is already nominated." : "",
  };
};

/* =====================================
      SHORTLIST VALIDATION
===================================== */

export const validateShortlist = (student) => {
  const errors = {};

  if (!student) {
    errors.student = "Student details are required.";
  } else {
    if (!student.company && !student.company_id) {
      errors.company = "Company must be assigned.";
    }

    const uppercaseStatus = (student.status || "").toUpperCase();
    const validStatuses = ["WAITING", "WAITLISTED", "SHORTLISTED", "PENDING"];

    if (!validStatuses.includes(uppercaseStatus)) {
      errors.status = "Student status is not eligible for shortlisting.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};