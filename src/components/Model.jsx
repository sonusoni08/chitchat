import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import userContext from './userContext';
import { useContext } from 'react';
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';

function Model() {
  const [show, setShow] = useState(false);
  const [user, setUser] = useContext(userContext).loginData;
  const [friends, setFriends] = useContext(userContext).userFriends;
  const [currentUser, setCurrentUser] = useContext(userContext).currentUser;
  const [email, setEmail] = useState("");
  const handleOpen = () => {
    setShow(true);
  }

  const checkExistance = async () => {
    let flag = true;
    await getDocs(collection(db, `${email}`))
        .then((querySnapshot) => {
            const newData = querySnapshot.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }));
            newData.map((val) => {
                if (user.email === val.email) {
                    flag = false;
                }
            })
        })
    return flag;
  }

  const addData = async (data) => {
    let res = await checkExistance().then((val) => val);
    if (res == true) {
      try {
        const docRef = await addDoc(collection(db, `${user.email}`), {
          chatName: data.chatName,
          image: data.image,
          name: data.name,
          email: data.email,
          time : data.time,
          pending: 0,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      try {
        const docRef = await addDoc(collection(db, `${email}`), {
          chatName: `${user.email}${email}`,
          image: user.image,
          name: user.name,
          email: user.email,
          time : Timestamp.now(),
          pending: 0,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      try {
        const docRef = await addDoc(collection(db, `${user.email}${email}`), {
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      setCurrentUser({
        chatName: data.chatName,
        image: data.image,
        name: data.name,
        email: data.email,
        time : data.time,
        id: data.id,
        pending: 0,
      });
      setFriends([...friends, data]);
    }
  }

  const handleClose = async () => {
    let flag = true;
    await getDocs(collection(db, "userEmail"))
      .then((querySnapshot) => {
        const newData = querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }));
        newData.map((value) => {
          if (value.email === email) {
            flag = false;
            const data = {
              chatName: `${user.email}${email}`,
              image: value.image,
              name: value.name,
              email: value.email,
              time : Timestamp.now(),
              id: value.id,
              pending: 0,
            }
            addData(data);
          }
        })
      })
    if (flag) {
      alert("User Not Found");
    }
    setShow(false);
  }
  return (
    <>
      <button style={{ marginTop: "0.5rem", borderRadius: "50px", backgroundColor: "#61828A" }} className="w-100 d-flex align-items-center justify-content-start" onClick={handleOpen}>
        <div>
          <h5 className="mb-0">+ Add User</h5>
          {/* <p className="text-muted mb-0">Description of button</p> */}
        </div>
      </button>
      <Modal show={show}>
        <Modal.Header closeButton onClick={() => setShow(false)}>
          {/* <Modal.Title>React Modal Popover Example</Modal.Title> */}
          <h2>Enter Email Of User</h2>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label for="inputAddress">Email</label>
            <input type="email" className="form-control" value={email} placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="dark" onClick={handleClose}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default Model