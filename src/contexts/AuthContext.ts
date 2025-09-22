// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import {
  onAuthChange,
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  loginAnonymouslyUser,
  logout,
} from '../firebase';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore guest from localStorage or Firebase user
  useEffect(() => {
    // 1️⃣ Check localStorage for a guest flag
    const isGuest = localStorage.getItem('guest') === 'true';
    if (isGuest) {
      // If we were a guest last time, rehydrate that state
      setUser({ id: null, role: 'guest', guest: true });
      setLoading(false);
      return; 
    }

    // 2️⃣ Otherwise, subscribe to Firebase auth changes
    const unsubscribe = onAuthChange(current => {
      if (current) {
        // Determine role from your logic
        const role = current.email === 'admin@bowlandbrothsociety.com'
          ? 'admin'
          : 'customer';
        setUser({ ...current, role });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Helper to persist or clear guest flag
  const setGuestFlag = (flag) => {
    if (flag) localStorage.setItem('guest', 'true');
    else localStorage.removeItem('guest');
  };

  // Email/password registration
  const register = (email, password) =>
    registerWithEmail(email, password);

  // Email/password login
  const login = (email, password) =>
    loginWithEmail(email, password);

  // Google OAuth login
  const loginGoogle = () =>
    loginWithGoogle();

  // Firebase anonymous login (optional)
  const loginAnon = async () => {
    const anonUser = await loginAnonymouslyUser();
    // Firebase will call onAuthChange and set the user
    return anonUser;
  };

  // **Local guest login** (no Firebase)
  const loginGuest = () => {
    const guest = { id: null, role: 'guest', guest: true };
    setUser(guest);
    setGuestFlag(true);
    return Promise.resolve(guest);
  };

  // Sign out both guest or Firebase user
  const signOut = () => {
    // Clear guest flag if set
    setGuestFlag(false);
    // If Firebase user, call logout
    logout();
    // Reset context user
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        loginGoogle,
        loginAnon,
        loginGuest,    // new
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
