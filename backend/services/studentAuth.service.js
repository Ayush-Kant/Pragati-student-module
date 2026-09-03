import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { createFirebaseStudent, deleteFirebaseUser, verifyFirebaseIdToken } from "./firebaseAdmin.service.js";
import { syncStudentFirebaseProfile } from "./studentFirebaseProfile.service.js";

const ACCESS_TTL = process.env.STUDENT_JWT_EXPIRES_IN || "15m";
const REFRESH_TTL_DAYS = Number(process.env.STUDENT_REFRESH_TTL_DAYS || 7);

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const parseCollegeId = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const safeSyncFirebaseProfile = async (studentId, firebaseUid, data = {}) => {
  try {
    await syncStudentFirebaseProfile({ studentId, firebaseUid, ...data });
  } catch (error) {
    // Firebase Auth must remain available even when Firestore is temporarily unavailable.
    console.warn("[student-auth] Firebase profile sync deferred:", error.message);
  }
};

export const ensureStudentAuthSchema = async () => {
  await pool.query(`
    ALTER TABLE students
      ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128),
      ADD COLUMN IF NOT EXISTS onboarding_step INTEGER NOT NULL DEFAULT 1;
  `);
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_students_firebase_uid
      ON students(firebase_uid) WHERE firebase_uid IS NOT NULL;
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS student_sessions (
      id SERIAL PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      refresh_token_hash CHAR(64) NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_used_at TIMESTAMPTZ
    );
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_student_sessions_student
      ON student_sessions(student_id, expires_at DESC);
  `);
  await pool.query(`
    INSERT INTO student_profiles (student_id)
    SELECT s.id FROM students s
    LEFT JOIN student_profiles p ON p.student_id = s.id
    WHERE p.student_id IS NULL;
  `);
};

const buildAccessToken = (student) => jwt.sign(
  {
    id: student.userId,
    uid: student.userId,
    userId: student.authUuid,
    authUserId: student.authUserId,
    studentId: student.studentId,
    name: student.name,
    email: student.email,
    role: "student",
    firebaseUid: student.firebaseUid,
    onboardingStep: student.onboardingStep,
  },
  process.env.JWT_SECRET,
  { expiresIn: ACCESS_TTL },
);

const createRefreshSession = async (studentId) => {
  const token = crypto.randomBytes(48).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
  await pool.query(
    `INSERT INTO student_sessions (student_id, refresh_token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [studentId, tokenHash, expiresAt],
  );
  return { token, expiresAt };
};

