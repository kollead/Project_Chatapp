import React, { Component } from 'react'
import {FaRegSmileWink, FaPlus} from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { connect } from 'react-redux'
import firebase from '../../../firebase'
import {setCurrentChatRoom, setPrivateChatRoom} from '../../../redux/actions/chatRoom_action'

export class ChatRooms extends Component {

    //const [show, setShow] = useState(false);
    state={
        show: false,
        name: "",
        description: "",
        chatRoomsRef: firebase.database().ref("chatRooms"),
        chatRooms: [],
        firstLoad: true,
        activeChatRoomId:""
    }
    //const handleClose = () => setShow(false);
    handleClose = () => this.setState({show: false});
    //const handleShow = () => setShow(true);
    handleShow = () => this.setState({show: true})

    componentWillUnmount(){
        this.state.chatRoomsRef.off();
    }
    componentDidMount() {
        this.AddChatRoomsListeners();
    }
    AddChatRoomsListeners=()=>{
        let chatRoomsArray=[];
        this.state.chatRoomsRef.on("child_added", DataSnapshot=>{
            chatRoomsArray.push(DataSnapshot.val());
            this.setState({chatRooms: chatRoomsArray}, ()=> this.setFirstChatRoom())
        })
    }

    setFirstChatRoom=()=>{
        const firstChatRoom=this.state.chatRooms[0]
        if(this.state.firstLoad&&this.state.chatRooms.length>0){
            this.props.dispatch(setCurrentChatRoom(firstChatRoom))
            this.setState({activeChatRoomId: firstChatRoom.id})
        }
            
        
        this.setState({firstLoad: false})
        
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {name, description} = this.state
        if(this.isFormValid(name, description)){
            this.addChatRoom()
        }
    }

    addChatRoom = async () => {

        const key= this.state.chatRoomsRef.push().key
        const {name, description} = this.state;
        const {user} = this.props
        const newChatRoom= {
            id: key,
            name: name,
            description: description,
            createdBy: {
                name: user.displayName,
                image: user.photoURL,
            }
        }
        try {
            await this.state.chatRoomsRef.child(key).update(newChatRoom)
            this.setState({
                name:"",
                description:"",
                show: false
            })
        } catch (error) {
            alert(error)
        }
    }

    isFormValid = (name, description) => 
        name && description
    
    changeChatRoom=(room)=>{
        this.props.dispatch(setCurrentChatRoom(room))
        this.props.dispatch(setPrivateChatRoom(false))
        this.setState({activeChatRoomId: room.id})
    }

    renderChatrooms = (chatRooms) =>
        //console.log("chatRooms", chatRooms)
        chatRooms.length > 0 &&
        chatRooms.map(room => (            
            <li
                key={room.id}
                onClick={()=>this.changeChatRoom(room)}
                style={{backgroundColor:
                    room.id===this.state.activeChatRoomId &&
                    "#ffffff45"}}
            >
                # {room.name}
            </li>
        ))
    

    render() {
        return (
            <div>
                <div style={{
                    position: 'relative', width: '100%',
                    display: 'flex', alignItems: 'center'
                }}>
                    <FaRegSmileWink style={{marginRight: 3 }}/>
                    CHAT ROOMS
                    <FaPlus style={{
                        position: 'absolute',
                        right: 0, cursor: 'pointer'
                    }}  onClick={this.handleShow}/>
                </div>

                <ul style={{listStyleType: 'none', padding: 0}}>
                    {this.renderChatrooms(this.state.chatRooms)}
                </ul>
                
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a Chat Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Room Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter a chat room name"
                                onChange={(e)=> this.setState({name:e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Room Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter a chat room description"
                                onChange={(e)=>this.setState({description:e.target.value})}/>                        
                        </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Create
                </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user:state.user.currentUser
    }
}
export default connect(mapStateToProps)(ChatRooms)
