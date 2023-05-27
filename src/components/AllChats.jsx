import React from "react";
import { getFirestore, onSnapshot } from "firebase/firestore";
import userContext from "./userContext";
import { useContext, useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  getDocs,
  clearIndexedDbPersistence,
} from "firebase/firestore";
import { db } from "../firebase";
import { query, orderBy } from "firebase/firestore";
import ChatInput from "./ChatInput";
import "./AllChats.css";

function AllChats() {
  const [chats, setChats] = useContext(userContext).userChats;
  const [currentUser, setCurrentUser] = useContext(userContext).currentUser;
  const [user, setUser] = useContext(userContext).loginData;
  const chatRef = useRef(null);
  const chatWindowRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const chatWindow = chatWindowRef.current;

    const handleScroll = () => {
      if (chatWindow) {
        const isScrolledToBottom =
          chatWindow.scrollHeight - chatWindow.clientHeight <=
          chatWindow.scrollTop + 1;
        setShowScrollButton(!isScrolledToBottom);
      }
    };

    if (chatWindow) {
      chatWindow.addEventListener("scroll", handleScroll);
      return () => {
        chatWindow.removeEventListener("scroll", handleScroll);
      };
    }
  }, [chatWindowRef.current]);

  const handleScrollDownClick = () => {
    const chatWindow = chatWindowRef.current;
    if (chatWindow) {
      chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
      });
    }
  };

  useEffect(() => {
    const fetchChat = async () => {
      const dbRef = collection(db, `${currentUser.chatName}`);
      const q = query(dbRef, orderBy("time", "asc"));

      const unsubscribe = onSnapshot(q, (docsSnap) => {
        const chatsArray = docsSnap.docs.map((doc) => doc.data());
        setChats(chatsArray);
      });
    };

    if (currentUser.name == "") {
      setChats([]);
    } else fetchChat();
  }, [currentUser]);

  useEffect(() => {
    handleScrollDownClick();
  }, [chats]);

  // console.log(user);
  // console.log(currentUser);
  const allChats = chats.map((value) => {
    // console.log(value);
    if (value.time != undefined) {
      const firebaseTimestamp = value.time;
      const date = firebaseTimestamp.toDate();
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      const timeString = date.toLocaleTimeString([], options);
      const dateString = date.toLocaleDateString();
      const dateTimeString = `${dateString} ${timeString}`;
      return (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div></div>
          <div
            key={value.id}
            className="d-flex flex-row"
            style={{ marginLeft: user.email === value.email ? "auto" : "0" }}
          >
            {user.email !== value.email && (
              <div style={{ marginRight: "0px" }}>
                <img
                  src={value.image}
                  alt=""
                  style={{
                    marginLeft: "auto",
                    marginRight: "2rem",
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
              </div>
            )}
            <div
              className="border border-dark border-2 p-2 m-3"
              style={{
                borderTopRightRadius: (user.email !== value.email) ? "25px" : "0px",
                borderBottomLeftRadius: "25px",
                borderBottomRightRadius: "25px",
                borderTopLeftRadius: (user.email === value.email) ? "25px" : "0px",
                backgroundColor: (user.email === value.email) ? "#ABC3CD" : "#A9CCCF"
              }}
            >
              <div className="d-flex flex-row">
                <div>
                  <p
                    className="font-weight-bold"
                    style={{ marginRight: "2rem" }}
                  >
                    {value.user}
                  </p>
                </div>
                <div>
                  <p className="font-italic">{dateTimeString}</p>
                </div>
              </div>
              <div style = {{textAlign: "center"}}>
                <h4 className="h5">{value.message}</h4>
              </div>
            </div>
            {user.email === value.email && (
              <div style={{ marginRight: "0px" }}>
                <img
                  src={value.image}
                  alt=""
                  style={{
                    marginLeft: "auto",
                    marginRight: "2rem",
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      );
    }
  });
  return (
    <>
      {/* <div className="chatArea" style={{ height: "71vh", overflowY: "scroll" }} ref={chatRef}> */}
      <div
        className="chatArea"
        style={{ height: "71vh", overflowY: "scroll" }}
        ref={chatWindowRef}
      >
        {allChats}
      </div>
      <div style={{ height: "10vh" }}>
        <ChatInput />
      </div>
      <div>
        {showScrollButton && (
          //   <button
          //     style={{
          //     //   padding: "10px",
          //       borderRadius: "50%",
          //       backgroundColor: "#fff",
          //       // border: "1px solid black",
          //       // boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
          //       color: "black",
          //     }}
          //     onClick={handleScrollDownClick}
          //   >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            class="bi bi-arrow-down-circle-fill"
            viewBox="0 0 16 16"
            onClick={handleScrollDownClick}
            style={{
              cursor: "pointer",
              position: "absolute",
              marginBottom: "4rem",
              marginRight: "1rem",
              bottom: "10px",
              right: "10px",
            }}
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z" />
          </svg>
          //   </button>
        )}
      </div>
    </>
  );
}

export default AllChats;
