import React, {useState, useEffect} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Image from 'react-bootstrap/Image'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import {FaLock, FaLockOpen} from 'react-icons/fa'
import {MdFavorite, MdFavoriteBorder} from 'react-icons/md'
import {AiOutlineSearch} from 'react-icons/ai'
import {useSelector} from 'react-redux'
import firebase from '../../../firebase'


function MessageHeader({handleSearchChange}) {

    const [isFavorited, setisFavorited] = useState(false)
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)
    const isPrivateChatRoom = useSelector(state=>state.chatRoom.isPrivateChatRoom)
    const usersRef = firebase.database().ref("users")
    

    useEffect(() => {
        if(chatRoom&&user){
            addFavoriteListener(chatRoom.id, user.uid)
        }        
    }, [])

    const addFavoriteListener = (chatRoomId, userId) => {
        usersRef
            .child(userId)
            .child("favorited")
            .once("value")
            .then(data=>{
                if(data.val() !== null){
                    const chatRoomIds = Object.keys(data.val())
                    //console.log('data.val(): ', data.val())
                    //console.log('chatRoomIds: ', chatRoomIds)
                    const isAlreadyFavorited = chatRoomIds.includes(chatRoomId)
                    setisFavorited(isAlreadyFavorited)
                }
            })
    }

    const handleFavorite = () => {
        if(isFavorited) {
            usersRef
                .child(`${user.uid}/favorited`)
                .child(chatRoom.id)
                .remove(err => {
                    if(err !== null){
                        console.error(err)
                    }
                })
            setisFavorited(prev => !prev)
        } else {
            usersRef
                .child(`${user.uid}/favorited`).update({
                    [chatRoom.id]: {
                        name: chatRoom.name,
                        description: chatRoom.description,
                        createdBy: {
                            name: chatRoom.createdBy.name,
                            image: chatRoom.createdBy.image
                        }
                    }
                })                
            setisFavorited(prev => !prev)
        }
    }

    return (
        <div style={{
            width: '100%',
            height: '190px',
            border: '.2rem solid #ececec',
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '1rem'
        }}>
            <Container>
                <Row>
                    <Col>
                        <h2>
                            {isPrivateChatRoom ?
                                <FaLock/>
                            :
                                <FaLockOpen/>
                            } 
                            {' '}{chatRoom&&chatRoom.name}{' '}
                            {!isPrivateChatRoom && 
                                <span style={{cursor: 'pointer'}} onClick={handleFavorite}>
                                    {isFavorited ?
                                        <MdFavorite stlye={{marginBottom: '10px'}}/>
                                    :
                                        <MdFavoriteBorder stlye={{marginBottom: '10px'}}/>
                                    }               
                                </span>                                
                            }                        
                        </h2>
                    </Col>
                    <Col>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    <AiOutlineSearch/>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                onChange={handleSearchChange}
                                placeholder="Search Messages"
                                aria-label="Search"

                            />
                        </InputGroup>
                    </Col>
                </Row>
                
                <div style={{display:'flex', justifyContent:'flex-end'
            }}>
                    <p>
                        <Image 
                            roundedCircle   
                            style={{width: '30px', height: '30px'}}
                            src={chatRoom&&chatRoom.createdBy.image}/>
                        {" "}{chatRoom&&chatRoom.createdBy.name}
                    </p>
                </div>
                
                <Row>
                    <Col>
                        <Accordion >
                            <Card>
                                <Card.Header style={{padding: '0 1rem'}}>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        Description
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>{chatRoom&&chatRoom.description}</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{padding: '0 1rem'}}>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                        Click me!
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>Hello! I'm another body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </div>
        
    )
}

export default MessageHeader
