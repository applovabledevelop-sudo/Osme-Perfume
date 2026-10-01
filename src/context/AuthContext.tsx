import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db, testConnection } from '../firebase/config';
import { UserProfile, Role } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: Role;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (e: string, p: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: 'customer',
  isAdmin: false,
  isSuperAdmin: false,
  loading: true,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
});

const BOOTSTRAP_ADMIN_EMAIL = 'applovabledevelop@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<Role>('customer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        let userRole: Role = 'customer';

        // Check if bootstrapped superadmin
        if (currentUser.email && currentUser.email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
          userRole = 'superadmin';
        } else {
          try {
            // Check /admins collection
            const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
            if (adminDoc.exists()) {
              userRole = (adminDoc.data().role as Role) || 'admin';
            }
          } catch (e) {
            console.warn('Error reading admin document:', e);
          }
        }

        // Fetch or create customer profile
        let userProf: UserProfile = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Valued Client',
          photoURL: currentUser.photoURL || undefined,
          role: userRole,
          createdAt: new Date().toISOString(),
        };

        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            userProf = { ...userProf, ...(userDoc.data() as UserProfile), role: userRole };
          } else {
            await setDoc(doc(db, 'users', currentUser.uid), userProf);
          }
        } catch (e) {
          console.warn('Error syncing profile document:', e);
        }

        setProfile(userProf);
        setRole(userRole);
      } else {
        setProfile(null);
        setRole('customer');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: name });
      const newProf: UserProfile = {
        uid: res.user.uid,
        email,
        displayName: name,
        role: email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase() ? 'superadmin' : 'customer',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', res.user.uid), newProf);
      setProfile(newProf);
      setRole(newProf.role);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
      setRole('customer');
    } catch (error: any) {
      console.error('Sign-out error:', error);
    }
  };

  const isAdmin = role === 'admin' || role === 'superadmin' || role === 'staff';
  const isSuperAdmin = role === 'superadmin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        isSuperAdmin,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
