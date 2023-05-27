import React from 'react'
import userContext from './userContext';
import { useContext } from 'react';

function ChatHeader() {
    const [currentUser, setCurrentUser] = useContext(userContext).currentUser;
    const handleCircleClick = () => {

    }

    return (
        <div className = "chat-head">
            <nav className="nav nav-pills nav-fill" style={{ padding: "7px 0px 5px 10px" }}>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center", paddingBottom: "10px"}}>
                    <img src = {currentUser.image} alt={currentUser.name[0]} style={{
                        marginLeft: "auto",
                        marginRight: "1rem",
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        cursor: "pointer",
                    }}
                        onClick={handleCircleClick}
                    />
                    <h4 className = "fw-normal align-text-bottom" style = {{ color: "black" }}>{currentUser.name}</h4>
                </div>
                {/* <a className="nav-item nav-link" href="#">Link</a>
                <a className="nav-item nav-link" href="#">Link</a>
                <a className="nav-item nav-link disabled" href="#">Disabled</a> */}
            </nav>
        </div>
    )
}

export default ChatHeader