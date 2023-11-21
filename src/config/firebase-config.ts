import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBOlwRoOWyZgrzpN2jfSbGfymbrzyJRdHY",
    authDomain: "thequizvortex.firebaseapp.com",
    databaseURL: "https://thequizvortex-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "thequizvortex",
    storageBucket: "thequizvortex.appspot.com",
    messagingSenderId: "944758740530",
    appId: "1:944758740530:web:319c8134b09ef50f150e2b"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage();