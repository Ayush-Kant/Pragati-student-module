import { CGPA_MAX, CGPA_MIN, GENDER_OPTIONS, VALIDATION_MESSAGES } from '../constants/studentProfileConstants';

/**
 * Checks if the provided email has a valid format.
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email is valid, false otherwise
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

/**
 * Checks if the provided phone number has a valid format.
 * Accepts 10 digits with optional +91 country code.
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if the phone number is valid, false otherwise
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return (digits.length === 10) || (digits.length === 12 && digits.startsWith('91'));
};

/**
 * Checks if the provided URL is valid.
 * @param {string} url - The URL to validate
 * @returns {boolean} True if the URL is valid, false otherwise
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Checks if the provided date string represents a valid date.
 * @param {string} date - The date string to validate
 * @returns {boolean} True if the date is valid, false otherwise
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
};

/**
 * Checks if the person is 18 years or older based on their date of birth.
 * @param {string} dateOfBirth - The date of birth string
 * @returns {boolean} True if the person is 18 or older, false otherwise
 */
export const isOver18 = (dateOfBirth) => {
  if (!dateOfBirth) return false;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 18;
};

/**
 * Validates personal information fields.
 * @param {Object} data - The personal info data object
 * @param {string} data.fullName - Full name (required, 2-100 chars)
 * @param {string} data.dateOfBirth - Date of birth (required, valid date)
 * @param {string} data.gender - Gender (required, one of Male/Female/Other/Prefer not to say)
 * @param {string} [data.bio] - Bio (optional, max 500 chars)
 * @returns {{isValid: boolean, errors: string[]}} Validation result with error messages
 */
