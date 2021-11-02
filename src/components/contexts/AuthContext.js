import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  deleteUser,
} from "@firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  // const [currentUserInfo, setCurrentUserInfo] = useState();
  const [loading, setLoading] = useState(true);

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function deleteUserAccount() {
    return deleteUser(auth.currentUser);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateProfileEmail(email) {
    return updateEmail(auth.currentUser, email);
  }

  function updateProfilePassword(password) {
    return updatePassword(auth.currentUser, password);
  }

  function uploadApplication(formInfo) {
    return setDoc(doc(db, "users", currentUser.uid), formInfo);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signUp,
    logout,
    resetPassword,
    updateProfileEmail,
    updateProfilePassword,
    uploadApplication,
    deleteUserAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
