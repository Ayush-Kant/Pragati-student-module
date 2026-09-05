import {
  GoogleAuthProvider,
  connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import firebaseApp from "./firebaseConfig";

export const firebaseAuth = getAuth(firebaseApp);

const authEmulatorHost = String(import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST || "").trim();
if (authEmulatorHost) {
  const emulatorUrl = authEmulatorHost.startsWith("http://") || authEmulatorHost.startsWith("https://")
    ? authEmulatorHost
    : `http://${authEmulatorHost}`;
  connectAuthEmulator(firebaseAuth, emulatorUrl, { disableWarnings: true });
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const signInStudentWithPassword = (email, password) =>
  signInWithEmailAndPassword(firebaseAuth, email, password);

export const signInStudentWithGoogle = () =>
  signInWithPopup(firebaseAuth, googleProvider);

export const getFirebaseIdToken = async () => {
  if (!firebaseAuth.currentUser) throw new Error("No Firebase user is signed in");
  return firebaseAuth.currentUser.getIdToken(true);
};
