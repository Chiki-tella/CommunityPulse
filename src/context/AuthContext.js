import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        setUser({ ...firebaseUser, ...userDoc.data() });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, name, role = 'citizen', district = '', department = '') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Send email verification
    await sendEmailVerification(userCredential.user);
    
    // Add user data to Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name,
      email,
      role, // 'citizen', 'official', 'admin'
      isVerified: role === 'citizen', // Citizens are prep-verified, Officials need admin approval
      district,
      department,
      createdAt: new Date().toISOString(),
      reportsCount: 0,
      confirmationsCount: 0
    });
    
    // Immediately log out so they must verify and log back in
    await signOut(auth);
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    if (!userCredential.user.emailVerified) {
      await signOut(auth);
      throw new Error('Please verify your email address before logging in. Check your inbox.');
    }
    
    // Fetch user doc to check role verification
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    const userData = userDoc.data();
    
    if (userData && userData.role === 'official' && !userData.isVerified) {
      await signOut(auth);
      throw new Error('Your official account is pending Admin approval.');
    }
    
    return userCredential;
  };

  const updateUserPhoto = async (photoURL) => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid), { photoURL }, { merge: true });
    setUser({ ...user, photoURL });
  };

  const updateProfileDetails = async (updates) => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
    setUser({ ...user, ...updates });
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    signup,
    login,
    logout,
    updateUserPhoto,
    updateProfileDetails,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
