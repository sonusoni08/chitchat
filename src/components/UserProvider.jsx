import React, { useState } from 'react'
import userContext from './userContext'

function UserProvider({children}) {
    const [formData, setFormData] = useState({
        name: '',
        contactNo: '',
        instagram: '',
        linkedin: '',
        github: '',
        skills: [],
        aboutMe: '',
        cvDownloadLink: '',
        services: [],
        experience: [],
        technologies: [],
        projects: [],
        email: '',
        address: '',
        photo: '',
      });
    const [user, setUser] = useState({name : "", email : "", password : "", image: "https://www.shutterstock.com/image-vector/microblog-platform-abstract-concept-vector-600w-1852998859.jpg"});
    const [chats, setChats] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [friends, setFriends] = useState([]);
    const [storeFriends, setStoreFriends] = useState([]);
    return (
        <userContext.Provider value={{formData : [formData, setFormData], loginData:  [user, setUser], userChats: [chats, setChats], userFriends: [friends, setFriends], currentUser: [currentUser, setCurrentUser], storedFriends: [storeFriends, setStoreFriends]}}>
            {children}
        </userContext.Provider>
    )
}
export default UserProvider;
