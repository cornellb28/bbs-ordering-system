// client/src/firebase.jsx
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';

// ——————————————————————————————————————————
// 1. Your Firebase config (from Firebase Console)
// ——————————————————————————————————————————
const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};

// ——————————————————————————————————————————
// 2. Initialize App & Auth
// ——————————————————————————————————————————
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google provider instance
const googleProvider = new GoogleAuthProvider();

// ——————————————————————————————————————————
// 3. Exported helper functions
// ——————————————————————————————————————————

// Listen for auth changes (e.g. in your AuthContext)
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// Email / Password
export const registerWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Google OAuth
export const loginWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

// Anonymous
export const loginAnonymouslyUser = () =>
  signInAnonymously(auth);

// Logout
export const logout = () => firebaseSignOut(auth);

// Default export for direct auth usage if needed
export default auth;