export const validatePersonalInfo = (data) => {
  const errors = [];

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push(VALIDATION_MESSAGES.REQUIRED);
  } else if (data.fullName.trim().length > 100) {
    errors.push('Full name must not exceed 100 characters');
  }

  if (!data.dateOfBirth || !isValidDate(data.dateOfBirth)) {
    errors.push('Valid date of birth is required');
  } else if (!isOver18(data.dateOfBirth)) {
    errors.push('Must be at least 18 years old');
  }

  if (!data.gender || !GENDER_OPTIONS.includes(data.gender)) {
    errors.push('Valid gender selection is required');
  }

  if (data.bio && data.bio.length > 500) {
    errors.push('Bio must not exceed 500 characters');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates contact information fields.
 * @param {Object} data - The contact info data object
 * @param {string} data.email - Email address (required, valid format)
 * @param {string} data.phone - Phone number (required, 10 digits with optional +91)
 * @returns {{isValid: boolean, errors: string[]}} Validation result with error messages
 */
export const validateContactInfo = (data) => {
  const errors = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push(VALIDATION_MESSAGES.EMAIL);
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push(VALIDATION_MESSAGES.PHONE);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates address fields.
 * @param {Object} data - The address data object
 * @param {string} data.street - Street address (required, min 5 chars)
 * @param {string} data.city - City (required, min 2 chars)
 * @param {string} data.state - State (required, min 2 chars)
 * @param {string} data.country - Country (required, min 2 chars)
 * @param {string} data.pincode - Pincode (required, 6 digits)
 * @returns {{isValid: boolean, errors: string[]}} Validation result with error messages
 */
export const validateAddress = (data) => {
  const errors = [];

  if (!data.street || data.street.trim().length < 5) {
    errors.push('Street address is required (min 5 characters)');
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.push('City is required (min 2 characters)');
  }

  if (!data.state || data.state.trim().length < 2) {
    errors.push('State is required (min 2 characters)');
  }

  if (!data.country || data.country.trim().length < 2) {
    errors.push('Country is required (min 2 characters)');
  }

  if (!data.pincode || !/^\d{6}$/.test(data.pincode.trim())) {
    errors.push('Valid 6-digit pincode is required');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates emergency contact fields.
 * @param {Object} data - The emergency contact data object
 * @param {string} data.name - Contact name (required, min 2 chars)
 * @param {string} data.relationship - Relationship (required, min 2 chars)
 * @param {string} data.phone - Phone number (required, valid format)
 * @returns {{isValid: boolean, errors: string[]}} Validation result with error messages
 */
export const validateEmergencyContact = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Emergency contact name is required (min 2 characters)');
  }

  if (!data.relationship || data.relationship.trim().length < 2) {
    errors.push('Relationship is required (min 2 characters)');
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push(VALIDATION_MESSAGES.PHONE);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates academic information fields.
 * @param {Object} data - The academic info data object
 * @param {string} data.department - Department (required)
 * @param {string} data.course - Course (required)
 * @param {number} data.semester - Semester (required, 1-10)
 * @param {number} data.cgpa - CGPA (required, 0-10)
 * @returns {{isValid: boolean, errors: string[]}} Validation result with error messages
 */
export const validateAcademicInfo = (data) => {
  const errors = [];

  if (!data.department || data.department.trim() === '') {
    errors.push(VALIDATION_MESSAGES.REQUIRED);
  }

  if (!data.course || data.course.trim() === '') {
    errors.push(VALIDATION_MESSAGES.REQUIRED);
  }

  if (data.semester === undefined || data.semester === null || isNaN(Number(data.semester))) {
    errors.push('Valid semester is required');
  } else {
    const semester = Number(data.semester);
    if (semester < 1 || semester > 10) {
      errors.push('Semester must be between 1 and 10');
    }
  }

  if (data.cgpa === undefined || data.cgpa === null || data.cgpa === '') {
    errors.push(VALIDATION_MESSAGES.REQUIRED);
  } else {
    const cgpa = parseFloat(data.cgpa);
    if (isNaN(cgpa) || cgpa < CGPA_MIN || cgpa > CGPA_MAX) {
      errors.push(VALIDATION_MESSAGES.CGPA);
    }
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates a skills array.
 * @param {string[]} skills - Array of skill strings
 * @returns {{isValid: boolean, errors: string[]}} Validation result with error messages
 */
export const validateSkills = (skills) => {
  const errors = [];

  if (!Array.isArray(skills)) {
    errors.push('Skills must be an array');
    return { isValid: false, errors };
  }

  if (skills.length === 0) {
    errors.push('At least one skill is required');
  }

  if (skills.length > 20) {
    errors.push('Maximum 20 skills allowed');
  }

  const invalidSkills = skills.filter(
    (skill) => typeof skill !== 'string' || skill.trim().length < 2 || skill.trim().length > 50
  );
  if (invalidSkills.length > 0) {
    errors.push('Each skill must be a string between 2 and 50 characters');
  }

  const emptySkills = skills.filter((skill) => typeof skill === 'string' && skill.trim() === '');
  if (emptySkills.length > 0) {
    errors.push('Skills must not contain empty strings');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates a languages array.
 * @param {string[]} languages - Array of language strings
 * @returns {{isValid: boolean, errors: string[]}} Validation result with error messages
 */
export const validateLanguages = (languages) => {
  const errors = [];

  if (!Array.isArray(languages)) {
    errors.push('Languages must be an array');
    return { isValid: false, errors };
  }

  if (languages.length === 0) {
    errors.push('At least one language is required');
  }

  if (languages.length > 10) {
    errors.push('Maximum 10 languages allowed');
  }

  const invalidLanguages = languages.filter(
    (lang) => typeof lang !== 'string' || lang.trim().length < 2 || lang.trim().length > 30
  );
  if (invalidLanguages.length > 0) {
    errors.push('Each language must be a string between 2 and 30 characters');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates a certifications array.
 * @param {Object[]} certifications - Array of certification objects
 * @param {string} certifications[].name - Certification name (required)
 * @param {string} certifications[].issuer - Issuer name (required)
 * @param {number} certifications[].year - Year issued (required, 1900-2026)
 * @returns {{isValid: boolean, errors: string[]}} Validation result with error messages
 */
export const validateCertifications = (certifications) => {
  const errors = [];

  if (!Array.isArray(certifications)) {
    errors.push('Certifications must be an array');
    return { isValid: false, errors };
  }

  certifications.forEach((cert, index) => {
    if (!cert.name || cert.name.trim() === '') {
      errors.push(`Certification ${index + 1}: name is required`);
    }
    if (!cert.issuer || cert.issuer.trim() === '') {
      errors.push(`Certification ${index + 1}: issuer is required`);
    }
    if (cert.year === undefined || cert.year === null || isNaN(Number(cert.year))) {
      errors.push(`Certification ${index + 1}: valid year is required`);
    } else {
      const year = Number(cert.year);
      if (year < 1900 || year > 2026) {
        errors.push(`Certification ${index + 1}: year must be between 1900 and 2026`);
      }
    }
  });

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates social links fields.
 * @param {Object} links - The social links object
 * @param {string} [links.linkedIn] - LinkedIn URL (optional, valid URL if provided)
 * @param {string} [links.github] - GitHub URL (optional, valid URL if provided)
 * @param {string} [links.portfolio] - Portfolio URL (optional, valid URL if provided)
 * @returns {{isValid: boolean, errors: string[]}} Validation result with error messages
 */
export const validateSocialLinks = (links) => {
  const errors = [];

  if (links.linkedIn && !isValidUrl(links.linkedIn)) {
    errors.push(VALIDATION_MESSAGES.URL);
  }

  if (links.github && !isValidUrl(links.github)) {
    errors.push(VALIDATION_MESSAGES.URL);
  }

  if (links.portfolio && !isValidUrl(links.portfolio)) {
    errors.push(VALIDATION_MESSAGES.URL);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates the entire student profile by running all individual validations.
 * @param {Object} data - The complete profile data object
 * @returns {{isValid: boolean, errors: Object.<string, string[]>}} Validation result with errors grouped by section
 */
export const validateProfile = (data) => {
  const errors = {};

  const personalResult = validatePersonalInfo(data);
  if (!personalResult.isValid) {
    errors.personal = personalResult.errors;
  }

  const contactResult = validateContactInfo(data);
  if (!contactResult.isValid) {
    errors.contact = contactResult.errors;
  }

  const addressResult = validateAddress(data.address || {});
  if (!addressResult.isValid) {
    errors.address = addressResult.errors;
  }

  const emergencyResult = validateEmergencyContact(data.emergencyContact || {});
  if (!emergencyResult.isValid) {
    errors.emergencyContact = emergencyResult.errors;
  }

  const academicResult = validateAcademicInfo(data);
  if (!academicResult.isValid) {
    errors.academic = academicResult.errors;
  }

  const skillsResult = validateSkills(data.skills || []);
  if (!skillsResult.isValid) {
    errors.skills = skillsResult.errors;
  }

  const languagesResult = validateLanguages(data.languages || []);
  if (!languagesResult.isValid) {
    errors.languages = languagesResult.errors;
  }

  const certificationsResult = validateCertifications(data.certifications || []);
  if (!certificationsResult.isValid) {
    errors.certifications = certificationsResult.errors;
  }

  const socialResult = validateSocialLinks(data.socialLinks || {});
  if (!socialResult.isValid) {
    errors.social = socialResult.errors;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};