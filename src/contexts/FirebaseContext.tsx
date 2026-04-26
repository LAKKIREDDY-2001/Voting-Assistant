import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, testConnection } from '../lib/firebase';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({ user: null, loading: true });

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    testConnection();
    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
};
