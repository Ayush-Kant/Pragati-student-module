import { getFirebaseFirestore } from "./firebaseAdmin.service.js";
import { pool } from "../config/db.js";

const collection = () => getFirebaseFirestore().collection("studentProfiles");

const safeTimestamp = () => new Date().toISOString();

export const syncStudentFirebaseProfile = async ({ studentId, firebaseUid, registration = {}, onboarding = {}, profile = null }) => {
  if (!firebaseUid) return { synced: false, reason: "firebase_uid_missing" };

  const studentResult = await pool.query(
    `SELECT s.id, s.user_id, s.college_id, s.name, s.email, s.phone, s.status,
            s.firebase_uid, s.onboarding_step, s.profile_verified,
            COALESCE(sp.profile_completeness, 0) AS profile_completeness
     FROM students s
     LEFT JOIN student_profiles sp ON sp.student_id = s.id
     WHERE s.id = $1
     LIMIT 1`,
    [studentId],
  );

  const student = studentResult.rows[0];
  if (!student) return { synced: false, reason: "student_missing" };

  const ref = collection().doc(String(firebaseUid));
  await ref.set({
    version: 1,
    firebaseUid: String(firebaseUid),
    auth: {
      email: student.email,
      name: student.name,
      provider: registration.provider || onboarding.provider || "firebase",
      lastSyncedAt: safeTimestamp(),
    },
    registration: {
      ...registration,
      studentId: student.id,
      collegeId: student.college_id ?? registration.collegeId ?? null,
      email: registration.email || student.email,
      fullName: registration.fullName || student.name,
      completedAt: registration.completedAt || null,
    },
    onboarding: {
      ...onboarding,
      currentStep: Number(student.onboarding_step || onboarding.currentStep || 1),
      completed: Number(student.onboarding_step || 1) >= 4,
      profileCompleteness: Number(student.profile_completeness || onboarding.profileCompleteness || 0),
      lastSavedAt: safeTimestamp(),
    },
    profile: profile || {
      personal: {
        name: student.name,
        email: student.email,
        phone: student.phone,
      },
      contact: {
        collegeId: student.college_id,
      },
      status: student.status,
      profileVerified: Boolean(student.profile_verified),
    },
    updatedAt: safeTimestamp(),
  }, { merge: true });

  return { synced: true, firebaseUid };
};
