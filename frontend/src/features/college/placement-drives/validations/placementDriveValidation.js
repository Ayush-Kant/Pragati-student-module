/**
 * Validate Placement Drive Form
 */
export const validatePlacementDrive = (drive) => {
    const errors = {};
  
    if (!drive.company?.trim()) {
      errors.company = "Company name is required.";
    }
  
    if (!drive.role?.trim()) {
      errors.role = "Job role is required.";
    }
  
    if (!drive.package?.trim()) {
      errors.package = "Package is required.";
    }
  
    if (!drive.driveDate) {
      errors.driveDate = "Drive date is required.";
    }
  
    if (!drive.deadline) {
      errors.deadline = "Application deadline is required.";
    } else if (
      drive.driveDate &&
      new Date(drive.deadline) > new Date(drive.driveDate)
    ) {
      errors.deadline =
        "Application deadline cannot be after the drive date.";
    }
  
    return errors;
  };
  
  /**
   * Validate Eligibility Criteria
   */
  export const validateEligibility = (eligibility) => {
    const errors = {};
  
    if (!eligibility.departments?.length) {
      errors.departments = "Select at least one department.";
    }
  
    if (!eligibility.courses?.length) {
      errors.courses = "Select at least one course.";
    }
  
    if (!eligibility.batches?.length) {
      errors.batches = "Select at least one batch.";
    }
  
    if (
      eligibility.cgpa === "" ||
      eligibility.cgpa === null ||
      eligibility.cgpa === undefined
    ) {
      errors.cgpa = "Minimum CGPA is required.";
    } else if (
      eligibility.cgpa < 0 ||
      eligibility.cgpa > 10
    ) {
      errors.cgpa = "CGPA must be between 0 and 10.";
    }
  
    return errors;
  };
  
  /**
   * Validate Schedule
   */
  export const validateSchedule = (schedule) => {
    const errors = {};
  
    if (!schedule.driveDate) {
      errors.driveDate = "Drive date is required.";
    }
  
    if (!schedule.deadline) {
      errors.deadline = "Application deadline is required.";
    }
  
    if (
      schedule.driveDate &&
      schedule.deadline &&
      new Date(schedule.deadline) > new Date(schedule.driveDate)
    ) {
      errors.deadline =
        "Deadline cannot be after the drive date.";
    }
  
    return errors;
  };