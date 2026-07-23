export const validateEmail = (email) => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email address format";
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return "Phone number is required";
  const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s-]/g, ""))) {
    return "Phone number must be between 10 and 15 digits";
  }
  return null;
};

export const validateCGPA = (cgpa) => {
  const val = parseFloat(cgpa);
  if (isNaN(val)) return "CGPA must be a valid number";
  if (val < 0 || val > 10) return "CGPA must be between 0.00 and 10.00";
  return null;
};

export const validateAttendance = (attendance) => {
  if (attendance === undefined || attendance === null) return "Attendance is required";
  const cleanAttendance = String(attendance).replace("%", "").trim();
  const val = parseFloat(cleanAttendance);
  if (isNaN(val)) return "Attendance must be a valid number";
  if (val < 0 || val > 100) return "Attendance percentage must be between 0 and 100";
  return null;
};

export const validateProfile = (profile) => {
  const errors = {};
  
  if (!profile.name || !profile.name.trim()) errors.name = "Name is required";
  if (!profile.enrollmentNo || !profile.enrollmentNo.trim()) errors.enrollmentNo = "Enrollment number is required";
  if (!profile.department || !profile.department.trim()) errors.department = "Department is required";
  if (!profile.course || !profile.course.trim()) errors.course = "Course is required";
  
  const emailErr = validateEmail(profile.email);
  if (emailErr) errors.email = emailErr;
  
  const phoneErr = validatePhone(profile.phone);
  if (phoneErr) errors.phone = phoneErr;
  
  const cgpaErr = validateCGPA(profile.cgpa);
  if (cgpaErr) errors.cgpa = cgpaErr;
  
  const attendanceErr = validateAttendance(profile.attendance);
  if (attendanceErr) errors.attendance = attendanceErr;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAcademicData = (academic) => {
  const errors = {};
  if (!academic.semester) errors.semester = "Semester number is required";
  
  const sgpaErr = validateCGPA(academic.sgpa);
  if (sgpaErr) errors.sgpa = sgpaErr.replace("CGPA", "SGPA");
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSkills = (skills) => {
  const errors = {};
  if (!Array.isArray(skills) || skills.length === 0) {
    errors.skills = "At least one skill must be provided";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
