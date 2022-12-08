import "sanitize.css";
import useFirebase, { FirebaseContext } from "./firebase";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import { firebaseConfig } from "./firebaseConfig";

function App() {
  const { user, auth, firestore } = useFirebase(firebaseConfig);
  return <FirebaseContext.Provider value={{ user, auth, firestore }}>
    {user ? <Chat /> : <Login />};
  </FirebaseContext.Provider>
}

export default App;
