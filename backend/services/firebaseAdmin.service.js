import { readFileSync } from "node:fs";
import { applicationDefault, cert, getApps, getApp, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const FIREBASE_PROJECT_ID = "pragatistudentmodule";
let initializedAuth = null;
let initializedFirestore = null;

const normalizeServiceAccount = (serviceAccount) => {
  if (serviceAccount?.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }
  return serviceAccount;
};

const parseServiceAccountJson = (raw) => {
  if (!raw) return null;

  try {
    return normalizeServiceAccount(JSON.parse(raw));
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON");
  }
};

const loadServiceAccount = () => {
  const fromEnv = parseServiceAccountJson(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (fromEnv) return fromEnv;

  const configuredPath = String(process.env.GOOGLE_APPLICATION_CREDENTIALS || "").trim();
  if (!configuredPath) return null;

  let raw;
  try {
    raw = readFileSync(configuredPath, "utf8");
  } catch (error) {
    throw new Error(
      `Firebase service account file could not be read at ${configuredPath}: ${error.message}`,
    );
  }

  try {
    return normalizeServiceAccount(JSON.parse(raw));
  } catch {
    throw new Error(`Firebase service account file at ${configuredPath} is not valid JSON`);
  }
};

const getConfiguredProjectId = () => {
  const projectId = String(process.env.FIREBASE_PROJECT_ID || FIREBASE_PROJECT_ID).trim();
  if (!projectId) throw new Error("FIREBASE_PROJECT_ID is required for Firebase Admin");
  return projectId;
};

const validateServiceAccountProject = (serviceAccount, configuredProjectId) => {
  const serviceAccountProjectId = String(serviceAccount?.project_id || "").trim();
  if (serviceAccountProjectId && serviceAccountProjectId !== configuredProjectId) {
    throw new Error(
      `Firebase service account project mismatch: expected ${configuredProjectId}, received ${serviceAccountProjectId}`,
    );
  }
};

const ensureAdminApp = () => {
  const apps = getApps();
  if (apps.length > 0) return getApp();

  const serviceAccount = loadServiceAccount();
  const configuredProjectId = getConfiguredProjectId();

  if (serviceAccount) {
    validateServiceAccountProject(serviceAccount, configuredProjectId);
    return initializeApp({
      credential: cert(serviceAccount),
      projectId: configuredProjectId,
    });
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId: configuredProjectId,
  });
};

export const getFirebaseAdminAuth = () => {
  if (initializedAuth) return initializedAuth;
  initializedAuth = getAuth(ensureAdminApp());
  return initializedAuth;
};

export const getFirebaseFirestore = () => {
  if (initializedFirestore) return initializedFirestore;
  initializedFirestore = getFirestore(ensureAdminApp());
  return initializedFirestore;
};

export const verifyFirebaseAdminConfiguration = async () => {
  const auth = getFirebaseAdminAuth();
  const app = getApp();
  await auth.listUsers(1);
  return {
    projectId: String(app.options.projectId || FIREBASE_PROJECT_ID),
    credentialConfigured: true,
  };
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
