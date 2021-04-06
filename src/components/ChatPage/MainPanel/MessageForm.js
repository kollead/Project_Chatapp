import React, {useState, useRef} from 'react'
import Form from 'react-bootstrap/Form'
import ProgressBar from'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import firebase from '../../../firebase' 
import {useSelector} from 'react-redux'
import mime from 'mime-types'


function MessageForm() {

    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const [Content, setContent] = useState("")
    const [Errors, setErrors] = useState([])
    const [Loading, setLoading] = useState(false)
    const user = useSelector(state => state.user.currentUser)
    const messagesRef = firebase.database().ref("messages")
    const inputOpenImageRef = useRef()
    const storageRef = firebase.storage().ref()
    const [Percentage, setPercentage] = useState(0)
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)
    const typingRef = firebase.database().ref("typing")

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
            typingRef.child(chatRoom.id).child(user.uid).remove()
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

    //upload reactdropzon 사용해보기

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    }

    const getPath = () => {
        if(isPrivateChatRoom){
            return `/message/private/${chatRoom.id}`
        } else {
            return `/message/public`
        }
    }

    const handleUploadImage = (event) => {
        const file=event.target.files[0]
        console.log('file: ', file)
        if(!file) return;
        const filePath = `${getPath()}/${file.name}`
        const metadata = {contentType: mime.lookup(file.name)}
        setLoading(true)
        try {
            let uploadTask = storageRef.child(filePath).put(file, metadata)
            uploadTask.on("state_changed", uploadTaskSnapshot=>{
                const percent = Math.round(
                    (uploadTaskSnapshot.bytesTransferred/uploadTaskSnapshot.totalBytes)*100
                )
                setPercentage(percent)
            },
            err=>{
                console.error("fileupload err: ", err)
                setLoading(false)
            },
            ()=>{
                // 저장이 된 후 파일 메시지 데이터베이스에 저장
                // 저장된 파일을 다운로드 받을 수 있는 URL 가져오기
                uploadTask.snapshot.ref.getDownloadURL()
                .then(downloadURL=>{
                    messagesRef.child(chatRoom.id).push().set(createMessage(downloadURL))
                    setLoading(false)
                })
            }
            )
        } catch (error) {
            alert(error)
        }
    }

    const handleKeyDown = () => {
        if(Content){
            typingRef.child(chatRoom.id).child(user.uid).set(user.displayName)
        } else{
            typingRef.child(chatRoom.id).child(user.uid).remove()
        }

    }

    return (
        <div>
           <Form onSubmit={handleSubmit}>
               <Form.Group>
                    <Form.Control 
                        onKeyDown={handleKeyDown}
                        value={Content}
                        onChange={handleChange}
                        as="textarea" rows={3}/>
               </Form.Group>
           </Form>
           {
               !(Percentage===0||Percentage===100) &&
               <ProgressBar variant="warning" label={`${Percentage}%`} now={Percentage}/>
           
           }
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
                        disabled={Loading ? true : false}
                    >
                        SUBMIT
                    </button></Col>
               <Col><button 
                        className="message-form-button"
                        style={{width: '100%'}}
                        onClick={handleOpenImageRef}
                        disabled={Loading ? true : false}
                    >
                        UPLOAD
                    </button></Col>
           </Row>
           <input 
                accept="image/jpeg, image/png"
                style={{display: 'none'}}
                type="file" 
                ref={inputOpenImageRef}
                onChange={handleUploadImage}/>
        </div>
    )
}

export default MessageForm
