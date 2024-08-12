import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYpou8w-7bMYC_SWXMaZcVQOOSvVSz0E8",
  authDomain: "projet1-418c6.firebaseapp.com",
  projectId: "projet1-418c6",
  storageBucket: "projet1-418c6.appspot.com",
  messagingSenderId: "372716822034",
  appId: "1:372716822034:web:2cde0217876a83bca002cb",
};
const firebase = initializeApp(firebaseConfig);
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);
export const auth = getAuth();

export { storage, firebaseApp, db, firebase };
