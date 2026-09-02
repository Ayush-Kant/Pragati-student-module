const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const stringMax = (value, max) => typeof value === "string" && value.trim().length <= max;
const optionalString = (value, max) => value === null || value === undefined || stringMax(value, max);
const optionalEmail = (value) =>
  value === null || value === undefined || (typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
const optionalUrl = (value) =>
  value === null || value === undefined ||
  (typeof value === "string" && /^https?:\/\/\S+$/i.test(value));
const optionalDate = (value) =>
  value === null || value === undefined ||
  (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value));
const optionalPhone = (value) =>
  value === null || value === undefined ||
  (typeof value === "string" && /^[0-9+()\-\s]{7,20}$/.test(value));
const optionalNumber = (value, min, max) => {
  if (value === null || value === undefined || value === "") return true;
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max;
};

const fail = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validatePersonal = (personal) => {
  if (!isPlainObject(personal)) throw fail("personal must be an object");
  if (!optionalString(personal.name, 150)) throw fail("personal.name must be a valid string");
  if (!optionalPhone(personal.phone)) throw fail("personal.phone must be a valid phone number");
  if (!optionalDate(personal.dateOfBirth)) throw fail("personal.dateOfBirth must use YYYY-MM-DD format");
  for (const [field, max] of [["bio", 2000], ["gender", 30], ["avatarUrl", 1000], ["profileImage", 1000]]) {
    if (!optionalString(personal[field], max)) throw fail(`personal.${field} is invalid`);
  }
};

const validateContact = (contact) => {
  if (!isPlainObject(contact)) throw fail("contact must be an object");
  for (const [field, max] of [
    ["address", 1000], ["addressLine1", 255], ["addressLine2", 255],
    ["city", 100], ["state", 100], ["country", 100], ["pincode", 10],
  ]) {
    if (!optionalString(contact[field], max)) throw fail(`contact.${field} is invalid`);
  }
  if (!optionalPhone(contact.alternatePhone)) throw fail("contact.alternatePhone is invalid");
  if (!optionalEmail(contact.alternateEmail)) throw fail("contact.alternateEmail is invalid");
};

const validateAcademic = (academic) => {
  if (!isPlainObject(academic)) throw fail("academic must be an object");
  for (const [field, max] of [
    ["institutionName", 255], ["department", 150], ["course", 150],
    ["degree", 100], ["enrollmentNo", 100], ["enrollmentNumber", 100], ["academicEmail", 255], ["batch", 50],
  ]) {
    if (!optionalString(academic[field], max)) throw fail(`academic.${field} is invalid`);
  }
  if (!optionalEmail(academic.academicEmail)) throw fail("academic.academicEmail is invalid");
  if (!optionalNumber(academic.semester, 1, 20)) throw fail("academic.semester must be between 1 and 20");
  if (!optionalNumber(academic.graduationYear, 1900, 2200)) throw fail("academic.graduationYear is invalid");
  if (!optionalNumber(academic.admissionYear, 1900, 2200)) throw fail("academic.admissionYear is invalid");
  if (!optionalNumber(academic.cgpa, 0, 10)) throw fail("academic.cgpa must be between 0 and 10");
  if (!optionalNumber(academic.tenthPercentage, 0, 100)) throw fail("academic.tenthPercentage must be between 0 and 100");
  if (!optionalNumber(academic.twelfthPercentage, 0, 100)) throw fail("academic.twelfthPercentage must be between 0 and 100");
  if (!optionalNumber(academic.backlogs, 0, 1000)) throw fail("academic.backlogs is invalid");
  if (!optionalNumber(academic.activeBacklogs, 0, 1000)) throw fail("academic.activeBacklogs is invalid");
};

const validateSkills = (skills) => {
  if (!Array.isArray(skills) || skills.length > 100) throw fail("skills must be an array with at most 100 items");
  skills.forEach((skill, index) => {
    if (!isPlainObject(skill)) throw fail(`skills[${index}] must be an object`);
    if (typeof skill.name !== "string" || skill.name.trim().length === 0 || skill.name.length > 100) {
      throw fail(`skills[${index}].name is required and must be at most 100 characters`);
    }
    if (!optionalString(skill.level, 30)) throw fail(`skills[${index}].level is invalid`);
    if (!optionalString(skill.category, 100)) throw fail(`skills[${index}].category is invalid`);
  });
};

