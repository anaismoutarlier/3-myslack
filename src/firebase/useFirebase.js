import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
// import { firebaseConfig } from "./firebaseConfig";
import { useState, useEffect } from "react";

const providers = {
  google: new GoogleAuthProvider(),
  facebook: new FacebookAuthProvider(),
};

export default function useFirebase(config) {
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const app = initializeApp(config);
    setAuth(getAuth(app));
    setDb(getFirestore(app));
  }, [config]);

  const updateUser = async (uid, newUser) => {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, newUser, { merge: true });
  };

  useEffect(() => {
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged(authUser => {
        if (authUser) {
          const newUser = {
            photoURL: authUser.photoURL,
            displayName: authUser.displayName,
            email: authUser.email,
            lastLogged: new Date(),
          };

          updateUser(authUser.uid, newUser);
          setUser({ ...newUser, uid: authUser.uid });
        } else {
          setUser(null);
        }
      });

      return () => unsubscribe();
    }
  }, [auth]);

  useEffect(() => {
    if (db) {
      const getMessages = handleSnapshot => {
        const q = query(collection(db, "messages"), orderBy("createdAt"));
  
        return onSnapshot(q, handleSnapshot);
      };
  
      const handleSnapshot = data => {
        const messages = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(messages);
      };
  
      const unsubscribe = getMessages(handleSnapshot);
  
      return () => unsubscribe();
    }
  }, [db]);

  const login = async provider =>
    await signInWithPopup(auth, providers[provider.toLowerCase()]);

  const logout = async () => await signOut(auth);

  const newMessage = async message => {
    await addDoc(collection(db, "messages"), message);
  };

  return {
    user,
    auth: {
      login,
      logout,
    },
    firestore: {
      newMessage,
      messages
    },
  };
}
