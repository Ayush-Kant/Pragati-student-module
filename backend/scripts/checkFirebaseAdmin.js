import "dotenv/config";
import { getApp } from "firebase-admin/app";
import {
  getFirebaseAdminAuth,
  getFirebaseFirestore,
  verifyFirebaseAdminConfiguration,
} from "../services/firebaseAdmin.service.js";

try {
  const result = await verifyFirebaseAdminConfiguration();
  const app = getApp();
  console.log(`✅ Firebase Admin is connected to ${result.projectId}`);
  console.log(`✅ Credential source initialized for ${app.options.projectId}`);
  console.log("✅ Firebase Auth API is reachable");

  getFirebaseAdminAuth();
  await getFirebaseFirestore().collection("_system").doc("connectivity-check").get();
  console.log("✅ Firebase Firestore API is reachable");
  process.exitCode = 0;
} catch (error) {
  console.error("❌ Firebase Admin configuration check failed:");
  console.error(error?.message || error);
  process.exitCode = 1;
}
