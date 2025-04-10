import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBar2zYk1BlKkli8lFxJPD1lISpVUglhto",
    authDomain: "remesdatabase.firebaseapp.com",
    projectId: "remesdatabase",
    storageBucket: "remesdatabase.firebasestorage.app",
    messagingSenderId: "354661121509",
    appId: "1:354661121509:web:bd2b7c3713fea2c177430c",
    measurementId: "G-N0CG5WJQZP"
};

// Firebaseの初期化
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 