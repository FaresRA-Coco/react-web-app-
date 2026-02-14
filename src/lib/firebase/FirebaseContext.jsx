import React, { createContext, useContext } from 'react';
// These should be your *initialized* Firebase instances
import { app, auth, db } from './firebase_config.js';

const FirebaseContext = createContext(null);

export function FirebaseProvider({ children }) {
  // --- ADDED FOR DIAGNOSIS ---
  console.log("FirebaseContext: 'db' instance being provided:", db);
  if (db === null || db === undefined) {
    console.error("FirebaseContext: 'db' is not properly initialized from firebase_config.js!");
  }
  // -------------------------

  return (
    <FirebaseContext.Provider value={{ app, auth, db }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  // Making the check a bit more explicit if you want:
  if (!context || !context.app || !context.auth || !context.db) {
    throw new Error('useFirebase must be used within a FirebaseProvider and ensure all Firebase instances (app, auth, db) are correctly initialized in firebase_config.js.');
  }
  return context;
}
