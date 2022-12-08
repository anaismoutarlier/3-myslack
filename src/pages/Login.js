import { RaisedButton } from "../components";
import { useContext } from "react";
import { FirebaseContext } from "../firebase";

export default function Login() {
  const { auth: { login } } = useContext(FirebaseContext);
  return (
    <div className="login container">
      <RaisedButton onClick={() => login("google")}>GOOGLE LOGIN</RaisedButton>
      <RaisedButton onClick={() => login("facebook")}>FACEBOOK LOGIN</RaisedButton>

    </div>
  )
}
