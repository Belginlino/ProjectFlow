import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { auth, db } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { DEMO_USERS_MAP } from '../services/seedData';

interface AuthContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, fullName: string) => Promise<void>;
  loginAsDemoUser: (role: 'student' | 'mentor' | 'evaluator' | 'admin') => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('projectflow_demo_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrCreateUser = async (firebaseUser: User, overrideName?: string) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const u = snap.data() as UserProfile;
      setCurrentUser(u);
      localStorage.setItem('projectflow_demo_user', JSON.stringify(u));
    } else {
      const newUser: UserProfile = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        fullName: overrideName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: 'student',
        institutionId: 'inst-ait-01',
        department: 'Computer Science & Engineering',
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, newUser);
      setCurrentUser(newUser);
      localStorage.setItem('projectflow_demo_user', JSON.stringify(newUser));
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchOrCreateUser(user);
      } else {
        const saved = localStorage.getItem('projectflow_demo_user');
        if (saved) {
          try {
            setCurrentUser(JSON.parse(saved));
          } catch {
            setCurrentUser(null);
          }
        }
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await fetchOrCreateUser(cred.user);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await fetchOrCreateUser(cred.user);
  };

  const signupWithEmail = async (email: string, pass: string, fullName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await fetchOrCreateUser(cred.user, fullName);
  };

  const loginAsDemoUser = (role: 'student' | 'mentor' | 'evaluator' | 'admin') => {
    let demoProfile: UserProfile = DEMO_USERS_MAP.student1;
    if (role === 'mentor') demoProfile = DEMO_USERS_MAP.mentor;
    else if (role === 'evaluator') demoProfile = DEMO_USERS_MAP.evaluator;
    else if (role === 'admin') demoProfile = DEMO_USERS_MAP.admin;

    setCurrentUser(demoProfile);
    localStorage.setItem('projectflow_demo_user', JSON.stringify(demoProfile));
  };

  const logout = async () => {
    localStorage.removeItem('projectflow_demo_user');
    setCurrentUser(null);
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        loginAsDemoUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};