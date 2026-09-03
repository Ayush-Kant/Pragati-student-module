import "dotenv/config";
import { getApp } from "firebase-admin/app";
import { getFirebaseAdminAuth, verifyFirebaseAdminConfiguration } from "../services/firebaseAdmin.service.js";

try {
  const result = await verifyFirebaseAdminConfiguration();
  const app = getApp();
  console.log(`✅ Firebase Admin is connected to ${result.projectId}`);
  console.log(`✅ Credential source initialized for ${app.options.projectId}`);
  console.log("✅ Firebase Auth API is reachable");
  // Keep the initialized Auth instance referenced so failures surface before process exit.
  getFirebaseAdminAuth();
  process.exitCode = 0;
} catch (error) {
  console.error("❌ Firebase Admin configuration check failed:");
  console.error(error?.message || error);
  process.exitCode = 1;
}
