import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBkEvIh9H8-qZ_gPwruqUUJukVD10z4kiU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pragatistudentmodule.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pragatistudentmodule",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pragatistudentmodule.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "526628460499",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:526628460499:web:92f17de7856dcc2f920126",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export default app;
