import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../config/db.js";
import { getMyProfile, getProfileCompleteness } from "./studentProfile.service.js";
import { resolveStudentId } from "../utils/studentProfileIdentity.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads/student-resumes");

const requireStep = (value) => {
  const step = Number(value);
  if (!Number.isInteger(step) || step < 1 || step > 4) {
    const error = new Error("stepNumber must be between 1 and 4");
    error.statusCode = 400;
    throw error;
  }
  return step;
};

const text = (value) => (value === null || value === undefined ? "" : String(value).trim());

const validateStep = (step, body) => {
  if (step === 1) {
    const fullName = text(body.fullName);
    if (fullName.length < 2 || fullName.length > 80 || !/^[A-Za-z][A-Za-z\s.'-]*$/.test(fullName)) {
      const error = new Error("Full name must be 2-80 characters");
      error.statusCode = 400;
      throw error;
    }
    if (body.phone && !/^[0-9+()\-\s]{7,20}$/.test(text(body.phone))) {
      const error = new Error("Invalid phone number");
      error.statusCode = 400;
      throw error;
    }
    if (body.city !== undefined && text(body.city).length > 100) {
      const error = new Error("City must be 100 characters or fewer");
      error.statusCode = 400;
      throw error;
    }
  }

  if (step === 2) {
    if (body.graduationYear !== undefined && body.graduationYear !== null && body.graduationYear !== "") {
      const year = Number(body.graduationYear);
      const currentYear = new Date().getUTCFullYear();
      if (!Number.isInteger(year) || year < currentYear - 1 || year > currentYear + 4) {
        const error = new Error("Invalid graduation year");
        error.statusCode = 400;
        throw error;
      }
    }
    if (body.cgpa !== undefined && body.cgpa !== null && body.cgpa !== "") {
      const cgpa = Number(body.cgpa);
      if (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 10) {
        const error = new Error("CGPA must be between 0 and 10");
        error.statusCode = 400;
        throw error;
      }
    }
  }

  if (step === 3) {
    if (!Array.isArray(body.skills) || body.skills.length > 20 || body.skills.some((skill) => text(skill).length < 1 || text(skill).length > 40)) {
      const error = new Error("Skills must be an array of up to 20 items; each skill must be 1-40 characters");
      error.statusCode = 400;
      throw error;
    }
  }
};

const recalculateProfile = async (studentId) => {
  const result = await getProfileCompleteness(studentId);
  const profile = await getMyProfile(studentId);
  return {
    completeness: Number(result?.completeness ?? profile?.profileCompleteness ?? 0),
    profile,
  };
};

export const getOnboardingState = async (user) => {
  const studentId = await resolveStudentId(user);
  const result = await pool.query(
    `SELECT s.onboarding_step, COALESCE(sp.profile_completeness, 0) AS profile_completeness
     FROM students s
     LEFT JOIN student_profiles sp ON sp.student_id = s.id
     WHERE s.id = $1`,
    [studentId],
  );

  if (!result.rows.length) {
    const error = new Error("Student profile not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    studentId,
    currentStep: Number(result.rows[0].onboarding_step || 1),
    profileCompleteness: Number(result.rows[0].profile_completeness || 0),
    profile: await getMyProfile(studentId),
  };
};

export const saveOnboardingStep = async (user, rawStep, body = {}, file = null) => {
  const studentId = await resolveStudentId(user);
  const step = requireStep(rawStep);
  validateStep(step, body);

  await pool.query(
    `INSERT INTO student_profiles (student_id)
     VALUES ($1)
     ON CONFLICT (student_id) DO NOTHING`,
    [studentId],
  );

  if (step === 1) {
    await pool.query(
      `UPDATE students
       SET name = $1,
           phone = $2,
           updated_at = NOW()
       WHERE id = $3`,
      [text(body.fullName), text(body.phone) || null, studentId],
    );

    await pool.query(
      `UPDATE student_profiles
       SET date_of_birth = $1,
           gender = $2,
           bio = $3,
           city = $4,
           updated_at = NOW()
       WHERE student_id = $5`,
      [body.dateOfBirth || null, text(body.gender) || null, text(body.bio) || null, text(body.city) || null, studentId],
    );
  }

  if (step === 2) {
    await pool.query(
      `INSERT INTO student_academic_details
        (student_id, institution_name, department, course, degree, semester, graduation_year, cgpa, admission_year, academic_email)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (student_id) DO UPDATE SET
         institution_name = EXCLUDED.institution_name,
         department = EXCLUDED.department,
         course = EXCLUDED.course,
         degree = EXCLUDED.degree,
         semester = EXCLUDED.semester,
         graduation_year = EXCLUDED.graduation_year,
         cgpa = EXCLUDED.cgpa,
         admission_year = EXCLUDED.admission_year,
         academic_email = EXCLUDED.academic_email,
         updated_at = NOW()`,
      [
        studentId,
        text(body.institutionName) || null,
        text(body.department) || null,
        text(body.course) || null,
        text(body.degree) || null,
        body.semester === "" || body.semester === undefined ? null : Number(body.semester),
        body.graduationYear === "" || body.graduationYear === undefined ? null : Number(body.graduationYear),
        body.cgpa === "" || body.cgpa === undefined ? null : Number(body.cgpa),
        body.admissionYear === "" || body.admissionYear === undefined ? null : Number(body.admissionYear),
        text(body.academicEmail) || null,
      ],
    );
  }

  if (step === 3) {
    const skills = body.skills.map((value) => text(value)).filter(Boolean);
    await pool.query("DELETE FROM student_skills WHERE student_id = $1", [studentId]);
    if (skills.length) {
      for (const skill of skills) {
        await pool.query(
          `INSERT INTO student_skills (student_id, skill_name, skill_level, category)
           VALUES ($1, $2, NULL, NULL)`,
          [studentId, skill],
        );
      }
    }

    await pool.query(
      `INSERT INTO student_social_links (student_id, linkedin_url, github_url)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id) DO UPDATE SET
         linkedin_url = EXCLUDED.linkedin_url,
         github_url = EXCLUDED.github_url,
         updated_at = NOW()`,
      [studentId, text(body.linkedinUrl) || null, text(body.githubUrl) || null],
    );
  }

  if (step === 4) {
    if (!file) {
      const error = new Error("Resume PDF is required for onboarding step 4");
      error.statusCode = 400;
      throw error;
    }

    await fs.mkdir(uploadDir, { recursive: true });
    const safeFilename = `${studentId}-${Date.now()}-${crypto.randomBytes(8).toString("hex")}.pdf`;
    const filePath = path.join(uploadDir, safeFilename);
    await fs.writeFile(filePath, file.buffer, { flag: "wx" });

    const baseUrl = process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 5000}`;
    const resumeUrl = `${baseUrl.replace(/\/$/, "")}/uploads/student-resumes/${safeFilename}`;

    await pool.query(
      `INSERT INTO student_resumes (student_id, resume_url, file_name, file_size, mime_type)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (student_id) DO UPDATE SET
         resume_url = EXCLUDED.resume_url,
         file_name = EXCLUDED.file_name,
         file_size = EXCLUDED.file_size,
         mime_type = EXCLUDED.mime_type,
         updated_at = NOW()`,
      [studentId, resumeUrl, file.originalname, file.size, file.mimetype],
    );

    await pool.query(
      `UPDATE students SET resume_status = 'Uploaded', updated_at = NOW() WHERE id = $1`,
      [studentId],
    );
  }

  const nextStep = Math.min(4, step + 1);
  if (step === 4) {
    await pool.query(
      `UPDATE students SET onboarding_step = 4, updated_at = NOW() WHERE id = $1`,
      [studentId],
    );
  } else {
    await pool.query(
      `UPDATE students SET onboarding_step = GREATEST(onboarding_step, $1), updated_at = NOW() WHERE id = $2`,
      [nextStep, studentId],
    );
  }

  const synced = await recalculateProfile(studentId);

  return {
    stepSaved: step,
    profileCompleteness: synced.completeness,
    nextStep: step === 4 ? 4 : nextStep,
    profile: synced.profile,
  };
};
