import React from 'react'
import {IoIosChatboxes} from 'react-icons/io'

function UserPanel() {
    return (
        <div>
            {/* Logo */}
            <h3 style={{color:'white'}}>
                <IoIosChatboxes/>{" "} Chat App
            </h3>
        </div>
    )
}

export default UserPanel
