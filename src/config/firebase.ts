import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDkd94rHsoBHElUdm5pj1UyoMZHOF2vecc",
  authDomain: "mr-sameh-f41c0.firebaseapp.com",
  projectId: "mr-sameh-f41c0",
  storageBucket: "mr-sameh-f41c0.firebasestorage.app",
  messagingSenderId: "758817609651",
  appId: "1:758817609651:web:5973334a0b6799aa22ddc6",
  measurementId: "G-0GMB03PWTR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;