import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { auth, db } from '../lib/firebase';
import { dataService } from '../services/dataService';
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
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, fullName: string, role: UserRole) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
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

  useEffect(() => {
    dataService.setCurrentUserContext(currentUser);
  }, [currentUser]);

  const fetchOrCreateUser = async (firebaseUser: User, overrideName?: string, overrideRole?: UserRole) => {
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
        role: overrideRole || 'student',
        institutionId: 'inst-ait-01',
        department: 'Computer Science & Engineering',
        isActive: true,
        onboardingComplete: false,
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

  const mockLoginFallback = (email: string, role?: UserRole, fullName?: string) => {
    const demoUsers = Object.values(DEMO_USERS_MAP) as UserProfile[];
    const existing = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existing) {
      setCurrentUser(existing);
      localStorage.setItem('projectflow_demo_user', JSON.stringify(existing));
      return;
    }

    const newUser: UserProfile = {
      id: 'mock-' + Date.now().toString(),
      email: email,
      fullName: fullName || email.split('@')[0] || 'User',
      role: role || 'student',
      institutionId: 'inst-ait-01',
      department: 'Computer Science & Engineering',
      isActive: true,
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    localStorage.setItem('projectflow_demo_user', JSON.stringify(newUser));
  };

  const loginWithGoogle = async (role?: UserRole) => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      await fetchOrCreateUser(cred.user, undefined, role);
    } catch (e: any) {
      console.warn('Firebase login failed, falling back to local demo auth', e);
      mockLoginFallback('demo@projectflow.edu', role);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await fetchOrCreateUser(cred.user);
    } catch (e: any) {
      console.warn('Firebase login failed, falling back to local demo auth', e);
      mockLoginFallback(email);
    }
  };

  const signupWithEmail = async (email: string, pass: string, fullName: string, role: UserRole) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await fetchOrCreateUser(cred.user, fullName, role);
    } catch (e: any) {
      console.warn('Firebase signup failed, falling back to local demo auth', e);
      mockLoginFallback(email, role, fullName);
    }
  };



  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const userRef = doc(db, 'users', currentUser.id);
    const updatedUser = { ...currentUser, ...data };
    await setDoc(userRef, updatedUser, { merge: true });
    setCurrentUser(updatedUser);
    localStorage.setItem('projectflow_demo_user', JSON.stringify(updatedUser));
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
        updateUserProfile,
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