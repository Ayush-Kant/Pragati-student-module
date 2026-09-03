import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBkEvIh9H8-qZ_gPwruqUUJukVD10z4kiU",
  authDomain: "pragatistudentmodule.firebaseapp.com",
  projectId: "pragatistudentmodule",
  storageBucket: "pragatistudentmodule.firebasestorage.app",
  messagingSenderId: "526628460499",
  appId: "1:526628460499:web:92f17de7856dcc2f920126",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export default app;
