import React from 'react'
import UserPanel from './UserPanel'
import DirectMessages from './DirectMessages'
import ChatRooms from './ChatRooms'
import Favorited from './Favorited'

function SidePanel() {
    return (
        <div
            style={{
                backgroundColor: '#7b83eb',
                padding: '2rem',
                height: '100%',
                minHeight: '100vh',
                color: 'white',
                minWidth: '275px'
            }}
        >
            <UserPanel/>
            <Favorited/>
            <ChatRooms/>
            <DirectMessages/>
        </div>
    )
}

export default SidePanel