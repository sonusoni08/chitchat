import React, { useState, useEffect } from 'react'
import signup from "../images/signup.png"
import login from "../images/login.png"
import { Link } from 'react-router-dom';
import { collection, addDoc, getDocs, clearIndexedDbPersistence, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import { query, orderBy } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import userContext from './userContext';
import { useContext } from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase"


function LoginSignup() {
    const [name, setName] = useState('');
    const [userData, setUserData] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState("");
    const [current, setCurrent] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useContext(userContext).loginData;
    const [page, setPage] = useContext(userContext).currentPage;

    const SignupGoogle = async () => {
        let flag = true;
        const signUpEmail = localStorage.getItem("email");
        const signUpName = localStorage.getItem("name");
        const signUpImage = localStorage.getItem("image");
        await getDocs(query(collection(db, "userEmail"), orderBy("email")))
        .then((querySnapshot) => {
            const newData = querySnapshot.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }));
            newData.map((val) => {
                if (signUpEmail === val.email) {
                    flag = false;
                }
            })
        })
        // navigate("/");
        setPage(1);
        if (flag) {
            try {
                const docRef = await addDoc(collection(db, "userEmail"), {
                    email: signUpEmail,
                    name: signUpName,
                    password: "",
                    image: signUpImage,
                });
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            try {
                const docRef = await addDoc(collection(db, `${signUpEmail}${signUpEmail}`), {
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }

            try {
                const docRef = await addDoc(collection(db, `${signUpEmail}admin`), {
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            try {
                const docRef = await addDoc(collection(db, `${signUpEmail}`), {
                    chatName: `${signUpEmail}${signUpEmail}`,
                    name: `${signUpName}`,
                    image: `${signUpImage}`,
                    email: signUpEmail,
                    time : Timestamp.now(),
                    pending: 0,
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            try {
                const docRef = await addDoc(collection(db, `${signUpEmail}`), {
                    chatName: `${signUpEmail}admin`,
                    name: `Admin`,
                    image: "https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg?w=740&t=st=1682276720~exp=1682277320~hmac=04d57d207cf81dc6a5278e10467445506e7fdc975f352e5947df1dff70c1809d",
                    email: "admin@gmail.com",
                    time : Timestamp.now(),
                    pending: 0,
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            setName('');
            setEmail('');
            setPassword('');
        }
    }

    const handleLogin = async () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                setName(result.user.displayName)
                setEmail(result.user.email)
                setImage(result.user.image)
                setPassword("")
                localStorage.setItem("name", result.user.displayName);
                localStorage.setItem("email", result.user.email);
                localStorage.setItem("image", result.user.photoURL);
                SignupGoogle();
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                // const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    useEffect(() => {
        const temp = localStorage.getItem("name");
        if (temp != undefined) {
            setUser({
                name: localStorage.getItem("name"),
                email: localStorage.getItem("email"),
                image: localStorage.getItem("image"),
            })
        }
    }, [email, name, password, image])

    const setData = (val) => {
        setName(val);
    }
    const toggle = () => {
        setCurrent(!current);
    }


    const Login = async () => {
        let flag = false;
        await getDocs(query(collection(db, "userEmail"), orderBy("email")))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                newData.map((val) => {
                    if (email === val.email && password === val.password) {
                        localStorage.setItem("name", val.name);
                        localStorage.setItem("email", val.email);
                        localStorage.setItem("image", val.image);
                        flag = true;
                        setUser({ email: val.email, name: val.name, password: val.password, image: val.image });
                    }
                })
            })
        if (flag) {
            // navigate("/");
            setPage(1);
        }
        else {
            toast.error('Invalid ID/Password', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }

        setName('');
        setEmail('');
        setPassword('');
    }

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const Signup = async () => {
        if (!name.length || !validateEmail(email) || !password.length) {
            toast.warn('Please Check entered information', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        let flag = true;
        await getDocs(query(collection(db, "userEmail"), orderBy("email")))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                for (let i = 0; i < newData.length; i++) {
                    if (email === newData[i].email) {
                        flag = false;
                        break;
                    }
                }
            })
        if (flag) {
            // navigate("/");
            setPage(1);
            localStorage.setItem("name", name);
            localStorage.setItem("email", email);
            localStorage.setItem("image", "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png");
            try {
                const docRef = await addDoc(collection(db, "userEmail"), {
                    email: email,
                    name: name,
                    password: password,
                    image: "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png",
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            try {
                const docRef = await addDoc(collection(db, `${email}${email}`), {
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }

            try {
                const docRef = await addDoc(collection(db, `${email}admin`), {
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            try {
                const docRef = await addDoc(collection(db, `${email}`), {
                    chatName: `${email}admin`,
                    name: `Admin`,
                    email: "admin@gmail.com",
                    image: "https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg?w=740&t=st=1682276720~exp=1682277320~hmac=04d57d207cf81dc6a5278e10467445506e7fdc975f352e5947df1dff70c1809d",
                    time: Timestamp.now(),
                    pending: 0,
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            try {
                const docRef = await addDoc(collection(db, `${email}`), {
                    chatName: `${email}${email}`,
                    name: name,
                    image: "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png",
                    email: email,
                    time: Timestamp.now(),
                    pending: 0,
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            setUser({ email: email, name: name, password: password, image: "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png" });
            setName('');
            setEmail('');
            setPassword('');
        }
        else {
            toast.warn('User Already Exist Please Login', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            toggle();
        }
    }

    return (
        <div>
            <ToastContainer />
            <div className="card mb-3 m-5 border-0 shadow-lg" style={{ border: '2px solid #ccc', backgroundColor: '#f8f9fa' }}>
                <div className="row no-gutters" style={{ minHeight: "80vh" }}>
                    {current && <div className="col-md-6">
                        <img src={signup} className="card-img h-100" alt="..." />
                    </div>}
                    <div className="col-md-6">
                        <div className="card-body">
                            {current && <h5 className="card-title text-center display-5 mt-4 mb-4">Signup</h5>}
                            {current && <div className="form-group">
                                <label htmlFor="name" className='mt-2 h5'>Name:</label>
                                <input type="text" id="name" className={`form-control-lg form-control `} name="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>}
                            {!current && <h5 className="card-title text-center display-5 mt-4 mb-4">Login</h5>}
                            <div className="form-group">
                                <label htmlFor="email" className='mt-2 h5'>Email:</label>
                                <input type="text" id="email" className={`form-control-lg form-control `} name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className='mt-2 h5'>Password:</label>
                                <input type="password" id="password" className={`form-control-lg form-control `} name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            {current && <div className="text-center mt-3">
                                <button onClick={Signup} className="btn text-white text-bold btn-lg mb-2 w-100" style={{
                                    backgroundColor
                                        : "#FF2E63"
                                }}>Signup</button>
                                <p className="card-text mb-3">Already have a Account? <Link onClick={toggle}>Login</Link></p>
                            </div>}
                            {!current && <div className="text-center mt-3">
                                <button onClick={Login} className="btn text-white text-bold btn-lg mb-2 w-100" style={{
                                    backgroundColor
                                        : "#FF2E63"
                                }}>Login</button>
                                <p className="card-text mb-3">Don't have a Account? <Link onClick={toggle}>Signup</Link></p>
                            </div>}
                            <div className='d-flex justify-content-center align-items-center'>
                                <button className="btn btn-light d-flex align-items-center justify-content-center" onClick={handleLogin}>
                                    <img
                                        alt="Google logo"
                                        src="https://img.icons8.com/color/48/000000/google-logo.png"
                                        width="24"
                                        height="24"
                                        className="mr-2"
                                        style={{ marginRight: "1rem" }}
                                    />
                                    {current && `Sign up with Google`}
                                    {!current && `Login With Google`}
                                </button>
                            </div>
                        </div>
                    </div>
                    {!current && <div className="col-md-6">
                        <img src={login} className="card-img h-100" alt="..." />
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default LoginSignup





