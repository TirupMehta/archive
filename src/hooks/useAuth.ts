import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Hardcoded pro for owner
        if (firebaseUser.email === 'tirupmehta1@gmail.com') {
          setIsPro(true);
        } else {
          try {
            const { doc, getDoc } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase');
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            setIsPro(userDoc.exists() && userDoc.data()?.isPro === true);
          } catch (e) {
            console.error("Error fetching pro status:", e);
            setIsPro(false);
          }
        }
      } else {
        setIsPro(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, isPro };
}
