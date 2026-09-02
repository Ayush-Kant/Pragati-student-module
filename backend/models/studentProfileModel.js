import { pool } from "../config/db.js";

const toNullable = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  return value;
};

const parseInteger = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseDecimal = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const mapCertification = (row) => ({
  id: row.id,
  name: row.name,
  issuingOrganization: row.issuing_organization,
  issueDate: row.issue_date,
  expiryDate: row.expiry_date,
  credentialId: row.credential_id,
  credentialUrl: row.credential_url,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapDocument = (row) => ({
  id: row.id,
  documentType: row.document_type,
  documentName: row.document_name,
  fileName: row.file_name,
  documentUrl: row.document_url,
  fileSize: row.file_size,
  mimeType: row.mime_type,
  uploadedAt: row.uploaded_at,
});

const getProfileQuery = `
  SELECT
    s.id,
    s.user_id,
    s.college_id,
    s.name,
    s.email,
    s.phone,
    s.enrollment_no,
    s.department,
    s.course,
    s.semester,
    s.batch,
    s.cgpa,
    s.address,
    s.linkedin,
    s.github,
    s.resume_status,
    s.profile_image,
    sp.bio,
    sp.gender,
    sp.date_of_birth,
    sp.avatar_url,
    sp.address_line1,
    sp.address_line2,
    sp.city,
    sp.state,
    sp.country,
    sp.pincode,
    sp.alternate_phone,
    sp.alternate_email,
    sp.profile_completeness,
    sp.created_at AS profile_created_at,
    sp.updated_at AS profile_updated_at,
    sad.institution_name,
    sad.department AS academic_department,
    sad.course AS academic_course,
    sad.degree,
    sad.semester AS academic_semester,
    sad.graduation_year,
    sad.cgpa AS academic_cgpa,
    sad.enrollment_number,
    sad.admission_year,
    sad.academic_email,
    sad.tenth_percentage,
    sad.twelfth_percentage,
    sad.backlogs,
    sad.active_backlogs,
    sr.id AS resume_id,
    sr.resume_url,
    sr.file_name AS resume_file_name,
    sr.file_size AS resume_file_size,
    sr.mime_type AS resume_mime_type,
    sr.uploaded_at AS resume_uploaded_at,
    sr.updated_at AS resume_updated_at,
    ssl.linkedin_url,
    ssl.github_url,
    ssl.portfolio_url,
    ssl.twitter_url,
    ssl.website_url
  FROM students s
  LEFT JOIN student_profiles sp ON sp.student_id = s.id
  LEFT JOIN student_academic_details sad ON sad.student_id = s.id
  LEFT JOIN student_resumes sr ON sr.student_id = s.id
  LEFT JOIN student_social_links ssl ON ssl.student_id = s.id
  WHERE s.id = $1
`;

const getSkills = async (client, studentId) => {
  const result = await client.query(
    `SELECT id, skill_name, skill_level, category, created_at, updated_at
     FROM student_skills
     WHERE student_id = $1
     ORDER BY id`,
    [studentId],
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.skill_name,
    level: row.skill_level,
    category: row.category,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

const getCertifications = async (client, studentId) => {
  const result = await client.query(
    `SELECT id, name, issuing_organization, issue_date, expiry_date,
            credential_id, credential_url, created_at, updated_at
     FROM student_certifications
     WHERE student_id = $1
     ORDER BY issue_date DESC NULLS LAST, id DESC`,
    [studentId],
  );

  return result.rows.map(mapCertification);
};

const getDocuments = async (client, studentId) => {
  const result = await client.query(
    `SELECT id, document_type, document_name, file_name, document_url,
            file_size, mime_type, uploaded_at
     FROM student_documents
     WHERE student_id = $1
     ORDER BY uploaded_at DESC NULLS LAST, id DESC`,
    [studentId],
  );

  return result.rows.map(mapDocument);
};

const hydrateProfile = async (client, studentId, baseRow = null) => {
  const result = baseRow ? { rows: [baseRow] } : await client.query(getProfileQuery, [studentId]);
  const row = result.rows[0];

  if (!row) return null;

  const [skills, certifications, documents] = await Promise.all([
    getSkills(client, studentId),
    getCertifications(client, studentId),
    getDocuments(client, studentId),
  ]);

  return {
    studentId: row.id,
    userId: row.user_id,
    collegeId: row.college_id,
    personal: {
      name: row.name,
      email: row.email,
      phone: row.phone,
      profileImage: row.profile_image,
      avatarUrl: row.avatar_url,
      bio: row.bio,
      gender: row.gender,
      dateOfBirth: row.date_of_birth,
    },
    contact: {
      address: row.address,
      addressLine1: row.address_line1,
      addressLine2: row.address_line2,
      city: row.city,
      state: row.state,
      country: row.country,
      pincode: row.pincode,
      alternatePhone: row.alternate_phone,
      alternateEmail: row.alternate_email,
    },
    academic: {
      enrollmentNo: row.enrollment_no,
      institutionName: row.institution_name,
      department: row.academic_department || row.department,
      course: row.academic_course || row.course,
      degree: row.degree,
      semester: row.academic_semester ?? row.semester,
      batch: row.batch,
      graduationYear: row.graduation_year,
      admissionYear: row.admission_year,
      cgpa: row.academic_cgpa ?? row.cgpa,
      enrollmentNumber: row.enrollment_number || row.enrollment_no,
      academicEmail: row.academic_email,
      tenthPercentage: row.tenth_percentage,
      twelfthPercentage: row.twelfth_percentage,
      backlogs: row.backlogs,
      activeBacklogs: row.active_backlogs,
    },
    skills,
    resume: row.resume_id
      ? {
          id: row.resume_id,
          url: row.resume_url,
          fileName: row.resume_file_name,
          fileSize: row.resume_file_size,
          mimeType: row.resume_mime_type,
          uploadedAt: row.resume_uploaded_at,
          updatedAt: row.resume_updated_at,
        }
      : null,
    certifications,
    social: {
      linkedin: row.linkedin_url || row.linkedin,
      github: row.github_url || row.github,
      portfolio: row.portfolio_url,
      twitter: row.twitter_url,
      website: row.website_url,
    },
    documents,
    profileCompleteness: row.profile_completeness ?? 0,
    createdAt: row.profile_created_at || null,
    updatedAt: row.profile_updated_at || null,
    placement: {
      resumeStatus: row.resume_status,
    },
  };
};

export const getStudentProfile = async (studentId, client = pool) => {
  return hydrateProfile(client, studentId);
};

export const updateStudentProfile = async (studentId, payload) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const studentCheck = await client.query("SELECT id FROM students WHERE id = $1 FOR UPDATE", [studentId]);
    if (!studentCheck.rows[0]) {
      await client.query("ROLLBACK");
      return null;
    }

    const personal = payload.personal || {};
    const contact = payload.contact || {};
    const academic = payload.academic || {};
    const social = payload.social || {};

    const studentUpdates = [];
    const studentValues = [];

    const addStudentField = (column, value) => {
      studentUpdates.push(`${column} = $${studentValues.length + 1}`);
      studentValues.push(value);
    };

    if (Object.prototype.hasOwnProperty.call(personal, "name")) {
      addStudentField("name", toNullable(personal.name));
    }
    if (Object.prototype.hasOwnProperty.call(personal, "phone")) {
      addStudentField("phone", toNullable(personal.phone));
    }
    if (Object.prototype.hasOwnProperty.call(contact, "address")) {
      addStudentField("address", toNullable(contact.address));
    }
    if (Object.prototype.hasOwnProperty.call(social, "linkedin")) {
      addStudentField("linkedin", toNullable(social.linkedin));
    }
    if (Object.prototype.hasOwnProperty.call(social, "github")) {
      addStudentField("github", toNullable(social.github));
    }

    if (studentUpdates.length > 0) {
      addStudentField("updated_at", new Date());
      studentValues.push(studentId);
      const idPlaceholder = `$${studentValues.length}`;
      await client.query(
        `UPDATE students
         SET ${studentUpdates.join(", ")}
         WHERE id = ${idPlaceholder}`,
        studentValues,
      );
    }

    const profileColumns = [
      ["bio", personal.bio],
      ["gender", personal.gender],
      ["date_of_birth", personal.dateOfBirth],
      ["avatar_url", personal.avatarUrl],
      ["address_line1", contact.addressLine1],
      ["address_line2", contact.addressLine2],
      ["city", contact.city],
      ["state", contact.state],
      ["country", contact.country],
      ["pincode", contact.pincode],
      ["alternate_phone", contact.alternatePhone],
      ["alternate_email", contact.alternateEmail],
    ];

    if (Object.prototype.hasOwnProperty.call(personal, "profileImage")) {
      profileColumns.push(["avatar_url", personal.profileImage]);
      profileColumns.push(["__profile_image", personal.profileImage]);
    }

    const definedProfileValues = profileColumns.filter(([, value]) => value !== undefined);

    if (definedProfileValues.length > 0) {
      const setters = [];
      const values = [studentId];

      for (const [column, value] of definedProfileValues) {
        if (column === "__profile_image") continue;
        setters.push(`${column} = $${values.length + 1}`);
        values.push(toNullable(value));
      }

      setters.push("updated_at = NOW()");

      await client.query(
        `INSERT INTO student_profiles (student_id)
         VALUES ($1)
         ON CONFLICT (student_id) DO NOTHING`,
        [studentId],
      );

      if (setters.length > 1) {
        await client.query(
          `UPDATE student_profiles
           SET ${setters.join(", ")}
           WHERE student_id = $1`,
          values,
        );
      }

      const profileImageValue = definedProfileValues.find(([column]) => column === "__profile_image")?.[1];
      if (profileImageValue !== undefined) {
        await client.query("UPDATE students SET profile_image = $1, updated_at = NOW() WHERE id = $2", [
          toNullable(profileImageValue),
          studentId,
        ]);
      }
    }

    const academicFields = [
      ["institution_name", academic.institutionName],
      ["department", academic.department],
      ["course", academic.course],
      ["degree", academic.degree],
      ["semester", parseInteger(academic.semester)],
      ["graduation_year", parseInteger(academic.graduationYear)],
      ["cgpa", parseDecimal(academic.cgpa)],
      ["enrollment_number", academic.enrollmentNumber || academic.enrollmentNo],
      ["admission_year", parseInteger(academic.admissionYear)],
      ["academic_email", academic.academicEmail],
      ["tenth_percentage", parseDecimal(academic.tenthPercentage)],
      ["twelfth_percentage", parseDecimal(academic.twelfthPercentage)],
      ["backlogs", parseInteger(academic.backlogs)],
      ["active_backlogs", parseInteger(academic.activeBacklogs)],
    ].filter(([, value]) => value !== undefined);

    if (academicFields.length > 0) {
      const columns = academicFields.map(([column]) => column);
      const values = academicFields.map(([, value]) => toNullable(value));
      const placeholders = values.map((_, index) => `$${index + 2}`);

      await client.query(
        `INSERT INTO student_academic_details (student_id, ${columns.join(", ")})
         VALUES ($1, ${placeholders.join(", ")})
         ON CONFLICT (student_id) DO UPDATE SET
           ${columns.map((column, index) => `${column} = EXCLUDED.${column}`).join(", ")},
           updated_at = NOW()`,
        [studentId, ...values],
      );

      const canonicalUpdates = [];
      const canonicalValues = [];
      const addCanonical = (column, value) => {
        canonicalUpdates.push(`${column} = $${canonicalValues.length + 1}`);
        canonicalValues.push(value);
      };

      if (Object.prototype.hasOwnProperty.call(academic, "department")) addCanonical("department", toNullable(academic.department));
      if (Object.prototype.hasOwnProperty.call(academic, "course")) addCanonical("course", toNullable(academic.course));
      if (Object.prototype.hasOwnProperty.call(academic, "semester")) addCanonical("semester", parseInteger(academic.semester));
      if (Object.prototype.hasOwnProperty.call(academic, "cgpa")) addCanonical("cgpa", parseDecimal(academic.cgpa));
      if (Object.prototype.hasOwnProperty.call(academic, "enrollmentNo")) addCanonical("enrollment_no", toNullable(academic.enrollmentNo));

      if (canonicalUpdates.length > 0) {
        canonicalUpdates.push("updated_at = NOW()");
        canonicalValues.push(studentId);
        await client.query(
          `UPDATE students SET ${canonicalUpdates.join(", ")} WHERE id = $${canonicalValues.length}`,
          canonicalValues,
        );
      }
    }

    if (Object.prototype.hasOwnProperty.call(payload, "skills")) {
      if (!Array.isArray(payload.skills)) throw new Error("skills must be an array");

      await client.query("DELETE FROM student_skills WHERE student_id = $1", [studentId]);

      for (const skill of payload.skills) {
        await client.query(
          `INSERT INTO student_skills (student_id, skill_name, skill_level, category, updated_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [
            studentId,
            toNullable(skill.name),
            toNullable(skill.level),
            toNullable(skill.category),
          ],
        );
      }
    }

    if (Object.prototype.hasOwnProperty.call(payload, "social")) {
      await client.query(
        `INSERT INTO student_social_links (
           student_id, linkedin_url, github_url, portfolio_url, twitter_url, website_url, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (student_id) DO UPDATE SET
           linkedin_url = EXCLUDED.linkedin_url,
           github_url = EXCLUDED.github_url,
           portfolio_url = EXCLUDED.portfolio_url,
           twitter_url = EXCLUDED.twitter_url,
           website_url = EXCLUDED.website_url,
           updated_at = NOW()`,
        [
          studentId,
          toNullable(social.linkedin),
          toNullable(social.github),
          toNullable(social.portfolio),
          toNullable(social.twitter),
          toNullable(social.website),
        ],
      );
    }

    if (Object.prototype.hasOwnProperty.call(payload, "resume")) {
      const resume = payload.resume;
      if (resume === null) {
        await client.query("DELETE FROM student_resumes WHERE student_id = $1", [studentId]);
        await client.query("UPDATE students SET resume_status = 'Not Uploaded', updated_at = NOW() WHERE id = $1", [studentId]);
      } else {
        await client.query(
          `INSERT INTO student_resumes (student_id, resume_url, file_name, file_size, mime_type, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW())
           ON CONFLICT (student_id) DO UPDATE SET
             resume_url = EXCLUDED.resume_url,
             file_name = EXCLUDED.file_name,
             file_size = EXCLUDED.file_size,
             mime_type = EXCLUDED.mime_type,
             updated_at = NOW()`,
          [
            studentId,
            resume.url,
            toNullable(resume.fileName),
            resume.fileSize ?? null,
            toNullable(resume.mimeType),
          ],
        );
        await client.query("UPDATE students SET resume_status = 'Uploaded', updated_at = NOW() WHERE id = $1", [studentId]);
      }
    }

    if (Object.prototype.hasOwnProperty.call(payload, "certifications")) {
      if (!Array.isArray(payload.certifications)) throw new Error("certifications must be an array");

      await client.query("DELETE FROM student_certifications WHERE student_id = $1", [studentId]);

      for (const certification of payload.certifications) {
        await client.query(
          `INSERT INTO student_certifications (
             student_id, name, issuing_organization, issue_date, expiry_date,
             credential_id, credential_url
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            studentId,
            certification.name,
            toNullable(certification.issuingOrganization),
            toNullable(certification.issueDate),
            toNullable(certification.expiryDate),
            toNullable(certification.credentialId),
            toNullable(certification.credentialUrl),
          ],
        );
      }
    }

    if (Object.prototype.hasOwnProperty.call(payload, "documents")) {
      if (!Array.isArray(payload.documents)) throw new Error("documents must be an array");

      await client.query("DELETE FROM student_documents WHERE student_id = $1", [studentId]);

      for (const document of payload.documents) {
        await client.query(
          `INSERT INTO student_documents (
             student_id, document_type, document_name, file_name, document_url,
             file_size, mime_type
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            studentId,
            toNullable(document.documentType),
            toNullable(document.documentName),
            toNullable(document.fileName),
            toNullable(document.documentUrl),
            document.fileSize ?? null,
            toNullable(document.mimeType),
          ],
        );
      }
    }

    await client.query(
      `INSERT INTO student_profiles (student_id)
       VALUES ($1)
       ON CONFLICT (student_id) DO NOTHING`,
      [studentId],
    );

    await client.query("COMMIT");

    return getStudentProfile(studentId);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
