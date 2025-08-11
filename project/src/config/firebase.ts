import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAukhYAhonE_9529-wsPKEPn9FIqjYEHn0",
  authDomain: "samoooh-65264.firebaseapp.com",
  projectId: "samoooh-65264",
  storageBucket: "samoooh-65264.firebasestorage.app",
  messagingSenderId: "1009478894590",
  appId: "1:1009478894590:web:a871d715d52fb2b58ef6af",
  measurementId: "G-SHCE1P8ML2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

let resolveAuth: (() => void) | null = null;
export const authReady: Promise<void> = new Promise((resolve) => {
  resolveAuth = resolve;
});

onAuthStateChanged(auth, (user) => {
  if (user && resolveAuth) {
    resolveAuth();
    resolveAuth = null;
  }
});

signInAnonymously(auth).catch(() => {/* ignore */});

export default app;