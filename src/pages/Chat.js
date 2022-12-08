import { RaisedButton } from "../components";
import { useContext, useState } from "react";
import { FirebaseContext } from "../firebase";

export default function Chat() {
  const {
    user,
    auth: {
      logout
    },
    firestore: {
      newMessage,
      messages
    }
  } = useContext(FirebaseContext);
  const [text, setText] = useState("");

  const handleChange = e => setText(e.target.value);

  const sendMessage = e => {
    e.preventDefault();

    if (!text) return;

    const message = {
      text,
      user: {
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName
      },
      createdAt: new Date()
    }

    console.log(message, user)

    newMessage(message);
    setText("");
  }

  return (
    <div className="chat container">
      <div className="sider">
        <div>
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="sider-avatar"
          />
          <h2>{user.displayName}</h2>
          <h3>{user.email}</h3>
        </div>
        <RaisedButton onClick={logout}>LOGOUT</RaisedButton>
      </div>
      <div className="content">
        <div className="message-container">
          {
            messages.map(message => {
              return <div className="message">
              <img src={message.user.photoURL} alt={message.user.displayName} className="avatar" />
              <div>
                <h6>{message.text}</h6>
                <p>
                  {message.createdAt.toDate().getHours()}h{message.createdAt.toDate().getMinutes().toString().padStart(2, 0)}
                </p>
              </div>
            </div>
              
            })

          }
        </div>
        <form className="input-container" onSubmit={sendMessage}>
          <input value={text} onChange={handleChange} />
          <RaisedButton type="submit">SEND</RaisedButton>
        </form>
      </div>
    </div>
  );
}
