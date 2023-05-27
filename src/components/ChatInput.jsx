import React from "react";
import userContext from "./userContext";
import { useContext, useState } from "react";
import { query, orderBy } from "firebase/firestore";
import { Button } from "react-bootstrap";
import { BsFileEarmark, BsPinAngle } from "react-icons/bs";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  clearIndexedDbPersistence,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

function ChatInput() {
  const [currentUser, setCurrentUser] = useContext(userContext).currentUser;
  const [user, setUser] = useContext(userContext).loginData;
  const [chats, setChats] = useContext(userContext).userChats;
  const [message, setMessage] = useState("");
  const [friends, setFriends] = useContext(userContext).userFriends;

  // console.log(message);
  console.log(currentUser);
  // console.log(chats);
  // console.log(user);
  const sendChat = async () => {
    try {
      const docRef = await addDoc(collection(db, `${currentUser.chatName}`), {
        message,
        user: user.name,
        time: Timestamp.now(),
        seen: false,
        image: user.image,
        email: user.email,
      });
      console.log("Document written with ID: ", docRef.id);

      let id;
      let pending;
      await getDocs(
        query(collection(db, currentUser.email), orderBy("email"))
      ).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        for (let i = 0; i < newData.length; i++) {
          if (user.email === newData[i].email) {
            id = newData[i].id;
            pending = newData[i].pending;
            break;
          }
        }
      });
      const Ref = doc(db, currentUser.email, id);
      updateDoc(Ref, {
        chatName: currentUser.chatName,
        email: user.email,
        image: user.image,
        name: user.name,
        time: Timestamp.now(),
        pending: pending + 1,
      });
      const Ref2 = doc(db, user.email, currentUser.id);
      updateDoc(Ref2, {
        chatName: currentUser.chatName,
        email: currentUser.email,
        image: currentUser.image,
        name: currentUser.name,
        time: Timestamp.now(),
        pending: 0,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setChats([
      ...chats,
      {
        message,
        user: user.name,
        time: Timestamp.now(),
        seen: false,
        email: user.email,
        image: user.image,
      },
    ]);
    setMessage("");
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
  <input
    onChange={(event) => setMessage(event.target.value)}
    onKeyDown={(event) => {
      if (event.key === "Enter") {
        sendChat();
      }
    }}
    value={message}
    type="text"
    className="form-control"
    placeholder="Type Message..."
    aria-label="Username"
    aria-describedby="basic-addon1"
    style={{ flexGrow: "1", marginRight: "10px" }}
  />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="40"
    fill="currentColor"
    className="bi bi-send-fill"
    viewBox="0 0 16 16"
    onClick={sendChat}
    style={{ cursor: "pointer" }}
  >
    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
  </svg>
</div>

  );
}

export default ChatInput;
