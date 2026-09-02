import { pool } from "../config/db.js";

const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

const nullable = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return typeof value === "string" && value.trim() === "" ? null : value;
};

const integerValue = (value) => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) throw new Error("Invalid integer value");
  return parsed;
};

const decimalValue = (value) => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) throw new Error("Invalid numeric value");
  return parsed;
};

const profileSelect = `
  SELECT
    s.id, s.user_id, s.college_id, s.name, s.email, s.phone, s.enrollment_no,
    s.department, s.course, s.semester, s.batch, s.cgpa, s.address, s.linkedin,
    s.github, s.resume_status, s.profile_image,
    sp.bio, sp.gender, sp.date_of_birth, sp.avatar_url, sp.address_line1,
    sp.address_line2, sp.city, sp.state, sp.country, sp.pincode,
    sp.alternate_phone, sp.alternate_email, sp.profile_completeness,
    sp.created_at AS profile_created_at, sp.updated_at AS profile_updated_at,
    sad.institution_name, sad.department AS academic_department,
    sad.course AS academic_course, sad.degree, sad.semester AS academic_semester,
    sad.graduation_year, sad.cgpa AS academic_cgpa, sad.enrollment_number,
    sad.admission_year, sad.academic_email, sad.tenth_percentage,
    sad.twelfth_percentage, sad.backlogs, sad.active_backlogs,
    sr.id AS resume_id, sr.resume_url, sr.file_name AS resume_file_name,
    sr.file_size AS resume_file_size, sr.mime_type AS resume_mime_type,
    sr.uploaded_at AS resume_uploaded_at, sr.updated_at AS resume_updated_at,
    ssl.linkedin_url, ssl.github_url, ssl.portfolio_url, ssl.twitter_url, ssl.website_url
  FROM students s
  LEFT JOIN student_profiles sp ON sp.student_id = s.id
  LEFT JOIN student_academic_details sad ON sad.student_id = s.id
  LEFT JOIN student_resumes sr ON sr.student_id = s.id
  LEFT JOIN student_social_links ssl ON ssl.student_id = s.id
  WHERE s.id = $1
`;

const hydrate = async (studentId, client = pool) => {
  const { rows } = await client.query(profileSelect, [studentId]);
  if (!rows[0]) return null;

  const row = rows[0];

  const [skillsResult, certificationsResult, documentsResult] = await Promise.all([
    client.query(
      `SELECT id, skill_name, skill_level, category, created_at, updated_at
       FROM student_skills
       WHERE student_id = $1
       ORDER BY id`,
      [studentId],
    ),
    client.query(
      `SELECT id, name, issuing_organization, issue_date, expiry_date,
              credential_id, credential_url, created_at, updated_at
       FROM student_certifications
       WHERE student_id = $1
       ORDER BY issue_date DESC NULLS LAST, id DESC`,
      [studentId],
    ),
    client.query(
      `SELECT id, document_type, document_name, file_name, document_url,
              file_size, mime_type, uploaded_at
       FROM student_documents
       WHERE student_id = $1
       ORDER BY uploaded_at DESC NULLS LAST, id DESC`,
      [studentId],
    ),
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
      enrollmentNumber: row.enrollment_number || row.enrollment_no,
      institutionName: row.institution_name,
      department: row.academic_department || row.department,
      course: row.academic_course || row.course,
      degree: row.degree,
      semester: row.academic_semester ?? row.semester,
      batch: row.batch,
      graduationYear: row.graduation_year,
      admissionYear: row.admission_year,
      cgpa: row.academic_cgpa ?? row.cgpa,
      academicEmail: row.academic_email,
      tenthPercentage: row.tenth_percentage,
      twelfthPercentage: row.twelfth_percentage,
      backlogs: row.backlogs,
      activeBacklogs: row.active_backlogs,
    },
    skills: skillsResult.rows.map((row) => ({
      id: row.id,
      name: row.skill_name,
      level: row.skill_level,
      category: row.category,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })),
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
    certifications: certificationsResult.rows.map((item) => ({
      id: item.id,
      name: item.name,
      issuingOrganization: item.issuing_organization,
      issueDate: item.issue_date,
      expiryDate: item.expiry_date,
      credentialId: item.credential_id,
      credentialUrl: item.credential_url,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })),
    social: {
      linkedin: row.linkedin_url || row.linkedin,
      github: row.github_url || row.github,
      portfolio: row.portfolio_url,
      twitter: row.twitter_url,
      website: row.website_url,
    },
    documents: documentsResult.rows.map((item) => ({
      id: item.id,
      documentType: item.document_type,
      documentName: item.document_name,
      fileName: item.file_name,
      documentUrl: item.document_url,
      fileSize: item.file_size,
      mimeType: item.mime_type,
      uploadedAt: item.uploaded_at,
    })),
    profileCompleteness: row.profile_completeness ?? 0,
    createdAt: row.profile_created_at || null,
    updatedAt: row.profile_updated_at || null,
    placement: {
      resumeStatus: row.resume_status,
    },
  };
};

