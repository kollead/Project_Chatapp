import React, {useState} from 'react'
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


function MessageHeader({handleSearchChange}) {

    const [isFavorited, setisFavorited] = useState(false)
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const isPrivateChatRoom = useSelector(state=>state.chatRoom.isPrivateChatRoom)
    return (
        <div style={{
            width: '100%',
            height: '170px',
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
                                <span style={{cursor: 'pointer'}} onClick>
                                    {isFovorited ?
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
                        <Image/> {" "}user name
                    </p>
                </div>
                
                <Row>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{padding: '0 1rem'}}>
                                    <Accordion.Toggle as={Button} variant="link" eventkey="0">
                                        Click
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hey</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{padding: '0 1rem'}}>
                                    <Accordion.Toggle as={Button} variant="link" eventkey="0">
                                        Click
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hey</Card.Body>
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
