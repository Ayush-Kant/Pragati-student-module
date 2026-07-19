// ─── Student Validators ───────────────────────────────────────────────────────

export const sanitizeInput = (data) => {
  const sanitized = {};
  for (const key in data) {
    const val = data[key];
    if (typeof val === 'string') {
      sanitized[key] = val.trim() === '' ? null : val.trim();
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
};

export const validateStudent = (data) => {
  const errors = [];

  // Required fields
  if (!data.enrollmentNo) errors.push('Enrollment number is required');
  if (!data.name)         errors.push('Name is required');
  if (!data.email)        errors.push('Email is required');

  // Email format
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  // Phone format (10 digits)
  if (data.phone && !/^\d{10}$/.test(data.phone.replace(/[\s\-\+]/g, ''))) {
    errors.push('Phone must be a valid 10-digit number');
  }

  // CGPA validation (0 - 10)
  if (data.cgpa !== undefined && data.cgpa !== null) {
    const cgpa = parseFloat(data.cgpa);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      errors.push('CGPA must be between 0 and 10');
    }
  }

  // Semester validation (1 - 8)
  if (data.semester !== undefined && data.semester !== null) {
    const sem = parseInt(data.semester);
    if (isNaN(sem) || sem < 1 || sem > 8) {
      errors.push('Semester must be between 1 and 8');
    }
  }

  // Enrollment number format
  if (data.enrollmentNo && !/^[A-Za-z0-9]+$/.test(data.enrollmentNo)) {
    errors.push('Enrollment number must be alphanumeric');
  }

  return errors;
};

export const validateAcademicDetails = (data) => {
  const errors = [];

  if (data.tenthPercentage !== undefined && data.tenthPercentage !== null) {
    const pct = parseFloat(data.tenthPercentage);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      errors.push('10th percentage must be between 0 and 100');
    }
  }

  if (data.twelfthPercentage !== undefined && data.twelfthPercentage !== null) {
    const pct = parseFloat(data.twelfthPercentage);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      errors.push('12th percentage must be between 0 and 100');
    }
  }

  if (data.backlogs !== undefined && data.backlogs !== null) {
    if (parseInt(data.backlogs) < 0) {
      errors.push('Backlogs cannot be negative');
    }
  }

  return errors;
};

export const validateSkill = (data) => {
  const errors = [];
  if (!data.skillName || data.skillName.trim() === '') {
    errors.push('Skill name is required');
  }
  return errors;
};

export const validateRequestBody = (req, res, validatorFn) => {
  const errors = validatorFn(req.body);
  if (errors.length > 0) {
    res.status(400).json({ success: false, message: 'Validation failed', errors });
    return false;
  }
  return true;
};
