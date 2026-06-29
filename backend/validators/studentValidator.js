// studentValidator.js

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim();
  }
  return input;
};

export const validateRequestBody = (req, res, next) => {
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeInput(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };
  
  if (req.body) {
    sanitizeObject(req.body);
  }
  
  next();
};

export const validateStudent = (req, res, next) => {
  const { enrollment_no, name, email, phone, semester, cgpa } = req.body;
  const errors = [];

  if (!enrollment_no) errors.push("enrollment_no is required");
  if (!name) errors.push("name is required");

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("Invalid email format");
  }

  if (phone && !/^\d{10}$/.test(phone)) {
    errors.push("Invalid phone format (must be 10 digits)");
  }

  if (cgpa !== undefined) {
    const cgpaNum = parseFloat(cgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      errors.push("CGPA must be a number between 0 and 10");
    }
  }

  if (semester !== undefined) {
    const semNum = parseInt(semester);
    if (isNaN(semNum) || semNum < 1 || semNum > 8) {
      errors.push("Semester must be between 1 and 8");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  next();
};

export const validateAcademicDetails = (req, res, next) => {
  const { tenth_percentage, twelfth_percentage, diploma_percentage } = req.body;
  const errors = [];

  const validatePercentage = (val, fieldName) => {
    if (val !== undefined && val !== null) {
      const num = parseFloat(val);
      if (isNaN(num) || num < 0 || num > 100) {
        errors.push(`${fieldName} must be between 0 and 100`);
      }
    }
  };

  validatePercentage(tenth_percentage, 'tenth_percentage');
  validatePercentage(twelfth_percentage, 'twelfth_percentage');
  validatePercentage(diploma_percentage, 'diploma_percentage');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  next();
};

export const validateSkill = (req, res, next) => {
  const { skill_name, skill_level } = req.body;
  const errors = [];

  if (req.method === 'POST' && !skill_name) {
    errors.push("skill_name is required");
  }
  
  if (skill_level) {
    const allowedLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
    if (!allowedLevels.includes(skill_level)) {
      errors.push(`skill_level must be one of: ${allowedLevels.join(", ")}`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  next();
};