const createPlatformStudentForFirebase = async (firebaseUser) => {
  const normalizedEmail = String(firebaseUser.email || "").trim().toLowerCase();
  const firebaseUid = String(firebaseUser.uid || "").trim();
  const displayName = String(firebaseUser.name || firebaseUser.displayName || normalizedEmail.split("@")[0]).trim().slice(0, 80);

  if (!normalizedEmail || !firebaseUid) {
    const error = new Error("Firebase account did not provide the required student identity");
    error.statusCode = 400;
    throw error;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existingStudentResult = await client.query(
      `SELECT s.id, s.user_id, s.college_id, s.name, s.email, s.status,
              s.firebase_uid, s.onboarding_step
       FROM students s
       WHERE s.firebase_uid = $1 OR LOWER(s.email) = LOWER($2)
       ORDER BY CASE WHEN s.firebase_uid = $1 THEN 0 ELSE 1 END, s.id
       LIMIT 1
       FOR UPDATE`,
      [firebaseUid, normalizedEmail],
    );
    const existingStudent = existingStudentResult.rows[0] || null;

    if (existingStudent?.status === "blocked") {
      const error = new Error("Account is suspended by admin");
      error.statusCode = 403;
      throw error;
    }

    let authUserId = null;
    let authUuid = null;

    if (existingStudent?.user_id) {
      const linkedAuth = await client.query(
        `SELECT au.id, au.uuid_id, au.role
         FROM users u
         JOIN auth_users au ON au.id = u.auth_user_id
         WHERE u.id = $1
         LIMIT 1`,
        [existingStudent.user_id],
      );
      authUserId = linkedAuth.rows[0]?.id || null;
      authUuid = linkedAuth.rows[0]?.uuid_id || null;
    }

    if (!authUserId) {
      const authLookup = await client.query(
        `SELECT id, uuid_id, role
         FROM auth_users
         WHERE LOWER(email) = LOWER($1)
         LIMIT 1
         FOR UPDATE`,
        [normalizedEmail],
      );

      if (authLookup.rows[0]) {
        if (authLookup.rows[0].role !== "student") {
          const error = new Error("This email is already linked to a non-student Pragati account");
          error.statusCode = 409;
          throw error;
        }
        authUserId = authLookup.rows[0].id;
        authUuid = authLookup.rows[0].uuid_id;
      } else {
        authUuid = crypto.randomUUID();
        const authResult = await client.query(
          `INSERT INTO auth_users (email, password_hash, role, uuid_id)
           VALUES ($1, $2, 'student', $3)
           RETURNING id, uuid_id`,
          [normalizedEmail, await bcrypt.hash(`${crypto.randomUUID()}-${crypto.randomBytes(16).toString("hex")}`, 12), authUuid],
        );
        authUserId = authResult.rows[0].id;
        authUuid = authResult.rows[0].uuid_id;
      }
    }

    let userId = existingStudent?.user_id || null;
    if (!userId) {
      const userLookup = await client.query(
        `SELECT id
         FROM users
         WHERE auth_user_id = $1 AND role = 'student'
         ORDER BY id
         LIMIT 1
         FOR UPDATE`,
        [authUserId],
      );
      userId = userLookup.rows[0]?.id || null;
    }

    if (!userId) {
      const userResult = await client.query(
        `INSERT INTO users (auth_user_id, email, role, created_at, phone, username)
         VALUES ($1, $2, 'student', NOW(), NULL, $3)
         RETURNING id`,
        [authUserId, normalizedEmail, normalizedEmail.split("@")[0]],
      );
      userId = userResult.rows[0].id;
    }

    let studentId = existingStudent?.id || null;
    if (studentId) {
      await client.query(
        `UPDATE students
         SET user_id = $1,
             email = $2,
             name = CASE WHEN NULLIF(name, '') IS NULL THEN $3 ELSE name END,
             firebase_uid = $4,
             onboarding_step = COALESCE(onboarding_step, 1),
             updated_at = NOW()
         WHERE id = $5`,
        [userId, normalizedEmail, displayName, firebaseUid, studentId],
      );
    } else {
      const studentResult = await client.query(
        `INSERT INTO students
          (user_id, college_id, name, email, status, firebase_uid, onboarding_step)
         VALUES ($1, NULL, $2, $3, 'pending', $4, 1)
         RETURNING id`,
        [userId, displayName, normalizedEmail, firebaseUid],
      );
      studentId = studentResult.rows[0].id;
    }

    await client.query(
      `INSERT INTO student_profiles (student_id)
       VALUES ($1)
       ON CONFLICT (student_id) DO NOTHING`,
      [studentId],
    );

    await client.query("COMMIT");

    return {
      studentId,
      userId,
      authUserId,
      authUuid,
      firebaseUid,
      email: normalizedEmail,
      name: displayName,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const loadStudentByIdToken = async (idToken) => {
  const firebaseUser = await verifyFirebaseIdToken(idToken);
  const result = await pool.query(
    `SELECT s.id AS student_id, s.user_id, s.email, s.name, s.status,
            s.firebase_uid, s.onboarding_step,
            COALESCE(sp.profile_completeness, 0) AS profile_completeness,
            au.id AS auth_user_id, au.uuid_id AS auth_uuid
     FROM students s
     JOIN users u ON u.id = s.user_id
     JOIN auth_users au ON au.id = u.auth_user_id
     LEFT JOIN student_profiles sp ON sp.student_id = s.id
     WHERE s.firebase_uid = $1 OR LOWER(s.email) = LOWER($2)
     ORDER BY CASE WHEN s.firebase_uid = $1 THEN 0 ELSE 1 END
     LIMIT 1`,
    [firebaseUser.uid, firebaseUser.email || ""],
  );

  let student = result.rows[0] || null;
  if (!student) {
    const provisioned = await createPlatformStudentForFirebase(firebaseUser);
    return {
      studentId: provisioned.studentId,
      userId: provisioned.userId,
      authUserId: provisioned.authUserId,
      authUuid: provisioned.authUuid,
      firebaseUid: provisioned.firebaseUid,
      email: provisioned.email,
      name: provisioned.name,
      onboardingStep: 1,
      profileCompleteness: 0,
    };
  }

  if (student.status === "blocked") {
    const error = new Error("Account is suspended by admin");
    error.statusCode = 403;
    throw error;
  }
  if (student.firebase_uid !== firebaseUser.uid) {
    await pool.query(
      `UPDATE students SET firebase_uid = $1, updated_at = NOW() WHERE id = $2`,
      [firebaseUser.uid, student.student_id],
    );
    student.firebase_uid = firebaseUser.uid;
  }

  return {
    studentId: student.student_id,
    userId: student.user_id,
    authUserId: student.auth_user_id,
    authUuid: student.auth_uuid,
    firebaseUid: student.firebase_uid,
    email: student.email,
    name: student.name,
    onboardingStep: student.onboarding_step || 1,
    profileCompleteness: Number(student.profile_completeness || 0),
  };
};

export const registerStudent = async ({ email, password, fullName, collegeId }) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const name = String(fullName || "").trim();
  const normalizedCollegeId = parseCollegeId(collegeId);
  if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    const error = new Error("Valid email is required"); error.statusCode = 400; throw error;
  }
  if (!name || name.length < 2 || name.length > 80) {
    const error = new Error("Full name must be 2-80 characters"); error.statusCode = 400; throw error;
  }
  if (String(password || "").length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    const error = new Error("Password must be at least 8 characters and include an uppercase letter, digit, and special character"); error.statusCode = 422; throw error;
  }
  if (!normalizedCollegeId) {
    const error = new Error("College ID is required for student registration"); error.statusCode = 400; throw error;
  }
  const college = await pool.query("SELECT id FROM colleges WHERE id = $1", [normalizedCollegeId]);
  if (!college.rows.length) {
    const error = new Error("Selected college was not found"); error.statusCode = 400; throw error;
  }
  const existing = await pool.query(`SELECT id FROM auth_users WHERE LOWER(email) = LOWER($1)`, [normalizedEmail]);
  if (existing.rows.length) {
    const error = new Error("Email already registered"); error.statusCode = 409; throw error;
  }

  const firebaseUser = await createFirebaseStudent({ email: normalizedEmail, password, fullName: name });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const authResult = await client.query(
      `INSERT INTO auth_users (email, password_hash, role, uuid_id)
       VALUES ($1, $2, 'student', $3) RETURNING id, uuid_id`,
      [normalizedEmail, await bcrypt.hash(String(password), 10), crypto.randomUUID()],
    );
    const authUserId = authResult.rows[0].id;
    const authUuid = authResult.rows[0].uuid_id;
    const userResult = await client.query(
      `INSERT INTO users (auth_user_id, email, role, created_at, phone, username)
       VALUES ($1, $2, 'student', NOW(), NULL, $3) RETURNING id`,
      [authUserId, normalizedEmail, normalizedEmail.split("@")[0]],
    );
    const userId = userResult.rows[0].id;
    const existingStudent = await client.query(
      `SELECT id, user_id, firebase_uid, status FROM students WHERE LOWER(email) = LOWER($1) FOR UPDATE`,
      [normalizedEmail],
    );
    let studentId;
    if (existingStudent.rows[0]) {
      const student = existingStudent.rows[0];
      if (student.user_id && Number(student.user_id) !== Number(userId)) {
        const error = new Error("A student profile with this email is already linked to another account"); error.statusCode = 409; throw error;
      }
      const linked = await client.query(
        `UPDATE students SET user_id = $1, college_id = $2, name = $3,
                firebase_uid = $4, onboarding_step = 1,
                status = CASE WHEN status = 'blocked' THEN status ELSE 'pending' END,
                updated_at = NOW() WHERE id = $5 RETURNING id`,
        [userId, normalizedCollegeId, name, firebaseUser.uid, student.id],
      );
      studentId = linked.rows[0].id;
    } else {
      const created = await client.query(
        `INSERT INTO students (user_id, college_id, name, email, status, firebase_uid, onboarding_step)
         VALUES ($1, $2, $3, $4, 'pending', $5, 1) RETURNING id`,
        [userId, normalizedCollegeId, name, normalizedEmail, firebaseUser.uid],
      );
      studentId = created.rows[0].id;
    }
    await client.query(`INSERT INTO student_profiles (student_id) VALUES ($1) ON CONFLICT (student_id) DO NOTHING`, [studentId]);
    await client.query("COMMIT");

    await safeSyncFirebaseProfile(studentId, firebaseUser.uid, {
      registration: {
        email: normalizedEmail,
        fullName: name,
        collegeId: normalizedCollegeId,
        completedAt: new Date().toISOString(),
      },
    });

    return { studentId, userId, authUuid, firebaseUid: firebaseUser.uid, onboardingStep: 1, profileCompleteness: 0 };
  } catch (error) {
    await client.query("ROLLBACK");
    try { await deleteFirebaseUser(firebaseUser.uid); } catch (cleanupError) { console.error("[student-auth] Firebase cleanup failed:", cleanupError.message); }
    throw error;
  } finally {
    client.release();
  }
};

