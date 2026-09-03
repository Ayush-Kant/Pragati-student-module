import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

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

const getProjectId = () => (
  String(
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    "pragati-85095",
  ).trim()
);

export const getFirebaseAdminAuth = () => {
  if (initializedAuth) return initializedAuth;

  const apps = getApps();
  if (apps.length === 0) {
    const serviceAccount = parseServiceAccount();
    const projectId = getProjectId();

    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId,
      });
    } else {
      // Local/server deployments may use GOOGLE_APPLICATION_CREDENTIALS.
      // Supplying the project explicitly prevents Firebase Admin from trying
      // to discover it from an unconfigured environment.
      initializeApp({
        credential: applicationDefault(),
        projectId,
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
