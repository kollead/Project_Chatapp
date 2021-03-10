import React, {useRef, useState} from 'react'
import {IoIosChatboxes} from 'react-icons/io'
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'react-bootstrap/Image'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {useDispatch, useSelector} from 'react-redux'
import firebase from '../../../firebase'
import mime from 'mime-types'
import {setPhotoURL} from '../../../redux/actions/user_action'

function UserPanel() {

    const user = useSelector(state => state.user.currentUser)
    const InputOpenImageRef = useRef();
    const dispatch =  useDispatch();
    
    const handleLogout = () => {
        firebase.auth().signOut();
    }
    const handelOpenImageRef = () => {
        InputOpenImageRef.current.click()
        
    }    
    const handleUploadImage = async(event) => {
        const file=event.target.files[0];
        const metadata={contentType: mime.lookup(file.name)}
        //스토리지에 파일 저장
        try{
            let uploadTaskSnapshot= await firebase.storage().ref()
                .child(`user_image/${user.uid}`)
                .put(file, metadata)
            
            let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL()
            
            await firebase.auth().currentUser.updateProfile({
                photoURL: downloadURL
            })

            dispatch(setPhotoURL(downloadURL))
            
            await firebase.database().ref("users")
                .child(user.uid)
                .update({image: downloadURL})

            //console.log("uploadTaskSnapshot: ", uploadTaskSnapshot)
            
        }catch(error){
            alert(error)

        }
    }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            {/* Logo */}
            <h3 style={{color:'white'}}>
                <IoIosChatboxes/>{" "} Chat App
            </h3>
            <div style={{ display: 'flex', marginBottom: '1rem'}}>
                <Image src={user && user.photoURL} 
                    style={{width: '30p', height: '30px', marginTop: '3px'}}
                    roundedCircle onClick={handleShow}/>
                <Dropdown>
                    <Dropdown.Toggle
                        style={{background: 'transparent', border: '0px'}}
                    id="dropdown-basic">
                        {user && user.displayName+" "}                       
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handelOpenImageRef}>
                            프로필 사진 변경
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>
                            로그아웃
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Profile Image</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Image src={user && user.photoURL}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>                        
                    </Modal.Footer>
                </Modal>
            </div>
            <input
                onChange={handleUploadImage}
                style={{display: 'none'}} 
                ref={InputOpenImageRef} type="file"
                accept="image/jpeg, image/png"/>
        </div>
    )
}

export default UserPanel
