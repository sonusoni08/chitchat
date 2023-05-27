import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import ContactUs from "./components/ContactUs"
import { createContext, useState} from 'react';
import Footer from "./components/Footer"
import LoginSignup from './components/LoginSignup';
import Error from "./components/Error"
import { useContext, useEffect } from 'react';
import userContext from './components/userContext';

function App() {

    const [user, setUser] = useContext(userContext).loginData;

    useEffect (() => {
        const temp = localStorage.getItem("name");
        if (temp != undefined) {
            setUser({
                name : localStorage.getItem("name"),
                email : localStorage.getItem("email"),
                image : localStorage.getItem("image"),
            })
        }
    }, [])
  return (

      <div className='full-body App'>
          {/* {(page == 1) && <ContactUs/>}
          {(page == 2) && <LoginSignup/>} */}
          <Routes>
            <Route exact path="/" element={<ContactUs/>} />
            <Route path="/loginsignup" element={<LoginSignup/>} />
            <Route path = "*" element ={<Error/>} />
          </Routes>
          <Footer /> 
      </div>

  );
}

export default App;
