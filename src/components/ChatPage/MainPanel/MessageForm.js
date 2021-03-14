import React, {useState} from 'react'
import Form from 'react-bootstrap/Form'
import ProgressBar from'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import firebase from '../../../firebase' 
import {useSelector} from 'react-redux'


function MessageForm() {

    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const [Content, setContent] = useState("")
    const [Errors, setErrors] = useState([])
    const [Loading, setLoading] = useState(false)
    const messagesRef = firebase.database.ref("messages")

    const handleSubmit = (e) => {
        setContent(e.target.value)
    }
    const createMessage = () => {
        
    }
    const handleChange = async() =>{
        if(!Content){
            setErrors(prev=>prev.concat("Type contents first"))
            return
        }
        setLoading(true)
        //firebase saving message
        try {
            await messagesRef.child(chatRoom.id).set(createMessage())
        } catch (error) {
            
        }

    }

    return (
        <div>
           <Form onSubmit={handleSubmit}>
               <Form.Group>
                    <Form.Control 
                        value={Content}
                        onChange={handleChange}
                        as="textarea" rows={3}/>
               </Form.Group>
           </Form>
           <ProgressBar variant="warning" label="60%" now={60}/>
           <Row>
               <Col><button 
                        className="message-form-button"
                        style={{width: '100%'}}
                        onClick={handleSubmit}
                    >
                        SUBMIT
                    </button></Col>
               <Col><button 
                        className="message-form-button"
                        style={{width: '100%'}}
                        onClick={handleSubmit}
                    >
                        UPLOAD
                    </button></Col>
           </Row>
        </div>
    )
}

export default MessageForm
