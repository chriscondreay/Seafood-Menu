
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBlCx47FivUKuEEvG40ngNJeu5d24HBWvc",
    authDomain: "seafood-menu-c15bf.firebaseapp.com",
    databaseURL: "https://seafood-menu-c15bf-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const base = getDatabase(firebaseApp);

export { firebaseApp, base };