import React, { Component } from 'react'
import {FaRegSmileWink, FaPlus} from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { connect } from 'react-redux'

export class ChatRooms extends Component {

    //const [show, setShow] = useState(false);
    state={
        show: false,
        name: "",
        description: ""
    }
    //const handleClose = () => setShow(false);
    handleClose = () => this.setState({show: false});
    //const handleShow = () => setShow(true);
    handleShow = () => this.setState({show: true})

    handleSubmit = (e) => {
        e.preventDefault();
        const {name, description} = this.state
        if(this.isFormValid(name, description)){
            this.addChatRoom()
        }
    }

    addChatRoom = () => {
        const {name, description} = this.state;
        const {user} = this.props
    }

    ifFormValid=(name, description)=> name&&description;


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
                
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a Chat Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Room Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter a chat room name"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Room Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter a chat room description"/>                        
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
