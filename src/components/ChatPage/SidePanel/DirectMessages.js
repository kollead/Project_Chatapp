import React, { Component } from 'react'
import {FaRegSmile} from 'react-icons/fa'
import firebase from '../../../firebase'
import {connect} from 'react-redux'
import {setCurrentChatRoom, setPrivateChatRoom
        } from '../../../redux/actions/chatRoom_action'

export class DirectMessages extends Component {

    state = {
        usersRef: firebase.database().ref("users"),
        users: [],
        activeChatRoom: ""
    }
    componentDidMount() {
        if(this.props.user){
            this.addUsersListeners(this.props.user.uid)
        }
        
    }

    addUsersListeners = (currentUserId) => {
        const {usersRef} = this.state;
        let usersArray = []
        usersRef.on("child_added", DataSnapshot=>{
                        
            if(currentUserId!==DataSnapshot.key){
                let user=DataSnapshot.val()
                user["uid"]=DataSnapshot.key
                user["status"]="offline"
                usersArray.push(user)
                this.setState({users: usersArray})
            }
            console.log('this.state.users ', this.state.users)
        })
    }

    renderDirectMessage = users => 
        users.length>0 &&
        users.map(user=>(
            <li key={user.uid}
                style={{
                    backgroundColor: user.uid===this.state.activeChatRoom && "#ffffff45"
                }}
                onClick={()=>this.changeChatRoom(user)}>
                # {user.name}
            </li>
        ))
    
    changeChatRoom = (user) => {        
        const chatRoomId = this.getChatRoomId(user.uid);
        const chatRoomData = {
            id: chatRoomId,
            name: user.name,            
        }
        console.log("crdata: ", chatRoomData)
        this.props.dispatch(setCurrentChatRoom(chatRoomData))
        this.props.dispatch(setPrivateChatRoom(true))
        this.setActiveChatRoom(user.uid)
    }

    setActiveChatRoom = (userId) => {
        this.setState({activeChatRoom: userId})
    }

    getChatRoomId = (userId) => {
        
        const currentUserId=this.props.user.uid
        return userId>currentUserId
            ? `${userId}/${currentUserId}`
            : `${currentUserId}/${userId}`
    }
    

    render() {
        const {users} = this.state;  
        return (
            <div>
                <span style={{display: 'flex', alignItems: 'center'}}>
                    <FaRegSmile style={{marginRight: 3}} />DIRECT MESSAGES()
                </span>
                <ul>
                    {this.renderDirectMessage(users)}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = state => {
 return {
     user: state.user.currentUser
 }
}
export default connect(mapStateToProps)(DirectMessages)