export const getStudentProfile = (studentId) => hydrate(studentId);

export const updateProfileCompleteness = async (studentId, completeness) => {
  await pool.query(
    `INSERT INTO student_profiles (student_id, profile_completeness)
     VALUES ($1, $2)
     ON CONFLICT (student_id) DO UPDATE SET
       profile_completeness = EXCLUDED.profile_completeness,
       updated_at = NOW()`,
    [studentId, completeness],
  );
};

export const updateStudentProfile = async (studentId, payload) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const student = await client.query(
      "SELECT id FROM students WHERE id = $1 FOR UPDATE",
      [studentId],
    );

    if (!student.rows[0]) {
      await client.query("ROLLBACK");
      return null;
    }

    const personal = payload.personal || {};
    const contact = payload.contact || {};
    const academic = payload.academic || {};
    const social = payload.social || {};

    const studentSet = [];
    const studentValues = [];

    const addStudentField = (column, value) => {
      studentSet.push(`${column} = $${studentValues.length + 1}`);
      studentValues.push(value);
    };

    if (has(personal, "name")) addStudentField("name", nullable(personal.name));
    if (has(personal, "phone")) addStudentField("phone", nullable(personal.phone));
    if (has(personal, "profileImage")) addStudentField("profile_image", nullable(personal.profileImage));
    if (has(contact, "address")) addStudentField("address", nullable(contact.address));
    if (has(social, "linkedin")) addStudentField("linkedin", nullable(social.linkedin));
    if (has(social, "github")) addStudentField("github", nullable(social.github));

    if (studentSet.length) {
      studentSet.push("updated_at = NOW()");
      studentValues.push(studentId);
      await client.query(
        `UPDATE students
         SET ${studentSet.join(", ")}
         WHERE id = $${studentValues.length}`,
        studentValues,
      );
    }

    const profileFields = [
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
    ].filter(([, value]) => value !== undefined);

    if (profileFields.length) {
      const columns = profileFields.map(([column]) => column);
      const values = profileFields.map(([, value]) => nullable(value));
      await client.query(
        `INSERT INTO student_profiles (student_id, ${columns.join(", ")})
         VALUES ($1, ${values.map((_, index) => `$${index + 2}`).join(", ")})
         ON CONFLICT (student_id) DO UPDATE SET
           ${columns.map((column) => `${column} = EXCLUDED.${column}`).join(", ")},
           updated_at = NOW()`,
        [studentId, ...values],
      );
    }

    const academicFields = [
      ["institution_name", academic.institutionName],
      ["department", academic.department],
      ["course", academic.course],
      ["degree", academic.degree],
      ["semester", integerValue(academic.semester)],
      ["graduation_year", integerValue(academic.graduationYear)],
      ["cgpa", decimalValue(academic.cgpa)],
      ["enrollment_number", academic.enrollmentNumber ?? academic.enrollmentNo],
      ["admission_year", integerValue(academic.admissionYear)],
      ["academic_email", academic.academicEmail],
      ["tenth_percentage", decimalValue(academic.tenthPercentage)],
      ["twelfth_percentage", decimalValue(academic.twelfthPercentage)],
      ["backlogs", integerValue(academic.backlogs)],
      ["active_backlogs", integerValue(academic.activeBacklogs)],
    ].filter(([, value]) => value !== undefined);

    if (academicFields.length) {
      const columns = academicFields.map(([column]) => column);
      const values = academicFields.map(([, value]) => nullable(value));

      await client.query(
        `INSERT INTO student_academic_details (student_id, ${columns.join(", ")})
         VALUES ($1, ${values.map((_, index) => `$${index + 2}`).join(", ")})
         ON CONFLICT (student_id) DO UPDATE SET
           ${columns.map((column) => `${column} = EXCLUDED.${column}`).join(", ")},
           updated_at = NOW()`,
        [studentId, ...values],
      );

      const canonicalSet = [];
      const canonicalValues = [];
      const addCanonicalField = (column, value) => {
        canonicalSet.push(`${column} = $${canonicalValues.length + 1}`);
        canonicalValues.push(value);
      };

      if (has(academic, "department")) addCanonicalField("department", nullable(academic.department));
      if (has(academic, "course")) addCanonicalField("course", nullable(academic.course));
      if (has(academic, "semester")) addCanonicalField("semester", integerValue(academic.semester));
      if (has(academic, "cgpa")) addCanonicalField("cgpa", decimalValue(academic.cgpa));
      if (has(academic, "enrollmentNo")) addCanonicalField("enrollment_no", nullable(academic.enrollmentNo));

      if (canonicalSet.length) {
        canonicalSet.push("updated_at = NOW()");
        canonicalValues.push(studentId);
        await client.query(
          `UPDATE students
           SET ${canonicalSet.join(", ")}
           WHERE id = $${canonicalValues.length}`,
          canonicalValues,
        );
      }
    }

    if (has(payload, "skills")) {
      await client.query("DELETE FROM student_skills WHERE student_id = $1", [studentId]);
      for (const skill of payload.skills) {
        await client.query(
          `INSERT INTO student_skills (student_id, skill_name, skill_level, category, updated_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [studentId, nullable(skill.name), nullable(skill.level), nullable(skill.category)],
        );
      }
    }

    if (has(payload, "social")) {
      await client.query(
        `INSERT INTO student_social_links
           (student_id, linkedin_url, github_url, portfolio_url, twitter_url, website_url, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (student_id) DO UPDATE SET
           linkedin_url = EXCLUDED.linkedin_url,
           github_url = EXCLUDED.github_url,
           portfolio_url = EXCLUDED.portfolio_url,
           twitter_url = EXCLUDED.twitter_url,
           website_url = EXCLUDED.website_url,
           updated_at = NOW()`,
        [studentId, nullable(social.linkedin), nullable(social.github), nullable(social.portfolio), nullable(social.twitter), nullable(social.website)],
      );
    }

    if (has(payload, "resume")) {
      if (payload.resume === null) {
        await client.query("DELETE FROM student_resumes WHERE student_id = $1", [studentId]);
        await client.query("UPDATE students SET resume_status = 'Not Uploaded', updated_at = NOW() WHERE id = $1", [studentId]);
      } else {
        await client.query(
          `INSERT INTO student_resumes
             (student_id, resume_url, file_name, file_size, mime_type, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW())
           ON CONFLICT (student_id) DO UPDATE SET
             resume_url = EXCLUDED.resume_url,
             file_name = EXCLUDED.file_name,
             file_size = EXCLUDED.file_size,
             mime_type = EXCLUDED.mime_type,
             updated_at = NOW()`,
          [studentId, payload.resume.url, nullable(payload.resume.fileName), payload.resume.fileSize ?? null, nullable(payload.resume.mimeType)],
        );
        await client.query("UPDATE students SET resume_status = 'Uploaded', updated_at = NOW() WHERE id = $1", [studentId]);
      }
    }

    if (has(payload, "certifications")) {
      await client.query("DELETE FROM student_certifications WHERE student_id = $1", [studentId]);
      for (const certification of payload.certifications) {
        await client.query(
          `INSERT INTO student_certifications
             (student_id, name, issuing_organization, issue_date, expiry_date, credential_id, credential_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            studentId,
            certification.name,
            nullable(certification.issuingOrganization),
            nullable(certification.issueDate),
            nullable(certification.expiryDate),
            nullable(certification.credentialId),
            nullable(certification.credentialUrl),
          ],
        );
      }
    }

    if (has(payload, "documents")) {
      await client.query("DELETE FROM student_documents WHERE student_id = $1", [studentId]);
      for (const document of payload.documents) {
        await client.query(
          `INSERT INTO student_documents
             (student_id, document_type, document_name, file_name, document_url, file_size, mime_type)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            studentId,
            nullable(document.documentType),
            nullable(document.documentName),
            nullable(document.fileName),
            nullable(document.documentUrl),
            document.fileSize ?? null,
            nullable(document.mimeType),
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
    return hydrate(studentId);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
