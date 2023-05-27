import React, { useState } from 'react'
import userContext from './userContext';
import { useContext } from 'react';
import { Link } from "react-router-dom";

function Profile() {
    const [user, setUser] = useContext(userContext).loginData;
    const [showDropdown, setShowDropdown] = useState(false);
    const [friends, setFriends] = useContext(userContext).userFriends;
    const [currentUser, setCurrentUser] = useContext(userContext).currentUser;
    const [storeFriends, setStoreFriends] = useContext(userContext).storedFriends;
    const [page, setPage] = useContext(userContext).currentPage;
    
    // console.log(user.image);

    function handleCircleClick() {
        setShowDropdown(!showDropdown);
    }

    function handleLogoutClick() {
        setUser({ name: "", email: "", password: "", image: null })
        localStorage.clear();
        setCurrentUser([]);
        setFriends([]);
        setStoreFriends([]);
        setShowDropdown(false);
        setPage(2);
    }

    const toggle = () => {
        setPage(2);
    }

    return (
        <div>
            {(user.name.length == 0) && <button onClick = {toggle} className="btn btn-primary" style={{ marginLeft: "auto", marginRight: "2rem", backgroundColor: "#FF2E63", border: "none" }}>Login/Signup</button>}
            {(user.name.length > 0) && (
                <div style={{ position: "relative" }}>
                    {<img src={user.image} alt="" style={{
                        marginLeft: "auto",
                        marginRight: "2rem",
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        cursor: "pointer",
                    }}
                        onClick={handleCircleClick}
                    />}
                    {showDropdown && (
                        <div
                            style={{
                                position: "absolute",
                                top: "90%",
                                left: "40%",
                                transform: "translate(-50%, 0)",
                                backgroundColor: "white",
                                padding: "0.5rem 1rem",
                                zIndex: "999",
                                borderRadius: "0.25rem",
                                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
                            }}
                        >
                            <div
                                style={{
                                    cursor: "pointer",
                                    padding: "0.25rem 0",
                                }}
                                onClick={handleLogoutClick}
                            >
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Profile