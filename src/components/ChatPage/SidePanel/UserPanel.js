import React from 'react'
import {IoIosChatboxes} from 'react-icons/io'
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'react-bootstrap/Image'

function UserPanel() {
    return (
        <div>
            {/* Logo */}
            <h3 style={{color:'white'}}>
                <IoIosChatboxes/>{" "} Chat App
            </h3>
            <div style={{ display: 'flex', marginBottom: '1rem'}}>
                <Image src="" 
                    style={{width: '30p', height: '30px', marginTop: '3px'}}
                    roundedCircle/>
                <Dropdown>
                    <Dropdown.Toggle
                        style={{background: 'transparent', border: '0px'}}
                    id="dropdown-basic">
                        User Name
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item></Dropdown.Item>
                        <Dropdown.Item></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}

export default UserPanel