export const loginStudentWithFirebase = async (idToken) => {
  const student = await loadStudentByIdToken(idToken);
  await safeSyncFirebaseProfile(student.studentId, student.firebaseUid, {
    onboarding: {
      currentStep: student.onboardingStep,
      profileCompleteness: student.profileCompleteness,
    },
  });
  const { token: refreshToken, expiresAt } = await createRefreshSession(student.studentId);
  return { accessToken: buildAccessToken(student), refreshToken, refreshExpiresAt: expiresAt, student };
};

export const refreshStudentSession = async (refreshToken) => {
  if (!refreshToken) { const error = new Error("Refresh token is required"); error.statusCode = 401; throw error; }
  const result = await pool.query(
    `SELECT ss.id AS session_id, s.id AS student_id, s.user_id, s.email, s.name,
            s.status, s.firebase_uid, s.onboarding_step,
            au.id AS auth_user_id, au.uuid_id AS auth_uuid,
            COALESCE(sp.profile_completeness, 0) AS profile_completeness
     FROM student_sessions ss
     JOIN students s ON s.id = ss.student_id
     JOIN users u ON u.id = s.user_id
     JOIN auth_users au ON au.id = u.auth_user_id
     LEFT JOIN student_profiles sp ON sp.student_id = s.id
     WHERE ss.refresh_token_hash = $1 AND ss.revoked_at IS NULL AND ss.expires_at > NOW()`,
    [hashToken(refreshToken)],
  );
  if (!result.rows.length) { const error = new Error("Refresh token expired or revoked"); error.statusCode = 401; throw error; }
  const row = result.rows[0];
  if (row.status === "blocked") { const error = new Error("Account is suspended by admin"); error.statusCode = 403; throw error; }
  await pool.query("UPDATE student_sessions SET last_used_at = NOW() WHERE id = $1", [row.session_id]);
  const student = {
    studentId: row.student_id, userId: row.user_id, authUserId: row.auth_user_id,
    authUuid: row.auth_uuid, firebaseUid: row.firebase_uid, email: row.email,
    name: row.name, onboardingStep: row.onboarding_step || 1,
    profileCompleteness: Number(row.profile_completeness || 0),
  };
  await safeSyncFirebaseProfile(student.studentId, student.firebaseUid, {
    onboarding: {
      currentStep: student.onboardingStep,
      profileCompleteness: student.profileCompleteness,
    },
  });
  return { accessToken: buildAccessToken(student), student };
};

export const logoutStudent = async (refreshToken) => {
  if (!refreshToken) return;
  await pool.query(`UPDATE student_sessions SET revoked_at = NOW() WHERE refresh_token_hash = $1 AND revoked_at IS NULL`, [hashToken(refreshToken)]);
};
