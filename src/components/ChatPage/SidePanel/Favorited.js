import React, {useEffect, useSelector, useState} from 'react'
import {FaRegSmileBeam} from 'react-icons/fa'
import firebase from '../../../firebase'

function Favorited() {

    useEffect(() => {
        if(user){
        addListener(user.uid)}
    }, [])

    const usersRef = firebase.database().ref("users")
    const user = useSelector(state => state.user.currentUser)
    const addListener = (userId) => {
        usersRef
            .child(userId)
    }

    return (
        <div>
            <span style={{ display: 'flex', alignItems: 'center'}}>
                <FaRegSmileBeam style={{marginRight: '3px'}}/>
                FAVORITED (1)
            </span>
            <ul style={{listStyleType: 'none', padding: '0'}}>

            </ul>
        </div>
    )
}

export default Favorited
