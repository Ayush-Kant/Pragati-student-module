import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA4kqZZJhVSAJEMhUiItJP6kNjfH9-p8B0",

  authDomain:
    "pragati-85095.firebaseapp.com",

  projectId: "pragati-85095",

  storageBucket:
    "pragati-85095.firebasestorage.app",

  messagingSenderId:
    "984421547912",

  appId:
    "1:984421547912:web:3c3c4ee680730dea11443d",

  measurementId:
    "G-SK8711LXHX",
};

const app =
  initializeApp(firebaseConfig);

/* FIREBASE STORAGE */
export const storage =
  getStorage(app);

export default app;