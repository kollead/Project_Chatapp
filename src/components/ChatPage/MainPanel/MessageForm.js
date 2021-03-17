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
    const user = useSelector(state => state.user.currentUser)
    const messagesRef = firebase.database().ref("messages")

    const handleChange = (e) => {
        setContent(e.target.value)
    }
    const createMessage = (fileUrl=null) => {
        const message= {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                image:user.photoURL
            }            
        }
        if(fileUrl!== null){
            message["image"]=fileUrl;
        }else{
            message["content"]=Content;
        }

        return message;
    }
    const handleSubmit = async() =>{
        if(!Content){
            setErrors(prev=>prev.concat("Type contents first"))
            return;
        }
        setLoading(true)
        //firebase saving message
        try {
            await messagesRef.child(chatRoom.id).push().set(createMessage())
            setLoading(false)
            setContent("")
            setErrors([])
        } catch (error) {
            setErrors(pre=>pre.concat(error.message))
            setLoading(false)
            setTimeout(()=>{
                setErrors([])
            }, 5000)
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
           <div>
               {Errors.map(errorMsg => <p style={{color:'red'}} key={errorMsg}>
                   {errorMsg}
               </p>)}
           </div>
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
