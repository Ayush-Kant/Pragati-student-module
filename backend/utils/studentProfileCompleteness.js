const isPresent = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
};

const sectionScore = (values, weight) => {
  const present = values.filter(isPresent).length;
  return Math.round((present / values.length) * weight);
};

export const calculateProfileCompleteness = (profile) => {
  if (!profile) return 0;

  const personal = profile.personal || {};
  const contact = profile.contact || {};
  const academic = profile.academic || {};
  const social = profile.social || {};

  let score = 0;

  score += sectionScore(
    [personal.name, personal.email, personal.phone, personal.dateOfBirth, personal.bio],
    20,
  );

  score += sectionScore(
    [
      contact.address || contact.addressLine1,
      contact.city,
      contact.state,
      contact.country,
      contact.pincode,
    ],
    15,
  );

  score += sectionScore(
    [
      academic.institutionName,
      academic.department,
      academic.course,
      academic.degree,
      academic.semester,
      academic.cgpa,
      academic.graduationYear,
    ],
    25,
  );

  score += profile.skills?.length ? 15 : 0;
  score += profile.resume?.url ? 10 : 0;
  score += profile.certifications?.length ? 5 : 0;

  score += social.linkedin || social.github || social.portfolio || social.twitter || social.website ? 10 : 0;

  return Math.max(0, Math.min(100, score));
};

export default calculateProfileCompleteness;
