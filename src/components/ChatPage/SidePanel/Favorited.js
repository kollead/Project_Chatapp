import React, {useEffect, useState} from 'react'
import {FaRegSmileBeam} from 'react-icons/fa'
import firebase from '../../../firebase'
import {useSelector} from 'react-redux'

function Favorited() {

   
    const usersRef = firebase.database().ref("users");
    const user = useSelector(state => state.user.currentUser);
    const [favoritedChatRooms, setfavoritedChatRooms] = useState([]);

    useEffect(() => {
        if(user){
            addListener(user.uid)}
    }, []);

    const addListener = (userId) => {        
        usersRef
            .child(userId)
            .child("favorited")
            .on("child_added", DataSnapshot => {
                const favoritedChatRoom ={id: DataSnapshot.key, ...DataSnapshot.val()}
                setfavoritedChatRooms(Rooms => {return [...Rooms, favoritedChatRoom]})                
            });
        usersRef
            .child(userId)
            .child("favorited")
            .on("child_removed", DataSnapshot => {
                const chatRoomToRemove = {id: DataSnapshot.key, ...DataSnapshot.val()}
                const filteredChatRooms = favoritedChatRooms.filter(chatRoom =>{
                    return chatRoom.id !== chatRoomToRemove.id;
                })
                setfavoritedChatRooms(filteredChatRooms)
            })      
        
        
    }

    const renderFavoritedChatRooms = () => {
        console.log("favoritedChatRoom: ",favoritedChatRooms)
        favoritedChatRooms > 0 && favoritedChatRooms.map(chatRoom => (
            <li key={chatRoom.id}>
                1
            </li>))
        
    }

    return (
        <div>
            <span style={{ display: 'flex', alignItems: 'center'}}>
                <FaRegSmileBeam style={{marginRight: '3px'}}/>
                FAVORITED (1)
            </span>
            <ul style={{listStyleType: 'none', padding: '0'}}>
                {renderFavoritedChatRooms()}
            </ul>
        </div>
    )
}

export default Favorited
