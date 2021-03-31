import React, {useEffect, useSelector, useState} from 'react'
import {FaRegSmileBeam} from 'react-icons/fa'
import firebase from '../../../firebase'

function Favorited() {

    useEffect(() => {
        if(user){
            addListener(user.uid)}
    }, []);

    const usersRef = firebase.database().ref("users");
    const user = useSelector(state => state.user.currentUser);
    const [favoritedChatRooms, setfavoritedChatRooms] = useState([]);
    const [filteredChatRooms, setfilteredChatRooms] = useState([]);
    const addListener = (userId) => {
        usersRef
            .child(userId)
            .child("favorited")
            .on("child_added", DataSnapshot => {
                const favoritedchatRoom ={id: DataSnapshot.key, ...DataSnapshot.val()}
                setfavoritedChatRooms([...favoritedChatRooms, favoritedchatRoom])
            })
        usersRef
            .child(usersRef)
            .child("favorited")
            .on("child_removed", DataSnapshot => {
                const chatRoomToRemove = {id: DataSnapshot, ...DataSnapshot.val()}
                const filteredChatRoom = favoritedChatRooms.filter(chatRoom => {
                    return chatRoom.id !==chatRoomToRemove.id
                })
                setfilteredChatRooms(filteredChatRoom)
            })
    }

    const renderFavoritedChatRooms = (favorited) => {
        favorited.length>0 && 
        favorited.map(chatRoom=>(
            <li key={chatRoom.id}>
                
            </li>
        ))
    }

    return (
        <div>
            <span style={{ display: 'flex', alignItems: 'center'}}>
                <FaRegSmileBeam style={{marginRight: '3px'}}/>
                FAVORITED (1)
            </span>
            <ul style={{listStyleType: 'none', padding: '0'}}>
                {renderFavoritedChatRooms(favoritedChatRooms)}
            </ul>
        </div>
    )
}

export default Favorited