const validateResume = (resume) => {
  if (resume === null) return;
  if (!isPlainObject(resume)) throw fail("resume must be an object or null");
  if (typeof resume.url !== "string" || !/^https?:\/\/\S+$/i.test(resume.url)) {
    throw fail("resume.url must be a valid HTTP(S) URL");
  }
  if (!optionalString(resume.fileName, 255)) throw fail("resume.fileName is invalid");
  if (!optionalString(resume.mimeType, 150)) throw fail("resume.mimeType is invalid");
  if (!optionalNumber(resume.fileSize, 0, 100 * 1024 * 1024)) throw fail("resume.fileSize is invalid");
};

const validateCertifications = (certifications) => {
  if (!Array.isArray(certifications) || certifications.length > 100) {
    throw fail("certifications must be an array with at most 100 items");
  }
  certifications.forEach((item, index) => {
    if (!isPlainObject(item)) throw fail(`certifications[${index}] must be an object`);
    if (typeof item.name !== "string" || item.name.trim().length === 0 || item.name.length > 255) {
      throw fail(`certifications[${index}].name is required`);
    }
    for (const [field, max] of [["issuingOrganization", 255], ["credentialId", 255]]) {
      if (!optionalString(item[field], max)) throw fail(`certifications[${index}].${field} is invalid`);
    }
    if (!optionalDate(item.issueDate) || !optionalDate(item.expiryDate)) {
      throw fail(`certifications[${index}] dates must use YYYY-MM-DD format`);
    }
    if (!optionalUrl(item.credentialUrl)) throw fail(`certifications[${index}].credentialUrl is invalid`);
  });
};

const validateSocial = (social) => {
  if (!isPlainObject(social)) throw fail("social must be an object");
  for (const field of ["linkedin", "github", "portfolio", "twitter", "website"]) {
    if (!optionalUrl(social[field])) throw fail(`social.${field} must be a valid HTTP(S) URL`);
  }
};

const validateDocuments = (documents) => {
  if (!Array.isArray(documents) || documents.length > 50) {
    throw fail("documents must be an array with at most 50 items");
  }
  documents.forEach((item, index) => {
    if (!isPlainObject(item)) throw fail(`documents[${index}] must be an object`);
    for (const [field, max] of [["documentType", 100], ["documentName", 255], ["fileName", 255], ["mimeType", 150]]) {
      if (!optionalString(item[field], max)) throw fail(`documents[${index}].${field} is invalid`);
    }
    if (!optionalUrl(item.documentUrl)) throw fail(`documents[${index}].documentUrl is invalid`);
    if (!optionalNumber(item.fileSize, 0, 100 * 1024 * 1024)) throw fail(`documents[${index}].fileSize is invalid`);
  });
};

const validatePayload = (body, allowedSections) => {
  if (!isPlainObject(body)) throw fail("Request body must be a JSON object");

  const keys = Object.keys(body);
  const unexpected = keys.filter((key) => !allowedSections.includes(key));
  if (unexpected.length) throw fail(`Unsupported profile fields: ${unexpected.join(", ")}`);

  if (body.personal !== undefined) validatePersonal(body.personal);
  if (body.contact !== undefined) validateContact(body.contact);
  if (body.academic !== undefined) validateAcademic(body.academic);
  if (body.skills !== undefined) validateSkills(body.skills);
  if (body.resume !== undefined) validateResume(body.resume);
  if (body.certifications !== undefined) validateCertifications(body.certifications);
  if (body.social !== undefined) validateSocial(body.social);
  if (body.documents !== undefined) validateDocuments(body.documents);
};

export const validateStudentProfile = (req, res, next) => {
  try {
    validatePayload(req.body, ["personal", "contact", "academic", "skills", "resume", "certifications", "social", "documents"]);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateProfileSection = (section) => (req, res, next) => {
  try {
    validatePayload({ [section]: req.body }, [section]);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateResumePayload = (req, res, next) => {
  try {
    validateResume(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateSkillsPayload = (req, res, next) => {
  try {
    validateSkills(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateCertificationsPayload = (req, res, next) => {
  try {
    validateCertifications(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateDocumentsPayload = (req, res, next) => {
  try {
    validateDocuments(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
