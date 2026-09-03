import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const FIREBASE_PROJECT_ID = "pragatistudentmodule";
let initializedAuth = null;

const parseServiceAccount = () => {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed.private_key) parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    return parsed;
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON");
  }
};

export const getFirebaseAdminAuth = () => {
  if (initializedAuth) return initializedAuth;

  const apps = getApps();
  if (apps.length === 0) {
    const serviceAccount = parseServiceAccount();
    const configuredProjectId = String(
      process.env.FIREBASE_PROJECT_ID || FIREBASE_PROJECT_ID,
    ).trim();

    if (serviceAccount) {
      const serviceAccountProjectId = String(serviceAccount.project_id || "").trim();
      if (serviceAccountProjectId && serviceAccountProjectId !== configuredProjectId) {
        throw new Error(
          `Firebase service account project mismatch: expected ${configuredProjectId}, received ${serviceAccountProjectId}`,
        );
      }

      initializeApp({
        credential: cert(serviceAccount),
        projectId: configuredProjectId,
      });
    } else {
      // Local/server deployments may use GOOGLE_APPLICATION_CREDENTIALS.
      // The project is explicit so Admin SDK does not depend on ambient project discovery.
      initializeApp({
        credential: applicationDefault(),
        projectId: configuredProjectId,
      });
    }
  }

  initializedAuth = getAuth();
  return initializedAuth;
};

export const createFirebaseStudent = async ({ email, password, fullName }) => {
  const auth = getFirebaseAdminAuth();
  return auth.createUser({
    email,
    password,
    displayName: fullName,
    emailVerified: false,
    disabled: false,
  });
};

export const deleteFirebaseUser = async (uid) => {
  if (!uid) return;
  const auth = getFirebaseAdminAuth();
  try {
    await auth.deleteUser(uid);
  } catch (error) {
    if (error?.code !== "auth/user-not-found") throw error;
  }
};

export const verifyFirebaseIdToken = async (idToken) => {
  if (!idToken) {
    const error = new Error("Firebase ID token is required");
    error.statusCode = 400;
    throw error;
  }

  return getFirebaseAdminAuth().verifyIdToken(idToken);
};
