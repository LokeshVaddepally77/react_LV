import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyAqGDYuKe8Yi4ODWmMGdfMhXu7lZpKOa38",
    authDomain: "financeflow-7e1e8.firebaseapp.com",
    projectId: "financeflow-7e1e8",
    storageBucket: "financeflow-7e1e8.firebasestorage.app",
    messagingSenderId: "1055231225122",
    appId: "1:1055231225122:web:206762aa7595686db8c97b",
    measurementId: "G-YFNQEPTVQ0"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence);

export const db = getFirestore(app);
export { auth };