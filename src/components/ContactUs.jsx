import React, { useEffect, useState } from 'react'
import "./ContactUs.css"
import userContext from './userContext';
import { query, orderBy } from 'firebase/firestore';
import { useContext } from 'react';
import { getFirestore, onSnapshot } from "firebase/firestore";
import Profile from './Profile';
import { doc, collection, addDoc, getDocs, clearIndexedDbPersistence, Timestamp, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import Model from './Model';
import ChatHeader from './ChatHeader';
import AllChats from "./AllChats"

function ContactUs() {
  const [user, setUser] = useContext(userContext).loginData;
  const [chats, setChats] = useContext(userContext).userChats;
  const [friends, setFriends] = useContext(userContext).userFriends;
  const [currentUser, setCurrentUser] = useContext(userContext).currentUser;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState('');
  const [storeFriends, setStoreFriends] = useContext(userContext).storedFriends;

  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {

      const dbRef = collection(db, (user.email));
      const q = query(dbRef, orderBy('time', 'desc'));
      const unsubscribe = onSnapshot(q, (docsSnap) => {
        const chatsArray = docsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log(chatsArray);
        setFriends(chatsArray);
        setStoreFriends(chatsArray);
      });
    } catch (error) {
      console.error(error);
    }
  };
  // console.log(search);
  useEffect(() => {

    // console.log(user);
    if (user.email == "") {
      setFriends([]);
    }
    else {
      fetchData();
    }
  }, [user.email, currentUser]);

  const loadChat = async (value) => {
    // console.log(friends);
    setCurrentUser(value);
    const q = collection(db, `${value.chatName}`);
    const querySnapshot = await getDocs(q);
    const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    if (user.email != value.email) {
      try {
        const Ref = doc(db, user.email, value.id);
        updateDoc(Ref, {
          chatName: value.chatName,
          email: value.email,
          image: value.image,
          name: value.name,
          time: value.time,
          pending: 0,
        })
      }
      catch (err) {
        console.log("error");
      }
    }
  }

  // console.log(friends)

  const handleSearch = (event) => {
    setSearch(event.target.value);
    const searchValue = event.target.value;
    const filteredFriends = storeFriends.filter((friend) =>
      friend.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFriends(filteredFriends);
  };

  const allFriends = friends.map((value, index) => {
    console.log(value)
    const firebaseTimestamp = value.time;
    const date = firebaseTimestamp.toDate();
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const timeString = date.toLocaleTimeString([], options);
    const dateString = date.toLocaleDateString();
    const dateTimeString = `${dateString} ${timeString}`;
    return (
      <button type="button" style={{ display: "flex", flexDirection: "row", marginTop: "0.5rem", borderRadius: "50px", backgroundColor: "#ABC3CD" }} className="w-100 d-flex align-items-center " key={index} onClick={() => loadChat(value)}>
        <img src={value.image} alt="Image" width="30" height="30" className="rounded-circle me-3" />
        <h5 className="mb-0" style={{ color: "black" }}>{value.name}</h5>
        <p className="text-muted mb-0" style={{ color: "white", marginLeft: "auto"}}>{dateTimeString}</p>
        {(value.pending > 0) && <div class="badge badge-circle badge-danger text-center">
          <span class="badge-number">{value.pending}</span>
        </div>}
      </button>
    )
  })

  return (
    <div className="row" style={{ "--bs-gutter-x": 0, backgroundColor: "#DFE9EB" }}>
      <div className="col-sm-4 p-2 border" style={{ height: "90vh", overflowY: "auto" }}>
        <div className='d-flex justify-content-between'>
          <Profile />
          <input className="form-control mr-sm-2" name="search" value={search} type="search" placeholder="Search" aria-label="Search" onChange={handleSearch} />
        </div>
        <hr style={{ height: '2px', backgroundColor: 'black', border: 'none' }} />
        <div>
          {allFriends}
          <Model />
        </div>
      </div>
      <div className="col-sm-8 p-2 border">
        {currentUser.image != null && <div style={{ height: "90vh" }}>
          <div style={{ height: "9vh", backgroundColor: "#A9CCCF" }}>
            <ChatHeader />
          </div>
          <div style={{ height: "81vh" }}>
            <span ></span>
            <AllChats />
          </div>
        </div>}
      </div>
    </div>
  )
}

export default ContactUs